package it.unina.dieti_estates.exception.resource;

import it.unina.dieti_estates.exception.base.DietiEstatesException;

public class BookedVisitNotFoundException extends DietiEstatesException {
    public BookedVisitNotFoundException(String message) {
        super(message, "BOOKED_VISIT_NOT_FOUND");
    } 
}
