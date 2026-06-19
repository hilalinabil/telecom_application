package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.ClientBoxRequest;
import com.example.telecom_network.dtos.response.ClientBoxResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.ClientBox;
import com.example.telecom_network.repositories.ClientBoxRepository;
import com.example.telecom_network.repositories.SplitterRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.ClientBoxService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientBoxServiceImpl implements ClientBoxService {

    private final ClientBoxRepository clientBoxRepository;
    private final SplitterRepository splitterRepository;
    private final ActivityLogService activityLogService;

    public ClientBoxServiceImpl(ClientBoxRepository clientBoxRepository,
                                SplitterRepository splitterRepository,
                                ActivityLogService activityLogService) {
        this.clientBoxRepository = clientBoxRepository;
        this.splitterRepository = splitterRepository;
        this.activityLogService = activityLogService;
    }

    private void configurePorts(ClientBox box) {
        if (box.getType() != null) {
            int ports = 16;
            switch (box.getType()) {
                case FO_16:
                    ports = 16;
                    break;
                case FO_24:
                    ports = 24;
                    break;
            }
            box.setTotalPorts(ports);
        } else if (box.getTotalPorts() == null) {
            box.setTotalPorts(16);
        }

        if (box.getUsedPorts() == null) {
            box.setUsedPorts(0);
        }
        box.setAvailablePorts(box.getTotalPorts() - box.getUsedPorts());
    }

    private ClientBoxResponse toResponse(ClientBox box) {
        return ClientBoxResponse.builder()
                .id(box.getId())
                .name(box.getName())
                .type(box.getType())
                .splitterId(box.getSplitterId())
                .totalPorts(box.getTotalPorts())
                .usedPorts(box.getUsedPorts())
                .availablePorts(box.getAvailablePorts())
                .latitude(box.getLatitude())
                .longitude(box.getLongitude())
                .status(box.getStatus())
                .zone(box.getZone())
                .installationDate(box.getInstallationDate())
                .createdAt(box.getCreatedAt())
                .updatedAt(box.getUpdatedAt())
                .build();
    }

    @Override
    public ClientBoxResponse createClientBox(ClientBoxRequest request) {
        if (request.getSplitterId() != null) {
            splitterRepository.findById(request.getSplitterId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Splitter not found with ID: " + request.getSplitterId()));
        }

        ClientBox clientBox = ClientBox.builder()
                .name(request.getName())
                .type(request.getType())
                .splitterId(request.getSplitterId())
                .totalPorts(request.getTotalPorts())
                .usedPorts(request.getUsedPorts())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus())
                .zone(request.getZone())
                .installationDate(request.getInstallationDate() != null ? request.getInstallationDate() : LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        configurePorts(clientBox);
        ClientBox saved = clientBoxRepository.save(clientBox);

        // Log action
        activityLogService.log("CREATE", "CLIENTBOX", saved.getId(), "Created Client Box: " + saved.getName() + " (" + saved.getType() + ")");

        return toResponse(saved);
    }

    @Override
    public List<ClientBoxResponse> getAllClientBoxes() {
        return clientBoxRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClientBoxResponse getClientBoxById(String id) {
        ClientBox box = clientBoxRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ClientBox not found with ID: " + id));
        return toResponse(box);
    }

    @Override
    public ClientBoxResponse updateClientBox(String id, ClientBoxRequest details) {
        ClientBox box = clientBoxRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ClientBox not found with ID: " + id));

        if (details.getSplitterId() != null) {
            splitterRepository.findById(details.getSplitterId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Splitter not found with ID: " + details.getSplitterId()));
        }

        box.setName(details.getName());
        box.setType(details.getType());
        box.setSplitterId(details.getSplitterId());
        box.setLatitude(details.getLatitude());
        box.setLongitude(details.getLongitude());
        box.setStatus(details.getStatus());
        box.setZone(details.getZone());
        if (details.getInstallationDate() != null) {
            box.setInstallationDate(details.getInstallationDate());
        }

        if (details.getUsedPorts() != null) {
            box.setUsedPorts(details.getUsedPorts());
        }
        configurePorts(box);
        box.setUpdatedAt(LocalDateTime.now());

        ClientBox saved = clientBoxRepository.save(box);

        // Log action
        activityLogService.log("UPDATE", "CLIENTBOX", saved.getId(), "Updated Client Box: " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public void deleteClientBox(String id) {
        ClientBox box = clientBoxRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "ClientBox not found with ID: " + id));
        
        clientBoxRepository.delete(box);

        // Log action
        activityLogService.log("DELETE", "CLIENTBOX", id, "Deleted Client Box: " + box.getName());
    }

    @Override
    public List<ClientBoxResponse> getClientBoxesByZone(String zone) {
        return clientBoxRepository.findByZone(zone).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
