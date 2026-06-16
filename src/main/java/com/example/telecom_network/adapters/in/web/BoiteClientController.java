package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.BoiteClientReqDto;
import com.example.telecom_network.domain.model.BoiteClient;
import com.example.telecom_network.domain.ports.in.ManageBoiteClientUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/boites-clients", "/api/boite-client"})
public class BoiteClientController {

    private final ManageBoiteClientUseCase boiteClientUseCase;

    public BoiteClientController(ManageBoiteClientUseCase boiteClientUseCase) {
        this.boiteClientUseCase = boiteClientUseCase;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody BoiteClientReqDto dto) {
        try {
            BoiteClient b = BoiteClient.builder()
                    .type(dto.getType())
                    .splitterId(dto.getSplitterId())
                    .portsUtilises(dto.getPortsUtilises())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return new ResponseEntity<>(boiteClientUseCase.createBoiteClient(b), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<BoiteClient>> getAll() {
        return ResponseEntity.ok(boiteClientUseCase.getAllBoiteClients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoiteClient> getById(@PathVariable String id) {
        return boiteClientUseCase.getBoiteClientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody BoiteClientReqDto dto) {
        try {
            BoiteClient b = BoiteClient.builder()
                    .type(dto.getType())
                    .splitterId(dto.getSplitterId())
                    .portsUtilises(dto.getPortsUtilises())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return ResponseEntity.ok(boiteClientUseCase.updateBoiteClient(id, b));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            boiteClientUseCase.deleteBoiteClient(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
