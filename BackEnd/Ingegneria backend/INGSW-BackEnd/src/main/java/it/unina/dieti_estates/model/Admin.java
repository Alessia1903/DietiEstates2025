package it.unina.dieti_estates.model;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "\"admin\"")
@PrimaryKeyJoinColumn(name = "id")
public class Admin extends User{
    
    @Column(nullable = false)
    private String vatNumber;

    public Admin() {
        super();
    }

    public Admin(String email, String password, String firstName, String lastName, String vatNumber) {
        super(email, password, firstName, lastName);
        this.vatNumber = vatNumber;
    }

    public String getVatNumber() {
        return vatNumber;
    }

    public void setVatNumber(String vatNumber) {
        this.vatNumber = vatNumber;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }
}
