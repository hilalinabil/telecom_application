package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.Datacenter;
import java.util.List;
import java.util.Optional;

public interface DatacenterRepositoryPort {
    Datacenter save(Datacenter datacenter);
    Optional<Datacenter> findById(String id);
    List<Datacenter> findAll();
    void deleteById(String id);
    boolean existsById(String id);
}
