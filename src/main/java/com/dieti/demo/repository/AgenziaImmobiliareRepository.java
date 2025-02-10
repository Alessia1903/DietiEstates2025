package com.dieti.demo.repository;

import com.dieti.demo.models.AgenziaImmobiliare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenziaImmobiliareRepository extends JpaRepository<AgenziaImmobiliare, Long> {
}
