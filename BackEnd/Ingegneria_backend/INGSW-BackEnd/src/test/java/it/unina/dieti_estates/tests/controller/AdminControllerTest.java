package it.unina.dieti_estates.tests.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.model.Admin;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.*;
import it.unina.dieti_estates.service.AdminService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.validation.DuplicateResourceException;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {

    private static final String CODE = "$.code";
    private static final String MESSAGE = "$.message";
    private static final String JSONPATHCODEVALUE = "DUPLICATE_RESOURCE";
    private static final String UNAUTHORIZEDMESSAGE = "Utente non autenticato o sessione non valida";
    private static final String CHANGEPASSPATH = "/api/admins/change-amministration-password";
    private static final String CREATEADMINPATH = "/api/admins/create-admin";
    private static final String CREATEESTATEAGENTPATH = "/api/admins/create-estate-agent-account";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loginAdminSuccess() throws Exception {
        Mockito.when(adminService.loginAdmin(any(LoginRequest.class))).thenReturn("token");
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@mail.com");
        req.setPassword("pass");
        mockMvc.perform(post("/api/admins/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("token"));
    }

    @Test
    void loginAdminInvalidCredentials() throws Exception {
        Mockito.when(adminService.loginAdmin(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException("Credenziali non valide"));
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@mail.com");
        req.setPassword("wrong");
        mockMvc.perform(post("/api/admins/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("Credenziali non valide"));
    }

    @Test
    void createAgencySuccess() throws Exception {
        QRCodeResponse resp = new QRCodeResponse();
        Mockito.when(adminService.createAgency(any(CreateAgencyRequest.class))).thenReturn(resp);
        CreateAgencyRequest req = new CreateAgencyRequest();
        mockMvc.perform(post("/api/admins/create-agency")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    void createAgencyDuplicate() throws Exception {
        Mockito.when(adminService.createAgency(any(CreateAgencyRequest.class)))
                .thenThrow(new DuplicateResourceException("Agenzia già esistente"));
        CreateAgencyRequest req = new CreateAgencyRequest();
        mockMvc.perform(post("/api/admins/create-agency")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(CODE).value(JSONPATHCODEVALUE))
                .andExpect(jsonPath(MESSAGE).value("Agenzia già esistente"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createAdminAccountDuplicate() throws Exception {
        Mockito.when(adminService.createAdminAccount(any(CreateAdminRequest.class)))
                .thenThrow(new DuplicateResourceException("Admin già esistente"));
        CreateAdminRequest req = new CreateAdminRequest();
        mockMvc.perform(post(CREATEADMINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(CODE).value(JSONPATHCODEVALUE))
                .andExpect(jsonPath(MESSAGE).value("Admin già esistente"));
    }

    @Test
    void createAdminAccountUnauthorized() throws Exception {
        CreateAdminRequest req = new CreateAdminRequest();
        mockMvc.perform(post(CREATEADMINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createAdminAccountSuccess() throws Exception {
        QRCodeResponse resp = new QRCodeResponse();
        Mockito.when(adminService.createAdminAccount(any(CreateAdminRequest.class))).thenReturn(resp);
        CreateAdminRequest req = new CreateAdminRequest();
        mockMvc.perform(post(CREATEADMINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createEstateAgentAccountDuplicate() throws Exception {
        Mockito.when(adminService.createEstateAgentAccount(any(CreateEstateAgentRequest.class)))
                .thenThrow(new DuplicateResourceException("Agente già esistente"));
        CreateEstateAgentRequest req = new CreateEstateAgentRequest();
        mockMvc.perform(post(CREATEESTATEAGENTPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(CODE).value(JSONPATHCODEVALUE))
                .andExpect(jsonPath(MESSAGE).value("Agente già esistente"));
    }

    @Test
    void createEstateAgentAccountUnauthorized() throws Exception {
        CreateEstateAgentRequest req = new CreateEstateAgentRequest();
        mockMvc.perform(post(CREATEESTATEAGENTPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createEstateAgentAccountSuccess() throws Exception {
        QRCodeResponse resp = new QRCodeResponse();
        Mockito.when(adminService.createEstateAgentAccount(any(CreateEstateAgentRequest.class))).thenReturn(resp);
        CreateEstateAgentRequest req = new CreateEstateAgentRequest();
        mockMvc.perform(post(CREATEESTATEAGENTPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void changeAmministrationPasswordUnauthorized() throws Exception {
        Mockito.doThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE))
                .when(adminService).changeAmministrationPassword(any(ChangePasswordRequest.class));
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");
        mockMvc.perform(post(CHANGEPASSPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(UNAUTHORIZEDMESSAGE));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void changeAmministrationPasswordInvalidCredentials() throws Exception {
        Mockito.doThrow(new InvalidCredentialsException("La password attuale non è corretta"))
                .when(adminService).changeAmministrationPassword(any(ChangePasswordRequest.class));
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");
        mockMvc.perform(post(CHANGEPASSPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("La password attuale non è corretta"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void changeAmministrationPasswordSuccess() throws Exception {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");
        mockMvc.perform(post(CHANGEPASSPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password cambiata con successo"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProfileSuccess() throws Exception {
        Admin admin = new Admin();
        Mockito.when(adminService.getProfile()).thenReturn(admin);
        mockMvc.perform(get("/api/admins/profile"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getProfileUnauthorized() throws Exception {
        Mockito.when(adminService.getProfile())
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get("/api/admins/profile"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(UNAUTHORIZEDMESSAGE));
    }
}
