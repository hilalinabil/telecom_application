package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.EquipementRequest;
import com.example.telecom_network.dtos.response.EquipementResponse;
import com.example.telecom_network.models.enums.NetworkStatus;
import com.example.telecom_network.services.EquipementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipements")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class EquipementController {

    private final EquipementService equipementService;

    public EquipementController(EquipementService equipementService) {
        this.equipementService = equipementService;
    }

    @PostMapping
    public ResponseEntity<EquipementResponse> createEquipement(@RequestBody EquipementRequest request) {
        EquipementResponse created = equipementService.createEquipement(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EquipementResponse>> getAllEquipements() {
        List<EquipementResponse> list = equipementService.getAllEquipements();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipementResponse> getEquipementById(@PathVariable String id) {
        EquipementResponse equipement = equipementService.getEquipementById(id);
        return ResponseEntity.ok(equipement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EquipementResponse> updateEquipement(@PathVariable String id, @RequestBody EquipementRequest details) {
        EquipementResponse updated = equipementService.updateEquipement(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable String id) {
        equipementService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EquipementResponse>> getEquipementsByStatus(@PathVariable NetworkStatus status) {
        List<EquipementResponse> list = equipementService.getEquipementsByStatus(status);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<EquipementResponse>> getEquipementsByZone(@PathVariable String zone) {
        List<EquipementResponse> list = equipementService.getEquipementsByZone(zone);
        return ResponseEntity.ok(list);
    }
}
