package it.unina.dieti_estates.tests.utils;

import it.unina.dieti_estates.utils.QRCodeGenerator;
import com.google.zxing.WriterException;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class QRCodeGeneratorTest {

    @Test
    void testGenerateQRCodeReturnsNonEmptyByteArray() throws WriterException, IOException {
        byte[] qr = QRCodeGenerator.generateQRCode("test-data", 200, 200);
        assertNotNull(qr);
        assertTrue(qr.length > 0);
    }

    @Test
    void testGenerateQRCodeBase64ReturnsNonEmptyString() throws WriterException, IOException {
        String base64 = QRCodeGenerator.generateQRCodeBase64("test-data", 200, 200);
        assertNotNull(base64);
        assertFalse(base64.isEmpty());
        assertDoesNotThrow(() -> Base64.getDecoder().decode(base64));
    }

    @Test
    void testGenerateQRCodeThrowsExceptionOnInvalidInput() {
        assertThrows(NullPointerException.class, () -> QRCodeGenerator.generateQRCode(null, 200, 200));
        assertThrows(IllegalArgumentException.class, () -> QRCodeGenerator.generateQRCode("test", -1, 200));
        assertThrows(IllegalArgumentException.class, () -> QRCodeGenerator.generateQRCode("test", 200, -1));
    }
}
