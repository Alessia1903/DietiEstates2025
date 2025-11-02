package it.unina.dieti_estates.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.exception.business.WeatherApiException;
import it.unina.dieti_estates.model.dto.CoordinatesDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.util.Scanner;

@Service
public class WeatherApiService {
    
    public JsonNode getWeatherForecast(String city, String date) {
        // Step 1: Validate and prepare dates
        LocalDate startDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        LocalDate endDate = startDate.plusDays(6);
        
        // Step 2: Geocoding
        CoordinatesDTO coordinates = getCoordinatesForCity(city);
        if (coordinates == null) {
            throw new WeatherApiException("Coordinate non disponibili per la città: " + city);
        }
        
        // Step 3: Weather data
        String weatherResult = getWeatherData(coordinates, startDate.toString(), endDate.toString());
        
        // Step 4: Parse response
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(weatherResult);
            if (!root.has("daily")) {
                throw new WeatherApiException("Risposta del servizio meteo non valida");
            }
            return root.get("daily");
        } catch (Exception e) {
            throw new WeatherApiException("Errore nell'elaborazione dei dati meteo: " + e.getMessage());
        }
    }

    public CoordinatesDTO getCoordinatesForCity(String city) {
        try {
            String encodedCity = java.net.URLEncoder.encode(city, "UTF-8");
            String geoUrl = "https://nominatim.openstreetmap.org/search?city=" + encodedCity + "&format=json&limit=1";
            
            String geoResult = makeHttpRequest(geoUrl, "DietiEstates/1.0");
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(geoResult);
            
            if (root.isArray() && root.size() > 0) {
                JsonNode firstResult = root.get(0);
                return new CoordinatesDTO(
                    firstResult.get("lat").asText(),
                    firstResult.get("lon").asText()
                );
            }
            return null;
        } catch (Exception e) {
            throw new WeatherApiException("Errore nel geocoding: " + e.getMessage());
        }
    }

    public String getWeatherData(CoordinatesDTO coords, String startDate, String endDate) {
        try {
            String url = String.format("https://api.open-meteo.com/v1/forecast?" +
                    "latitude=%s&longitude=%s" +
                    "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode" +
                    "&start_date=%s&end_date=%s&timezone=Europe/Rome",
                    coords.getLatitude(), coords.getLongitude(), startDate, endDate);
            
            return makeHttpRequest(url, null);
        } catch (Exception e) {
            throw new WeatherApiException("Errore nel recupero dati meteo: " + e.getMessage());
        }
    }

    public String makeHttpRequest(String urlString, String userAgent) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        if (userAgent != null) {
            conn.setRequestProperty("User-Agent", userAgent);
        }
        
        try (InputStream is = conn.getInputStream();
             Scanner scanner = new Scanner(is).useDelimiter("\\A")) {
            return scanner.hasNext() ? scanner.next() : "";
        }
    }
}
