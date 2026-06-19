package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.EquipementRequest;
import com.example.telecom_network.dtos.response.EquipementResponse;
import com.example.telecom_network.models.enums.NetworkStatus;
import java.util.List;

public interface EquipementService {
    EquipementResponse createEquipement(EquipementRequest request);
    List<EquipementResponse> getAllEquipements();
    EquipementResponse getEquipementById(String id);
    EquipementResponse updateEquipement(String id, EquipementRequest details);
    void deleteEquipement(String id);
    List<EquipementResponse> getEquipementsByStatus(NetworkStatus status);
    List<EquipementResponse> getEquipementsByZone(String zone);
}
