package it.unina.dieti_estates.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class CreateEstateAgentRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Telephone number is required")
    private String telephoneNumber;

    @NotBlank(message = "Qualifications are required")
    private String qualifications;

    public CreateEstateAgentRequest() {}

    public CreateEstateAgentRequest(String email, String firstName, String lastName, String telephoneNumber, String qualifications) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.telephoneNumber = telephoneNumber;
        this.qualifications = qualifications;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getTelephoneNumber() {
        return telephoneNumber;
    }

    public void setTelephoneNumber(String telephoneNumber) {
        this.telephoneNumber = telephoneNumber;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }
}
