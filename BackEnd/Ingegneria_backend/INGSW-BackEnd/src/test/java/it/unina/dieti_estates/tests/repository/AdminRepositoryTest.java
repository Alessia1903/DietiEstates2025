package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.Admin;
import it.unina.dieti_estates.repository.AdminRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AdminRepositoryTest {

    @Autowired
    private AdminRepository adminRepository;

    @Test
    @DisplayName("findByEmail returns Admin when present")
    void findByEmailReturnsAdmin() {
        Admin admin = new Admin(
            "admin@example.com",
            "password",
            "Anna",
            "Bianchi",
            "12345678901"
        );
        adminRepository.save(admin);

        Optional<Admin> found = adminRepository.findByEmail("admin@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Anna");
        assertThat(found.get().getVatNumber()).isEqualTo("12345678901");
    }

    @Test
    @DisplayName("findByEmail returns empty when not present")
    void findByEmailReturnsEmpty() {
        Optional<Admin> found = adminRepository.findByEmail("notfound@example.com");
        assertThat(found).isNotPresent();
    }
}
