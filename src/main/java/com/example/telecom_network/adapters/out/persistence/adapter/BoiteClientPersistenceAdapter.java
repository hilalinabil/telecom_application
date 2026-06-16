package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.BoiteClientDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoBoiteClientRepository;
import com.example.telecom_network.domain.model.BoiteClient;
import com.example.telecom_network.domain.ports.out.BoiteClientRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class BoiteClientPersistenceAdapter implements BoiteClientRepositoryPort {

    private final MongoBoiteClientRepository repository;

    public BoiteClientPersistenceAdapter(MongoBoiteClientRepository repository) {
        this.repository = repository;
    }

    @Override
    public BoiteClient save(BoiteClient b) {
        BoiteClientDocument doc = toDocument(b);
        BoiteClientDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<BoiteClient> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<BoiteClient> findAll() {
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

    private BoiteClientDocument toDocument(BoiteClient b) {
        if (b == null) return null;
        return BoiteClientDocument.builder()
                .id(b.getId())
                .type(b.getType())
                .splitterId(b.getSplitterId())
                .portsUtilises(b.getPortsUtilises())
                .latitude(b.getLatitude())
                .longitude(b.getLongitude())
                .build();
    }

    private BoiteClient toDomain(BoiteClientDocument b) {
        if (b == null) return null;
        return BoiteClient.builder()
                .id(b.getId())
                .type(b.getType())
                .splitterId(b.getSplitterId())
                .portsUtilises(b.getPortsUtilises())
                .latitude(b.getLatitude())
                .longitude(b.getLongitude())
                .build();
    }
}
