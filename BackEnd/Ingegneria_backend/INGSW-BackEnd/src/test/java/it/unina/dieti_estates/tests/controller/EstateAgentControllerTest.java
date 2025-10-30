package it.unina.dieti_estates.tests.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.VisitActionRequest;
import it.unina.dieti_estates.model.dto.CreateRealEstateRequest;
import it.unina.dieti_estates.service.EstateAgentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.model.dto.BookedVisitDTO;
import it.unina.dieti_estates.model.dto.PageResponse;
import java.util.List;
import java.sql.Timestamp;
import it.unina.dieti_estates.exception.resource.BookedVisitNotFoundException;
import it.unina.dieti_estates.model.dto.RealEstateResponseDTO;
import it.unina.dieti_estates.exception.validation.InvalidRealEstateDataException;
import it.unina.dieti_estates.exception.storage.FileStorageException;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class EstateAgentControllerTest {

    private static final String CODE = "$.code";
    private static final String MESSAGE = "$.message";
    private static final String ARRAYCONTENT = "$.content";
    private static final String UNAUTHORIZEDMESSAGE = "Utente non autenticato o sessione non valida";
    private static final String PROFILEPATH = "/api/estate-agents/profile";
    private static final String BOOKEDVISITPATH = "/api/estate-agents/all-booked-visits";
    private static final String ACCEPTVISITPATH = "/api/estate-agents/visits/accept";
    private static final String REJECTVISITPATH = "/api/estate-agents/visits/reject";
    private static final String VISITNOTFOUNDMESSAGE = "Visita non trovata con id: 99";
    private static final String MYPROPERTIESPATH = "/api/estate-agents/my-properties";
    private static final String MANAGEOWNVISITSMESSAGE = "L'agente immobiliare può gestire solo le proprie visite";
    private static final String LOADREALESTATEPATH = "/api/estate-agents/load-real-estate";
    private static final String FLASHATTRCREATEREALESTATE = "createRealEstateRequest";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EstateAgentService agentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loginAgentSuccess() throws Exception {
        Mockito.when(agentService.loginAgent(any(LoginRequest.class))).thenReturn("token");
        LoginRequest req = new LoginRequest();
        req.setEmail("agent@mail.com");
        req.setPassword("pass");
        mockMvc.perform(post("/api/estate-agents/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("token"));
    }

    @Test
    void loginAgentInvalidCredentials() throws Exception {
        Mockito.when(agentService.loginAgent(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException("Credenziali non valide"));
        LoginRequest req = new LoginRequest();
        req.setEmail("agent@mail.com");
        req.setPassword("wrong");
        mockMvc.perform(post("/api/estate-agents/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("Credenziali non valide"));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void getProfileSuccess() throws Exception {
        EstateAgent agent = new EstateAgent();
        Mockito.when(agentService.getProfile()).thenReturn(agent);
        mockMvc.perform(get(PROFILEPATH))
                .andExpect(status().isOk());
    }

    @Test
    void getProfileUnauthorized() throws Exception {
        Mockito.when(agentService.getProfile())
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get(PROFILEPATH))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void getAllBookedVisitsSuccess() throws Exception {
        var visit = new BookedVisitDTO(
            1L, "Immobile", new Timestamp(System.currentTimeMillis()), "Cliente", "Stato"
        );
        var resp = new PageResponse<BookedVisitDTO>(List.of(visit), 0, 5, 1, false);
        Mockito.when(agentService.getAllBookedVisits(0, 5)).thenReturn(resp);
        mockMvc.perform(get(BOOKEDVISITPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isNotEmpty());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void getAllBookedVisitsEmpty() throws Exception {
        var resp = new PageResponse<BookedVisitDTO>(java.util.Collections.emptyList(), 0, 5, 0, false);
        Mockito.when(agentService.getAllBookedVisits(0, 5)).thenReturn(resp);
        mockMvc.perform(get(BOOKEDVISITPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isEmpty());
    }

    @Test
    void getAllBookedVisitsUnauthorized() throws Exception {
        Mockito.when(agentService.getAllBookedVisits(0, 5))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get(BOOKEDVISITPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void acceptVisitSuccess() throws Exception {
        Mockito.when(agentService.acceptVisit(1L)).thenReturn("Visita accettata con successo");
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(1L);
        mockMvc.perform(post(ACCEPTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Visita accettata con successo"));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void acceptVisitNotFound() throws Exception {
        Mockito.when(agentService.acceptVisit(99L))
                .thenThrow(new BookedVisitNotFoundException(VISITNOTFOUNDMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(99L);
        mockMvc.perform(post(ACCEPTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(VISITNOTFOUNDMESSAGE));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void acceptVisitUnauthorizedAgent() throws Exception {
        Mockito.when(agentService.acceptVisit(2L))
                .thenThrow(new UnauthorizedAccessException(MANAGEOWNVISITSMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(2L);
        mockMvc.perform(post(ACCEPTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(MANAGEOWNVISITSMESSAGE));
    }

    @Test
    void acceptVisitNotAuthenticated() throws Exception {
        Mockito.when(agentService.acceptVisit(3L))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(3L);
        mockMvc.perform(post(ACCEPTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void rejectVisitSuccess() throws Exception {
        Mockito.when(agentService.rejectVisit(1L)).thenReturn("Visita rifiutata con successo");
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(1L);
        mockMvc.perform(post(REJECTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Visita rifiutata con successo"));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void rejectVisitNotFound() throws Exception {
        Mockito.when(agentService.rejectVisit(99L))
                .thenThrow(new BookedVisitNotFoundException(VISITNOTFOUNDMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(99L);
        mockMvc.perform(post(REJECTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(VISITNOTFOUNDMESSAGE));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void rejectVisitUnauthorizedAgent() throws Exception {
        Mockito.when(agentService.rejectVisit(2L))
                .thenThrow(new UnauthorizedAccessException(MANAGEOWNVISITSMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(2L);
        mockMvc.perform(post(REJECTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value(MANAGEOWNVISITSMESSAGE));
    }

    @Test
    void rejectVisitNotAuthenticated() throws Exception {
        Mockito.when(agentService.rejectVisit(3L))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        VisitActionRequest req = new VisitActionRequest();
        req.setVisitId(3L);
        mockMvc.perform(post(REJECTVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void loadNewRealEstateSuccess() throws Exception {
        var resp = new RealEstateResponseDTO();
        Mockito.when(agentService.loadNewRealEstate(any(CreateRealEstateRequest.class))).thenReturn(resp);
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        req.setCity("Napoli");
        mockMvc.perform(multipart(LOADREALESTATEPATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .flashAttr(FLASHATTRCREATEREALESTATE, req))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void loadNewRealEstateNoPhoto() throws Exception {
        Mockito.when(agentService.loadNewRealEstate(any(CreateRealEstateRequest.class)))
                .thenThrow(new InvalidRealEstateDataException("Devi caricare almeno una foto!"));
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        mockMvc.perform(multipart(LOADREALESTATEPATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .flashAttr(FLASHATTRCREATEREALESTATE, req))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("Devi caricare almeno una foto!"));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void loadNewRealEstateTooManyPhotos() throws Exception {
        Mockito.when(agentService.loadNewRealEstate(any(CreateRealEstateRequest.class)))
                .thenThrow(new InvalidRealEstateDataException("Puoi caricare al massimo 7 foto!"));
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        mockMvc.perform(multipart(LOADREALESTATEPATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .flashAttr(FLASHATTRCREATEREALESTATE, req))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("Puoi caricare al massimo 7 foto!"));
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void loadNewRealEstateUploadError() throws Exception {
        Mockito.when(agentService.loadNewRealEstate(any(CreateRealEstateRequest.class)))
                .thenThrow(new FileStorageException("Nessuna immagine è stata caricata correttamente"));
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        mockMvc.perform(multipart(LOADREALESTATEPATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .flashAttr(FLASHATTRCREATEREALESTATE, req))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath(CODE).exists())
                .andExpect(jsonPath(MESSAGE).value("Nessuna immagine è stata caricata correttamente"));
    }

    @Test
    void loadNewRealEstateNotAuthenticated() throws Exception {
        Mockito.when(agentService.loadNewRealEstate(any(CreateRealEstateRequest.class)))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        CreateRealEstateRequest req = new CreateRealEstateRequest();
        mockMvc.perform(multipart(LOADREALESTATEPATH)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .flashAttr(FLASHATTRCREATEREALESTATE, req))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void getMyPropertiesSuccess() throws Exception {
        var resp = new PageResponse<RealEstateResponseDTO>(
            java.util.List.of(new RealEstateResponseDTO()), 0, 5, 1, false);
        Mockito.when(agentService.getMyProperties(0, 5)).thenReturn(resp);
        mockMvc.perform(get(MYPROPERTIESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isNotEmpty());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void getMyPropertiesEmpty() throws Exception {
        var resp = new PageResponse<RealEstateResponseDTO>(
            java.util.Collections.emptyList(), 0, 5, 0, false);
        Mockito.when(agentService.getMyProperties(0, 5)).thenReturn(resp);
        mockMvc.perform(get(MYPROPERTIESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isEmpty());
    }

    @Test
    void getMyPropertiesUnauthorized() throws Exception {
        Mockito.when(agentService.getMyProperties(0, 5))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get(MYPROPERTIESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENT")
    void updateProfileSuccess() throws Exception {
        EstateAgent updated = new EstateAgent();
        updated.setFirstName("Mario");
        Mockito.doNothing().when(agentService).updateProfile(any(EstateAgent.class));
        mockMvc.perform(patch(PROFILEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().string("Profilo aggiornato con successo"));
    }

    @Test
    void updateProfileUnauthorized() throws Exception {
        Mockito.doThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE))
                .when(agentService).updateProfile(any(EstateAgent.class));
        EstateAgent updated = new EstateAgent();
        updated.setFirstName("Mario");
        mockMvc.perform(patch(PROFILEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isForbidden());
    }
}
