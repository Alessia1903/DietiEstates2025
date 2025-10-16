package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Getter
@Setter
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

}
