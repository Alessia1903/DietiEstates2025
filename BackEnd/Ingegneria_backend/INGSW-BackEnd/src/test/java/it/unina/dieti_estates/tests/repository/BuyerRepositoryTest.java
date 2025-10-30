package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.Buyer;
import it.unina.dieti_estates.repository.BuyerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.time.LocalDate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BuyerRepositoryTest {

    @Autowired
    private BuyerRepository buyerRepository;

    @Test
    @DisplayName("findByEmail returns Buyer when present")
    void findByEmailReturnsBuyer() {
        Buyer buyer = new Buyer(
            "test@example.com",
            "password",
            "Mario",
            "Rossi",
            LocalDate.now()
        );
        buyerRepository.save(buyer);

        Optional<Buyer> found = buyerRepository.findByEmail("test@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Mario");
    }

    @Test
    @DisplayName("findByEmail returns empty when not present")
    void findByEmailReturnsEmpty() {
        Optional<Buyer> found = buyerRepository.findByEmail("notfound@example.com");
        assertThat(found).isNotPresent();
    }
}
