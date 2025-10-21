package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherRequest {
    private String city;
    private String date;

    public WeatherRequest() {}

    public WeatherRequest(String city, String date) {
        this.city = city;
        this.date = date;
    }
}
