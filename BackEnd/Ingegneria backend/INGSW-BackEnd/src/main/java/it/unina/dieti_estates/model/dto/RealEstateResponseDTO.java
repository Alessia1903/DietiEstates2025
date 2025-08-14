package it.unina.dieti_estates.model.dto;

public class RealEstateResponseDTO {
    private Long id;
    private String imageUrl;
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

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
