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
@Table(name = "\"estate_agent\"")
@PrimaryKeyJoinColumn(name = "id")
public class EstateAgent extends User {
    
    @Column(nullable = false)
    private String telephoneNumber;
    
    @Column(nullable = false)
    private String qualifications;

    public EstateAgent() {
        super();
    }

    public EstateAgent(String email, String password, String firstName, String lastName, String telephoneNumber, String qualifications) {
        super(email, password, firstName, lastName);
        this.telephoneNumber = telephoneNumber;
        this.qualifications = qualifications;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Restituisce il ruolo specifico per l'EstateAgent
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_AGENT"));
    }
}
