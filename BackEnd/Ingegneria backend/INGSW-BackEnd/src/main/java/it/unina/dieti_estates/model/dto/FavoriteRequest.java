package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FavoriteRequest {
    private String city;
    private String contractType;
    private String energyClass;
    private Integer rooms;
    private Double minPrice;
    private Double maxPrice;
}
