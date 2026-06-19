package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.FibrePathRequest;
import com.example.telecom_network.dtos.response.FibrePathResponse;
import com.example.telecom_network.models.enums.FibreStatus;
import com.example.telecom_network.services.FibrePathService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fibre-paths")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class FibrePathController {

    private final FibrePathService fibrePathService;

    public FibrePathController(FibrePathService fibrePathService) {
        this.fibrePathService = fibrePathService;
    }

    @PostMapping
    public ResponseEntity<FibrePathResponse> createFibrePath(@RequestBody FibrePathRequest request) {
        FibrePathResponse created = fibrePathService.createFibrePath(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FibrePathResponse>> getAllFibrePaths() {
        List<FibrePathResponse> list = fibrePathService.getAllFibrePaths();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FibrePathResponse> getFibrePathById(@PathVariable String id) {
        FibrePathResponse path = fibrePathService.getFibrePathById(id);
        return ResponseEntity.ok(path);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FibrePathResponse> updateFibrePath(@PathVariable String id, @RequestBody FibrePathRequest details) {
        FibrePathResponse updated = fibrePathService.updateFibrePath(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteFibrePath(@PathVariable String id) {
        fibrePathService.deleteFibrePath(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FibrePathResponse>> getFibrePathsByStatus(@PathVariable FibreStatus status) {
        List<FibrePathResponse> list = fibrePathService.getFibrePathsByStatus(status);
        return ResponseEntity.ok(list);
    }
}
