package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.SplitterReqDto;
import com.example.telecom_network.domain.model.Splitter;
import com.example.telecom_network.domain.ports.in.ManageSplitterUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/splitters", "/api/splitter"})
public class SplitterController {

    private final ManageSplitterUseCase splitterUseCase;

    public SplitterController(ManageSplitterUseCase splitterUseCase) {
        this.splitterUseCase = splitterUseCase;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SplitterReqDto dto) {
        try {
            Splitter s = Splitter.builder()
                    .ratio(dto.getRatio())
                    .repartiteurId(dto.getRepartiteurId())
                    .nbSorties(dto.getNbSorties())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return new ResponseEntity<>(splitterUseCase.createSplitter(s), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Splitter>> getAll() {
        return ResponseEntity.ok(splitterUseCase.getAllSplitters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Splitter> getById(@PathVariable String id) {
        return splitterUseCase.getSplitterById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody SplitterReqDto dto) {
        try {
            Splitter s = Splitter.builder()
                    .ratio(dto.getRatio())
                    .repartiteurId(dto.getRepartiteurId())
                    .nbSorties(dto.getNbSorties())
                    .latitude(dto.getLatitude())
                    .longitude(dto.getLongitude())
                    .build();
            return ResponseEntity.ok(splitterUseCase.updateSplitter(id, s));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        try {
            splitterUseCase.deleteSplitter(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
