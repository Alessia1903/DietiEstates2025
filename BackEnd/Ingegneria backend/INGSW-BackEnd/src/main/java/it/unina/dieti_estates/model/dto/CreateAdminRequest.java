package it.unina.dieti_estates.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAdminRequest {
    private String email;
    private String firstName;
    private String lastName;

    public CreateAdminRequest() {}

    public CreateAdminRequest(String email, String firstName, String lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

}
