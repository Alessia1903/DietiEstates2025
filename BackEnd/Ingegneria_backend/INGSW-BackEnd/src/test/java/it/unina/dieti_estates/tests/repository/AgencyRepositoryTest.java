package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.Agency;
import it.unina.dieti_estates.model.Admin;
import it.unina.dieti_estates.repository.AgencyRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AgencyRepositoryTest {

    @Autowired
    private AgencyRepository agencyRepository;

    @Test
    @DisplayName("existsByVatNumber returns true when Agency exists")
    void existsByVatNumberReturnsTrue() {
        Admin admin = new Admin(
            "agencyadmin@example.com",
            "password",
            "Luca",
            "Verdi",
            "12345678901"
        );
        Agency agency = new Agency(
            "Agenzia Test",
            "98765432109",
            admin
        );
        agencyRepository.save(agency);

        boolean exists = agencyRepository.existsByVatNumber("98765432109");
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByVatNumber returns false when Agency does not exist")
    void existsByVatNumberReturnsFalse() {
        boolean exists = agencyRepository.existsByVatNumber("00000000000");
        assertThat(exists).isFalse();
    }
}
