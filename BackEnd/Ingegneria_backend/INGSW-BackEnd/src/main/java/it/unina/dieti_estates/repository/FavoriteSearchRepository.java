package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.FavoriteSearch;
import it.unina.dieti_estates.model.dto.FavoriteRequest;
import it.unina.dieti_estates.model.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface FavoriteSearchRepository extends JpaRepository<FavoriteSearch, Long> {
    Page<FavoriteSearch> findByBuyerId(Long buyerId, Pageable pageable);

    @Query("SELECT f FROM FavoriteSearch f WHERE f.city = :city AND f.contractType = :contractType AND f.energyClass = :energyClass AND f.rooms = :rooms AND f.minPrice <= :price AND f.maxPrice >= :price")
    List<FavoriteSearch> findMatchingFavorites(
        @Param("city") String city,
        @Param("contractType") String contractType,
        @Param("energyClass") String energyClass,
        @Param("rooms") Integer rooms,
        @Param("price") Double price
    );
    
    @Query("SELECT COUNT(f) > 0 FROM FavoriteSearch f WHERE f.buyer = :buyer AND f.city = :#{#request.city} AND f.contractType = :#{#request.contractType} AND f.energyClass = :#{#request.energyClass} AND f.rooms = :#{#request.rooms} AND f.minPrice = :#{#request.minPrice} AND f.maxPrice = :#{#request.maxPrice}")
    boolean existsByBuyerAndRequest(@Param("buyer") Buyer buyer, @Param("request") FavoriteRequest request);
}
