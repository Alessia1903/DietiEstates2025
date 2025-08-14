package it.unina.dieti_estates.exception.base;

public abstract class DietiEstatesException extends RuntimeException {
    private final String errorCode;

    protected DietiEstatesException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    protected DietiEstatesException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
