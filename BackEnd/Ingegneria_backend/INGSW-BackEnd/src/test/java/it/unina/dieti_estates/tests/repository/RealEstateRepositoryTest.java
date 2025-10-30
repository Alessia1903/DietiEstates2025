package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.model.RealEstate;
import it.unina.dieti_estates.repository.EstateAgentRepository;
import it.unina.dieti_estates.repository.RealEstateRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class RealEstateRepositoryTest {

    @Autowired
    private RealEstateRepository realEstateRepository;

    @Autowired
    private EstateAgentRepository estateAgentRepository;

    private static final String CITY = "Napoli";
    private static final String CONTRACT_TYPE = "in vendita";

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

    private RealEstate createRealEstate(EstateAgent agent, String city, String contractType, String energyClass, Integer rooms, Double price) {
        return realEstateRepository.save(
            new RealEstate(
                Collections.emptyList(),
                city,
                "Centro",
                "Via Roma 1",
                "1",
                2,
                rooms,
                100.0f,
                true,
                4,
                energyClass,
                "arredato",
                "autonomo",
                "ristrutturato",
                contractType,
                "Ampio appartamento",
                price.floatValue(),
                agent
            )
        );
    }

    @Test
    @DisplayName("findByAgentId returns real estates for agent")
    void findByAgentIdReturnsResults() {
        EstateAgent agent = createAgent("agent@example.com");
        createRealEstate(agent, CITY, CONTRACT_TYPE, "A", 3, 200000.0);

        Page<RealEstate> page = realEstateRepository.findByAgentId(agent.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("findByAgentId returns empty for agent with no real estates")
    void findByAgentIdReturnsEmpty() {
        EstateAgent agent = createAgent("agent2@example.com");
        Page<RealEstate> page = realEstateRepository.findByAgentId(agent.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    @DisplayName("searchRealEstates returns results with all filters")
    void searchRealEstatesAllFilters() {
        EstateAgent agent = createAgent("agent3@example.com");
        createRealEstate(agent, CITY, CONTRACT_TYPE, "A", 3, 200000.0);

        Page<RealEstate> page = realEstateRepository.searchRealEstates(
            CITY, CONTRACT_TYPE, "A", 4, 0.0, 1000000.0, PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("searchRealEstates returns empty with unmatched filters")
    void searchRealEstatesNoResults() {
        EstateAgent agent = createAgent("agent4@example.com");
        createRealEstate(agent, "Roma", "in affitto", "B", 2, 100000.0);

        Page<RealEstate> page = realEstateRepository.searchRealEstates(
            CITY, CONTRACT_TYPE, "A", 3, 150000.0, 250000.0, PageRequest.of(0, 10));
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    @DisplayName("searchRealEstates returns all for city only")
    void searchRealEstatesCityOnly() {
        EstateAgent agent = createAgent("agent5@example.com");
        createRealEstate(agent, CITY, CONTRACT_TYPE, "A", 3, 200000.0);

        Page<RealEstate> page = realEstateRepository.searchRealEstates(
            CITY, null, null, null, null, null, PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("findTop5ByOrderByIdDesc returns latest 5 estates")
    void findTop5ByOrderByIdDescReturnsLatestFive() {
        EstateAgent agent = createAgent("agent6@example.com");
        for (int i = 1; i <= 7; i++) {
            createRealEstate(agent, "City" + i, CONTRACT_TYPE, "A", 3, 200000.0 + i);
        }

        List<RealEstate> latest = realEstateRepository.findTop5ByOrderByIdDesc();
        assertThat(latest).hasSize(5);
        // Verify they are in descending order
        for (int i = 0; i < latest.size() - 1; i++) {
            assertThat(latest.get(i).getId()).isGreaterThan(latest.get(i + 1).getId());
        }
    }

    @Test
    @DisplayName("findTop5ByOrderByIdDesc returns all estates when less than 5")
    void findTop5ByOrderByIdDescReturnsLessThanFive() {
        EstateAgent agent = createAgent("agent7@example.com");
        createRealEstate(agent, "City1", CONTRACT_TYPE, "A", 3, 200000.0);
        createRealEstate(agent, "City2", CONTRACT_TYPE, "A", 3, 200000.0);

        List<RealEstate> latest = realEstateRepository.findTop5ByOrderByIdDesc();
        assertThat(latest).hasSize(2);
    }

    @Test
    @DisplayName("findTop5ByOrderByIdDesc returns empty list for empty database")
    void findTop5ByOrderByIdDescReturnsEmpty() {
        List<RealEstate> latest = realEstateRepository.findTop5ByOrderByIdDesc();
        assertThat(latest).isEmpty();
    }
}
