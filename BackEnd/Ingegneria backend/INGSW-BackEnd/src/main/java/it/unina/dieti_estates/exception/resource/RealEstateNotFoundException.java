package it.unina.dieti_estates.exception.resource;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class RealEstateNotFoundException extends DietiEstatesException {
    public RealEstateNotFoundException(String message) {
        super(message, "REAL_ESTATE_NOT_FOUND");
    }

    public RealEstateNotFoundException(Long realEstateId) {
        super(String.format("Real estate not found with id: %d", realEstateId), "REAL_ESTATE_NOT_FOUND");
    }

    public static RealEstateNotFoundException withAddress(String address) {
        return new RealEstateNotFoundException(String.format("Real estate not found at address: %s", address));
    }

    public RealEstateNotFoundException(String message, Throwable cause) {
        super(message, "REAL_ESTATE_NOT_FOUND", cause);
    }
}
