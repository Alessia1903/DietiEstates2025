package it.unina.dieti_estates.exception.base;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private final String status;
    private final String code;
    private final String message;
    private final LocalDateTime timestamp;
    private Map<String, Object> details;

    public ErrorResponse(String code, String message) {
        this.status = "ERROR";
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(String code, String message, Map<String, Object> details) {
        this(code, message);
        this.details = details;
    }

    public String getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Map<String, Object> getDetails() {
        return details;
    }
}
