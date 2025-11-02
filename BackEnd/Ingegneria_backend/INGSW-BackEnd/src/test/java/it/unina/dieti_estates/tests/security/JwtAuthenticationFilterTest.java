package it.unina.dieti_estates.tests.security;

import it.unina.dieti_estates.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import it.unina.dieti_estates.service.JwtService;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.mockito.Mockito;

@WebMvcTest(controllers = TestController.class)
@Import(JwtAuthenticationFilter.class)
class JwtAuthenticationFilterTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @Test
    void requestWithoutJwtShouldBeUnauthorized() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void requestWithInvalidJwtShouldBeUnauthorized() throws Exception {
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.any()))
                .thenReturn(false);

        mockMvc.perform(MockMvcRequestBuilders.get("/")
                .header("Authorization", "Bearer invalid.token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser
    void requestWithValidJwtShouldBeAuthorized() throws Exception {
        Mockito.when(jwtService.isTokenValid(Mockito.anyString(), Mockito.any()))
                .thenReturn(true);

        mockMvc.perform(MockMvcRequestBuilders.get("/")
                .header("Authorization", "Bearer valid.token")
                .with(SecurityMockMvcRequestPostProcessors.user("user")))
                .andExpect(status().isOk());
    }
}
