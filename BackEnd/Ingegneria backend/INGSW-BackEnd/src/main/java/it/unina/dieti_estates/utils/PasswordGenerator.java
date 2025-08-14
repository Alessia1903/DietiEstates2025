package it.unina.dieti_estates.utils;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;
import java.util.stream.Collectors;

@Component
public class PasswordGenerator {
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    private static final int PASSWORD_LENGTH = 12;

    public String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        return random.ints(PASSWORD_LENGTH, 0, CHARS.length())
                    .mapToObj(i -> String.valueOf(CHARS.charAt(i)))
                    .collect(Collectors.joining());
    }
}
