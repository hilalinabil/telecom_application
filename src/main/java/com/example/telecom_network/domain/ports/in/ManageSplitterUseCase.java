package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.Splitter;
import java.util.List;
import java.util.Optional;

public interface ManageSplitterUseCase {
    Splitter createSplitter(Splitter splitter);
    Optional<Splitter> getSplitterById(String id);
    List<Splitter> getAllSplitters();
    Splitter updateSplitter(String id, Splitter splitter);
    void deleteSplitter(String id);
}
