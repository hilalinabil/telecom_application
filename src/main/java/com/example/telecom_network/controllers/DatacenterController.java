package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.DatacenterRequest;
import com.example.telecom_network.dtos.response.DatacenterResponse;
import com.example.telecom_network.services.DatacenterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datacenters")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class DatacenterController {

    private final DatacenterService datacenterService;

    public DatacenterController(DatacenterService datacenterService) {
        this.datacenterService = datacenterService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<DatacenterResponse> createDatacenter(@RequestBody DatacenterRequest request) {
        DatacenterResponse created = datacenterService.createDatacenter(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DatacenterResponse>> getAllDatacenters() {
        List<DatacenterResponse> list = datacenterService.getAllDatacenters();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatacenterResponse> getDatacenterById(@PathVariable String id) {
        DatacenterResponse datacenter = datacenterService.getDatacenterById(id);
        return ResponseEntity.ok(datacenter);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<DatacenterResponse> updateDatacenter(@PathVariable String id, @RequestBody DatacenterRequest details) {
        DatacenterResponse updated = datacenterService.updateDatacenter(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteDatacenter(@PathVariable String id) {
        datacenterService.deleteDatacenter(id);
        return ResponseEntity.noContent().build();
    }
}
