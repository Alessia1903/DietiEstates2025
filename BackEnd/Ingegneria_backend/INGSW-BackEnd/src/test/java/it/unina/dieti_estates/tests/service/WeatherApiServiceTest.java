package it.unina.dieti_estates.tests.service;

import com.fasterxml.jackson.databind.JsonNode;
import it.unina.dieti_estates.exception.business.WeatherApiException;
import it.unina.dieti_estates.model.dto.CoordinatesDTO;
import it.unina.dieti_estates.service.WeatherApiService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WeatherApiServiceTest {

    @Spy
    @InjectMocks
    private WeatherApiService weatherApiService;

    private static final String LATITUDE = "40.8518";
    private static final String LONGITUDE = "14.2681";
    private static final String CITY = "Napoli";
    private static final String DATE = "2025-12-01";
    private static final String USER_AGENT = "DietiEstates/1.0";
    private static final String API_URL = "api.open-meteo.com";
    private static final String WEATHER_API_ERROR = "WEATHER_API_ERROR";
    private static final String GEO_API_URL = "search?city="; 
    private static final String EXPECTED_RESPONSE = """
        {
            "daily": {
                "temperature_2m_max": [20.5, 21.3],
                "temperature_2m_min": [15.2, 16.1]
            }
        }""";
    private static final String GEO_RESPONSE = """
            [{
                "lat": "40.8518",
                "lon": "14.2681"
            }]""";

    @Test
    void makeHttpRequestSuccess() throws IOException {
        String urlString = "https://example.com";
        String userAgent = "TestAgent";
        String expectedResponse = "Test response";

        doReturn(expectedResponse).when(weatherApiService).makeHttpRequest(
            urlString, 
            userAgent
        );

        String result = weatherApiService.makeHttpRequest(urlString, userAgent);

        assertEquals(expectedResponse, result);
    }

    @Test
    void getCoordinatesForCityNotFound() throws IOException {

        doReturn("[]").when(weatherApiService).makeHttpRequest(
            anyString(), 
            eq(USER_AGENT)
        );

        CoordinatesDTO result = weatherApiService.getCoordinatesForCity("CittàInesistente");

        assertNull(result);
    }

    @Test
    void getWeatherDataSuccess() throws IOException {

        CoordinatesDTO coords = new CoordinatesDTO(LATITUDE, LONGITUDE);
        String expectedResponse = EXPECTED_RESPONSE;
        doReturn(expectedResponse).when(weatherApiService).makeHttpRequest(
            contains("latitude=40.8518&longitude=14.2681"), 
            isNull()
        );

        String result = weatherApiService.getWeatherData(coords, DATE, "2025-12-07");

        assertEquals(expectedResponse, result);
    }

    @Test
    void getWeatherDataConnectionError() throws IOException {
        CoordinatesDTO coords = new CoordinatesDTO(LATITUDE, LONGITUDE);
        
        doThrow(new IOException("Connection refused")).when(weatherApiService).makeHttpRequest(
            contains(API_URL), 
            isNull()
        );

        WeatherApiException exception = assertThrows(WeatherApiException.class,
            () -> weatherApiService.getWeatherData(coords, DATE, "2025-12-07")
        );

        assertEquals(WEATHER_API_ERROR, exception.getMessage());
    }

    @Test
    void getWeatherForecastSuccess() throws IOException {
        
        doReturn(GEO_RESPONSE).when(weatherApiService).makeHttpRequest(
            contains(GEO_API_URL), 
            eq(USER_AGENT)
        );
        
       
        doReturn(EXPECTED_RESPONSE).when(weatherApiService).makeHttpRequest(
            contains(API_URL), 
            isNull()
        );

        JsonNode result = weatherApiService.getWeatherForecast(CITY, DATE);

        assertNotNull(result);
        assertTrue(result.has("temperature_2m_max"));
        assertTrue(result.has("temperature_2m_min"));
    }

    @Test
    void getWeatherForecastCityNotFound() throws IOException {
       
        doReturn("[]").when(weatherApiService).makeHttpRequest(
            contains(GEO_API_URL), 
            eq(USER_AGENT)
        );

        WeatherApiException exception = assertThrows(WeatherApiException.class,
            () -> weatherApiService.getWeatherForecast("CityCheNonEsiste", DATE)
        );
        assertEquals(WEATHER_API_ERROR, exception.getMessage());
    }

    @Test
    void getWeatherForecastInvalidResponse() throws IOException {
        
        doReturn(GEO_RESPONSE).when(weatherApiService).makeHttpRequest(
            contains(GEO_API_URL), 
            eq(USER_AGENT)
        );

        doReturn("{ \"wrong_field\": {} }").when(weatherApiService).makeHttpRequest(
            contains(API_URL), 
            isNull()
        );

        WeatherApiException exception = assertThrows(WeatherApiException.class,
            () -> weatherApiService.getWeatherForecast(CITY, DATE)
        );
        assertEquals(WEATHER_API_ERROR, exception.getMessage());
    }

    @Test
    void getWeatherForecastDataProcessingError() throws IOException {
        doReturn(GEO_RESPONSE).when(weatherApiService).makeHttpRequest(
            contains(GEO_API_URL), 
            eq(USER_AGENT)
        );
        
        doReturn("{malformed_json:}").when(weatherApiService).makeHttpRequest(
            contains(API_URL), 
            isNull()
        );

        WeatherApiException exception = assertThrows(WeatherApiException.class,
            () -> weatherApiService.getWeatherForecast(CITY, DATE)
        );

        assertEquals(WEATHER_API_ERROR, exception.getMessage());
    }

    @Test
    void getCoordinatesForCityError() throws IOException {
        doThrow(new IOException("Network error")).when(weatherApiService).makeHttpRequest(
            contains(GEO_API_URL), 
            eq(USER_AGENT)
        );

        WeatherApiException exception = assertThrows(WeatherApiException.class,
            () -> weatherApiService.getCoordinatesForCity(CITY)
        );

        assertEquals(WEATHER_API_ERROR, exception.getMessage());
    }

}
