package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.BookedVisitDTO;
import it.unina.dieti_estates.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.time.LocalDate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BookedVisitRepositoryTest {

    @Autowired
    private BookedVisitRepository bookedVisitRepository;

    @Autowired
    private EstateAgentRepository estateAgentRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private RealEstateRepository realEstateRepository;

    private EstateAgent createAgent(String email) {
        EstateAgent agent = new EstateAgent(
            email,
            "password",
            "Mario",
            "Rossi",
            "3331234567",
            "Laurea in Architettura"
        );
        return estateAgentRepository.save(agent);
    }

    private Buyer createBuyer(String email) {
        Buyer buyer = new Buyer(
            email,
            "password",
            "Giulia",
            "Verdi",
            LocalDate.of(2000, 1, 1) // 2000-01-01
        );
        return buyerRepository.save(buyer);
    }

    private RealEstate createRealEstate(EstateAgent agent, String address) {
        RealEstate realEstate = new RealEstate(
            Collections.emptyList(),
            "Napoli",
            "Centro",
            address,
            "1",
            2,
            5,
            100.0f,
            true,
            4,
            "A",
            "arredato",
            "autonomo",
            "ristrutturato",
            "in vendita",
            "Ampio appartamento",
            250000.0f,
            agent
        );
        return realEstateRepository.save(realEstate);
    }

    @Test
    @DisplayName("findByEstateAgent returns results when visits exist")
    void findByEstateAgentWithResults() {
        EstateAgent agent = createAgent("agent@example.com");
        Buyer buyer = createBuyer("buyer@example.com");
        RealEstate realEstate = createRealEstate(agent, "Via Roma 1");

        BookedVisit visit = new BookedVisit(
            "accettata",
            Timestamp.valueOf(LocalDateTime.now()),
            realEstate,
            buyer,
            agent
        );
        bookedVisitRepository.save(visit);

        Page<BookedVisitDTO> page = bookedVisitRepository.findByEstateAgent(agent.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("findByEstateAgent returns empty when no visits exist")
    void findByEstateAgentNoResults() {
        EstateAgent agent = createAgent("agent2@example.com");
        Page<BookedVisitDTO> page = bookedVisitRepository.findByEstateAgent(agent.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    @DisplayName("existsByEstateAndRequestDate returns true when visit exists")
    void existsByEstateAndRequestDateTrue() {
        EstateAgent agent = createAgent("agent3@example.com");
        Buyer buyer = createBuyer("buyer3@example.com");
        RealEstate realEstate = createRealEstate(agent, "Via Firenze 3");

        Timestamp ts = Timestamp.valueOf("2023-01-01 10:00:00");
        BookedVisit visit = new BookedVisit(
            "In_attesa",
            ts,
            realEstate,
            buyer,
            agent
        );
        bookedVisitRepository.save(visit);

        boolean exists = bookedVisitRepository.existsByEstateAndRequestDate(realEstate, ts);
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByEstateAndRequestDate returns false when no visit exists")
    void existsByEstateAndRequestDateFalse() {
        EstateAgent agent = createAgent("agent4@example.com");
        RealEstate realEstate = createRealEstate(agent, "Via Torino 4");

        boolean exists = bookedVisitRepository.existsByEstateAndRequestDate(realEstate, Timestamp.valueOf(LocalDateTime.now()));
        assertThat(exists).isFalse();
    }
}
