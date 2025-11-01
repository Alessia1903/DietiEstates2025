package it.unina.dieti_estates.tests.service;

import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.resource.BookedVisitNotFoundException;
import it.unina.dieti_estates.exception.storage.FileStorageException;
import it.unina.dieti_estates.exception.validation.InvalidRealEstateDataException;
import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.*;
import it.unina.dieti_estates.repository.*;
import it.unina.dieti_estates.service.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EstateAgentServiceTest {

    private static final String ADDRESS = "Via Roma";
    private static final String CITY = "Napoli";
    private static final String IMAGE = "img.jpg";
    private static final String IMAGEURL = "http://img.url";

    @Mock private EstateAgentRepository agentRepository;
    @Mock private BookedVisitRepository visitRepository;
    @Mock private RealEstateRepository realEstateRepository;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private BlobStorageService blobStorageService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private NotificationRepository notificationRepository;
    @Mock private FavoriteSearchRepository favoriteSearchRepository;

    @InjectMocks
    private EstateAgentService estateAgentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    void loginAgentSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail("agent@example.com");
        req.setPassword("pass");
        EstateAgent agent = new EstateAgent();
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(agent);
        when(jwtService.generateToken(agent)).thenReturn("jwt-token");

        String token = estateAgentService.loginAgent(req);
        assertEquals("jwt-token", token);
    }

    @Test
    void loginAgentInvalidCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("agent@example.com");
        req.setPassword("wrong");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new RuntimeException());

        assertThrows(InvalidCredentialsException.class, () -> estateAgentService.loginAgent(req));
    }

    @Test
    void getProfileSuccess() {
        EstateAgent agent = new EstateAgent();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        EstateAgent result = estateAgentService.getProfile();
        assertEquals(agent, result);
    }

    @Test
    void getProfileUnauthorized() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.getProfile());
    }

    @Test
    void getAllBookedVisitsUnauthorized() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.getAllBookedVisits(0, 10));
    }

    @Test
    void acceptVisitAgentNull() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.acceptVisit(1L));
    }

    @Test
    void acceptVisitNotFound() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(visitRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(BookedVisitNotFoundException.class, () -> estateAgentService.acceptVisit(2L));
    }

    @Test
    void rejectVisitAgentNull() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.rejectVisit(1L));
    }

    @Test
    void rejectVisitNotFound() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(visitRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(BookedVisitNotFoundException.class, () -> estateAgentService.rejectVisit(2L));
    }

    @Test
    void loadNewRealEstateNoImages() {
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        req.setImages(null);

        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        EstateAgent agent = new EstateAgent();
        when(auth.getPrincipal()).thenReturn(agent);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertThrows(InvalidRealEstateDataException.class, () -> estateAgentService.loadNewRealEstate(req));
    }

    @Test
    void loadNewRealEstateTooManyImages() {
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile[] images = new MultipartFile[8];
        req.setImages(images);

        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        EstateAgent agent = new EstateAgent();
        when(auth.getPrincipal()).thenReturn(agent);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        assertThrows(InvalidRealEstateDataException.class, () -> estateAgentService.loadNewRealEstate(req));
    }

    @Test
    void updateProfileSuccess() {
        EstateAgent agent = new EstateAgent();
        agent.setFirstName("Old");
        agent.setPassword("oldpass");
        EstateAgent updated = new EstateAgent();
        updated.setFirstName("New");
        updated.setPassword("newpass");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(passwordEncoder.encode("newpass")).thenReturn("encodedNew");

        estateAgentService.updateProfile(updated);

        assertEquals("New", agent.getFirstName());
        assertEquals("encodedNew", agent.getPassword());
        verify(agentRepository).save(agent);
    }

    @Test
    void getAllBookedVisitsSuccess() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        BookedVisitDTO dto = new BookedVisitDTO(
            1L,
            "buyer@email.com",
            new java.sql.Timestamp(System.currentTimeMillis()),
            ADDRESS,
            "accettata"
        );
        List<BookedVisitDTO> dtos = Collections.singletonList(dto);
        Page<BookedVisitDTO> page = new PageImpl<>(dtos, PageRequest.of(0, 10), 1);
        when(visitRepository.findByEstateAgent(1L, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<BookedVisitDTO> resp = estateAgentService.getAllBookedVisits(0, 10);
        assertEquals(1, resp.getTotalElements());
        assertEquals(dto, resp.getContent().get(0));
    }

    @Test
    void acceptVisitSuccess() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        BookedVisit visit = new BookedVisit();
        visit.setId(2L);
        EstateAgent visitAgent = new EstateAgent();
        visitAgent.setId(1L);
        visit.setAgent(visitAgent);
        visit.setStatus("in attesa");
        Buyer buyer = new Buyer();
        RealEstate realEstate = new RealEstate();
        realEstate.setAddress(ADDRESS);
        visit.setBuyer(buyer);
        visit.setRealEstate(realEstate);

        when(visitRepository.findById(2L)).thenReturn(Optional.of(visit));

        String result = estateAgentService.acceptVisit(2L);
        assertEquals("Visita accettata con successo", result);
        assertEquals("accettata", visit.getStatus());
        verify(visitRepository).save(visit);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void acceptVisitUnauthorized() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        BookedVisit visit = new BookedVisit();
        visit.setId(2L);
        EstateAgent visitAgent = new EstateAgent();
        visitAgent.setId(99L);
        visit.setAgent(visitAgent);

        when(visitRepository.findById(2L)).thenReturn(Optional.of(visit));

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.acceptVisit(2L));
    }

    @Test
    void rejectVisitSuccess() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        BookedVisit visit = new BookedVisit();
        visit.setId(2L);
        EstateAgent visitAgent = new EstateAgent();
        visitAgent.setId(1L);
        visit.setAgent(visitAgent);
        visit.setStatus("in attesa");
        Buyer buyer = new Buyer();
        RealEstate realEstate = new RealEstate();
        realEstate.setAddress(ADDRESS);
        visit.setBuyer(buyer);
        visit.setRealEstate(realEstate);

        when(visitRepository.findById(2L)).thenReturn(Optional.of(visit));

        String result = estateAgentService.rejectVisit(2L);
        assertEquals("Visita rifiutata con successo", result);
        assertEquals("rifiutata", visit.getStatus());
        verify(visitRepository).save(visit);
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void rejectVisitUnauthorized() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        BookedVisit visit = new BookedVisit();
        visit.setId(2L);
        EstateAgent visitAgent = new EstateAgent();
        visitAgent.setId(99L);
        visit.setAgent(visitAgent);

        when(visitRepository.findById(2L)).thenReturn(Optional.of(visit));

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.rejectVisit(2L));
    }

    @Test
    void loadNewRealEstateNoImageUploaded() throws IOException {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile img = mock(MultipartFile.class);
        when(img.isEmpty()).thenReturn(false);
        when(img.getOriginalFilename()).thenReturn(IMAGE);
        MultipartFile[] images = new MultipartFile[]{img};
        req.setImages(images);

        // uploadFile restituisce stringa vuota, quindi nessuna immagine caricata
        when(blobStorageService.uploadFile(any())).thenReturn("");

        assertThrows(FileStorageException.class, () -> estateAgentService.loadNewRealEstate(req));
    }

    @Test
    void loadNewRealEstateUploadFailed() throws IOException {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile img = mock(MultipartFile.class);
        when(img.isEmpty()).thenReturn(false);
        when(img.getOriginalFilename()).thenReturn(IMAGE);
        MultipartFile[] images = new MultipartFile[]{img};
        req.setImages(images);

        when(blobStorageService.uploadFile(any())).thenThrow(new RuntimeException("upload error"));

        assertThrows(FileStorageException.class, () -> estateAgentService.loadNewRealEstate(req));
    }

    @Test
    void loadNewRealEstateSendsNotificationsToFavorites() throws IOException {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile img = mock(MultipartFile.class);
        when(img.isEmpty()).thenReturn(false);
        when(img.getBytes()).thenReturn(new byte[]{1,2,3});
        when(img.getOriginalFilename()).thenReturn(IMAGE);
        MultipartFile[] images = new MultipartFile[]{img};
        req.setImages(images);
        req.setCity(CITY);
        req.setDistrict("Centro");
        req.setAddress(ADDRESS);
        req.setStreetNumber("10");
        req.setFloor(1);
        req.setTotalBuildingFloors(5);
        req.setCommercialArea(100f);
        req.setElevator(true);
        req.setRooms(3);
        req.setEnergyClass("A");
        req.setFurnishing("Arredato");
        req.setHeating("Autonomo");
        req.setPropertyStatus("Nuovo");
        req.setContractType("Vendita");
        req.setDescription("desc");
        req.setPrice(100000f);

        when(blobStorageService.uploadFile(any())).thenReturn(IMAGEURL);
        when(realEstateRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        FavoriteSearch fav1 = mock(FavoriteSearch.class);
        FavoriteSearch fav2 = mock(FavoriteSearch.class);
        List<FavoriteSearch> favorites = Arrays.asList(fav1, fav2);
        when(favoriteSearchRepository.findMatchingFavorites(any(), any(), any(), any(), anyDouble())).thenReturn(favorites);

        RealEstateResponseDTO resp = estateAgentService.loadNewRealEstate(req);
        assertEquals(CITY, resp.getCity());
        assertEquals(ADDRESS, resp.getAddress());
        assertEquals(1, resp.getImageUrls().size());
        verify(notificationRepository, times(2)).save(any(Notification.class));
    }

    @Test
    void loadNewRealEstateSuccess() throws IOException {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile img = mock(MultipartFile.class);
        when(img.isEmpty()).thenReturn(false);
        when(img.getBytes()).thenReturn(new byte[]{1,2,3});
        when(img.getOriginalFilename()).thenReturn(IMAGE);
        MultipartFile[] images = new MultipartFile[]{img};
        req.setImages(images);
        req.setCity(CITY);
        req.setDistrict("Centro");
        req.setAddress(ADDRESS);
        req.setStreetNumber("10");
        req.setFloor(1);
        req.setTotalBuildingFloors(5);
        req.setCommercialArea(100f);
        req.setElevator(true);
        req.setRooms(3);
        req.setEnergyClass("A");
        req.setFurnishing("Arredato");
        req.setHeating("Autonomo");
        req.setPropertyStatus("Nuovo");
        req.setContractType("Vendita");
        req.setDescription("desc");
        req.setPrice(100000f);

        when(blobStorageService.uploadFile(any())).thenReturn(IMAGEURL);
        when(realEstateRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(favoriteSearchRepository.findMatchingFavorites(any(), any(), any(), any(), anyDouble())).thenReturn(Collections.emptyList());

        RealEstateResponseDTO resp = estateAgentService.loadNewRealEstate(req);
        assertEquals(CITY, resp.getCity());
        assertEquals(ADDRESS, resp.getAddress());
        assertEquals(1, resp.getImageUrls().size());
    }

    @Test
    void loadNewRealEstateUnauthorized() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        CreateRealEstateRequest req = new CreateRealEstateRequest();
        MultipartFile[] images = new MultipartFile[1];
        req.setImages(images);

        assertThrows(UnauthorizedAccessException.class, () -> estateAgentService.loadNewRealEstate(req));
    }

    @Test
    void getMyPropertiesSuccess() {
        EstateAgent agent = new EstateAgent();
        agent.setId(1L);
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(agent);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        RealEstate estate = new RealEstate();
        estate.setId(10L);
        estate.setCity(CITY);
        estate.setImageUrls(Collections.singletonList(IMAGEURL));
        List<RealEstate> estates = Collections.singletonList(estate);
        Page<RealEstate> page = new PageImpl<>(estates, PageRequest.of(0, 10), 1);
        when(realEstateRepository.findByAgentId(1L, PageRequest.of(0, 10))).thenReturn(page);

        PageResponse<RealEstateResponseDTO> resp = estateAgentService.getMyProperties(0, 10);
        assertEquals(1, resp.getTotalElements());
        assertEquals(CITY, resp.getContent().get(0).getCity());
    }
}
