package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Getter
@Setter
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

}
