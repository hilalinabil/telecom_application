package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.Equipement;
import com.example.telecom_network.domain.ports.in.ManageEquipementUseCase;
import com.example.telecom_network.domain.ports.out.EquipementRepositoryPort;
import com.example.telecom_network.domain.ports.out.RepartiteurRepositoryPort;
import java.util.List;
import java.util.Optional;

public class EquipementDomainService implements ManageEquipementUseCase {

    private final EquipementRepositoryPort equipementRepositoryPort;
    private final RepartiteurRepositoryPort repartiteurRepositoryPort;

    public EquipementDomainService(EquipementRepositoryPort equipementRepositoryPort, RepartiteurRepositoryPort repartiteurRepositoryPort) {
        this.equipementRepositoryPort = equipementRepositoryPort;
        this.repartiteurRepositoryPort = repartiteurRepositoryPort;
    }

    @Override
    public Equipement createEquipement(Equipement equipement) {
        if (equipement.getRepartiteurId() != null && !repartiteurRepositoryPort.existsById(equipement.getRepartiteurId())) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + equipement.getRepartiteurId());
        }
        return equipementRepositoryPort.save(equipement);
    }

    @Override
    public Optional<Equipement> getEquipementById(String id) {
        return equipementRepositoryPort.findById(id);
    }

    @Override
    public List<Equipement> getAllEquipements() {
        return equipementRepositoryPort.findAll();
    }

    @Override
    public Equipement updateEquipement(String id, Equipement equipement) {
        if (!equipementRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Equipement not found with id: " + id);
        }
        if (equipement.getRepartiteurId() != null && !repartiteurRepositoryPort.existsById(equipement.getRepartiteurId())) {
            throw new IllegalArgumentException("Repartiteur not found with id: " + equipement.getRepartiteurId());
        }
        equipement.setId(id);
        return equipementRepositoryPort.save(equipement);
    }

    @Override
    public void deleteEquipement(String id) {
        if (!equipementRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Equipement not found with id: " + id);
        }
        equipementRepositoryPort.deleteById(id);
    }
}
