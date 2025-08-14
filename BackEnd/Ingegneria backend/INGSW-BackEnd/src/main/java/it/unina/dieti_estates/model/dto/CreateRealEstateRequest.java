package it.unina.dieti_estates.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

public class CreateRealEstateRequest {
    private MultipartFile image;
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

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStreetNumber() { return streetNumber; }
    public void setStreetNumber(String streetNumber) { this.streetNumber = streetNumber; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public Integer getTotalBuildingFloors() { return totalBuildingFloors; }
    public void setTotalBuildingFloors(Integer totalBuildingFloors) { this.totalBuildingFloors = totalBuildingFloors; }

    public Float getCommercialArea() { return commercialArea; }
    public void setCommercialArea(Float commercialArea) { this.commercialArea = commercialArea; }

    public Boolean getElevator() { return elevator; }
    public void setElevator(Boolean elevator) { this.elevator = elevator; }

    public Integer getRooms() { return rooms; }
    public void setRooms(Integer rooms) { this.rooms = rooms; }

    public String getEnergyClass() { return energyClass; }
    public void setEnergyClass(String energyClass) { this.energyClass = energyClass; }

    public String getFurnishing() { return furnishing; }
    public void setFurnishing(String furnishing) { this.furnishing = furnishing; }

    public String getHeating() { return heating; }
    public void setHeating(String heating) { this.heating = heating; }

    public String getPropertyStatus() { return propertyStatus; }
    public void setPropertyStatus(String propertyStatus) { this.propertyStatus = propertyStatus; }

    public String getContractType() { return contractType; }
    public void setContractType(String contractType) { this.contractType = contractType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Float getPrice() { return price; }
    public void setPrice(Float price) { this.price = price; }
}
