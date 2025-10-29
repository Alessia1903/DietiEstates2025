package it.unina.dieti_estates.model;

import jakarta.persistence.*;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"real_estate\"")
public class RealEstate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "real_estate_images", joinColumns = @JoinColumn(name = "real_estate_id"))
    @Column(name = "image_url")
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
    private String furnishing; // furnished, unfurnished, partially furnished
    private String heating; // autonomous, centralized, none
    private String propertyStatus; // under construction, renovated, to renovate
    private String contractType; // for sale, for rent
    private String description;
    private Float price;

    @CreationTimestamp
    @Column(name = "created_at", nullable = true, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    private EstateAgent agent;

    public RealEstate() {}

    public RealEstate(List<String> imageUrls, String city, String district, String address, String streetNumber, Integer floor,
                      Integer totalBuildingFloors, Float commercialArea, Boolean elevator, Integer rooms,
                      String energyClass, String furnishing, String heating, String propertyStatus,
                      String contractType, String description, Float price, EstateAgent agent) {
        this.imageUrls = imageUrls;
        this.city = city;
        this.district = district;
        this.address = address;
        this.streetNumber = streetNumber;
        this.floor = floor;
        this.totalBuildingFloors = totalBuildingFloors;
        this.commercialArea = commercialArea;
        this.elevator = elevator;
        this.rooms = rooms;
        this.energyClass = energyClass;
        this.furnishing = furnishing;
        this.heating = heating;
        this.propertyStatus = propertyStatus;
        this.contractType = contractType;
        this.description = description;
        this.price = price;
        this.agent = agent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

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

    public EstateAgent getAgent() { return agent; }
    public void setAgent(EstateAgent agent) { this.agent = agent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
