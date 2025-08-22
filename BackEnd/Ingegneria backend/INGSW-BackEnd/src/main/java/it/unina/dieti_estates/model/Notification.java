package it.unina.dieti_estates.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"notification\"")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String type; 

    private String message;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "real_estate_id", nullable = true)
    private RealEstate realEstate;

    public Notification() {}

    public Notification(String title, String type, String message, LocalDateTime createdAt, Buyer buyer, RealEstate realEstate) {
        this.title = title;
        this.type = type;
        this.message = message;
        this.createdAt = createdAt;
        this.buyer = buyer;
        this.realEstate = realEstate;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getType() { return type; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Buyer getBuyer() { return buyer; }
    public RealEstate getRealEstate() { return realEstate; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setType(String type) { this.type = type; }
    public void setMessage(String message) { this.message = message; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setBuyer(Buyer buyer) { this.buyer = buyer; }
    public void setRealEstate(RealEstate realEstate) { this.realEstate = realEstate; }
}
