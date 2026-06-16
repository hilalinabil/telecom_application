package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.Chemin;
import java.util.List;
import java.util.Optional;

public interface CheminRepositoryPort {
    Chemin save(Chemin chemin);
    Optional<Chemin> findById(String id);
    List<Chemin> findAll();
    void deleteById(String id);
    void deleteAll();
}
