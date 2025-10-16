package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QRCodeResponse {
    private String message;
    private String base64QRCode;

    public QRCodeResponse() {}

    public QRCodeResponse(String message, String base64QRCode) {
        this.message = message;
        this.base64QRCode = base64QRCode;
    }
}
