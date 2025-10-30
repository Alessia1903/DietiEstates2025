package it.unina.dieti_estates;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.SpringApplication;

import static org.junit.jupiter.api.Assertions.*;

class DietiEstatesApplicationTest {

    @Test
    void mainRunsWithAllEnvVars() {
        try (MockedStatic<Dotenv> dotenvMock = Mockito.mockStatic(Dotenv.class)) {
            Dotenv mockDotenv = Mockito.mock(Dotenv.class);
            dotenvMock.when(Dotenv::load).thenReturn(mockDotenv);

            Mockito.when(mockDotenv.get("DB_URL")).thenReturn("url");
            Mockito.when(mockDotenv.get("DB_USERNAME")).thenReturn("user");
            Mockito.when(mockDotenv.get("DB_PASSWORD")).thenReturn("pass");
            Mockito.when(mockDotenv.get("JWT_SECRET")).thenReturn("jwt");
            Mockito.when(mockDotenv.get("AZURE_STORAGE_CONNECTION_STRING")).thenReturn("azconn");
            Mockito.when(mockDotenv.get("AZURE_CONTAINER_NAME")).thenReturn("azcont");
            Mockito.when(mockDotenv.get("GOOGLE_CLIENT_ID")).thenReturn("gid");
            Mockito.when(mockDotenv.get("GOOGLE_CLIENT_SECRET")).thenReturn("gsecret");

            // Mock SpringApplication.run per non avviare davvero il contesto
            try (MockedStatic<SpringApplication> springAppMock = Mockito.mockStatic(SpringApplication.class)) {
                assertDoesNotThrow(() -> DietiEstatesApplication.main(new String[]{}));
            }
        }
    }

    @Test
    void mainThrowsIfEnvVarMissing() {
        try (MockedStatic<Dotenv> dotenvMock = Mockito.mockStatic(Dotenv.class)) {
            Dotenv mockDotenv = Mockito.mock(Dotenv.class);
            dotenvMock.when(Dotenv::load).thenReturn(mockDotenv);

            Mockito.when(mockDotenv.get("DB_URL")).thenReturn(null); // Simula variabile mancante
            Mockito.when(mockDotenv.get("DB_USERNAME")).thenReturn("user");
            Mockito.when(mockDotenv.get("DB_PASSWORD")).thenReturn("pass");
            Mockito.when(mockDotenv.get("JWT_SECRET")).thenReturn("jwt");
            Mockito.when(mockDotenv.get("AZURE_STORAGE_CONNECTION_STRING")).thenReturn("azconn");
            Mockito.when(mockDotenv.get("AZURE_CONTAINER_NAME")).thenReturn("azcont");
            Mockito.when(mockDotenv.get("GOOGLE_CLIENT_ID")).thenReturn("gid");
            Mockito.when(mockDotenv.get("GOOGLE_CLIENT_SECRET")).thenReturn("gsecret");

            try (MockedStatic<SpringApplication> springAppMock = Mockito.mockStatic(SpringApplication.class)) {
                Exception ex = assertThrows(IllegalArgumentException.class, () -> DietiEstatesApplication.main(new String[]{}));
                assertTrue(ex.getMessage().contains("One or more environment variables are not set"));
            }
        }
    }
}
