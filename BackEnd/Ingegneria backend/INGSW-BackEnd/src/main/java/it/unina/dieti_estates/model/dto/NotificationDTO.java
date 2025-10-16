package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationDTO {
    private Long id;
    private String title;
    private String type;
    private String message;
    private LocalDateTime createdAt;
    private String realEstateAddress;

    public NotificationDTO(Long id, String title, String type, String message, LocalDateTime createdAt, String realEstateAddress) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
        this.realEstateAddress = realEstateAddress;
    }
}
