package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.ClientBoxRequest;
import com.example.telecom_network.dtos.response.ClientBoxResponse;
import java.util.List;

public interface ClientBoxService {
    ClientBoxResponse createClientBox(ClientBoxRequest request);
    List<ClientBoxResponse> getAllClientBoxes();
    ClientBoxResponse getClientBoxById(String id);
    ClientBoxResponse updateClientBox(String id, ClientBoxRequest details);
    void deleteClientBox(String id);
    List<ClientBoxResponse> getClientBoxesByZone(String zone);
}
