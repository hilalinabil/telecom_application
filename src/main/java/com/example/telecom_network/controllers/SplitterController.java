package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.SplitterRequest;
import com.example.telecom_network.dtos.response.SplitterResponse;
import com.example.telecom_network.services.SplitterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/splitters")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class SplitterController {

    private final SplitterService splitterService;

    public SplitterController(SplitterService splitterService) {
        this.splitterService = splitterService;
    }

    @PostMapping
    public ResponseEntity<SplitterResponse> createSplitter(@RequestBody SplitterRequest request) {
        SplitterResponse created = splitterService.createSplitter(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SplitterResponse>> getAllSplitters() {
        List<SplitterResponse> list = splitterService.getAllSplitters();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SplitterResponse> getSplitterById(@PathVariable String id) {
        SplitterResponse splitter = splitterService.getSplitterById(id);
        return ResponseEntity.ok(splitter);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SplitterResponse> updateSplitter(@PathVariable String id, @RequestBody SplitterRequest details) {
        SplitterResponse updated = splitterService.updateSplitter(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteSplitter(@PathVariable String id) {
        splitterService.deleteSplitter(id);
        return ResponseEntity.noContent().build();
    }
}
