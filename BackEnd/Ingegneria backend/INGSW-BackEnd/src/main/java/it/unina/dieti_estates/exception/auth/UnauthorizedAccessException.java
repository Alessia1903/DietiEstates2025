package it.unina.dieti_estates.exception.auth;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class UnauthorizedAccessException extends DietiEstatesException {
    public UnauthorizedAccessException(String message) {
        super(message, "UNAUTHORIZED_ACCESS");
    }

    public UnauthorizedAccessException(String resource, String operation) {
        super(String.format("Unauthorized access: Cannot perform '%s' on resource '%s'", operation, resource), "UNAUTHORIZED_ACCESS");
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, "UNAUTHORIZED_ACCESS", cause);
    }
}
