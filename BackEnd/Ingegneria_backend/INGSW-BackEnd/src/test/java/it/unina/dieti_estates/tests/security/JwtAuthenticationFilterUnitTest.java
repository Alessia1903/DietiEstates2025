package it.unina.dieti_estates.tests.security;

import it.unina.dieti_estates.security.JwtAuthenticationFilter;
import it.unina.dieti_estates.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.GrantedAuthority;
import jakarta.servlet.FilterChain;
import java.util.Collections;
import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterUnitTest {

    @Mock
    private JwtService jwtService;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private FilterChain filterChain;
    @Mock
    private UserDetails userDetails;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        SecurityContextHolder.clearContext();
    }

    @Test
    void testDoFilterInternalAuthenticatesUserAndSetsContext() throws Exception {
        String jwt = "valid.jwt.token";
        String email = "user@example.com";
        Collection<? extends GrantedAuthority> authorities = Collections.emptyList();

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + jwt);
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(jwtService.extractUsername(jwt)).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email)).thenReturn(userDetails);
        when(jwtService.isTokenValid(jwt, userDetails)).thenReturn(true);
        when(jwtService.extractRoles(jwt)).thenAnswer(invocation -> authorities);

        // SecurityContextHolder senza autenticazione
        assertNull(SecurityContextHolder.getContext().getAuthentication());

        // Usa reflection per invocare il metodo protected doFilterInternal
        java.lang.reflect.Method method = JwtAuthenticationFilter.class.getDeclaredMethod(
            "doFilterInternal",
            jakarta.servlet.http.HttpServletRequest.class,
            jakarta.servlet.http.HttpServletResponse.class,
            jakarta.servlet.FilterChain.class
        );
        method.setAccessible(true);
        method.invoke(filter, request, response, filterChain);

        // Dopo il filtro, SecurityContextHolder deve avere autenticazione
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertTrue(SecurityContextHolder.getContext().getAuthentication() instanceof UsernamePasswordAuthenticationToken);
        assertEquals(userDetails, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        assertEquals(authorities, SecurityContextHolder.getContext().getAuthentication().getAuthorities());
    }
}
