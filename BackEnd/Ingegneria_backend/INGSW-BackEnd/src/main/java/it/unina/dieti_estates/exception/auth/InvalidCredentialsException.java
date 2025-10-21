package it.unina.dieti_estates.exception.auth;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class InvalidCredentialsException extends DietiEstatesException {
    public InvalidCredentialsException(String message) {
        super(message, "INVALID_CREDENTIALS");
    }
}
