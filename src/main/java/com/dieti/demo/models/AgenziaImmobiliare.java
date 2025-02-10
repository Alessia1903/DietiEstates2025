package com.dieti.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "agenziaimmobiliare")
public class AgenziaImmobiliare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idagenziaimmobiliare")
    private Long id;

    @Column(name = "nome", nullable = false, length = 128)
    private String nome;

    @Column(name = "piva", nullable = false, unique = true, length = 128)
    private String piva;

    // Costruttori
    public AgenziaImmobiliare() {}

    public AgenziaImmobiliare(String nome, String piva) {
        this.nome = nome;
        this.piva = piva;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPiva() { return piva; } // Metodo con nome coerente
    public void setPiva(String piva) { this.piva = piva; }
}