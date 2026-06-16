package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.EquipementReqDto;
import com.example.telecom_network.domain.model.Equipement;
import com.example.telecom_network.domain.ports.in.ManageEquipementUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/equipements", "/api/equipement"})
public class EquipementController {

    private final ManageEquipementUseCase equipementUseCase;

    public EquipementController(ManageEquipementUseCase equipementUseCase) {
        this.equipementUseCase = equipementUseCase;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody EquipementReqDto dto) {
        try {
            Equipement eq = Equipement.builder()
                    .type(dto.getType())
                    .ip(dto.getIp())
                    .statut(dto.getStatut() != null ? dto.getStatut() : "actif")
                    .repartiteurId(dto.getRepartiteurId())
                    .build();
            return new ResponseEntity<>(equipementUseCase.createEquipement(eq), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Equipement>> getAll() {
        return ResponseEntity.ok(equipementUseCase.getAllEquipements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipement> getById(@PathVariable String id) {
        return equipementUseCase.getEquipementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody EquipementReqDto dto) {
        try {
            Equipement eq = Equipement.builder()
                    .type(dto.getType())
                    .ip(dto.getIp())
                    .statut(dto.getStatut())
                    .repartiteurId(dto.getRepartiteurId())
                    .build();
            return ResponseEntity.ok(equipementUseCase.updateEquipement(id, eq));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            equipementUseCase.deleteEquipement(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
