package it.unina.dieti_estates.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.storage.FileStorageException;
import it.unina.dieti_estates.exception.validation.InvalidRealEstateDataException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.*;
import it.unina.dieti_estates.repository.BookedVisitRepository;
import it.unina.dieti_estates.repository.EstateAgentRepository;
import it.unina.dieti_estates.repository.RealEstateRepository;
import it.unina.dieti_estates.repository.NotificationRepository;
import it.unina.dieti_estates.repository.FavoriteSearchRepository;
import it.unina.dieti_estates.exception.resource.BookedVisitNotFoundException;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class EstateAgentService {

    private final EstateAgentRepository agentRepository;
    private final BookedVisitRepository visitRepository;
    private final RealEstateRepository realEstateRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final BlobStorageService blobStorageService;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;
    private final FavoriteSearchRepository favoriteSearchRepository;

    @Autowired
    public EstateAgentService(
            EstateAgentRepository agentRepository,
            @Lazy AuthenticationManager authenticationManager,
            JwtService jwtService,
            BookedVisitRepository visitRepository,
            RealEstateRepository realEstateRepository,
            BlobStorageService blobStorageService,
            PasswordEncoder passwordEncoder,
            NotificationRepository notificationRepository,
            FavoriteSearchRepository favoriteSearchRepository) {
        this.agentRepository = agentRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.visitRepository = visitRepository;
        this.realEstateRepository = realEstateRepository;
        this.blobStorageService = blobStorageService;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
        this.favoriteSearchRepository = favoriteSearchRepository;
    }
    
    public String loginAgent(LoginRequest loginAgentRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        loginAgentRequest.getEmail(),
                        loginAgentRequest.getPassword()
                    )
            );
            EstateAgent agentDetails = (EstateAgent) authentication.getPrincipal();
            return jwtService.generateToken(agentDetails);
        } catch (Exception ex) {
            throw new InvalidCredentialsException("Credenziali non valide");
        }
    }

    public EstateAgent getProfile() {
        EstateAgent agent = (EstateAgent) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (agent == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }
        return agent;
    }

    public PageResponse<BookedVisitDTO> getAllBookedVisits(int page, int size) {
        EstateAgent agent = (EstateAgent) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (agent == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }
        Page<BookedVisitDTO> visitPage = visitRepository.findByEstateAgent(agent.getId(), PageRequest.of(page, size));
        return new PageResponse<>(
            visitPage.getContent(),
            visitPage.getNumber(),
            visitPage.getSize(),
            visitPage.getTotalElements(),
            visitPage.hasNext()
        );
    }

    public String acceptVisit(Long visitId) {
        EstateAgent agent = (EstateAgent) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (agent == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }

        BookedVisit visit = visitRepository.findById(visitId)
            .orElseThrow(() -> new BookedVisitNotFoundException("Visit not found with id: " + visitId));

        if (!visit.getAgent().getId().equals(agent.getId())) {
            throw new UnauthorizedAccessException("Estate agent can only manage their own visits");
        }

        visit.setStatus("accettata");
        visitRepository.save(visit);

        // CREA NOTIFICA PER BUYER
        Notification notification = new Notification(
            "Visita Accettata",
            "VISITA",
            "La tua richiesta di visita per l'immobile '" + visit.getRealEstate().getAddress() + "' è stata ACCETTATA.",
            LocalDateTime.now(),
            visit.getBuyer(),
            visit.getRealEstate()
        );
        notificationRepository.save(notification);

        return "Visita accettata con successo";
    }

    public String rejectVisit(Long visitId) {
        EstateAgent agent = (EstateAgent) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (agent == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }

        BookedVisit visit = visitRepository.findById(visitId)
            .orElseThrow(() -> new BookedVisitNotFoundException("Visit not found with id: " + visitId));

        if (!visit.getAgent().getId().equals(agent.getId())) {
            throw new UnauthorizedAccessException("Estate agent can only manage their own visits");
        }

        visit.setStatus("rifiutata");
        visitRepository.save(visit);

        // CREA NOTIFICA PER BUYER
        Notification notification = new Notification(
            "Visita Rifiutata",
            "VISITA",
            "La tua richiesta di visita per l'immobile '" + visit.getRealEstate().getAddress() + "' è stata RIFIUTATA.",
            LocalDateTime.now(),
            visit.getBuyer(),
            visit.getRealEstate()
        );
        notificationRepository.save(notification);

        return "Visita rifiutata con successo";
    }

    public RealEstateResponseDTO loadNewRealEstate(CreateRealEstateRequest request) throws IOException {
        // Ottiene l'agente dal SecurityContext
        EstateAgent agent = (EstateAgent) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (agent == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }

        // Verifica che ci sia almeno un'immagine
        if (request.getImages() == null || request.getImages().length == 0) {
            throw new InvalidRealEstateDataException("Devi caricare almeno una foto!");
        }

        // Verifica il numero massimo di immagini
        if (request.getImages().length > 7) {
            throw new InvalidRealEstateDataException("Puoi caricare al massimo 7 foto!");
        }

        // Upload delle immagini su Azure Blob Storage
        List<String> imageUrls = new java.util.ArrayList<>();
        for (MultipartFile img : request.getImages()) {
            if (img != null && !img.isEmpty()) {
                try {
                    String url = blobStorageService.uploadFile(img);
                    if (url != null && !url.isEmpty()) {
                        imageUrls.add(url);
                    }
                } catch (Exception e) {
                    throw FileStorageException.uploadFailed(img.getOriginalFilename(), e.getMessage());
                }
            }
        }

        // Verifica che almeno un'immagine sia stata caricata con successo
        if (imageUrls.isEmpty()) {
            throw new FileStorageException("Nessuna immagine è stata caricata correttamente");
        }

        RealEstate realEstate = new RealEstate(
            imageUrls,
            request.getCity(),
            request.getDistrict(),
            request.getAddress(),
            request.getStreetNumber(),
            request.getFloor(),
            request.getTotalBuildingFloors(),
            request.getCommercialArea(),
            request.getElevator(),
            request.getRooms(),
            request.getEnergyClass(),
            request.getFurnishing(),
            request.getHeating(),
            request.getPropertyStatus(),
            request.getContractType(),
            request.getDescription(),
            request.getPrice(),
            agent
        );

        RealEstate savedEstate = realEstateRepository.save(realEstate);

        // NOTIFICHE AI BUYER CON PREFERITI COMPATIBILI
        List<FavoriteSearch> matchingFavorites = favoriteSearchRepository.findMatchingFavorites(
            savedEstate.getCity(),
            savedEstate.getContractType(),
            savedEstate.getEnergyClass(),
            savedEstate.getRooms(),
            savedEstate.getPrice().doubleValue()
        );
        for (FavoriteSearch fav : matchingFavorites) {
            Notification notification = new Notification(
                "Nuova proprietà in linea con la tua ricerca",
                "NUOVA_PROPRIETA",
                "Nuovo immobile compatibile con i tuoi preferiti: " + savedEstate.getAddress(),
                LocalDateTime.now(),
                fav.getBuyer(),
                savedEstate
            );
            notificationRepository.save(notification);
        }

        return mapToResponseDTO(savedEstate);
    }

    private RealEstateResponseDTO mapToResponseDTO(RealEstate realEstate) {
        RealEstateResponseDTO dto = new RealEstateResponseDTO();
        dto.setId(realEstate.getId());
        List<String> imageUrls = new ArrayList<>(realEstate.getImageUrls());
        dto.setImageUrls(imageUrls);
        dto.setCity(realEstate.getCity());
        dto.setDistrict(realEstate.getDistrict());
        dto.setAddress(realEstate.getAddress());
        dto.setStreetNumber(realEstate.getStreetNumber());
        dto.setFloor(realEstate.getFloor());
        dto.setTotalBuildingFloors(realEstate.getTotalBuildingFloors());
        dto.setCommercialArea(realEstate.getCommercialArea());
        dto.setElevator(realEstate.getElevator());
        dto.setRooms(realEstate.getRooms());
        dto.setEnergyClass(realEstate.getEnergyClass());
        dto.setFurnishing(realEstate.getFurnishing());
        dto.setHeating(realEstate.getHeating());
        dto.setPropertyStatus(realEstate.getPropertyStatus());
        dto.setContractType(realEstate.getContractType());
        dto.setDescription(realEstate.getDescription());
        dto.setPrice(realEstate.getPrice());
        return dto;
    }

    @Transactional(readOnly = true)
    public PageResponse<RealEstateResponseDTO> getMyProperties(int page, int size) {
        EstateAgent agent = getProfile();
        Page<RealEstate> realEstatePage = realEstateRepository.findByAgentId(
            agent.getId(), 
            PageRequest.of(page, size)
        );

        List<RealEstateResponseDTO> dtos = realEstatePage.getContent()
            .stream()
            .map(this::mapToResponseDTO)
            .collect(Collectors.toList());

        return new PageResponse<>(
            dtos,
            realEstatePage.getNumber(),
            realEstatePage.getSize(),
            realEstatePage.getTotalElements(),
            realEstatePage.hasNext()
        );
    }

    public void updateProfile(EstateAgent updatedAgent) {
        EstateAgent agent = getProfile();
        if (updatedAgent.getFirstName() != null) agent.setFirstName(updatedAgent.getFirstName());
        if (updatedAgent.getLastName() != null) agent.setLastName(updatedAgent.getLastName());
        if (updatedAgent.getEmail() != null) agent.setEmail(updatedAgent.getEmail());
        if (updatedAgent.getTelephoneNumber() != null) agent.setTelephoneNumber(updatedAgent.getTelephoneNumber());
        if (updatedAgent.getQualifications() != null) agent.setQualifications(updatedAgent.getQualifications());
        if (updatedAgent.getPassword() != null && !updatedAgent.getPassword().isEmpty()) {
            agent.setPassword(passwordEncoder.encode(updatedAgent.getPassword()));
        }
        agentRepository.save(agent);
    }
}
