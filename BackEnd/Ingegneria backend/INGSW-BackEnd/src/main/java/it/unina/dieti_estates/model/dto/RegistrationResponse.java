package it.unina.dieti_estates.model.dto;

public class RegistrationResponse {
    private final String message;

    public RegistrationResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
