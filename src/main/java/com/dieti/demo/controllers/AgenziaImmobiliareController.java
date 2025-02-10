package com.dieti.demo.controllers;

import com.dieti.demo.models.AgenziaImmobiliare;
import com.dieti.demo.repository.AgenziaImmobiliareRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agenzie")
public class AgenziaImmobiliareController {

    @Autowired
    private AgenziaImmobiliareRepository agenziaRepo;

    @GetMapping
    public List<AgenziaImmobiliare> getAllAgenzie() {
        return agenziaRepo.findAll();
    }

    @PostMapping
    public AgenziaImmobiliare createAgenzia(@RequestBody AgenziaImmobiliare agenzia) {
        return agenziaRepo.save(agenzia);
    }
}
