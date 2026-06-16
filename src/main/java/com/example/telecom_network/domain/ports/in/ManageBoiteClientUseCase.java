package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.BoiteClient;
import java.util.List;
import java.util.Optional;

public interface ManageBoiteClientUseCase {
    BoiteClient createBoiteClient(BoiteClient boiteClient);
    Optional<BoiteClient> getBoiteClientById(String id);
    List<BoiteClient> getAllBoiteClients();
    BoiteClient updateBoiteClient(String id, BoiteClient boiteClient);
    void deleteBoiteClient(String id);
}
