package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.repository.EstateAgentRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class EstateAgentRepositoryTest {

    @Autowired
    private EstateAgentRepository estateAgentRepository;

    @Test
    @DisplayName("findByEmail returns agent when present")
    void findByEmailReturnsAgent() {
        EstateAgent agent = new EstateAgent(
            "agent@example.com",
            "password",
            "Mario",
            "Rossi",
            "3331234567",
            "Laurea in Architettura"
        );

        estateAgentRepository.save(agent);

        Optional<EstateAgent> found = estateAgentRepository.findByEmail("agent@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Mario");
        assertThat(found.get().getTelephoneNumber()).isEqualTo("3331234567");
    }

    @Test
    @DisplayName("findByEmail returns empty when not present")
    void findByEmailReturnsEmpty() {
        Optional<EstateAgent> found = estateAgentRepository.findByEmail("notfound@example.com");
        assertThat(found).isNotPresent();
    }
}
