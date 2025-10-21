package it.unina.dieti_estates.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.sql.Timestamp;

@Entity
@Table(name = "\"booked_visit\"")
public class BookedVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private Timestamp requestDate;

    @ManyToOne
    @JoinColumn(name = "real_estate_id", nullable = false)
    private RealEstate estate;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    @ManyToOne
    @JoinColumn(name = "estate_agent_id", nullable = false)
    private EstateAgent agent;

    public BookedVisit() {
    }

    public BookedVisit(String status, Timestamp requestDate, RealEstate estate, Buyer buyer, EstateAgent agent) {
        this.status = status;
        this.requestDate = requestDate;
        this.estate = estate;
        this.buyer = buyer;
        this.agent = agent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Timestamp requestDate) {
        this.requestDate = requestDate;
    }

    public RealEstate getRealEstate() {
        return estate;
    }

    public void setRealEstate(RealEstate estate) {
        this.estate = estate;
    }

    public Buyer getBuyer() {
        return buyer;
    }

    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }

    public EstateAgent getAgent() {
        return agent;
    }

    public void setAgent(EstateAgent agent) {
        this.agent = agent;
    }
}
