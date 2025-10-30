package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.User;
import it.unina.dieti_estates.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("findByEmail returns user when present")
    void findByEmailReturnsUser() {
        User user = new User(
            "user@example.com",
            "password",
            "Mario",
            "Rossi"
        );

        userRepository.save(user);
        Optional<User> found = userRepository.findByEmail("user@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Mario");
    }

    @Test
    @DisplayName("findByEmail returns empty when not present")
    void findByEmailReturnsEmpty() {
        Optional<User> found = userRepository.findByEmail("notfound@example.com");
        assertThat(found).isNotPresent();
    }
}
