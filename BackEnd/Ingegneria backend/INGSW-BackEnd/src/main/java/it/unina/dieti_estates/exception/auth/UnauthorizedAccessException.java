package it.unina.dieti_estates.exception.auth;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class UnauthorizedAccessException extends DietiEstatesException {
    public UnauthorizedAccessException(String message) {
        super(message, "UNAUTHORIZED_ACCESS");
    }
}
