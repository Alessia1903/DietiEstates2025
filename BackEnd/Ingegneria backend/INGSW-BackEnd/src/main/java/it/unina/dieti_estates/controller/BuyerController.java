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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    private final BuyerService buyerService;

    @Autowired
    public BuyerController(BuyerService buyerService) {
        this.buyerService = buyerService;
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

    @PostMapping("/google-login")
    public ResponseEntity<String> loginBuyerWithGoogle(@RequestBody String idToken) {
        String jwt = buyerService.loginBuyerWithGoogle(idToken);
        return ResponseEntity.ok(jwt);
    }

    @PostMapping("/google-register")
    public ResponseEntity<RegistrationResponse> registerBuyerWithGoogle(@RequestBody String idToken) {
        RegistrationResponse response = buyerService.registerBuyerWithGoogle(idToken);
        return ResponseEntity.ok(response);
    }

    // TODO: implementare le notifiche

    // TODO: implementare la funzionalità di richiesta visita
}
