package com.example.telecom_network.domain.ports.out;

import com.example.telecom_network.domain.model.Splitter;
import java.util.List;
import java.util.Optional;

public interface SplitterRepositoryPort {
    Splitter save(Splitter splitter);
    Optional<Splitter> findById(String id);
    List<Splitter> findAll();
    void deleteById(String id);
    boolean existsById(String id);
}
