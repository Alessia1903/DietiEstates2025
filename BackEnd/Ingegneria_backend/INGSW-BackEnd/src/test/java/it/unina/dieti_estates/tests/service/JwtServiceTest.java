package it.unina.dieti_estates.tests.service;

import it.unina.dieti_estates.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.ExpiredJwtException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET_KEY = "ZmFrZXNlY3JldGtleWZvcnRlc3Rpbmdqd3RzMTIzNDU2Nzg5MDEyMzQ1Ng==";
    private static final String USERNAME = "testuser";
    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET_KEY);
        userDetails = User.withUsername(USERNAME)
                .password("password")
                .roles("USER", "ADMIN")
                .build();
    }

    @Test
    void testGenerateTokenAndExtractUsername() {
        String token = jwtService.generateToken(userDetails);
        String username = jwtService.extractUsername(token);
        assertEquals(USERNAME, username);
    }

    @Test
    void testGenerateTokenAndExtractRoles() {
        String token = jwtService.generateToken(userDetails);
        Collection<? extends GrantedAuthority> roles = jwtService.extractRoles(token);
        Set<String> roleNames = new HashSet<>();
        for (GrantedAuthority ga : roles) {
            roleNames.add(ga.getAuthority());
        }
        assertTrue(roleNames.contains("ROLE_USER"));
        assertTrue(roleNames.contains("ROLE_ADMIN"));
    }

    @Test
    void testIsTokenValidWithCorrectUser() {
        String token = jwtService.generateToken(userDetails);
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void testIsTokenValidWithWrongUser() {
        String token = jwtService.generateToken(userDetails);
        UserDetails otherUser = User.withUsername("otheruser").password("password").roles("USER").build();
        assertFalse(jwtService.isTokenValid(token, otherUser));
    }

    @Test
    void testExtractClaimCustom() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("custom", "value");
        String token = jwtService.generateToken(claims, userDetails);
        String custom = jwtService.extractClaim(token, c -> c.get("custom", String.class));
        assertEquals("value", custom);
    }

    @Test
    void testExtractRolesReturnsEmptyListIfNoRolesClaim() {
        // Genera un token senza claim "roles"
        String token = io.jsonwebtoken.Jwts.builder()
                .setSubject(USERNAME)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(io.jsonwebtoken.security.Keys.hmacShaKeyFor(
                        Base64.getDecoder().decode(SECRET_KEY)),
                        io.jsonwebtoken.SignatureAlgorithm.HS256)
                .compact();
        Collection<? extends GrantedAuthority> roles = jwtService.extractRoles(token);
        assertNotNull(roles);
        assertTrue(roles.isEmpty());
    }

    @Test
    void testIsTokenValidWithExpiredToken() {
        // Genera un token già scaduto impostando expiration nel passato
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", Arrays.asList("ROLE_USER", "ROLE_ADMIN"));
        String token = io.jsonwebtoken.Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis() - 100000))
                .setExpiration(new Date(System.currentTimeMillis() - 1000)) // già scaduto
                .signWith(Keys.hmacShaKeyFor(
                        Base64.getDecoder().decode(SECRET_KEY)),
                        SignatureAlgorithm.HS256)
                .compact();
        assertThrows(ExpiredJwtException.class, () -> jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void testExtractClaimNotPresentReturnsNull() {
        String token = jwtService.generateToken(userDetails);
        String notPresent = jwtService.extractClaim(token, c -> c.get("notPresent", String.class));
        assertNull(notPresent);
    }

    @Test
    void testInvalidSignatureThrowsException() {
        JwtService otherService = new JwtService();
        ReflectionTestUtils.setField(otherService, "secretKey", "YW5vdGhlcnNlY3JldGtleWZvcnRlc3RpbmcxMjM0NTY3ODkwMTIzNDU2"); // base64 di "anothersecretkeyfortesting1234567890123456"
        String token = jwtService.generateToken(userDetails);
        assertThrows(Exception.class, () -> otherService.extractUsername(token));
    }
}
