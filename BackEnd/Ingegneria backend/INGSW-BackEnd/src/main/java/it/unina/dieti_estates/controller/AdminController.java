package it.unina.dieti_estates.controller;

import it.unina.dieti_estates.model.*;
import it.unina.dieti_estates.model.dto.ChangePasswordRequest;
import it.unina.dieti_estates.model.dto.CreateAdminRequest;
import it.unina.dieti_estates.model.dto.CreateEstateAgentRequest;
import it.unina.dieti_estates.model.dto.QRCodeResponse;

import java.io.IOException;
import com.google.zxing.WriterException;

import it.unina.dieti_estates.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody LoginRequest loginAdminRequest) {
        String token = adminService.loginAdmin(loginAdminRequest);
        return ResponseEntity.ok(token);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/change-amministration-password")
    public ResponseEntity<String> changeAmministrationPassword(@RequestBody ChangePasswordRequest request) {
        adminService.changeAmministrationPassword(request);
        return ResponseEntity.ok("Password changed successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-admin")
    public ResponseEntity<QRCodeResponse> createAdminAccount(@RequestBody CreateAdminRequest request) throws IOException, WriterException {
        QRCodeResponse response = adminService.createAdminAccount(request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create-estate-agent-account")
    public ResponseEntity<QRCodeResponse> createEstateAgentAccount(@RequestBody CreateEstateAgentRequest request) throws IOException, WriterException {
        QRCodeResponse response = adminService.createEstateAgentAccount(request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<Admin> getProfile() {
        Admin admin = adminService.getProfile();
        return ResponseEntity.ok(admin);
    }

    // TODO: implementare la registrazione dell'agenzia
}
