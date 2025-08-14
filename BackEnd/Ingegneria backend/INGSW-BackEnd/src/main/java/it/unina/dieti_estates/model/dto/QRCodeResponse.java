package it.unina.dieti_estates.model.dto;

public class QRCodeResponse {
    private String message;
    private String base64QRCode;

    public QRCodeResponse() {}

    public QRCodeResponse(String message, String base64QRCode) {
        this.message = message;
        this.base64QRCode = base64QRCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getBase64QRCode() {
        return base64QRCode;
    }

    public void setBase64QRCode(String base64QRCode) {
        this.base64QRCode = base64QRCode;
    }
}
