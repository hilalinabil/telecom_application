package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.domain.model.*;
import com.example.telecom_network.domain.ports.in.*;
import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping({"/api/reseau", "/api/network"})
public class NetworkController {

    private final ManageDatacenterUseCase datacenterUseCase;
    private final ManageRepartiteurUseCase repartiteurUseCase;
    private final ManageEquipementUseCase equipementUseCase;
    private final ManageSplitterUseCase splitterUseCase;
    private final ManageBoiteClientUseCase boiteClientUseCase;
    private final SimulationUseCase simulationUseCase;

    public NetworkController(
            ManageDatacenterUseCase datacenterUseCase,
            ManageRepartiteurUseCase repartiteurUseCase,
            ManageEquipementUseCase equipementUseCase,
            ManageSplitterUseCase splitterUseCase,
            ManageBoiteClientUseCase boiteClientUseCase,
            SimulationUseCase simulationUseCase) {
        this.datacenterUseCase = datacenterUseCase;
        this.repartiteurUseCase = repartiteurUseCase;
        this.equipementUseCase = equipementUseCase;
        this.splitterUseCase = splitterUseCase;
        this.boiteClientUseCase = boiteClientUseCase;
        this.simulationUseCase = simulationUseCase;
    }

    @GetMapping
    public ResponseEntity<NetworkGraphDto> getFullNetwork() {
        NetworkGraphDto graph = NetworkGraphDto.builder()
                .datacenters(datacenterUseCase.getAllDatacenters())
                .repartiteurs(repartiteurUseCase.getAllRepartiteurs())
                .equipements(equipementUseCase.getAllEquipements())
                .splitters(splitterUseCase.getAllSplitters())
                .boiteClients(boiteClientUseCase.getAllBoiteClients())
                .chemins(simulationUseCase.getAllPaths())
                .build();
        return ResponseEntity.ok(graph);
    }

    @Data
    @Builder
    public static class NetworkGraphDto {
        private List<Datacenter> datacenters;
        private List<Repartiteur> repartiteurs;
        private List<Equipement> equipements;
        private List<Splitter> splitters;
        private List<BoiteClient> boiteClients;
        private List<Chemin> chemins;
    }
}
