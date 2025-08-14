package it.unina.dieti_estates.exception.validation;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class InvalidRealEstateDataException extends DietiEstatesException {
    public InvalidRealEstateDataException(String message) {
        super(message, "INVALID_REAL_ESTATE_DATA");
    }

    public static InvalidRealEstateDataException missingDetails(String propertyType) {
        return new InvalidRealEstateDataException(
            String.format("Missing required details for %s property", propertyType.toLowerCase())
        );
    }

    public static InvalidRealEstateDataException invalidType() {
        return new InvalidRealEstateDataException("Invalid real estate type provided");
    }

    public InvalidRealEstateDataException(String message, Throwable cause) {
        super(message, "INVALID_REAL_ESTATE_DATA", cause);
    }
}
