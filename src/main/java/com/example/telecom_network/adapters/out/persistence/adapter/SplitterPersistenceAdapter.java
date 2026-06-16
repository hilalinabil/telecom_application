package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.SplitterDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoSplitterRepository;
import com.example.telecom_network.domain.model.Splitter;
import com.example.telecom_network.domain.ports.out.SplitterRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class SplitterPersistenceAdapter implements SplitterRepositoryPort {

    private final MongoSplitterRepository repository;

    public SplitterPersistenceAdapter(MongoSplitterRepository repository) {
        this.repository = repository;
    }

    @Override
    public Splitter save(Splitter splitter) {
        SplitterDocument doc = toDocument(splitter);
        SplitterDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<Splitter> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Splitter> findAll() {
        return repository.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }

    private SplitterDocument toDocument(Splitter s) {
        if (s == null) return null;
        return SplitterDocument.builder()
                .id(s.getId())
                .ratio(s.getRatio())
                .repartiteurId(s.getRepartiteurId())
                .nbSorties(s.getNbSorties())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .build();
    }

    private Splitter toDomain(SplitterDocument s) {
        if (s == null) return null;
        return Splitter.builder()
                .id(s.getId())
                .ratio(s.getRatio())
                .repartiteurId(s.getRepartiteurId())
                .nbSorties(s.getNbSorties())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .build();
    }
}
