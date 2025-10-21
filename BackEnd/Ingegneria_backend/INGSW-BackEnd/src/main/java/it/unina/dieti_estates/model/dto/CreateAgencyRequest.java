package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAgencyRequest {
    private String agencyName;
    private String vatNumber;
    private String adminFirstName;
    private String adminLastName;
    private String adminEmail;
}
