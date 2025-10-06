package it.unina.dieti_estates.exception.validation;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class InvalidRealEstateDataException extends DietiEstatesException {
    public InvalidRealEstateDataException(String message) {
        super(message, "INVALID_REAL_ESTATE_DATA");
    }
    
}
