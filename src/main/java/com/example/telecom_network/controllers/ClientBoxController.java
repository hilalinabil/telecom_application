package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.ClientBoxRequest;
import com.example.telecom_network.dtos.response.ClientBoxResponse;
import com.example.telecom_network.services.ClientBoxService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client-boxes")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class ClientBoxController {

    private final ClientBoxService clientBoxService;

    public ClientBoxController(ClientBoxService clientBoxService) {
        this.clientBoxService = clientBoxService;
    }

    @PostMapping
    public ResponseEntity<ClientBoxResponse> createClientBox(@RequestBody ClientBoxRequest request) {
        ClientBoxResponse created = clientBoxService.createClientBox(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClientBoxResponse>> getAllClientBoxes() {
        List<ClientBoxResponse> list = clientBoxService.getAllClientBoxes();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientBoxResponse> getClientBoxById(@PathVariable String id) {
        ClientBoxResponse box = clientBoxService.getClientBoxById(id);
        return ResponseEntity.ok(box);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientBoxResponse> updateClientBox(@PathVariable String id, @RequestBody ClientBoxRequest details) {
        ClientBoxResponse updated = clientBoxService.updateClientBox(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteClientBox(@PathVariable String id) {
        clientBoxService.deleteClientBox(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<ClientBoxResponse>> getClientBoxesByZone(@PathVariable String zone) {
        List<ClientBoxResponse> list = clientBoxService.getClientBoxesByZone(zone);
        return ResponseEntity.ok(list);
    }
}
