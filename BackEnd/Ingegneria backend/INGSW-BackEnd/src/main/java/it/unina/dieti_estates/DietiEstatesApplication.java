package it.unina.dieti_estates;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class DietiEstatesApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        String dbUrl = dotenv.get("DB_URL");
        String dbUsername = dotenv.get("DB_USERNAME");
        String dbPassword = dotenv.get("DB_PASSWORD");
        String jwtSecret = dotenv.get("JWT_SECRET");
        String azureStorageConnection = dotenv.get("AZURE_STORAGE_CONNECTION_STRING");
        String azureContainerName = dotenv.get("AZURE_CONTAINER_NAME");
        String googleClientId = dotenv.get("GOOGLE_CLIENT_ID");
        String googleClientSecret = dotenv.get("GOOGLE_CLIENT_SECRET");

        if (dbUrl == null || dbUsername == null || dbPassword == null || jwtSecret == null 
            || azureStorageConnection == null || azureContainerName == null || googleClientId == null || googleClientSecret == null) {
            throw new IllegalArgumentException("One or more environment variables are not set");
        }

        System.setProperty("DB_URL", dbUrl);
        System.setProperty("DB_USERNAME", dbUsername);
        System.setProperty("DB_PASSWORD", dbPassword);
        System.setProperty("JWT_SECRET", jwtSecret);
        System.setProperty("AZURE_STORAGE_CONNECTION_STRING", azureStorageConnection);
        System.setProperty("AZURE_CONTAINER_NAME", azureContainerName);
        System.setProperty("GOOGLE_CLIENT_ID", googleClientId);
        System.setProperty("GOOGLE_CLIENT_SECRET", googleClientSecret);

        SpringApplication.run(DietiEstatesApplication.class, args);
    }

}
