package it.unina.dieti_estates.tests.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.model.Buyer;
import it.unina.dieti_estates.model.dto.RegistrationResponse;
import it.unina.dieti_estates.service.BuyerService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import it.unina.dieti_estates.exception.validation.DuplicateResourceException;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import org.springframework.security.test.context.support.WithMockUser;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.model.dto.FavoriteSearchDeleteRequest;
import it.unina.dieti_estates.exception.resource.FavoriteSearchNotFoundException;
import it.unina.dieti_estates.model.dto.FavoriteRequest;
import it.unina.dieti_estates.model.dto.PageResponse;
import it.unina.dieti_estates.model.dto.FavoriteSearchResponse;
import it.unina.dieti_estates.model.dto.RealEstateResponseDTO;
import it.unina.dieti_estates.model.dto.WeatherRequest;
import it.unina.dieti_estates.exception.business.WeatherApiException;
import it.unina.dieti_estates.model.dto.VisitRequest;
import it.unina.dieti_estates.exception.resource.RealEstateNotFoundException;
import it.unina.dieti_estates.model.dto.NotificationDTO;
import java.util.List;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.util.Arrays;

@SpringBootTest
@AutoConfigureMockMvc
class BuyerControllerTest {

    private static final String EMAILTEST = "test@mail.com";
    private static final String PASSWORDTEST = "password";
    private static final String MESSAGE = "$.message";
    private static final String ARRAYCONTENT = "$.content";
    private static final String UNAUTHORIZEDMESSAGE = "Utente non autenticato o sessione non valida";
    private static final String PROFILEPATH = "/api/buyers/profile";
    private static final String FAVORITESADDPATH = "/api/buyers/favorites/add";
    private static final String FAVORITESREMOVEPATH = "/api/buyers/favorites/remove";
    private static final String CITY = "Napoli";
    private static final String NOTIFICATIONSPATH = "/api/buyers/notifications";
    private static final String BOOKVISITPATH = "/api/buyers/book-visit";
    private static final String WEATHERPATH = "/api/buyers/weather";
    private static final String FAVORITESPATH = "/api/buyers/favorites";
    private static final String DUMMYCODE = "dummyCode";
    private static final String GOOGLELOGINPATH = "/api/buyers/auth/google/callback";
    private static final String GOOGLEREGISTERPATH = "/api/buyers/auth/google/register";
    private static final String EMAILALREADYREGISTERED = "Email già registrata";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BuyerService buyerService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerBuyerSuccess() throws Exception {
        Buyer buyer = new Buyer();
        buyer.setEmail(EMAILTEST);
        buyer.setPassword(PASSWORDTEST);
        RegistrationResponse resp = new RegistrationResponse("Registrazione avvenuta con successo");
        Mockito.when(buyerService.registerNewBuyer(any(Buyer.class))).thenReturn(resp);

        mockMvc.perform(post("/api/buyers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buyer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath(MESSAGE).value("Registrazione avvenuta con successo"));
    }

    @Test
    void registerBuyerAlreadyExists() throws Exception {
        Buyer buyer = new Buyer();
        buyer.setEmail(EMAILTEST);
        buyer.setPassword(PASSWORDTEST);
        Mockito.when(buyerService.registerNewBuyer(any(Buyer.class)))
                .thenThrow(new DuplicateResourceException(EMAILALREADYREGISTERED));

        mockMvc.perform(post("/api/buyers/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buyer)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(MESSAGE).value(EMAILALREADYREGISTERED));
    }

    @Test
    void loginBuyerSuccess() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail(EMAILTEST);
        req.setPassword(PASSWORDTEST);
        Mockito.when(buyerService.loginBuyer(any(LoginRequest.class)))
                .thenReturn("token123");

        mockMvc.perform(post("/api/buyers/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("token123"));
    }

    @Test
    void loginBuyerInvalidCredentials() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail(EMAILTEST);
        req.setPassword("wrong");
        Mockito.when(buyerService.loginBuyer(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException("Credenziali non valide"));

        mockMvc.perform(post("/api/buyers/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(MESSAGE).value("Credenziali non valide"));
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getProfileSuccess() throws Exception {
        Buyer buyer = new Buyer();
        buyer.setEmail(EMAILTEST);
        Mockito.when(buyerService.getProfile()).thenReturn(buyer);

        mockMvc.perform(get(PROFILEPATH))
                .andExpect(status().isOk());
    }

    @Test
    void getProfileUnauthorized() throws Exception {
        Mockito.when(buyerService.getProfile())
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));

        mockMvc.perform(get(PROFILEPATH))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void updateProfileSuccess() throws Exception {
        Buyer updated = new Buyer();
        updated.setFirstName("Mario");
        Mockito.doNothing().when(buyerService).updateProfile(any(Buyer.class));
        mockMvc.perform(patch(PROFILEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(content().string("Profilo aggiornato con successo"));
    }

    @Test
    void updateProfileUnauthorized() throws Exception {
        Mockito.doThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE))
                .when(buyerService).updateProfile(any(Buyer.class));
        Buyer updated = new Buyer();
        updated.setFirstName("Mario");
        mockMvc.perform(patch(PROFILEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void addFavoriteSuccess() throws Exception {
        var req = new FavoriteRequest();
        req.setCity(CITY);
        Mockito.when(buyerService.addFavorite(any(FavoriteRequest.class)))
                .thenReturn("Aggiunto ai preferiti");
        mockMvc.perform(post(FAVORITESADDPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Aggiunto ai preferiti"));
    }

    @Test
    void addFavoriteUnauthorized() throws Exception {
        Mockito.when(buyerService.addFavorite(any(FavoriteRequest.class)))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        var req = new FavoriteRequest();
        req.setCity(CITY);
        mockMvc.perform(post(FAVORITESADDPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void addFavoriteDuplicate() throws Exception {
        var req = new FavoriteRequest();
        req.setCity(CITY);
        Mockito.when(buyerService.addFavorite(any(FavoriteRequest.class)))
                .thenThrow(new DuplicateResourceException("Preferito già presente"));
        mockMvc.perform(post(FAVORITESADDPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(MESSAGE).value("Preferito già presente"));
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void removeFavoriteSuccess() throws Exception {
        var req = new FavoriteSearchDeleteRequest();
        req.setFavoriteSearchId(1L);
        Mockito.when(buyerService.removeFavorite(any(FavoriteSearchDeleteRequest.class)))
                .thenReturn("Rimosso dai preferiti");
        mockMvc.perform(post(FAVORITESREMOVEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(content().string("Rimosso dai preferiti"));
    }

    @Test
    void removeFavoriteUnauthorized() throws Exception {
        Mockito.when(buyerService.removeFavorite(any(FavoriteSearchDeleteRequest.class)))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        var req = new FavoriteSearchDeleteRequest();
        req.setFavoriteSearchId(1L);
        mockMvc.perform(post(FAVORITESREMOVEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void removeFavoriteNotFound() throws Exception {
        var req = new FavoriteSearchDeleteRequest();
        req.setFavoriteSearchId(999L);
        Mockito.when(buyerService.removeFavorite(any(FavoriteSearchDeleteRequest.class)))
                .thenThrow(new FavoriteSearchNotFoundException("Ricerca non trovata tra i tuoi preferiti"));
        mockMvc.perform(post(FAVORITESREMOVEPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath(MESSAGE).value("Ricerca non trovata tra i tuoi preferiti"));
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getFavoritesSuccess() throws Exception {
        var resp = new PageResponse<FavoriteSearchResponse>(
            List.of(new FavoriteSearchResponse()), 0, 5, 1, false);
        Mockito.when(buyerService.getFavorites(0, 5)).thenReturn(resp);
        mockMvc.perform(get(FAVORITESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isNotEmpty());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getFavoritesEmpty() throws Exception {
        var resp = new PageResponse<FavoriteSearchResponse>(
            Collections.emptyList(), 0, 5, 0, false);
        Mockito.when(buyerService.getFavorites(0, 5)).thenReturn(resp);
        mockMvc.perform(get(FAVORITESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isEmpty());
    }

    @Test
    void getFavoritesUnauthorized() throws Exception {
        Mockito.when(buyerService.getFavorites(0, 5))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get(FAVORITESPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    void searchRealEstatesSuccess() throws Exception {
        var req = new FavoriteRequest();
        var resp = new PageResponse<RealEstateResponseDTO>(
            List.of(new RealEstateResponseDTO()), 0, 5, 1, false);
        Mockito.when(buyerService.searchRealEstates(any(FavoriteRequest.class), any(Integer.class), any(Integer.class)))
                .thenReturn(resp);
        mockMvc.perform(post("/api/buyers/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isNotEmpty());
    }

    @Test
    void searchRealEstatesNoResults() throws Exception {
        var req = new FavoriteRequest();
        var resp = new PageResponse<RealEstateResponseDTO>(
            Collections.emptyList(), 0, 5, 0, false);
        Mockito.when(buyerService.searchRealEstates(any(FavoriteRequest.class), any(Integer.class), any(Integer.class)))
                .thenReturn(resp);
        mockMvc.perform(post("/api/buyers/search")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isEmpty());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getWeatherSuccess() throws Exception {
        var req = new WeatherRequest();
        req.setCity(CITY);
        Mockito.when(buyerService.getWeatherForecast(any(WeatherRequest.class)))
                .thenReturn(Collections.singletonMap("temperature_2m_max", java.util.List.of(25, 26, 27, 28, 29, 30, 31)));
        mockMvc.perform(post(WEATHERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temperature_2m_max").exists());
    }

    @Test
    void getWeatherCityNotFound() throws Exception {
        var req = new WeatherRequest();
        req.setCity("Atlantide");
        Mockito.when(buyerService.getWeatherForecast(any(WeatherRequest.class)))
                .thenThrow(new WeatherApiException("Latitudine/longitudine non trovate per la città: Atlantide"));
        mockMvc.perform(post(WEATHERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getWeatherApiError() throws Exception {
        var req = new WeatherRequest();
        req.setCity(CITY);
        Mockito.when(buyerService.getWeatherForecast(any(WeatherRequest.class)))
                .thenThrow(new WeatherApiException("Errore chiamata OpenMeteo: codice 500"));
        mockMvc.perform(post(WEATHERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void bookVisitSuccess() throws Exception {
        var req = new VisitRequest();
        Mockito.doNothing().when(buyerService).bookVisit(any(VisitRequest.class));
        mockMvc.perform(post(BOOKVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void bookVisitDuplicate() throws Exception {
        var req = new VisitRequest();
        Mockito.doThrow(new DuplicateResourceException("Visita già prenotata")).when(buyerService).bookVisit(any(VisitRequest.class));
        mockMvc.perform(post(BOOKVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(MESSAGE).value("Visita già prenotata"));
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void bookVisitRealEstateNotFound() throws Exception {
        var req = new VisitRequest();
        Mockito.doThrow(new RealEstateNotFoundException("Immobile non trovato")).when(buyerService).bookVisit(any(VisitRequest.class));
        mockMvc.perform(post(BOOKVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath(MESSAGE).value("Immobile non trovato"));
    }

    @Test
    void bookVisitUnauthorized() throws Exception {
        var req = new VisitRequest();
        Mockito.doThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE)).when(buyerService).bookVisit(any(VisitRequest.class));
        mockMvc.perform(post(BOOKVISITPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getNotificationsSuccess() throws Exception {
        var notification = new NotificationDTO(
            1L, "Titolo", "Messaggio", "INFO", java.time.LocalDateTime.now(), "buyer@mail.com");
        var resp = new PageResponse<NotificationDTO>(
            List.of(notification), 0, 5, 1, false);
        Mockito.when(buyerService.getNotificationsForCurrentBuyer(0, 5)).thenReturn(resp);
        mockMvc.perform(get(NOTIFICATIONSPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isNotEmpty());
    }

    @Test
    @WithMockUser(roles = "BUYER")
    void getNotificationsEmpty() throws Exception {
        var resp = new PageResponse<NotificationDTO>(
            Collections.emptyList(), 0, 5, 0, false);
        Mockito.when(buyerService.getNotificationsForCurrentBuyer(0, 5)).thenReturn(resp);
        mockMvc.perform(get(NOTIFICATIONSPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ARRAYCONTENT).isArray())
                .andExpect(jsonPath(ARRAYCONTENT).isEmpty());
    }

    @Test
    void getNotificationsUnauthorized() throws Exception {
        Mockito.when(buyerService.getNotificationsForCurrentBuyer(0, 5))
                .thenThrow(new UnauthorizedAccessException(UNAUTHORIZEDMESSAGE));
        mockMvc.perform(get(NOTIFICATIONSPATH)
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginBuyerWithGoogleSuccess() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        Mockito.when(buyerService.loginBuyerWithGoogleCode(any())).thenReturn("jwt-token");
        mockMvc.perform(post(GOOGLELOGINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value("jwt-token"));
    }

    @Test
    void loginBuyerWithGoogleInvalidCredentials() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        Mockito.when(buyerService.loginBuyerWithGoogleCode(any()))
                .thenThrow(new InvalidCredentialsException("ID token Google non valido"));
        mockMvc.perform(post(GOOGLELOGINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(MESSAGE).value("ID token Google non valido"));
    }

    @Test
    void loginBuyerWithGoogleUserNotFound() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        Mockito.when(buyerService.loginBuyerWithGoogleCode(any()))
                .thenThrow(new it.unina.dieti_estates.exception.auth.UserNotFoundException("Buyer non trovato per email Google"));
        mockMvc.perform(post(GOOGLELOGINPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath(MESSAGE).value("Buyer non trovato per email Google"));
    }

    @Test
    void registerBuyerWithGoogleSuccess() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        RegistrationResponse resp = new RegistrationResponse("Registrazione Google andata a buon fine");
        Mockito.when(buyerService.registerBuyerWithGoogle(any())).thenReturn(resp);
        mockMvc.perform(post(GOOGLEREGISTERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath(MESSAGE).value("Registrazione Google andata a buon fine"));
    }

    @Test
    void registerBuyerWithGoogleInvalidCredentials() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        Mockito.when(buyerService.registerBuyerWithGoogle(any()))
                .thenThrow(new InvalidCredentialsException("Buyer già registrato con questa email Google"));
        mockMvc.perform(post(GOOGLEREGISTERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath(MESSAGE).value("Buyer già registrato con questa email Google"));
    }

    @Test
    void registerBuyerWithGoogleDuplicate() throws Exception {
        var body = Collections.singletonMap("code", DUMMYCODE);
        Mockito.when(buyerService.registerBuyerWithGoogle(any()))
                .thenThrow(new DuplicateResourceException(EMAILALREADYREGISTERED));
        mockMvc.perform(post(GOOGLEREGISTERPATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath(MESSAGE).value(EMAILALREADYREGISTERED));
    }

    @Test
    void getHomePageEstatesSuccess() throws Exception {
        RealEstateResponseDTO estate1 = new RealEstateResponseDTO();
        estate1.setId(1L);
        RealEstateResponseDTO estate2 = new RealEstateResponseDTO();
        estate2.setId(2L);
        List<RealEstateResponseDTO> estates = Arrays.asList(estate1, estate2);
        
        Mockito.when(buyerService.getHomePageEstates()).thenReturn(estates);

        mockMvc.perform(get("/api/buyers/homepage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getHomePageEstatesEmpty() throws Exception {
        Mockito.when(buyerService.getHomePageEstates()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/buyers/homepage"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }
}
