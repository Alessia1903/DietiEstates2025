package it.unina.dieti_estates.repository;

import it.unina.dieti_estates.model.FavoriteSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface FavoriteSearchRepository extends JpaRepository<FavoriteSearch, Long> {
    Page<FavoriteSearch> findByBuyerId(Long buyerId, Pageable pageable);
}
