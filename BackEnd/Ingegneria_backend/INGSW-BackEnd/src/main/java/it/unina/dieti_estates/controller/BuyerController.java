package it.unina.dieti_estates.controller;

import it.unina.dieti_estates.model.Buyer;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.FavoriteRequest;
import it.unina.dieti_estates.model.dto.FavoriteSearchDeleteRequest;
import it.unina.dieti_estates.model.dto.FavoriteSearchResponse;
import it.unina.dieti_estates.model.dto.PageResponse;
import it.unina.dieti_estates.model.dto.RegistrationResponse;
import it.unina.dieti_estates.service.BuyerService;
import it.unina.dieti_estates.model.dto.RealEstateResponseDTO;
import it.unina.dieti_estates.model.dto.WeatherRequest;
import it.unina.dieti_estates.model.dto.VisitRequest;
import it.unina.dieti_estates.model.dto.NotificationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    private final BuyerService buyerService;

    @Autowired
    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    @GetMapping("/homepage")
    public ResponseEntity<List<RealEstateResponseDTO>> getHomePageEstates() {
        List<RealEstateResponseDTO> estates = buyerService.getHomePageEstates();
        return ResponseEntity.ok(estates);
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> registerBuyer(@RequestBody Buyer buyer) {
        RegistrationResponse response = buyerService.registerNewBuyer(buyer);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginBuyer(@RequestBody LoginRequest loginRequest) { 
        String token = buyerService.loginBuyer(loginRequest);
        return ResponseEntity.ok(token);
    }

    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/profile")
    public ResponseEntity<Buyer> getProfile() {
        Buyer buyer = buyerService.getProfile();
        return ResponseEntity.ok(buyer);
    }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/favorites/add")
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteRequest request) {
        String result = buyerService.addFavorite(request);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/favorites/remove")
    public ResponseEntity<String> removeFavorite(@RequestBody FavoriteSearchDeleteRequest request) {
        String result = buyerService.removeFavorite(request);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/favorites")
    public ResponseEntity<PageResponse<FavoriteSearchResponse>> getFavorites(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        PageResponse<FavoriteSearchResponse> response = buyerService.getFavorites(page, size);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('BUYER')")
    @PatchMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody Buyer updatedBuyer) {
        buyerService.updateProfile(updatedBuyer);
        return ResponseEntity.ok("Profilo aggiornato con successo");
    }

    @PostMapping("/search")
    public ResponseEntity<PageResponse<RealEstateResponseDTO>> searchRealEstates(
        @RequestBody FavoriteRequest request,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        PageResponse<RealEstateResponseDTO> response = buyerService.searchRealEstates(request, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/google/callback")
    public ResponseEntity<?> googleAuthCallback(@RequestBody Map<String, String> body) {
        String jwt = buyerService.loginBuyerWithGoogleCode(body);
        return ResponseEntity.ok(Map.of("jwt", jwt, "role", "user"));
    }

    @PostMapping("/auth/google/register")
    public ResponseEntity<?> googleRegisterCallback(@RequestBody Map<String, String> body) {
        RegistrationResponse response = buyerService.registerBuyerWithGoogle(body);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/weather")
    public ResponseEntity<?> getWeather(@RequestBody WeatherRequest request) {
        return ResponseEntity.ok(buyerService.getWeatherForecast(request));
    }

    @PreAuthorize("hasRole('BUYER')")
    @PostMapping("/book-visit")
    public ResponseEntity<String> bookVisit(@RequestBody VisitRequest request) {
        buyerService.bookVisit(request);
        return ResponseEntity.ok("Visita prenotata con successo");
    }

    @PreAuthorize("hasRole('BUYER')")
    @GetMapping("/notifications")
    public ResponseEntity<PageResponse<NotificationDTO>> getNotifications(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        PageResponse<NotificationDTO> notifications = buyerService.getNotificationsForCurrentBuyer(page, size);
        return ResponseEntity.ok(notifications);
    }
}
