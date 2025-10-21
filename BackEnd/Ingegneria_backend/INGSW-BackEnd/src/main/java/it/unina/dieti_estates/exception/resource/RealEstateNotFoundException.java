package it.unina.dieti_estates.exception.resource;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class RealEstateNotFoundException extends DietiEstatesException {
    public RealEstateNotFoundException(String message) {
        super(message, "REAL_ESTATE_NOT_FOUND");
    }   
}
