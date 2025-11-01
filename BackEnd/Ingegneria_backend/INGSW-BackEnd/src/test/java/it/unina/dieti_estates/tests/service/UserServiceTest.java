package it.unina.dieti_estates.tests.service;

import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.User;
import it.unina.dieti_estates.repository.UserRepository;
import it.unina.dieti_estates.service.JwtService;
import it.unina.dieti_estates.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private static final String EXISTING_EMAIL = "test1@example.com";
    private static final String NON_EXISTING_EMAIL = "notfound@example.com";
    private static final String LOGIN_EMAIL = "user@example.com";

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void loadUserByUsernameExistingUserReturnsUser() {
        User user = new User();
        user.setEmail(EXISTING_EMAIL);
        when(userRepository.findByEmail(EXISTING_EMAIL)).thenReturn(Optional.of(user));

        assertEquals(user, userService.loadUserByUsername(EXISTING_EMAIL));
    }

    @Test
    void loadUserByUsernameNonExistingUserThrowsException() {
        when(userRepository.findByEmail(NON_EXISTING_EMAIL)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userService.loadUserByUsername(NON_EXISTING_EMAIL));
    }

    @Test
    void loginUserValidCredentialsReturnsJwt() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(LOGIN_EMAIL);
        loginRequest.setPassword("password");

        User user = new User();
        user.setEmail(LOGIN_EMAIL);

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        String token = userService.loginUser(loginRequest);
        assertEquals("jwt-token", token);
    }

    @Test
    void loginUserInvalidCredentialsThrowsException() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(LOGIN_EMAIL);
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> userService.loginUser(loginRequest));
    }
}
