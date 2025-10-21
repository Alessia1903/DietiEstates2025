package it.unina.dieti_estates.exception.validation;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class DuplicateResourceException extends DietiEstatesException {
    public DuplicateResourceException(String message) {
        super(message, "DUPLICATE_RESOURCE");
    }

    public static DuplicateResourceException emailAlreadyExists(String email) {
        return new DuplicateResourceException(
            String.format("A user with email '%s' already exists", email)
        );
    }
}
