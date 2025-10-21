package it.unina.dieti_estates.model.dto;

import lombok.Getter;

@Getter
public class RegistrationResponse {
    private final String message;

    public RegistrationResponse(String message) {
        this.message = message;
    }
}
