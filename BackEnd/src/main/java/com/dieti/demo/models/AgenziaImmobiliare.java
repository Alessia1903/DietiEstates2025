package com.dieti.demo.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "agenziaimmobiliare")
@JsonIgnoreProperties({"nome", "piva"})
public class AgenziaImmobiliare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idagenziaimmobiliare")
    private Long id;

    @JsonProperty("Nome")
    @Column(name = "nome", nullable = false, length = 128)
    private String Nome;

    @JsonProperty("pIva")
    @Column(name = "piva", nullable = false, unique = true, length = 128)
    private String pIva;

    // Costruttori
    public AgenziaImmobiliare() {}

    public AgenziaImmobiliare(String Nome, String pIva) {
        this.Nome = Nome;
        this.pIva = pIva;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return Nome; }
    public void setNome(String Nome) { this.Nome = Nome; }

    public String getPIva() { return pIva; }
    public void setPIva(String pIva) { this.pIva = pIva; }
}
