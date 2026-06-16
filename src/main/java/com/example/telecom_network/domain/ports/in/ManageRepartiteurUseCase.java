package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.Repartiteur;
import java.util.List;
import java.util.Optional;

public interface ManageRepartiteurUseCase {
    Repartiteur createRepartiteur(Repartiteur repartiteur);
    Optional<Repartiteur> getRepartiteurById(String id);
    List<Repartiteur> getAllRepartiteurs();
    Repartiteur updateRepartiteur(String id, Repartiteur repartiteur);
    void deleteRepartiteur(String id);
}
