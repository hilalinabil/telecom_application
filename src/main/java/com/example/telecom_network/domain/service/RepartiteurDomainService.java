package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.Repartiteur;
import com.example.telecom_network.domain.ports.in.ManageRepartiteurUseCase;
import com.example.telecom_network.domain.ports.out.RepartiteurRepositoryPort;
import com.example.telecom_network.domain.ports.out.DatacenterRepositoryPort;
import java.util.List;
import java.util.Optional;

public class RepartiteurDomainService implements ManageRepartiteurUseCase {

    private final RepartiteurRepositoryPort repartiteurRepositoryPort;
    private final DatacenterRepositoryPort datacenterRepositoryPort;

    public RepartiteurDomainService(RepartiteurRepositoryPort repartiteurRepositoryPort, DatacenterRepositoryPort datacenterRepositoryPort) {
        this.repartiteurRepositoryPort = repartiteurRepositoryPort;
        this.datacenterRepositoryPort = datacenterRepositoryPort;
    }

    @Override
    public Repartiteur createRepartiteur(Repartiteur repartiteur) {
        if (repartiteur.getDatacenterId() != null && !datacenterRepositoryPort.existsById(repartiteur.getDatacenterId())) {
            throw new IllegalArgumentException("Datacenter not found with id: " + repartiteur.getDatacenterId());
        }
        return repartiteurRepositoryPort.save(repartiteur);
    }

    @Override
    public Optional<Repartiteur> getRepartiteurById(String id) {
        return repartiteurRepositoryPort.findById(id);
    }

    @Override
    public List<Repartiteur> getAllRepartiteurs() {
        return repartiteurRepositoryPort.findAll();
    }

    @Override
    public Repartiteur updateRepartiteur(String id, Repartiteur repartiteur) {
        if (!repartiteurRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + id);
        }
        if (repartiteur.getDatacenterId() != null && !datacenterRepositoryPort.existsById(repartiteur.getDatacenterId())) {
            throw new IllegalArgumentException("Datacenter not found with id: " + repartiteur.getDatacenterId());
        }
        repartiteur.setId(id);
        return repartiteurRepositoryPort.save(repartiteur);
    }

    @Override
    public void deleteRepartiteur(String id) {
        if (!repartiteurRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + id);
        }
        repartiteurRepositoryPort.deleteById(id);
    }
}
