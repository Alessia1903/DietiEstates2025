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


@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final FavoriteSearchRepository favoriteSearchRepository;
    private final RealEstateRepository realEstateRepository;

    @Autowired
    public BuyerService(BuyerRepository buyerRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       @Lazy AuthenticationManager authenticationManager,
                       FavoriteSearchRepository favoriteSearchRepository,
                       RealEstateRepository realEstateRepository) {
        this.buyerRepository = buyerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.favoriteSearchRepository = favoriteSearchRepository;
        this.realEstateRepository = realEstateRepository;
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
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            return jwtService.generateToken(userDetails);
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Email o password non valida");
        }
    }

    public String addFavorite(FavoriteRequest request) {
        Buyer buyer = getProfile();

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
                dto.setImageUrl(re.getImageUrl());
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
}
