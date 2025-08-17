package it.unina.dieti_estates.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorite_search")
public class FavoriteSearch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    private String city;
    private String contractType;
    private String energyClass;
    private Integer rooms;
    private Double minPrice;
    private Double maxPrice;
    private LocalDateTime favoritedAt;

    public FavoriteSearch() {

    }

    public FavoriteSearch(Buyer buyer, String city, String contractType, String energyClass, Integer rooms, Double minPrice, Double maxPrice, LocalDateTime favoritedAt) {
        this.buyer = buyer;
        this.city = city;
        this.contractType = contractType;
        this.energyClass = energyClass;
        this.rooms = rooms;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.favoritedAt = favoritedAt;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Buyer getBuyer() {
        return buyer;
    }
    public void setBuyer(Buyer buyer) {
        this.buyer = buyer;
    }

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

    public LocalDateTime getFavoritedAt() {
        return favoritedAt;
    }
    public void setFavoritedAt(LocalDateTime favoritedAt) {
        this.favoritedAt = favoritedAt;
    }
}
