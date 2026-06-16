package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.BoiteClient;
import java.util.List;
import java.util.Optional;

public interface BoiteClientRepositoryPort {
    BoiteClient save(BoiteClient boiteClient);
    Optional<BoiteClient> findById(String id);
    List<BoiteClient> findAll();
    void deleteById(String id);
    boolean existsById(String id);
}
