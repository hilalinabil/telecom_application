package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.DatacenterDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoDatacenterRepository;
import com.example.telecom_network.domain.model.Datacenter;
import com.example.telecom_network.domain.ports.out.DatacenterRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class DatacenterPersistenceAdapter implements DatacenterRepositoryPort {

    private final MongoDatacenterRepository repository;

    public DatacenterPersistenceAdapter(MongoDatacenterRepository repository) {
        this.repository = repository;
    }

    @Override
    public Datacenter save(Datacenter datacenter) {
        DatacenterDocument doc = toDocument(datacenter);
        DatacenterDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<Datacenter> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Datacenter> findAll() {
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

    private DatacenterDocument toDocument(Datacenter d) {
        if (d == null) return null;
        return DatacenterDocument.builder()
                .id(d.getId())
                .nom(d.getNom())
                .localisation(d.getLocalisation())
                .capacite(d.getCapacite())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .build();
    }

    private Datacenter toDomain(DatacenterDocument d) {
        if (d == null) return null;
        return Datacenter.builder()
                .id(d.getId())
                .nom(d.getNom())
                .localisation(d.getLocalisation())
                .capacite(d.getCapacite())
                .latitude(d.getLatitude())
                .longitude(d.getLongitude())
                .build();
    }
}
