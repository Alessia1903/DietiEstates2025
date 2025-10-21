package it.unina.dieti_estates.exception.business;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class WeatherApiException extends DietiEstatesException {
    public WeatherApiException(String message) {
        super("WEATHER_API_ERROR", message);
    }
}
