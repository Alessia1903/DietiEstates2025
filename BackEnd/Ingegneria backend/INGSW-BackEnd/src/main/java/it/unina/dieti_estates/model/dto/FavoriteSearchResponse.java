package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class FavoriteSearchResponse {
    private Long id;
    private String city;
    private String contractType;
    private String energyClass;
    private Integer rooms;
    private Double minPrice;
    private Double maxPrice;
    private LocalDateTime favoritedAt;
}
