package it.unina.dieti_estates.exception.resource;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class BookedVisitNotFoundException extends DietiEstatesException {
    public BookedVisitNotFoundException(String message) {
        super(message, "BOOKED_VISIT_NOT_FOUND");
    }

    public BookedVisitNotFoundException(Long visitId) {
        super(String.format("Booked visit not found with id: %d", visitId), "BOOKED_VISIT_NOT_FOUND");
    }

    public static BookedVisitNotFoundException forBuyerAndEstate(Long buyerId, Long realEstateId) {
        return new BookedVisitNotFoundException(
            String.format("No booked visit found for buyer %d and real estate %d", buyerId, realEstateId)
        );
    }

    public BookedVisitNotFoundException(String message, Throwable cause) {
        super(message, "BOOKED_VISIT_NOT_FOUND", cause);
    }
}
