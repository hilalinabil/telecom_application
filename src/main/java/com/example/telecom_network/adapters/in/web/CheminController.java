package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.domain.model.Chemin;
import com.example.telecom_network.domain.ports.in.SimulationUseCase;
import com.example.telecom_network.domain.ports.out.CheminRepositoryPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/chemins", "/api/chemin"})
public class CheminController {

    private final SimulationUseCase simulationUseCase;
    private final CheminRepositoryPort cheminRepositoryPort;

    public CheminController(SimulationUseCase simulationUseCase, CheminRepositoryPort cheminRepositoryPort) {
        this.simulationUseCase = simulationUseCase;
        this.cheminRepositoryPort = cheminRepositoryPort;
    }

    @GetMapping
    public ResponseEntity<List<Chemin>> getAll() {
        return ResponseEntity.ok(simulationUseCase.getAllPaths());
    }

    @PostMapping
    public ResponseEntity<Chemin> create(@RequestBody Chemin chemin) {
        return new ResponseEntity<>(cheminRepositoryPort.save(chemin), HttpStatus.CREATED);
    }
}
