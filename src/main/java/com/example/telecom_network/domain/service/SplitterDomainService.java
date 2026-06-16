package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.Splitter;
import com.example.telecom_network.domain.ports.in.ManageSplitterUseCase;
import com.example.telecom_network.domain.ports.out.SplitterRepositoryPort;
import com.example.telecom_network.domain.ports.out.RepartiteurRepositoryPort;
import java.util.List;
import java.util.Optional;

public class SplitterDomainService implements ManageSplitterUseCase {

    private final SplitterRepositoryPort splitterRepositoryPort;
    private final RepartiteurRepositoryPort repartiteurRepositoryPort;

    public SplitterDomainService(SplitterRepositoryPort splitterRepositoryPort, RepartiteurRepositoryPort repartiteurRepositoryPort) {
        this.splitterRepositoryPort = splitterRepositoryPort;
        this.repartiteurRepositoryPort = repartiteurRepositoryPort;
    }

    @Override
    public Splitter createSplitter(Splitter splitter) {
        if (splitter.getRepartiteurId() != null && !repartiteurRepositoryPort.existsById(splitter.getRepartiteurId())) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + splitter.getRepartiteurId());
        }
        return splitterRepositoryPort.save(splitter);
    }

    @Override
    public Optional<Splitter> getSplitterById(String id) {
        return splitterRepositoryPort.findById(id);
    }

    @Override
    public List<Splitter> getAllSplitters() {
        return splitterRepositoryPort.findAll();
    }

    @Override
    public Splitter updateSplitter(String id, Splitter splitter) {
        if (!splitterRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Splitter not found with id: " + id);
        }
        if (splitter.getRepartiteurId() != null && !repartiteurRepositoryPort.existsById(splitter.getRepartiteurId())) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + splitter.getRepartiteurId());
        }
        splitter.setId(id);
        return splitterRepositoryPort.save(splitter);
    }

    @Override
    public void deleteSplitter(String id) {
        if (!splitterRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Splitter not found with id: " + id);
        }
        splitterRepositoryPort.deleteById(id);
    }
}
