package it.unina.dieti_estates.tests.utils;

import it.unina.dieti_estates.utils.PasswordGenerator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordGeneratorTest {

    private final PasswordGenerator generator = new PasswordGenerator();

    @Test
    void testGeneratedPasswordHasCorrectLength() {
        String password = generator.generateSecurePassword();
        assertEquals(12, password.length());
    }

    @Test
    void testGeneratedPasswordsAreRandom() {
        String password1 = generator.generateSecurePassword();
        String password2 = generator.generateSecurePassword();
        assertNotEquals(password1, password2, "Passwords should be different");
    }

    @Test
    void testGeneratedPasswordIsNotNullOrEmpty() {
        String password = generator.generateSecurePassword();
        assertNotNull(password);
        assertFalse(password.isEmpty());
    }
}
