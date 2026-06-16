package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.Chemin;
import java.util.List;

public interface SimulationUseCase {
    List<Chemin> generateVirtualFiberPaths();
    List<Chemin> getAllPaths();
}
