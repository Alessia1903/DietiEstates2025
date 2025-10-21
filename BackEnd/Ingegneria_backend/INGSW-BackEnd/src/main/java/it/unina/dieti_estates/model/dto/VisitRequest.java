package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
}
