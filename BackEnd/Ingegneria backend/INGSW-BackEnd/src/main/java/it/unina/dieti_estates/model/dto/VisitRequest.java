package it.unina.dieti_estates.model.dto;

public class VisitRequest {
    private Long realEstateId;
    private String date;
    private String time;

    public VisitRequest() {}

    public VisitRequest(Long realEstateId, String date, String time) {
        this.realEstateId = realEstateId;
        this.date = date;
        this.time = time;
    }

    public Long getRealEstateId() {
        return realEstateId;
    }

    public void setRealEstateId(Long realEstateId) {
        this.realEstateId = realEstateId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
