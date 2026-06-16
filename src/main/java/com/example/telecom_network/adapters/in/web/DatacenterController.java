package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.DatacenterReqDto;
import com.example.telecom_network.domain.model.Datacenter;
import com.example.telecom_network.domain.ports.in.ManageDatacenterUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/datacenters", "/api/datacenter"})
public class DatacenterController {

    private final ManageDatacenterUseCase datacenterUseCase;

    public DatacenterController(ManageDatacenterUseCase datacenterUseCase) {
        this.datacenterUseCase = datacenterUseCase;
    }

    @PostMapping
    public ResponseEntity<Datacenter> create(@Valid @RequestBody DatacenterReqDto dto) {
        Datacenter dc = Datacenter.builder()
                .nom(dto.getNom())
                .localisation(dto.getLocalisation())
                .capacite(dto.getCapacite())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();
        return new ResponseEntity<>(datacenterUseCase.createDatacenter(dc), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Datacenter>> getAll() {
        return ResponseEntity.ok(datacenterUseCase.getAllDatacenters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Datacenter> getById(@PathVariable String id) {
        return datacenterUseCase.getDatacenterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Datacenter> update(@PathVariable String id, @Valid @RequestBody DatacenterReqDto dto) {
        try {
            Datacenter dc = Datacenter.builder()
                    .nom(dto.getNom())
                    .localisation(dto.getLocalisation())
                    .capacite(dto.getCapacite())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return ResponseEntity.ok(datacenterUseCase.updateDatacenter(id, dc));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            datacenterUseCase.deleteDatacenter(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
