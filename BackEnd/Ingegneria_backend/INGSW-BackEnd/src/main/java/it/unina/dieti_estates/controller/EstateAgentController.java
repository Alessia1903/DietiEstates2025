package it.unina.dieti_estates.controller;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.BookedVisitDTO;
import it.unina.dieti_estates.model.dto.CreateRealEstateRequest;
import it.unina.dieti_estates.model.dto.PageResponse;
import it.unina.dieti_estates.model.dto.RealEstateResponseDTO;
import it.unina.dieti_estates.model.dto.VisitActionRequest;
import it.unina.dieti_estates.service.EstateAgentService;

@RestController
@RequestMapping("/api/estate-agents")
public class EstateAgentController {
    
    private final EstateAgentService agentService;

    @Autowired
    public EstateAgentController(EstateAgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginAgent(@RequestBody LoginRequest loginAgentRequest) {
        String token = agentService.loginAgent(loginAgentRequest);
        return ResponseEntity.ok(token);
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/profile")
    public ResponseEntity<EstateAgent> getProfile() {
        EstateAgent agent = agentService.getProfile();
        return ResponseEntity.ok(agent);
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/all-booked-visits")
    public ResponseEntity<PageResponse<BookedVisitDTO>> getAllBookedVisits(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(agentService.getAllBookedVisits(page, size));
    }

    @PreAuthorize("hasRole('AGENT')")
    @PostMapping("/visits/accept")
    public ResponseEntity<String> acceptVisit(@RequestBody VisitActionRequest request) {
        String result = agentService.acceptVisit(request.getVisitId());
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('AGENT')")
    @PostMapping("/visits/reject")
    public ResponseEntity<String> rejectVisit(@RequestBody VisitActionRequest request) {
        String result = agentService.rejectVisit(request.getVisitId());
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('AGENT')")
    @PostMapping(value = "/load-real-estate", consumes = { "multipart/form-data" })
    public ResponseEntity<RealEstateResponseDTO> loadNewRealEstate(@ModelAttribute CreateRealEstateRequest request) throws IOException {
        RealEstateResponseDTO estate = agentService.loadNewRealEstate(request);
        return ResponseEntity.ok(estate);
    }

    @PreAuthorize("hasRole('AGENT')")
    @GetMapping("/my-properties")
    public ResponseEntity<PageResponse<RealEstateResponseDTO>> getMyProperties(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size
    ) {
        PageResponse<RealEstateResponseDTO> response = agentService.getMyProperties(page, size);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('AGENT')")
    @PatchMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody EstateAgent updatedAgent) {
        agentService.updateProfile(updatedAgent);
        return ResponseEntity.ok("Profilo aggiornato con successo");
    }
}
