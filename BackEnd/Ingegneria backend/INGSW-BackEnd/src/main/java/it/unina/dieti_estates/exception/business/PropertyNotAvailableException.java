package it.unina.dieti_estates.exception.business;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class PropertyNotAvailableException extends DietiEstatesException {
    public PropertyNotAvailableException(String message) {
        super(message, "PROPERTY_NOT_AVAILABLE");
    }

    public PropertyNotAvailableException(Long realEstateId, String currentStatus) {
        super(
            String.format("Property with id %d is not available. Current status: %s", realEstateId, currentStatus),
            "PROPERTY_NOT_AVAILABLE"
        );
    }

    public static PropertyNotAvailableException forVisit(Long realEstateId) {
        return new PropertyNotAvailableException(
            String.format("Property with id %d is not available for visits at this time", realEstateId)
        );
    }

    public PropertyNotAvailableException(String message, Throwable cause) {
        super(message, "PROPERTY_NOT_AVAILABLE", cause);
    }
}
