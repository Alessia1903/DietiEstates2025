package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.RealEstate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RealEstateRepository extends JpaRepository<RealEstate, Long> {
    @Query("SELECT r FROM RealEstate r WHERE r.agent.id = :agentId")
    Page<RealEstate> findByAgentId(@Param("agentId") Long agentId, Pageable pageable);

    @Query("SELECT r FROM RealEstate r " +
           "WHERE (:city IS NULL OR r.city = :city) " +
           "AND (:contractType IS NULL OR r.contractType = :contractType) " +
           "AND (:energyClass IS NULL OR r.energyClass = :energyClass) " +
           "AND (:rooms IS NULL OR r.rooms = :rooms) " +
           "AND (:minPrice IS NULL OR r.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR r.price <= :maxPrice) " +
           "ORDER BY r.id DESC")
    Page<RealEstate> searchRealEstates(
        @Param("city") String city,
        @Param("contractType") String contractType,
        @Param("energyClass") String energyClass,
        @Param("rooms") Integer rooms,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        Pageable pageable
    );
    
    List<RealEstate> findTop5ByOrderByIdDesc();
}
