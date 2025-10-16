package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RealEstateResponseDTO {
    private Long id;
    private List<String> imageUrls;
    private String city;
    private String district;
    private String address;
    private String streetNumber;
    private Integer floor;
    private Integer totalBuildingFloors;
    private Float commercialArea;
    private Boolean elevator;
    private Integer rooms;
    private String energyClass;
    private String furnishing;
    private String heating;
    private String propertyStatus;
    private String contractType;
    private String description;
    private Float price;

}
