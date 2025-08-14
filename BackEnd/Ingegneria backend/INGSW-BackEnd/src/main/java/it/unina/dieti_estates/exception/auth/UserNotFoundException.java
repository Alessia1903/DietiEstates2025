package it.unina.dieti_estates.exception.auth;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class UserNotFoundException extends DietiEstatesException {
    public UserNotFoundException(String message) {
        super(message, "USER_NOT_FOUND");
    }

    public static UserNotFoundException withIdentifier(String userIdentifier) {
        return new UserNotFoundException(String.format("User not found with identifier: %s", userIdentifier));
    }

    public UserNotFoundException(String message, Throwable cause) {
        super(message, "USER_NOT_FOUND", cause);
    }
}
