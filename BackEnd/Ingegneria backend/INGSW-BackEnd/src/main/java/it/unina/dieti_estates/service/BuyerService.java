package it.unina.dieti_estates.service;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.*;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import it.unina.dieti_estates.repository.BuyerRepository;
import it.unina.dieti_estates.repository.FavoriteSearchRepository;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; 
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import it.unina.dieti_estates.repository.RealEstateRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.Collections;
import java.io.IOException;
import java.security.GeneralSecurityException;
import it.unina.dieti_estates.exception.auth.UserNotFoundException;
import it.unina.dieti_estates.model.dto.VisitRequest;
import it.unina.dieti_estates.model.dto.WeatherRequest;
import it.unina.dieti_estates.model.BookedVisit;
import it.unina.dieti_estates.repository.BookedVisitRepository;
import it.unina.dieti_estates.repository.NotificationRepository;
import it.unina.dieti_estates.model.Notification;
import java.util.List;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.InputStream;
import java.util.Scanner;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import it.unina.dieti_estates.exception.business.WeatherApiException;
import it.unina.dieti_estates.exception.resource.RealEstateNotFoundException;
import it.unina.dieti_estates.exception.validation.DuplicateResourceException;


@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FavoriteSearchRepository favoriteSearchRepository;
    private final RealEstateRepository realEstateRepository;
    private final BookedVisitRepository bookedVisitRepository;
    private final NotificationRepository notificationRepository;


    @Value("${google.clientId}")
    private String googleClientId;

    @Value("${google.clientSecret}")
    private String googleClientSecret;      

    @Autowired
    public BuyerService(BuyerRepository buyerRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       @Lazy AuthenticationManager authenticationManager,
                       FavoriteSearchRepository favoriteSearchRepository,
                       RealEstateRepository realEstateRepository,
                       BookedVisitRepository bookedVisitRepository,
                       NotificationRepository notificationRepository) {
        this.buyerRepository = buyerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.favoriteSearchRepository = favoriteSearchRepository;
        this.realEstateRepository = realEstateRepository;
        this.bookedVisitRepository = bookedVisitRepository;
        this.notificationRepository = notificationRepository;
    }

    public RegistrationResponse registerNewBuyer(Buyer buyer) {
        buyer.setPassword(passwordEncoder.encode(buyer.getPassword()));
        buyerRepository.save(buyer);
        return new RegistrationResponse("Registrazione andata a buon fine");
    }

    public String loginBuyer(LoginRequest loginRequest) {
        try {
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // 2. Recupera i dettagli dell'utente autenticato (sarà un Buyer)
            Buyer buyer = (Buyer) authentication.getPrincipal();

            // Generazione random notifica promozionale (10% probabilità)
            if (Math.random() < 0.10) {
                String[] promoMessages = {
                    "Scopri le nuove proprietà in evidenza!",
                    "Solo per te: sconto sulle commissioni questa settimana!",
                    "Visita gratuita per i nuovi iscritti!",
                    "Nuove promozioni disponibili, non perderle!",
                    "DietiEstates ti premia: controlla le offerte speciali!"
                };
                int idx = (int)(Math.random() * promoMessages.length);
                Notification promo = new Notification(
                    "Promozione speciale!",
                    "PROMOZIONALE",
                    promoMessages[idx],
                    java.time.LocalDateTime.now(),
                    buyer,
                    null
                );
                notificationRepository.save(promo);
            }

            return jwtService.generateToken(buyer);
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Email o password non valida");
        }
    }

    public String addFavorite(FavoriteRequest request) {
        Buyer buyer = getProfile();

        // Controllo se gia tra i preferiti
        boolean exists = favoriteSearchRepository.existsByBuyerAndRequest(buyer, request);
        if (exists) {
            throw new DuplicateResourceException("La ricerca è già tra i preferiti.");
        }

        FavoriteSearch favoriteSearch = new FavoriteSearch();
        favoriteSearch.setBuyer(buyer);
        favoriteSearch.setCity(request.getCity());
        favoriteSearch.setContractType(request.getContractType());
        favoriteSearch.setEnergyClass(request.getEnergyClass());
        favoriteSearch.setRooms(request.getRooms());
        favoriteSearch.setMinPrice(request.getMinPrice());
        favoriteSearch.setMaxPrice(request.getMaxPrice());
        favoriteSearch.setFavoritedAt(java.time.LocalDateTime.now());

        favoriteSearchRepository.save(favoriteSearch);

        return "Ricerca aggiunta ai preferiti";
    }

    @Transactional
    public String removeFavorite(FavoriteSearchDeleteRequest request) {
        Buyer buyer = getProfile();
        Long favoriteSearchId = request.getFavoriteSearchId();

        FavoriteSearch favoriteSearch = favoriteSearchRepository.findById(favoriteSearchId).orElse(null);
        if (favoriteSearch == null || !favoriteSearch.getBuyer().getId().equals(buyer.getId())) {
            return "Ricerca non trovata tra i tuoi preferiti";
        }
        favoriteSearchRepository.deleteById(favoriteSearchId);
        return "Ricerca rimossa dai preferiti";
    }

    public PageResponse<FavoriteSearchResponse> getFavorites(int page, int size) {
        Buyer buyer = getProfile();
        Page<FavoriteSearch> favoritePage = favoriteSearchRepository.findByBuyerId(
            buyer.getId(),
            PageRequest.of(page, size)
        );

        List<FavoriteSearchResponse> dtos = favoritePage.getContent()
            .stream()
            .map(fav -> {
                FavoriteSearchResponse dto = new FavoriteSearchResponse();
                dto.setId(fav.getId());
                dto.setCity(fav.getCity());
                dto.setContractType(fav.getContractType());
                dto.setEnergyClass(fav.getEnergyClass());
                dto.setRooms(fav.getRooms());
                dto.setMinPrice(fav.getMinPrice());
                dto.setMaxPrice(fav.getMaxPrice());
                dto.setFavoritedAt(fav.getFavoritedAt());
                return dto;
            })
            .collect(Collectors.toList());

        return new PageResponse<>(
            dtos,
            favoritePage.getNumber(),
            favoritePage.getSize(),
            favoritePage.getTotalElements(),
            favoritePage.hasNext()
        );
    }

    public Buyer getProfile() {
        Buyer buyer = (Buyer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (buyer == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }
        return buyer;
    }

    public void updateProfile(Buyer updatedBuyer) {
        Buyer buyer = getProfile();
        if (updatedBuyer.getFirstName() != null) buyer.setFirstName(updatedBuyer.getFirstName());
        if (updatedBuyer.getLastName() != null) buyer.setLastName(updatedBuyer.getLastName());
        if (updatedBuyer.getEmail() != null) buyer.setEmail(updatedBuyer.getEmail());
        if (updatedBuyer.getPassword() != null && !updatedBuyer.getPassword().isEmpty()) {
            buyer.setPassword(passwordEncoder.encode(updatedBuyer.getPassword()));
        }
        if (updatedBuyer.getBirthdate() != null) buyer.setBirthdate(updatedBuyer.getBirthdate());
        
        buyerRepository.save(buyer);
    }

    @Transactional(readOnly = true)
    public PageResponse<RealEstateResponseDTO> searchRealEstates(FavoriteRequest request, int page, int size) {
        Page<RealEstate> realEstates = realEstateRepository.searchRealEstates(
            request.getCity(),
            request.getContractType(),
            request.getEnergyClass(),
            request.getRooms(),
            request.getMinPrice(),
            request.getMaxPrice(),
            PageRequest.of(page, size)
        );
        List<RealEstateResponseDTO> dtos = realEstates.getContent()
            .stream()
            .map(re -> {
                RealEstateResponseDTO dto = new RealEstateResponseDTO();
                dto.setId(re.getId());
                List<String> imageUrls = new ArrayList<>(re.getImageUrls());
                dto.setImageUrls(imageUrls);
                dto.setCity(re.getCity());
                dto.setDistrict(re.getDistrict());
                dto.setAddress(re.getAddress());
                dto.setStreetNumber(re.getStreetNumber());
                dto.setFloor(re.getFloor());
                dto.setTotalBuildingFloors(re.getTotalBuildingFloors());
                dto.setCommercialArea(re.getCommercialArea());
                dto.setElevator(re.getElevator());
                dto.setRooms(re.getRooms());
                dto.setEnergyClass(re.getEnergyClass());
                dto.setFurnishing(re.getFurnishing());
                dto.setHeating(re.getHeating());
                dto.setPropertyStatus(re.getPropertyStatus());
                dto.setContractType(re.getContractType());
                dto.setDescription(re.getDescription());
                dto.setPrice(re.getPrice());
                return dto;
            })
            .collect(Collectors.toList());

        return new PageResponse<>(
            dtos,
            realEstates.getNumber(),
            realEstates.getSize(),
            realEstates.getTotalElements(),
            realEstates.hasNext()
        );
    }

    public String loginBuyerWithGoogleCode(Map<String, String> body) {
        String code = body.get("code");
        String redirectUri = body.getOrDefault("redirectUri", "http://localhost:5173/auth/callback");
        String idTokenString = getGoogleIdTokenFromCode(code, redirectUri);
        GoogleIdToken idToken = verifyGoogleIdToken(idTokenString);
        if (idToken == null) {
            throw new InvalidCredentialsException("ID token Google non valido");
        }
        String email = idToken.getPayload().getEmail();
        Buyer buyer = buyerRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("Buyer non trovato per email Google"));
        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(buyer.getEmail())
            .password(buyer.getPassword())
            .authorities("ROLE_BUYER")
            .build();
        return jwtService.generateToken(userDetails);
    }


public String getGoogleIdTokenFromCode(String code, String redirectUri) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> params = new HashMap<>();
        params.put("client_id", googleClientId);
        params.put("client_secret", googleClientSecret);
        params.put("code", code);
        params.put("redirect_uri", redirectUri);
        params.put("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        StringBuilder requestBody = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (requestBody.length() > 0) requestBody.append("&");
            requestBody.append(entry.getKey()).append("=").append(entry.getValue());
        }

        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://oauth2.googleapis.com/token",
            request,
            Map.class
        );

        if (response.getStatusCode() != HttpStatus.OK || !response.getBody().containsKey("id_token")) {
            throw new InvalidCredentialsException("Google token exchange failed");
        }

        return (String) response.getBody().get("id_token");
    }



public RegistrationResponse registerBuyerWithGoogle(Map<String, String> body) {
        String code = body.get("code");
        String redirectUri = body.getOrDefault("redirectUri", "http://localhost:5173/auth/callback");
        String idTokenString = getGoogleIdTokenFromCode(code, redirectUri);
        GoogleIdToken idToken = verifyGoogleIdToken(idTokenString);
        if (idToken == null) {
            throw new InvalidCredentialsException("ID token Google non valido");
        }
        String email = idToken.getPayload().getEmail();
        if (buyerRepository.findByEmail(email).isPresent()) {
            throw new InvalidCredentialsException("Buyer già registrato con questa email Google");
        }
        Buyer buyer = new Buyer();
        buyer.setEmail(email);
        buyer.setFirstName((String) idToken.getPayload().get("given_name"));
        buyer.setLastName((String) idToken.getPayload().get("family_name"));
        buyer.setPassword(passwordEncoder.encode("google-auth")); // Placeholder password
        buyerRepository.save(buyer);
        return new RegistrationResponse("Registrazione Google andata a buon fine");
    }


aggiungere una riga di codice al metodo verifyGoogleIdToken (guarda foto mandate sul gruppo)

.setAudience(Collections.singletonList(googleClientId))

    // Helper for Google ID token verification
    private GoogleIdToken verifyGoogleIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(System.getenv("GOOGLE_CLIENT_ID")))
            .build();
            return verifier.verify(idTokenString);
        } catch (GeneralSecurityException | IOException e) {
            return null;
        }
    }

    public Object getWeatherForecast(WeatherRequest request) {
        try {
            String city = request.getCity();
            // Usa la data corrente del server
            java.time.LocalDate start = java.time.LocalDate.now();
            java.time.LocalDate end = start.plusDays(6); // Include il giorno iniziale
            String startDate = start.toString();
            String endDate = end.toString();

            // Step 1: Geocoding con Nominatim
            String geoUrl = "https://nominatim.openstreetmap.org/search?city=" + java.net.URLEncoder.encode(city, "UTF-8") + "&format=json&limit=1";
            URL geoApiUrl = new URL(geoUrl);
            HttpURLConnection geoConn = (HttpURLConnection) geoApiUrl.openConnection();
            geoConn.setRequestMethod("GET");
            geoConn.setRequestProperty("User-Agent", "DietiEstates/1.0");
            geoConn.connect();
            int geoResponseCode = geoConn.getResponseCode();
            if (geoResponseCode != 200) {
                throw new WeatherApiException("Errore chiamata Nominatim: codice " + geoResponseCode);
            }
            InputStream geoIs = geoConn.getInputStream();
            Scanner geoScanner = new Scanner(geoIs).useDelimiter("\\A");
            String geoResult = geoScanner.hasNext() ? geoScanner.next() : "";
            geoScanner.close();
            geoIs.close();

            // Parsing JSON manuale (solo per lat/lon)
            String lat = null, lon = null;
            if (geoResult.startsWith("[") && geoResult.length() > 2) {
                int latIdx = geoResult.indexOf("\"lat\":\"");
                int lonIdx = geoResult.indexOf("\"lon\":\"");
                if (latIdx != -1 && lonIdx != -1) {
                    lat = geoResult.substring(latIdx + 7, geoResult.indexOf("\"", latIdx + 7));
                    lon = geoResult.substring(lonIdx + 7, geoResult.indexOf("\"", lonIdx + 7));
                }
            }
            if (lat == null || lon == null) {
                throw new WeatherApiException("Latitudine/longitudine non trovate per la città: " + city);
            }

            // Step 2: Chiamata OpenMeteo con lat/lon
            String url = "https://api.open-meteo.com/v1/forecast?"
                       + "latitude=" + lat
                       + "&longitude=" + lon
                       + "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode"
                       + "&start_date=" + startDate
                       + "&end_date=" + endDate
                       + "&timezone=Europe/Rome";

            URL apiUrl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) apiUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();
            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                throw new WeatherApiException("Errore chiamata OpenMeteo: codice " + responseCode);
            }
            InputStream is = conn.getInputStream();
            Scanner s = new Scanner(is).useDelimiter("\\A");
            String result = s.hasNext() ? s.next() : "";
            s.close();
            is.close();
            
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(result);
                if (root.has("daily")) {
                    return root.get("daily");
                } else {
                    throw new WeatherApiException("Risposta OpenMeteo non contiene dati 'daily'");
                }
            } catch (Exception ex) {
                throw new WeatherApiException("Errore parsing JSON meteo: " + ex.getMessage());
            }

        } catch (Exception e) {
            throw new WeatherApiException("Errore nel recupero delle previsioni meteo: " + e.getMessage());
        }
    }

    @Transactional
    public void bookVisit(VisitRequest request) {
        Long realEstateId = request.getRealEstateId();
        String date = request.getDate();
        String time = request.getTime();

        RealEstate estate = realEstateRepository.findById(realEstateId)
            .orElseThrow(() -> new RealEstateNotFoundException("Immobile non trovato con id: " + realEstateId));

        Buyer buyer = getProfile();
        EstateAgent agent = estate.getAgent();

        try {
            // Validazione e formattazione data e ora
            java.time.LocalDate.parse(date); // Verifica formato data
            if (!time.matches("^([0-1][0-9]|2[0-3]):[0-5][0-9]$")) {
                throw new IllegalArgumentException("Formato ora non valido");
            }
            
            String timestamp = String.format("%s %s:00", date, time);
            Timestamp visitTimestamp = Timestamp.valueOf(timestamp);
            boolean exists = bookedVisitRepository.existsByEstateAndRequestDate(estate, visitTimestamp);

            if (exists) {
                throw new DuplicateResourceException("Visita già prenotata per questo immobile, data e orario");
            }

            BookedVisit visit = new BookedVisit();
            visit.setStatus("In attesa");
            visit.setRequestDate(visitTimestamp);
            visit.setRealEstate(estate);
            visit.setBuyer(buyer);
            visit.setAgent(agent);

            bookedVisitRepository.save(visit);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Formato data/ora non valido: " + e.getMessage());
        }

    }

    public PageResponse<NotificationDTO> getNotificationsForCurrentBuyer(int page, int size) {
        Buyer buyer = getProfile();
        Page<Notification> notificationPage = notificationRepository.findByBuyer(buyer, PageRequest.of(page, size));
        List<NotificationDTO> dtos = notificationPage.getContent()
            .stream()
            .map(n -> new it.unina.dieti_estates.model.dto.NotificationDTO(
                n.getId(),
                n.getTitle(),
                n.getType(),
                n.getMessage(),
                n.getCreatedAt(),
                n.getRealEstate() != null ? n.getRealEstate().getAddress() : null
            ))
            .collect(java.util.stream.Collectors.toList());
        return new PageResponse<>(
            dtos,
            notificationPage.getNumber(),
            notificationPage.getSize(),
            notificationPage.getTotalElements(),
            notificationPage.hasNext()
        );
    }
}
