package it.unina.dieti_estates.exception.auth;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class UserNotFoundException extends DietiEstatesException {
    public UserNotFoundException(String message) {
        super(message, "USER_NOT_FOUND");
    }
}
