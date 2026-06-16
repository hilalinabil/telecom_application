package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.EquipementDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoEquipementRepository;
import com.example.telecom_network.domain.model.Equipement;
import com.example.telecom_network.domain.ports.out.EquipementRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class EquipementPersistenceAdapter implements EquipementRepositoryPort {

    private final MongoEquipementRepository repository;

    public EquipementPersistenceAdapter(MongoEquipementRepository repository) {
        this.repository = repository;
    }

    @Override
    public Equipement save(Equipement eq) {
        EquipementDocument doc = toDocument(eq);
        EquipementDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<Equipement> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Equipement> findAll() {
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

    private EquipementDocument toDocument(Equipement eq) {
        if (eq == null) return null;
        return EquipementDocument.builder()
                .id(eq.getId())
                .type(eq.getType())
                .ip(eq.getIp())
                .statut(eq.getStatut())
                .repartiteurId(eq.getRepartiteurId())
                .build();
    }

    private Equipement toDomain(EquipementDocument eq) {
        if (eq == null) return null;
        return Equipement.builder()
                .id(eq.getId())
                .type(eq.getType())
                .ip(eq.getIp())
                .statut(eq.getStatut())
                .repartiteurId(eq.getRepartiteurId())
                .build();
    }
}
