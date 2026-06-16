package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.BoiteClient;
import com.example.telecom_network.domain.ports.in.ManageBoiteClientUseCase;
import com.example.telecom_network.domain.ports.out.BoiteClientRepositoryPort;
import com.example.telecom_network.domain.ports.out.SplitterRepositoryPort;
import java.util.List;
import java.util.Optional;

public class BoiteClientDomainService implements ManageBoiteClientUseCase {

    private final BoiteClientRepositoryPort boiteClientRepositoryPort;
    private final SplitterRepositoryPort splitterRepositoryPort;

    public BoiteClientDomainService(BoiteClientRepositoryPort boiteClientRepositoryPort, SplitterRepositoryPort splitterRepositoryPort) {
        this.boiteClientRepositoryPort = boiteClientRepositoryPort;
        this.splitterRepositoryPort = splitterRepositoryPort;
    }

    @Override
    public BoiteClient createBoiteClient(BoiteClient boiteClient) {
        if (boiteClient.getSplitterId() != null && !splitterRepositoryPort.existsById(boiteClient.getSplitterId())) {
            throw new IllegalArgumentException("Splitter not found with id: " + boiteClient.getSplitterId());
        }
        return boiteClientRepositoryPort.save(boiteClient);
    }

    @Override
    public Optional<BoiteClient> getBoiteClientById(String id) {
        return boiteClientRepositoryPort.findById(id);
    }

    @Override
    public List<BoiteClient> getAllBoiteClients() {
        return boiteClientRepositoryPort.findAll();
    }

    @Override
    public BoiteClient updateBoiteClient(String id, BoiteClient boiteClient) {
        if (!boiteClientRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("BoiteClient not found with id: " + id);
        }
        if (boiteClient.getSplitterId() != null && !splitterRepositoryPort.existsById(boiteClient.getSplitterId())) {
            throw new IllegalArgumentException("Splitter not found with id: " + boiteClient.getSplitterId());
        }
        boiteClient.setId(id);
        return boiteClientRepositoryPort.save(boiteClient);
    }

    @Override
    public void deleteBoiteClient(String id) {
        if (!boiteClientRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("BoiteClient not found with id: " + id);
        }
        boiteClientRepositoryPort.deleteById(id);
    }
}
