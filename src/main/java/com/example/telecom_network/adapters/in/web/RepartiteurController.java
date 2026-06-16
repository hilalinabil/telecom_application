package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.RepartiteurReqDto;
import com.example.telecom_network.domain.model.Repartiteur;
import com.example.telecom_network.domain.ports.in.ManageRepartiteurUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/repartiteurs", "/api/repartiteur"})
public class RepartiteurController {

    private final ManageRepartiteurUseCase repartiteurUseCase;

    public RepartiteurController(ManageRepartiteurUseCase repartiteurUseCase) {
        this.repartiteurUseCase = repartiteurUseCase;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody RepartiteurReqDto dto) {
        try {
            Repartiteur r = Repartiteur.builder()
                    .nom(dto.getNom())
                    .datacenterId(dto.getDatacenterId())
                    .nbPorts(dto.getNbPorts())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return new ResponseEntity<>(repartiteurUseCase.createRepartiteur(r), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Repartiteur>> getAll() {
        return ResponseEntity.ok(repartiteurUseCase.getAllRepartiteurs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Repartiteur> getById(@PathVariable String id) {
        return repartiteurUseCase.getRepartiteurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody RepartiteurReqDto dto) {
        try {
            Repartiteur r = Repartiteur.builder()
                    .nom(dto.getNom())
                    .datacenterId(dto.getDatacenterId())
                    .nbPorts(dto.getNbPorts())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return ResponseEntity.ok(repartiteurUseCase.updateRepartiteur(id, r));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            repartiteurUseCase.deleteRepartiteur(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
