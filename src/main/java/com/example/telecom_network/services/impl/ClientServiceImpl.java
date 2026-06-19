package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.ClientRequest;
import com.example.telecom_network.dtos.response.ClientResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.Client;
import com.example.telecom_network.models.ClientBox;
import com.example.telecom_network.repositories.ClientBoxRepository;
import com.example.telecom_network.repositories.ClientRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final ClientBoxRepository clientBoxRepository;
    private final ActivityLogService activityLogService;

    public ClientServiceImpl(ClientRepository clientRepository,
                             ClientBoxRepository clientBoxRepository,
                             ActivityLogService activityLogService) {
        this.clientRepository = clientRepository;
        this.clientBoxRepository = clientBoxRepository;
        this.activityLogService = activityLogService;
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .customerNumber(client.getCustomerNumber())
                .fullName(client.getFullName())
                .phone(client.getPhone())
                .email(client.getEmail())
                .address(client.getAddress())
                .clientBoxId(client.getClientBoxId())
                .assignedPort(client.getAssignedPort())
                .subscriptionType(client.getSubscriptionType())
                .status(client.getStatus())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }

    @Override
    public ClientResponse createClient(ClientRequest request) {
        if (request.getCustomerNumber() != null && clientRepository.existsByCustomerNumber(request.getCustomerNumber())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Customer number already exists: " + request.getCustomerNumber());
        }

        // Port capacity management: Assign to client box
        if (request.getClientBoxId() != null) {
            ClientBox box = clientBoxRepository.findById(request.getClientBoxId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ClientBox not found with ID: " + request.getClientBoxId()));

            if (box.getAvailablePorts() <= 0) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "ClientBox has no available ports.");
            }

            box.setUsedPorts(box.getUsedPorts() + 1);
            box.setAvailablePorts(box.getAvailablePorts() - 1);
            clientBoxRepository.save(box);
        }

        Client client = Client.builder()
                .customerNumber(request.getCustomerNumber())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .address(request.getAddress())
                .clientBoxId(request.getClientBoxId())
                .assignedPort(request.getAssignedPort())
                .subscriptionType(request.getSubscriptionType())
                .status(request.getStatus())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Client saved = clientRepository.save(client);

        // Log action
        activityLogService.log("CREATE", "CLIENT", saved.getId(), "Created Client record: " + saved.getFullName() + " (" + saved.getCustomerNumber() + ")");

        return toResponse(saved);
    }

    @Override
    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponse getClientById(String id) {
        Client c = clientRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found with ID: " + id));
        return toResponse(c);
    }

    @Override
    public ClientResponse updateClient(String id, ClientRequest details) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found with ID: " + id));

        String oldBoxId = client.getClientBoxId();
        String newBoxId = details.getClientBoxId();

        // Unique validation for customerNumber
        if (details.getCustomerNumber() != null && !details.getCustomerNumber().equals(client.getCustomerNumber())) {
            if (clientRepository.existsByCustomerNumber(details.getCustomerNumber())) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Customer number already exists: " + details.getCustomerNumber());
            }
        }

        // Port capacity management: box changes
        if (oldBoxId != null && !oldBoxId.equals(newBoxId)) {
            clientBoxRepository.findById(oldBoxId).ifPresent(box -> {
                box.setUsedPorts(Math.max(0, box.getUsedPorts() - 1));
                box.setAvailablePorts(box.getTotalPorts() - box.getUsedPorts());
                clientBoxRepository.save(box);
            });
        }
        if (newBoxId != null && !newBoxId.equals(oldBoxId)) {
            ClientBox newBox = clientBoxRepository.findById(newBoxId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ClientBox not found with ID: " + newBoxId));

            if (newBox.getAvailablePorts() <= 0) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Selected ClientBox has no available ports.");
            }

            newBox.setUsedPorts(newBox.getUsedPorts() + 1);
            newBox.setAvailablePorts(newBox.getAvailablePorts() - 1);
            clientBoxRepository.save(newBox);
        }

        client.setCustomerNumber(details.getCustomerNumber());
        client.setFullName(details.getFullName());
        client.setPhone(details.getPhone());
        client.setEmail(details.getEmail());
        client.setAddress(details.getAddress());
        client.setClientBoxId(details.getClientBoxId());
        client.setAssignedPort(details.getAssignedPort());
        client.setSubscriptionType(details.getSubscriptionType());
        client.setStatus(details.getStatus());
        client.setUpdatedAt(LocalDateTime.now());

        Client saved = clientRepository.save(client);

        // Log action
        activityLogService.log("UPDATE", "CLIENT", saved.getId(), "Updated Client record: " + saved.getFullName());

        return toResponse(saved);
    }

    @Override
    public void deleteClient(String id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Client not found with ID: " + id));

        // Restore ports in box
        if (client.getClientBoxId() != null) {
            clientBoxRepository.findById(client.getClientBoxId()).ifPresent(box -> {
                box.setUsedPorts(Math.max(0, box.getUsedPorts() - 1));
                box.setAvailablePorts(box.getTotalPorts() - box.getUsedPorts());
                clientBoxRepository.save(box);
            });
        }

        clientRepository.delete(client);

        // Log action
        activityLogService.log("DELETE", "CLIENT", id, "Deleted Client record: " + client.getFullName());
    }
}
