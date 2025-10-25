package it.unina.dieti_estates.config;

import it.unina.dieti_estates.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

/**
 * Configuration class for Spring Security.
 * Sets up security configurations for the application.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(@Lazy JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Defines the security filter chain for HTTP requests.
     *
     * @param http HttpSecurity object to configure security.
     * @return SecurityFilterChain configured for the application.
     * @throws Exception if configuration fails.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                // CSRF protection is disabled because this application only exposes stateless REST APIs
                // secured via JWT tokens in the Authorization header. No session or cookie-based auth is used.
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                            "/api/buyers/register", 
                            "/api/buyers/login", 
                            "/api/buyers/google-login",
                            "/api/buyers/google-register",
                            "/api/buyers/auth/google/callback",
                            "/api/buyers/auth/google/register",
                            "/api/buyers/search",
                            "/api/admins/login",
                            "/api/buyers/homepage",
                            "/api/estate-agents/login",
                            "/api/admins/create-agency").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Exposes an AuthenticationManager bean.
     *
     * @param config AuthenticationConfiguration.
     * @return AuthenticationManager.
     * @throws Exception if getting AuthenticationManager fails.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Provides a PasswordEncoder bean for password hashing.
     *
     * @return BCryptPasswordEncoder.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
