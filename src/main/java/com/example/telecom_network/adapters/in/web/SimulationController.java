package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.domain.model.Chemin;
import com.example.telecom_network.domain.ports.in.SimulationUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping({"/api/simulation", "/api/simulation/generate"})
public class SimulationController {

    private final SimulationUseCase simulationUseCase;

    public SimulationController(SimulationUseCase simulationUseCase) {
        this.simulationUseCase = simulationUseCase;
    }

    @PostMapping
    public ResponseEntity<List<Chemin>> runSimulation() {
        List<Chemin> paths = simulationUseCase.generateVirtualFiberPaths();
        return ResponseEntity.ok(paths);
    }
    
    // Supporting exact path mapping for POST /api/simulation/generate
    @PostMapping("/generate")
    public ResponseEntity<List<Chemin>> runSimulationGenerate() {
        return ResponseEntity.ok(simulationUseCase.generateVirtualFiberPaths());
    }
}
