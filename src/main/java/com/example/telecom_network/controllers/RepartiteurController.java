package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.RepartiteurRequest;
import com.example.telecom_network.dtos.response.RepartiteurResponse;
import com.example.telecom_network.services.RepartiteurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repartiteurs")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class RepartiteurController {

    private final RepartiteurService repartiteurService;

    public RepartiteurController(RepartiteurService repartiteurService) {
        this.repartiteurService = repartiteurService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<RepartiteurResponse> createRepartiteur(@RequestBody RepartiteurRequest request) {
        RepartiteurResponse created = repartiteurService.createRepartiteur(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RepartiteurResponse>> getAllRepartiteurs() {
        List<RepartiteurResponse> list = repartiteurService.getAllRepartiteurs();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepartiteurResponse> getRepartiteurById(@PathVariable String id) {
        RepartiteurResponse repartiteur = repartiteurService.getRepartiteurById(id);
        return ResponseEntity.ok(repartiteur);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<RepartiteurResponse> updateRepartiteur(@PathVariable String id, @RequestBody RepartiteurRequest details) {
        RepartiteurResponse updated = repartiteurService.updateRepartiteur(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteRepartiteur(@PathVariable String id) {
        repartiteurService.deleteRepartiteur(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<RepartiteurResponse>> getRepartiteursByZone(@PathVariable String zone) {
        List<RepartiteurResponse> list = repartiteurService.getRepartiteursByZone(zone);
        return ResponseEntity.ok(list);
    }
}
