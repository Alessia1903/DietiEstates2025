package it.unina.dieti_estates.model.dto;

public class WeatherRequest {
    private String city;
    private String date;

    public WeatherRequest() {}

    public WeatherRequest(String city, String date) {
        this.city = city;
        this.date = date;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
