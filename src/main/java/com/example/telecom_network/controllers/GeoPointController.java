package com.example.telecom_network.controllers;

import com.example.telecom_network.dtos.request.GeoPointRequest;
import com.example.telecom_network.dtos.response.GeoPointResponse;
import com.example.telecom_network.services.GeoPointService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geo-points")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
public class GeoPointController {

    private final GeoPointService geoPointService;

    public GeoPointController(GeoPointService geoPointService) {
        this.geoPointService = geoPointService;
    }

    @PostMapping
    public ResponseEntity<GeoPointResponse> createGeoPoint(@RequestBody GeoPointRequest request) {
        GeoPointResponse created = geoPointService.createGeoPoint(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<GeoPointResponse>> getAllGeoPoints() {
        List<GeoPointResponse> list = geoPointService.getAllGeoPoints();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeoPointResponse> getGeoPointById(@PathVariable String id) {
        GeoPointResponse point = geoPointService.getGeoPointById(id);
        return ResponseEntity.ok(point);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GeoPointResponse> updateGeoPoint(@PathVariable String id, @RequestBody GeoPointRequest details) {
        GeoPointResponse updated = geoPointService.updateGeoPoint(id, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Void> deleteGeoPoint(@PathVariable String id) {
        geoPointService.deleteGeoPoint(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/path/{pathId}")
    public ResponseEntity<List<GeoPointResponse>> getGeoPointsByPathId(@PathVariable String pathId) {
        List<GeoPointResponse> list = geoPointService.getGeoPointsByPathId(pathId);
        return ResponseEntity.ok(list);
    }
}
