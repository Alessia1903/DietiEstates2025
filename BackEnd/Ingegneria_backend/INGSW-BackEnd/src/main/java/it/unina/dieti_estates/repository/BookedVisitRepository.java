package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.BookedVisit;
import it.unina.dieti_estates.model.dto.BookedVisitDTO;
import it.unina.dieti_estates.model.RealEstate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public interface BookedVisitRepository extends JpaRepository<BookedVisit, Long> {

    @Query("SELECT new it.unina.dieti_estates.model.dto.BookedVisitDTO(b.id, b.status, b.requestDate, bu.email, p.address) " +
       "FROM BookedVisit b " +
       "JOIN b.buyer bu " +  
       "JOIN b.estate p " +
       "WHERE b.agent.id = :agentId")
    Page<BookedVisitDTO> findByEstateAgent(@Param("agentId") Long agentId, Pageable pageable);

    boolean existsByEstateAndRequestDate(RealEstate estate, Timestamp requestDate);
}
