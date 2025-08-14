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
}
