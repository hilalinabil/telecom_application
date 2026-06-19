package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.ClientRequest;
import com.example.telecom_network.dtos.response.ClientResponse;
import java.util.List;

public interface ClientService {
    ClientResponse createClient(ClientRequest request);
    List<ClientResponse> getAllClients();
    ClientResponse getClientById(String id);
    ClientResponse updateClient(String id, ClientRequest details);
    void deleteClient(String id);
}
