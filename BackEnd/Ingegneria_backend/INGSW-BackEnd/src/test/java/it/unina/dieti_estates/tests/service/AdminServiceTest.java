package it.unina.dieti_estates.tests.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.validation.DuplicateResourceException;
import it.unina.dieti_estates.model.Admin;
import it.unina.dieti_estates.model.Agency;
import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.ChangePasswordRequest;
import it.unina.dieti_estates.model.dto.CreateAdminRequest;
import it.unina.dieti_estates.model.dto.CreateEstateAgentRequest;
import it.unina.dieti_estates.model.dto.CreateAgencyRequest;
import it.unina.dieti_estates.model.dto.QRCodeResponse;
import it.unina.dieti_estates.repository.AdminRepository;
import it.unina.dieti_estates.repository.EstateAgentRepository;
import it.unina.dieti_estates.repository.AgencyRepository;
import it.unina.dieti_estates.service.AdminService;
import it.unina.dieti_estates.service.JwtService;
import it.unina.dieti_estates.utils.PasswordGenerator;
import it.unina.dieti_estates.utils.QRCodeGenerator;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTest {

    private static final String EMAIL_ADMIN = "admin@example.com";
    private static final String WRONG_PASSWORD = "wrong";
    private static final String ENCODED_OLD_PASSWORD = "encodedOld";
    private static final String QR_BASE64 = "qrbase64";

    @Mock private AdminRepository adminRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private EstateAgentRepository agentRepository;
    @Mock private ObjectMapper objectMapper;
    @Mock private PasswordGenerator passwordGenerator;
    @Mock private AgencyRepository agencyRepository;

    @InjectMocks
    private AdminService adminService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.clearContext();
    }

    @Test
    void loginAdminSuccess() {
        LoginRequest req = new LoginRequest();
        req.setEmail(EMAIL_ADMIN);
        req.setPassword("pass");
        Admin admin = new Admin();
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(admin);
        when(jwtService.generateToken(admin)).thenReturn("jwt-token");

        String token = adminService.loginAdmin(req);
        assertEquals("jwt-token", token);
    }

    @Test
    void loginAdminInvalidCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail(EMAIL_ADMIN);
        req.setPassword(WRONG_PASSWORD);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenThrow(new RuntimeException());

        assertThrows(InvalidCredentialsException.class, () -> adminService.loginAdmin(req));
    }

    @Test
    void getProfileSuccess() {
        Admin admin = new Admin();
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(admin);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        Admin result = adminService.getProfile();
        assertEquals(admin, result);
    }

    @Test
    void getProfileUnauthorized() {
        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        when(context.getAuthentication()).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(null);
        SecurityContextHolder.setContext(context);

        assertThrows(UnauthorizedAccessException.class, () -> adminService.getProfile());
    }

    @Test
    void changeAmministrationPasswordSuccess() {
        Admin admin = new Admin();
        admin.setPassword(ENCODED_OLD_PASSWORD);
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(admin);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(passwordEncoder.matches("old", ENCODED_OLD_PASSWORD)).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("encodedNew");

        adminService.changeAmministrationPassword(req);

        assertEquals("encodedNew", admin.getPassword());
        verify(adminRepository).save(admin);
    }

    @Test
    void changeAmministrationPasswordWrongCurrent() {
        Admin admin = new Admin();
        admin.setPassword(ENCODED_OLD_PASSWORD);
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword(WRONG_PASSWORD);
        req.setNewPassword("new");

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(admin);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(passwordEncoder.matches(WRONG_PASSWORD, ENCODED_OLD_PASSWORD)).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> adminService.changeAmministrationPassword(req));
    }

    @Test
    void createAdminAccountDuplicate() {
        CreateAdminRequest req = new CreateAdminRequest();
        req.setEmail(EMAIL_ADMIN);
        when(adminRepository.findByEmail(EMAIL_ADMIN)).thenReturn(Optional.of(new Admin()));

        assertThrows(DuplicateResourceException.class, () -> adminService.createAdminAccount(req));
    }

    @Test
    void createAdminAccountSuccess() throws Exception {
        CreateAdminRequest req = new CreateAdminRequest();
        req.setEmail("newadmin@example.com");
        req.setFirstName("Luca");
        req.setLastName("Bianchi");

        when(adminRepository.findByEmail("newadmin@example.com")).thenReturn(Optional.empty());
        when(passwordGenerator.generateSecurePassword()).thenReturn("plainpass");
        Admin authenticatedAdmin = new Admin();
        authenticatedAdmin.setVatNumber("12345678903");
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(authenticatedAdmin);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(objectMapper.writeValueAsString(any())).thenReturn("{\"email\":\"newadmin@example.com\",\"password\":\"plainpass\"}");
        try (MockedStatic<QRCodeGenerator> qrMock = Mockito.mockStatic(QRCodeGenerator.class)) {
            qrMock.when(() -> QRCodeGenerator.generateQRCodeBase64(anyString(), anyInt(), anyInt())).thenReturn(QR_BASE64);

            QRCodeResponse resp = adminService.createAdminAccount(req);
            assertEquals("Account per admin creato con successo", resp.getMessage());
            assertEquals(QR_BASE64, resp.getBase64QRCode());
            verify(adminRepository).save(any(Admin.class));
        }
    }

    @Test
    void createEstateAgentAccountDuplicate() {
        CreateEstateAgentRequest req = new CreateEstateAgentRequest();
        req.setEmail("agent@example.com");
        when(agentRepository.findByEmail("agent@example.com")).thenReturn(Optional.of(new EstateAgent()));

        assertThrows(DuplicateResourceException.class, () -> adminService.createEstateAgentAccount(req));
    }

    @Test
    void createEstateAgentAccountSuccess() throws Exception {
        CreateEstateAgentRequest req = new CreateEstateAgentRequest();
        req.setEmail("newagent@example.com");
        req.setFirstName("Nome");
        req.setLastName("Cognome");
        req.setTelephoneNumber("123456");
        req.setQualifications("qual");

        when(agentRepository.findByEmail("newagent@example.com")).thenReturn(Optional.empty());
        when(passwordGenerator.generateSecurePassword()).thenReturn("plainpass2");
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"email\":\"newagent@example.com\",\"password\":\"plainpass2\"}");
        try (MockedStatic<QRCodeGenerator> qrMock = Mockito.mockStatic(QRCodeGenerator.class)) {
            qrMock.when(() -> QRCodeGenerator.generateQRCodeBase64(anyString(), anyInt(), anyInt())).thenReturn(QR_BASE64);

            QRCodeResponse resp = adminService.createEstateAgentAccount(req);
            assertEquals("Account per agente immobiliare creato con successo", resp.getMessage());
            assertEquals(QR_BASE64, resp.getBase64QRCode());
            verify(agentRepository).save(any(EstateAgent.class));
        }
    }

    @Test
    void createAgencyDuplicate() {
        CreateAgencyRequest req = new CreateAgencyRequest();
        req.setVatNumber("VAT123");
        when(agencyRepository.existsByVatNumber("VAT123")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> adminService.createAgency(req));
    }

    @Test
    void createAgencySuccess() throws Exception {
        CreateAgencyRequest req = new CreateAgencyRequest();
        req.setVatNumber("VAT999");
        req.setAdminEmail("admin@agency.com");
        req.setAdminFirstName("Nome");
        req.setAdminLastName("Cognome");
        req.setAgencyName("Agenzia");

        when(agencyRepository.existsByVatNumber("VAT999")).thenReturn(false);
        when(passwordGenerator.generateSecurePassword()).thenReturn("plainpass");
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"email\":\"admin@agency.com\",\"password\":\"plainpass\"}");
        try (MockedStatic<QRCodeGenerator> qrMock = Mockito.mockStatic(QRCodeGenerator.class)) {
            qrMock.when(() -> QRCodeGenerator.generateQRCodeBase64(anyString(), anyInt(), anyInt())).thenReturn(QR_BASE64);

            QRCodeResponse resp = adminService.createAgency(req);
            assertEquals("Agenzia registrata con successo", resp.getMessage());
            assertEquals(QR_BASE64, resp.getBase64QRCode());
            verify(agencyRepository).save(any(Agency.class));
        }
    }
}
