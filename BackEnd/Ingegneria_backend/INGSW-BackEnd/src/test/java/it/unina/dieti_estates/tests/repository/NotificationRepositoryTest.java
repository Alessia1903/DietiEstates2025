package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.Buyer;
import it.unina.dieti_estates.model.Notification;
import it.unina.dieti_estates.repository.BuyerRepository;
import it.unina.dieti_estates.repository.NotificationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class NotificationRepositoryTest {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BuyerRepository buyerRepository;

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

    private Notification createNotification(Buyer buyer, String message) {
        Notification notification = new Notification();
        notification.setBuyer(buyer);
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Test
    @DisplayName("findByBuyer returns notifications for buyer")
    void findByBuyerReturnsNotifications() {
        Buyer buyer = createBuyer("buyer@example.com");
        createNotification(buyer, "Nuova notifica");

        Page<Notification> page = notificationRepository.findByBuyer(buyer, PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
        assertThat(page.getContent().get(0).getMessage()).isEqualTo("Nuova notifica");
    }

    @Test
    @DisplayName("findByBuyer returns empty for buyer with no notifications")
    void findByBuyerReturnsEmpty() {
        Buyer buyer = createBuyer("buyer2@example.com");
        Page<Notification> page = notificationRepository.findByBuyer(buyer, PageRequest.of(0, 10));
        assertThat(page.getContent()).isEmpty();
    }
}
