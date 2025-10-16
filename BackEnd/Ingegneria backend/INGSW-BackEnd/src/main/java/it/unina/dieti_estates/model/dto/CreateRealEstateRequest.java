package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class CreateRealEstateRequest {
    @NotNull
    @Size(min = 1, max = 7, message = "Devi caricare da 1 a 7 immagini")
    private MultipartFile[] images;

    @NotBlank
    private String city;
    @NotBlank
    private String district;
    @NotBlank
    private String address;
    @NotBlank
    private String streetNumber;
    @NotNull
    private Integer floor;
    @NotNull
    private Integer totalBuildingFloors;
    @NotNull
    private Float commercialArea;
    @NotNull
    private Boolean elevator;
    @NotNull
    private Integer rooms;
    @NotBlank
    private String energyClass;
    @NotBlank
    private String furnishing;
    @NotBlank
    private String heating;
    @NotBlank
    private String propertyStatus;
    @NotBlank
    private String contractType;
    @NotBlank
    private String description;
    @NotNull
    private Float price;

}
