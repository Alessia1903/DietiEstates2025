package it.unina.dieti_estates.exception;

import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.auth.UserNotFoundException;
import it.unina.dieti_estates.exception.base.*;
import it.unina.dieti_estates.exception.business.*;
import it.unina.dieti_estates.exception.resource.*;
import it.unina.dieti_estates.exception.storage.*;
import it.unina.dieti_estates.exception.validation.*;
import org.springframework.dao.DataIntegrityViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedAccessException(UnauthorizedAccessException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RealEstateNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleRealEstateNotFoundException(RealEstateNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BookedVisitNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBookedVisitNotFoundException(BookedVisitNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PropertyNotAvailableException.class)
    public ResponseEntity<ErrorResponse> handlePropertyNotAvailableException(PropertyNotAvailableException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse> handleFileStorageException(FileStorageException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(InvalidRealEstateDataException.class)
    public ResponseEntity<ErrorResponse> handleInvalidRealEstateDataException(InvalidRealEstateDataException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException ex) {
        ErrorResponse error = new ErrorResponse(ex.getErrorCode(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        ErrorResponse error = new ErrorResponse(
            "DATA_INTEGRITY_VIOLATION",
            "A conflict occurred while processing your request. Please check your data."
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred. Please try again later."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
