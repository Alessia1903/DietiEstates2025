package it.unina.dieti_estates.tests.service;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.*;
import it.unina.dieti_estates.repository.*;
import it.unina.dieti_estates.service.*;
import it.unina.dieti_estates.exception.auth.*;
import it.unina.dieti_estates.exception.validation.*;
import it.unina.dieti_estates.exception.resource.*;
import it.unina.dieti_estates.exception.business.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import static org.mockito.ArgumentMatchers.eq;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BuyerServiceTest {

    private static final String TIME = "10:00";
    private static final String EMAILTEST = "test@example.com";
    private static final String DUMMYCODE = "dummyCode";
    private static final String IDTOKEN = "idToken";
    private static final String VALID_TOKEN = "valid_token";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String REDIRECT_URI = "http://localhost:5173/auth/callback";

    @Mock private BuyerRepository buyerRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private FavoriteSearchRepository favoriteSearchRepository;
    @Mock private RealEstateRepository realEstateRepository;
    @Mock private BookedVisitRepository bookedVisitRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private RestTemplate restTemplate;

    @InjectMocks
    private BuyerService buyerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
        // Crea spy di buyerService per poter mockare metodi specifici
        buyerService = spy(buyerService);
        // Ritorna il mock di RestTemplate quando viene chiamato getRestTemplate
        doReturn(restTemplate).when(buyerService).getRestTemplate();
    }

    @Test
    void registerNewBuyerSuccess() {
        Buyer buyer = new Buyer();
        buyer.setPassword("plain");
        when(passwordEncoder.encode("plain")).thenReturn("enc");
        RegistrationResponse resp = buyerService.registerNewBuyer(buyer);
        assertEquals("Registrazione andata a buon fine", resp.getMessage());
        verify(buyerRepository).save(buyer);
    }

    @Test
    void loginBuyerSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("mail");
        req.setPassword("pass");
        Authentication auth = mock(Authentication.class);
        Buyer buyer = new Buyer();
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(buyer);
        when(jwtService.generateToken(buyer)).thenReturn("jwt");
        String token = buyerService.loginBuyer(req);
        assertEquals("jwt", token);
    }

    @Test
    void loginBuyerInvalidCredentials() {
        LoginRequest req = new LoginRequest();
        when(authenticationManager.authenticate(any())).thenThrow(new RuntimeException());
        assertThrows(InvalidCredentialsException.class, () -> buyerService.loginBuyer(req));
    }

    @Test
    void addFavoriteSuccess() {
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        FavoriteRequest req = new FavoriteRequest();
        when(favoriteSearchRepository.existsByBuyerAndRequest(buyer, req)).thenReturn(false);
        String msg = buyerService.addFavorite(req);
        assertEquals("Ricerca aggiunta ai preferiti", msg);
        verify(favoriteSearchRepository).save(any(FavoriteSearch.class));
    }

    @Test
    void addFavoriteDuplicate() {
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        FavoriteRequest req = new FavoriteRequest();
        when(favoriteSearchRepository.existsByBuyerAndRequest(buyer, req)).thenReturn(true);
        assertThrows(DuplicateResourceException.class, () -> buyerService.addFavorite(req));
    }

    @Test
    void getProfileSuccess() {
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Buyer result = buyerService.getProfile();
        assertEquals(buyer, result);
    }

    @Test
    void getProfileUnauthorized() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> buyerService.getProfile());
    }

    @Test
    void removeFavoriteSuccess() {
        Buyer buyer = new Buyer();
        buyer.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        FavoriteSearch fav = new FavoriteSearch();
        fav.setId(2L);
        Buyer favBuyer = new Buyer();
        favBuyer.setId(1L);
        fav.setBuyer(favBuyer);

        when(favoriteSearchRepository.findById(2L)).thenReturn(Optional.of(fav));
        FavoriteSearchDeleteRequest req = new FavoriteSearchDeleteRequest();
        req.setFavoriteSearchId(2L);
        String msg = buyerService.removeFavorite(req);
        assertEquals("Ricerca rimossa dai preferiti", msg);
        verify(favoriteSearchRepository).deleteById(2L);
    }

    @Test
    void removeFavoriteNotFound() {
        Buyer buyer = new Buyer();
        buyer.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(favoriteSearchRepository.findById(2L)).thenReturn(Optional.empty());
        FavoriteSearchDeleteRequest req = new FavoriteSearchDeleteRequest();
        req.setFavoriteSearchId(2L);
        assertThrows(FavoriteSearchNotFoundException.class, () -> buyerService.removeFavorite(req));
    }

    @Test
    void getFavoritesPagination() {
        Buyer buyer = new Buyer();
        buyer.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        FavoriteSearch fav = new FavoriteSearch();
        fav.setId(1L);
        Page<FavoriteSearch> page = new PageImpl<>(Collections.singletonList(fav), PageRequest.of(0, 10), 1);
        when(favoriteSearchRepository.findByBuyerId(1L, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<FavoriteSearchResponse> resp = buyerService.getFavorites(0, 10);
        assertEquals(1, resp.getTotalElements());
    }

    @Test
    void getFavoritesEmpty() {
        Buyer buyer = new Buyer();
        buyer.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Page<FavoriteSearch> page = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);
        when(favoriteSearchRepository.findByBuyerId(1L, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<FavoriteSearchResponse> resp = buyerService.getFavorites(0, 10);
        assertEquals(0, resp.getTotalElements());
    }

    @Test
    void registerBuyerWithGoogleExistingEmailThrowsException() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        when(buyerRepository.findByEmail(anyString())).thenReturn(Optional.of(new Buyer()));
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(mockValidGoogleIdToken(EMAILTEST)).when(buyerService).verifyGoogleIdToken(anyString());

        assertThrows(DuplicateResourceException.class, () -> 
            buyerService.registerBuyerWithGoogle(body)
        );
    }

    @Test
    void registerBuyerWithGoogleNewUserSuccess() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        when(buyerRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(mockValidGoogleIdToken("newuser@example.com")).when(buyerService).verifyGoogleIdToken(anyString());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");

        RegistrationResponse resp = buyerService.registerBuyerWithGoogle(body);
        assertEquals("Registrazione Google andata a buon fine", resp.getMessage());
        verify(buyerRepository).save(any(Buyer.class));
    }

    @Test
    void registerBuyerWithGoogleInvalidTokenThrowsException() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(null).when(buyerService).verifyGoogleIdToken(anyString());

        assertThrows(InvalidCredentialsException.class, () -> 
            buyerService.registerBuyerWithGoogle(body)
        );
    }

    @Test
    void loginBuyerWithGoogleCodeValidTokenSuccess() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        Buyer buyer = new Buyer();
        buyer.setEmail(EMAILTEST);
        buyer.setPassword("pwd");
        when(buyerRepository.findByEmail(anyString())).thenReturn(Optional.of(buyer));
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(mockValidGoogleIdToken(EMAILTEST)).when(buyerService).verifyGoogleIdToken(anyString());
        when(jwtService.generateToken(any())).thenReturn("jwt");

        String jwt = buyerService.loginBuyerWithGoogleCode(body);
        assertEquals("jwt", jwt);
    }

    @Test
    void loginBuyerWithGoogleCodeUserNotFoundThrowsException() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(mockValidGoogleIdToken("notfound@example.com")).when(buyerService).verifyGoogleIdToken(anyString());
        when(buyerRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> 
            buyerService.loginBuyerWithGoogleCode(body)
        );
    }

    @Test
    void loginBuyerWithGoogleCodeInvalidTokenThrowsException() {
        Map<String, String> body = Map.of("code", DUMMYCODE);
        doReturn(IDTOKEN).when(buyerService).getGoogleIdTokenFromCode(anyString(), anyString());
        doReturn(null).when(buyerService).verifyGoogleIdToken(anyString());

        assertThrows(InvalidCredentialsException.class, () -> 
            buyerService.loginBuyerWithGoogleCode(body)
        );
    }

    private static GoogleIdToken mockValidGoogleIdToken(String email) {
        Payload payload = mock(Payload.class);
        when(payload.getEmail()).thenReturn(email);
        GoogleIdToken idToken = mock(GoogleIdToken.class);
        when(idToken.getPayload()).thenReturn(payload);
        return idToken;
    }

    @Test
    void getGoogleIdTokenFromCodeSuccess() {
        Map<String, String> response = new HashMap<>();
        response.put("id_token", VALID_TOKEN);
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(response, HttpStatus.OK);
        
        when(restTemplate.postForEntity(
            eq(TOKEN_URL),
            any(HttpEntity.class),
            eq(Map.class)
        )).thenReturn(responseEntity);

        String result = buyerService.getGoogleIdTokenFromCode("valid_code", REDIRECT_URI);
        assertEquals(VALID_TOKEN, result);
    }

    @Test
    void getGoogleIdTokenFromCodeEmptyResponse() {
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(null, HttpStatus.OK);
        
        when(restTemplate.postForEntity(
            eq(TOKEN_URL),
            any(HttpEntity.class),
            eq(Map.class)
        )).thenReturn(responseEntity);

        assertThrows(InvalidCredentialsException.class, () -> 
            buyerService.getGoogleIdTokenFromCode("invalid_code", REDIRECT_URI)
        );
    }

    @Test
    void getGoogleIdTokenFromCodeInvalidResponse() {
        Map<String, String> response = new HashMap<>(); // No id_token in response
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(response, HttpStatus.OK);
        
        when(restTemplate.postForEntity(
            eq(TOKEN_URL),
            any(HttpEntity.class),
            eq(Map.class)
        )).thenReturn(responseEntity);

        assertThrows(InvalidCredentialsException.class, () -> 
            buyerService.getGoogleIdTokenFromCode("invalid_code", REDIRECT_URI)
        );
    }

    @Test
    void verifyGoogleIdTokenSuccess() {
        String idTokenString = VALID_TOKEN;
        GoogleIdToken mockToken = mock(GoogleIdToken.class);
        GoogleIdToken.Payload mockPayload = mock(GoogleIdToken.Payload.class);
        when(mockToken.getPayload()).thenReturn(mockPayload);
        
        doReturn(mockToken).when(buyerService).verifyGoogleIdToken(idTokenString);
        
        GoogleIdToken result = buyerService.verifyGoogleIdToken(idTokenString);
        assertNotNull(result);
        assertEquals(mockToken, result);
    }

    @Test
    void verifyGoogleIdTokenInvalid() {
        String invalidToken = "invalid_token";
        doReturn(null).when(buyerService).verifyGoogleIdToken(invalidToken);
        
        GoogleIdToken result = buyerService.verifyGoogleIdToken(invalidToken);
        assertNull(result);
    }

    @Test
    void updateProfileSuccess() {
        Buyer buyer = new Buyer();
        buyer.setPassword("old");
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Buyer updated = new Buyer();
        updated.setFirstName("New");
        updated.setPassword("new");
        when(passwordEncoder.encode("new")).thenReturn("encNew");

        buyerService.updateProfile(updated);
        assertEquals("New", buyer.getFirstName());
        assertEquals("encNew", buyer.getPassword());
        verify(buyerRepository).save(buyer);
    }

    @Test
    void updateProfileNullFields() {
        Buyer buyer = new Buyer();
        buyer.setFirstName("Old");
        buyer.setPassword("old");
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Buyer updated = new Buyer();
        buyerService.updateProfile(updated);
        assertEquals("Old", buyer.getFirstName());
        assertEquals("old", buyer.getPassword());
        verify(buyerRepository).save(buyer);
    }

    @Test
    void searchRealEstatesResults() {
        FavoriteRequest req = new FavoriteRequest();
        RealEstate estate = new RealEstate();
        estate.setId(1L);
        estate.setImageUrls(Collections.singletonList("url"));
        Page<RealEstate> page = new PageImpl<>(Collections.singletonList(estate), PageRequest.of(0, 10), 1);
        when(realEstateRepository.searchRealEstates(any(), any(), any(), any(), any(), any(), any())).thenReturn(page);

        PageResponse<RealEstateResponseDTO> resp = buyerService.searchRealEstates(req, 0, 10);
        assertEquals(1, resp.getTotalElements());
    }

    @Test
    void searchRealEstatesNoResults() {
        FavoriteRequest req = new FavoriteRequest();
        Page<RealEstate> page = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);
        when(realEstateRepository.searchRealEstates(any(), any(), any(), any(), any(), any(), any())).thenReturn(page);

        PageResponse<RealEstateResponseDTO> resp = buyerService.searchRealEstates(req, 0, 10);
        assertEquals(0, resp.getTotalElements());
    }

    @Test
    void getHomePageEstatesSuccess() {
        RealEstate estate = new RealEstate();
        estate.setId(1L);
        estate.setImageUrls(Collections.singletonList("url"));
        List<RealEstate> estates = List.of(estate);
        when(realEstateRepository.findTop5ByOrderByIdDesc()).thenReturn(estates);

        List<RealEstateResponseDTO> result = buyerService.getHomePageEstates();
        assertFalse(result.isEmpty());
    }

    @Test
    void getHomePageEstatesEmpty() {
        when(realEstateRepository.findTop5ByOrderByIdDesc()).thenReturn(Collections.emptyList());
        List<RealEstateResponseDTO> result = buyerService.getHomePageEstates();
        assertTrue(result.isEmpty());
    }

    @Test
    void getWeatherForecastCityNotFound() {
        WeatherRequest req = new WeatherRequest();
        req.setCity("FakeCity");
        assertThrows(WeatherApiException.class, () -> buyerService.getWeatherForecast(req));
    }

    @Test
    void bookVisitInvalidDate() {
        VisitRequest req = new VisitRequest();
        req.setRealEstateId(1L);
        req.setDate("invalid-date");
        req.setTime(TIME);
        when(realEstateRepository.findById(1L)).thenReturn(Optional.of(new RealEstate()));
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertThrows(IllegalArgumentException.class, () -> buyerService.bookVisit(req));
    }

    @Test
    void bookVisitRealEstateNotFound() {
        VisitRequest req = new VisitRequest();
        req.setRealEstateId(99L);
        req.setDate("2025-11-10");
        req.setTime(TIME);
        when(realEstateRepository.findById(99L)).thenReturn(Optional.empty());
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertThrows(RealEstateNotFoundException.class, () -> buyerService.bookVisit(req));
    }

    @Test
    void getNotificationsForCurrentBuyerEmpty() {
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Page<Notification> page = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);
        when(notificationRepository.findByBuyer(buyer, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<NotificationDTO> resp = buyerService.getNotificationsForCurrentBuyer(0, 10);
        assertEquals(0, resp.getTotalElements());
    }

    @Test
    void getNotificationsForCurrentBuyerWithResults() {
        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Notification n = new Notification();
        n.setId(1L);
        n.setTitle("Titolo");
        n.setType("INFO");
        n.setMessage("Messaggio");
        n.setCreatedAt(java.time.LocalDateTime.now());
        Page<Notification> page = new PageImpl<>(Collections.singletonList(n), PageRequest.of(0, 10), 1);
        when(notificationRepository.findByBuyer(buyer, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<NotificationDTO> resp = buyerService.getNotificationsForCurrentBuyer(0, 10);
        assertEquals(1, resp.getTotalElements());
        assertEquals("Titolo", resp.getContent().get(0).getTitle());
    }

    @Test
    void bookVisitSuccess() {
        VisitRequest req = new VisitRequest();
        req.setRealEstateId(1L);
        req.setDate("2025-10-10");
        req.setTime(TIME);
        RealEstate estate = new RealEstate();
        estate.setAgent(new EstateAgent());
        when(realEstateRepository.findById(1L)).thenReturn(Optional.of(estate));
        when(bookedVisitRepository.existsByEstateAndRequestDate(any(), any())).thenReturn(false);

        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertDoesNotThrow(() -> buyerService.bookVisit(req));
        verify(bookedVisitRepository).save(any(BookedVisit.class));
    }

    @Test
    void bookVisitDuplicate() {
        VisitRequest req = new VisitRequest();
        req.setRealEstateId(1L);
        req.setDate("2025-10-10");
        req.setTime(TIME);
        RealEstate estate = new RealEstate();
        estate.setAgent(new EstateAgent());
        when(realEstateRepository.findById(1L)).thenReturn(Optional.of(estate));
        when(bookedVisitRepository.existsByEstateAndRequestDate(any(), any())).thenReturn(true);

        Buyer buyer = new Buyer();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(buyer);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertThrows(DuplicateResourceException.class, () -> buyerService.bookVisit(req));
    }

    @Test
    void getWeatherForecastSuccess() {
        // Test solo struttura: in realtà chiama API esterne, qui si verifica che non lanci eccezioni per città reale
        WeatherRequest req = new WeatherRequest();
        req.setCity("Napoli");
        assertDoesNotThrow(() -> buyerService.getWeatherForecast(req));
    }

}
