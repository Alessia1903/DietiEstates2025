package it.unina.dieti_estates.tests.repository;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.FavoriteRequest;
import it.unina.dieti_estates.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class FavoriteSearchRepositoryTest {

    @Autowired
    private FavoriteSearchRepository favoriteSearchRepository;

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

    private FavoriteSearch createFavorite(Buyer buyer, String city, String contractType, String energyClass, Integer rooms, Double minPrice, Double maxPrice) {
        FavoriteSearch fav = new FavoriteSearch(
            buyer,
            city,
            contractType,
            energyClass,
            rooms,
            minPrice,
            maxPrice,
            java.time.LocalDateTime.now()
        );
        return favoriteSearchRepository.save(fav);
    }

    @Test
    @DisplayName("findByBuyerId returns favorites for buyer")
    void findByBuyerIdReturnsFavorites() {
        Buyer buyer = createBuyer("buyer@example.com");
        createFavorite(buyer, "Napoli", "in vendita", "A", 3, 100000.0, 300000.0);

        Page<FavoriteSearch> page = favoriteSearchRepository.findByBuyerId(buyer.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isNotEmpty();
    }

    @Test
    @DisplayName("findByBuyerId returns empty for buyer with no favorites")
    void findByBuyerIdReturnsEmpty() {
        Buyer buyer = createBuyer("buyer2@example.com");
        Page<FavoriteSearch> page = favoriteSearchRepository.findByBuyerId(buyer.getId(), PageRequest.of(0, 10));
        assertThat(page.getContent()).isEmpty();
    }

    @Test
    @DisplayName("findMatchingFavorites returns matching favorites")
    void findMatchingFavoritesReturnsResults() {
        Buyer buyer = createBuyer("buyer3@example.com");
        createFavorite(buyer, "Napoli", "in vendita", "A", 3, 100000.0, 300000.0);

        List<FavoriteSearch> results = favoriteSearchRepository.findMatchingFavorites("Napoli", "in vendita", "A", 3, 200000.0);
        assertThat(results).isNotEmpty();
    }

    @Test
    @DisplayName("findMatchingFavorites returns empty when no match")
    void findMatchingFavoritesReturnsEmpty() {
        Buyer buyer = createBuyer("buyer4@example.com");
        createFavorite(buyer, "Roma", "in affitto", "B", 2, 50000.0, 100000.0);

        List<FavoriteSearch> results = favoriteSearchRepository.findMatchingFavorites("Napoli", "in vendita", "A", 3, 200000.0);
        assertThat(results).isEmpty();
    }

    @Test
    @DisplayName("existsByBuyerAndRequest returns true when favorite exists")
    void existsByBuyerAndRequestTrue() {
        Buyer buyer = createBuyer("buyer5@example.com");
        createFavorite(buyer, "Napoli", "in vendita", "A", 3, 100000.0, 300000.0);

        FavoriteRequest req = new FavoriteRequest();
        req.setCity("Napoli");
        req.setContractType("in vendita");
        req.setEnergyClass("A");
        req.setRooms(3);
        req.setMinPrice(100000.0);
        req.setMaxPrice(300000.0);
        boolean exists = favoriteSearchRepository.existsByBuyerAndRequest(buyer, req);
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("existsByBuyerAndRequest returns false when favorite does not exist")
    void existsByBuyerAndRequestFalse() {
        Buyer buyer = createBuyer("buyer6@example.com");
        createFavorite(buyer, "Roma", "in affitto", "B", 2, 50000.0, 100000.0);

        FavoriteRequest req = new FavoriteRequest();
        req.setCity("Napoli");
        req.setContractType("in vendita");
        req.setEnergyClass("A");
        req.setRooms(3);
        req.setMinPrice(100000.0);
        req.setMaxPrice(300000.0);
        boolean exists = favoriteSearchRepository.existsByBuyerAndRequest(buyer, req);
        assertThat(exists).isFalse();
    }
}
