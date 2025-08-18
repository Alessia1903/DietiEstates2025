package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {
    boolean existsByVatNumber(String vatNumber);
}
