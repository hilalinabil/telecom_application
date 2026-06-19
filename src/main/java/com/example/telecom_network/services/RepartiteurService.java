package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.RepartiteurRequest;
import com.example.telecom_network.dtos.response.RepartiteurResponse;
import java.util.List;

public interface RepartiteurService {
    RepartiteurResponse createRepartiteur(RepartiteurRequest request);
    List<RepartiteurResponse> getAllRepartiteurs();
    RepartiteurResponse getRepartiteurById(String id);
    RepartiteurResponse updateRepartiteur(String id, RepartiteurRequest details);
    void deleteRepartiteur(String id);
    List<RepartiteurResponse> getRepartiteursByZone(String zone);
}
