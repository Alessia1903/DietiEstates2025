package it.unina.dieti_estates.model.dto;

public class FavoriteRequest {
    private String city;
    private String contractType;
    private String energyClass;
    private Integer rooms;
    private Double minPrice;
    private Double maxPrice;
    
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public String getContractType() {
        return contractType;
    }
    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getEnergyClass() {
        return energyClass;
    }
    public void setEnergyClass(String energyClass) {
        this.energyClass = energyClass;
    }

    public Integer getRooms() {
        return rooms;
    }
    public void setRooms(Integer rooms) {
        this.rooms = rooms;
    }

    public Double getMinPrice() {
        return minPrice;
    }
    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }
    public Double getMaxPrice() {
        return maxPrice;
    }
    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }

}
