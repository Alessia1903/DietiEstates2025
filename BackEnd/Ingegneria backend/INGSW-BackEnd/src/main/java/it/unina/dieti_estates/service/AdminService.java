package it.unina.dieti_estates.service;

import com.google.zxing.WriterException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unina.dieti_estates.exception.auth.InvalidCredentialsException;
import it.unina.dieti_estates.exception.auth.UnauthorizedAccessException;
import it.unina.dieti_estates.exception.validation.DuplicateResourceException;
import it.unina.dieti_estates.model.Admin;
import it.unina.dieti_estates.model.EstateAgent;
import it.unina.dieti_estates.model.LoginRequest;
import it.unina.dieti_estates.model.dto.ChangePasswordRequest;
import it.unina.dieti_estates.model.dto.CreateAdminRequest;
import it.unina.dieti_estates.model.dto.CreateEstateAgentRequest;
import it.unina.dieti_estates.model.dto.QRCodeResponse;
import it.unina.dieti_estates.repository.AdminRepository;
import it.unina.dieti_estates.repository.EstateAgentRepository;
import it.unina.dieti_estates.utils.PasswordGenerator;
import it.unina.dieti_estates.utils.QRCodeGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EstateAgentRepository agentRepository;
    private final ObjectMapper objectMapper;
    private final PasswordGenerator passwordGenerator;

    @Autowired
    public AdminService(AdminRepository adminRepository, 
                       PasswordEncoder passwordEncoder,
                       @Lazy AuthenticationManager authenticationManager, 
                       JwtService jwtService, 
                       EstateAgentRepository agentRepository,
                       ObjectMapper objectMapper,
                       PasswordGenerator passwordGenerator) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.agentRepository = agentRepository;
        this.objectMapper = objectMapper;
        this.passwordGenerator = passwordGenerator;
    }

    public String loginAdmin(LoginRequest loginAdminRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginAdminRequest.getEmail(),
                    loginAdminRequest.getPassword()
                )
        );

        UserDetails adminDetails = (UserDetails) authentication.getPrincipal();
        return jwtService.generateToken(adminDetails);
    }

    public QRCodeResponse createAdminAccount(CreateAdminRequest request) throws IOException, WriterException {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw DuplicateResourceException.emailAlreadyExists(request.getEmail());
        }

        String generatedPassword = passwordGenerator.generateSecurePassword();
        
        Admin authenticatedAdmin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Admin admin = new Admin(
            request.getEmail(),
            passwordEncoder.encode(generatedPassword),
            request.getFirstName(),
            request.getLastName(),
            authenticatedAdmin.getVatNumber()
        );

        adminRepository.save(admin);

        // Creazione dati per QR code
        Map<String, String> qrData = new HashMap<>();
        qrData.put("email", admin.getEmail());
        qrData.put("password", generatedPassword); // password non criptata
        String qrDataJson = objectMapper.writeValueAsString(qrData);

        // Generazione QR code
        String qrCodeBase64 = QRCodeGenerator.generateQRCodeBase64(qrDataJson, 200, 200);

        return new QRCodeResponse(
            "Admin account created successfully",
            qrCodeBase64
        );
    }

    public Admin getProfile() {
        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (admin == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }
        return admin;
    }

    public void changeAmministrationPassword(ChangePasswordRequest request) {
        Admin admin = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (admin == null) {
            throw new UnauthorizedAccessException("User not authenticated or invalid session");
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
    }

    public QRCodeResponse createEstateAgentAccount(CreateEstateAgentRequest request) throws IOException, WriterException {
        if (agentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw DuplicateResourceException.emailAlreadyExists(request.getEmail());
        }

        String generatedPassword = passwordGenerator.generateSecurePassword();

        EstateAgent agent = new EstateAgent(
            request.getEmail(),
            passwordEncoder.encode(generatedPassword),
            request.getFirstName(),
            request.getLastName(),
            request.getTelephoneNumber(),
            request.getQualifications()
        );

        agentRepository.save(agent);

        // Creazione dati per QR code
        Map<String, String> qrData = new HashMap<>();
        qrData.put("email", agent.getEmail());
        qrData.put("password", generatedPassword); // password non criptata
        String qrDataJson = objectMapper.writeValueAsString(qrData);

        // Generazione QR code
        String qrCodeBase64 = QRCodeGenerator.generateQRCodeBase64(qrDataJson, 200, 200);

        return new QRCodeResponse(
            "Estate agent account created successfully",
            qrCodeBase64
        );
    }
}
