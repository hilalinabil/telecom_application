package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.Equipement;
import java.util.List;
import java.util.Optional;

public interface EquipementRepositoryPort {
    Equipement save(Equipement equipement);
    Optional<Equipement> findById(String id);
    List<Equipement> findAll();
    void deleteById(String id);
    boolean existsById(String id);
}
