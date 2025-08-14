package it.unina.dieti_estates.model.dto;

import java.sql.Timestamp;

public class BookedVisitDTO {
    private Long id;
    private String status;
    private Timestamp requestDate;
    private String buyerName;
    private String realEstateAddress;

    public BookedVisitDTO(Long id, String status, Timestamp requestDate, String buyerName, String realEstateAddress) {
        this.id = id;
        this.status = status;
        this.requestDate = requestDate;
        this.buyerName = buyerName;
        this.realEstateAddress = realEstateAddress;
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

    public Timestamp getRequestDate() {
        return requestDate;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public String getRealEstateAddress() {
        return realEstateAddress;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRequestDate(Timestamp requestDate) {
        this.requestDate = requestDate;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public void setRealEstateAddress(String realEstateAddress) {
        this.realEstateAddress = realEstateAddress;
    }
}
