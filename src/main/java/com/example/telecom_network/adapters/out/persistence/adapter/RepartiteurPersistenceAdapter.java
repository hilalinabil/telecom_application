package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.RepartiteurDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoRepartiteurRepository;
import com.example.telecom_network.domain.model.Repartiteur;
import com.example.telecom_network.domain.ports.out.RepartiteurRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class RepartiteurPersistenceAdapter implements RepartiteurRepositoryPort {

    private final MongoRepartiteurRepository repository;

    public RepartiteurPersistenceAdapter(MongoRepartiteurRepository repository) {
        this.repository = repository;
    }

    @Override
    public Repartiteur save(Repartiteur r) {
        RepartiteurDocument doc = toDocument(r);
        RepartiteurDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<Repartiteur> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Repartiteur> findAll() {
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

    private RepartiteurDocument toDocument(Repartiteur r) {
        if (r == null) return null;
        return RepartiteurDocument.builder()
                .id(r.getId())
                .nom(r.getNom())
                .datacenterId(r.getDatacenterId())
                .nbPorts(r.getNbPorts())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .build();
    }

    private Repartiteur toDomain(RepartiteurDocument r) {
        if (r == null) return null;
        return Repartiteur.builder()
                .id(r.getId())
                .nom(r.getNom())
                .datacenterId(r.getDatacenterId())
                .nbPorts(r.getNbPorts())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .build();
    }
}
