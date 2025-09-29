package it.unina.dieti_estates.model.dto;

import java.time.LocalDateTime;

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

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getType() { return type; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getRealEstateAddress() { return realEstateAddress; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setType(String type) { this.type = type; }
    public void setMessage(String message) { this.message = message; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setRealEstateAddress(String realEstateAddress) { this.realEstateAddress = realEstateAddress; }
}
