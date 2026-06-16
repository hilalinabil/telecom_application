package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.Equipement;
import java.util.List;
import java.util.Optional;

public interface ManageEquipementUseCase {
    Equipement createEquipement(Equipement equipement);
    Optional<Equipement> getEquipementById(String id);
    List<Equipement> getAllEquipements();
    Equipement updateEquipement(String id, Equipement equipement);
    void deleteEquipement(String id);
}
