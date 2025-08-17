package it.unina.dieti_estates.model;
import java.util.Date;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "\"buyer\"")
@PrimaryKeyJoinColumn(name = "id")
public class Buyer extends User{
    private Date birthdate;

    public Buyer() {
        super();
    }

    public Buyer(String email, String password, String firstName, String lastName, Date birthdate) {
        super(email, password, firstName, lastName);
        this.birthdate = birthdate;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Restituisce il ruolo specifico per il Buyer
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_BUYER"));
    }
}
