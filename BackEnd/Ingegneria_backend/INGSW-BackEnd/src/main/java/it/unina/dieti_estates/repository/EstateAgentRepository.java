package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.EstateAgent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstateAgentRepository extends JpaRepository<EstateAgent, Long> {
    Optional<EstateAgent> findByEmail(String email);
}
