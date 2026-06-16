package com.example.telecom_network.adapters.out.persistence.adapter;

import com.example.telecom_network.adapters.out.persistence.entity.CheminDocument;
import com.example.telecom_network.adapters.out.persistence.entity.GpsPointDocument;
import com.example.telecom_network.adapters.out.persistence.repository.MongoCheminRepository;
import com.example.telecom_network.domain.model.Chemin;
import com.example.telecom_network.domain.model.GpsPoint;
import com.example.telecom_network.domain.ports.out.CheminRepositoryPort;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CheminPersistenceAdapter implements CheminRepositoryPort {

    private final MongoCheminRepository repository;

    public CheminPersistenceAdapter(MongoCheminRepository repository) {
        this.repository = repository;
    }

    @Override
    public Chemin save(Chemin ch) {
        CheminDocument doc = toDocument(ch);
        CheminDocument saved = repository.save(doc);
        return toDomain(saved);
    }

    @Override
    public Optional<Chemin> findById(String id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Chemin> findAll() {
        return repository.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public void deleteAll() {
        repository.deleteAll();
    }

    private CheminDocument toDocument(Chemin ch) {
        if (ch == null) return null;
        List<GpsPointDocument> gpsDocs = null;
        if (ch.getGpsPoints() != null) {
            gpsDocs = ch.getGpsPoints().stream()
                    .map(p -> GpsPointDocument.builder()
                            .latitude(p.getLatitude())
                            .longitude(p.getLongitude())
                            .num(p.getNum())
                            .build())
                    .collect(Collectors.toList());
        }
        return CheminDocument.builder()
                .id(ch.getId())
                .source(ch.getSource())
                .destination(ch.getDestination())
                .longueur(ch.getLongueur())
                .statut(ch.getStatut())
                .gpsPoints(gpsDocs)
                .build();
    }

    private Chemin toDomain(CheminDocument ch) {
        if (ch == null) return null;
        List<GpsPoint> gpsDomain = null;
        if (ch.getGpsPoints() != null) {
            gpsDomain = ch.getGpsPoints().stream()
                    .map(p -> GpsPoint.builder()
                            .latitude(p.getLatitude())
                            .longitude(p.getLongitude())
                            .num(p.getNum())
                            .build())
                    .collect(Collectors.toList());
        }
        return Chemin.builder()
                .id(ch.getId())
                .source(ch.getSource())
                .destination(ch.getDestination())
                .longueur(ch.getLongueur())
                .statut(ch.getStatut())
                .gpsPoints(gpsDomain)
                .build();
    }
}
