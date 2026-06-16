package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.Repartiteur;
import java.util.List;
import java.util.Optional;

public interface RepartiteurRepositoryPort {
    Repartiteur save(Repartiteur repartiteur);
    Optional<Repartiteur> findById(String id);
    List<Repartiteur> findAll();
    void deleteById(String id);
    boolean existsById(String id);
}
