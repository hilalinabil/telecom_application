package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.FibrePathRequest;
import com.example.telecom_network.dtos.response.FibrePathResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.FibrePath;
import com.example.telecom_network.models.enums.DestinationType;
import com.example.telecom_network.models.enums.FibreStatus;
import com.example.telecom_network.models.enums.SourceType;
import com.example.telecom_network.repositories.*;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.FibrePathService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FibrePathServiceImpl implements FibrePathService {

    private final FibrePathRepository fibrePathRepository;
    private final DatacenterRepository datacenterRepository;
    private final RepartiteurRepository repartiteurRepository;
    private final SplitterRepository splitterRepository;
    private final ClientBoxRepository clientBoxRepository;
    private final ActivityLogService activityLogService;

    public FibrePathServiceImpl(FibrePathRepository fibrePathRepository,
                                DatacenterRepository datacenterRepository,
                                RepartiteurRepository repartiteurRepository,
                                SplitterRepository splitterRepository,
                                ClientBoxRepository clientBoxRepository,
                                ActivityLogService activityLogService) {
        this.fibrePathRepository = fibrePathRepository;
        this.datacenterRepository = datacenterRepository;
        this.repartiteurRepository = repartiteurRepository;
        this.splitterRepository = splitterRepository;
        this.clientBoxRepository = clientBoxRepository;
        this.activityLogService = activityLogService;
    }

    private void validateFibrePath(FibrePath path) {
        SourceType sType = path.getSourceType();
        DestinationType dType = path.getDestinationType();

        if (sType == null || dType == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Source type and destination type are required.");
        }

        if (path.getSourceId() == null || path.getDestinationId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Source ID and destination ID are required.");
        }

        if (path.getSourceId().equals(path.getDestinationId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Source and destination cannot be the same entity.");
        }

        // Hierarchy rule validation
        boolean isValid = false;
        if (sType == SourceType.DATACENTER && dType == DestinationType.REPARTITEUR) {
            isValid = true;
        } else if (sType == SourceType.REPARTITEUR && dType == DestinationType.SPLITTER) {
            isValid = true;
        } else if (sType == SourceType.SPLITTER && dType == DestinationType.CLIENTBOX) {
            isValid = true;
        }

        if (!isValid) {
            throw new ApiException(HttpStatus.BAD_REQUEST, String.format(
                    "Invalid hierarchy connection: %s cannot connect to %s. Rules: DATACENTER -> REPARTITEUR, REPARTITEUR -> SPLITTER, SPLITTER -> CLIENTBOX",
                    sType, dType));
        }

        // Verify that source entity exists
        switch (sType) {
            case DATACENTER:
                if (!datacenterRepository.existsById(path.getSourceId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Source Datacenter not found with ID: " + path.getSourceId());
                }
                break;
            case REPARTITEUR:
                if (!repartiteurRepository.existsById(path.getSourceId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Source Repartiteur (OLT) not found with ID: " + path.getSourceId());
                }
                break;
            case SPLITTER:
                if (!splitterRepository.existsById(path.getSourceId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Source Splitter not found with ID: " + path.getSourceId());
                }
                break;
        }

        // Verify that destination entity exists
        switch (dType) {
            case REPARTITEUR:
                if (!repartiteurRepository.existsById(path.getDestinationId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Destination Repartiteur (OLT) not found with ID: " + path.getDestinationId());
                }
                break;
            case SPLITTER:
                if (!splitterRepository.existsById(path.getDestinationId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Destination Splitter not found with ID: " + path.getDestinationId());
                }
                break;
            case CLIENTBOX:
                if (!clientBoxRepository.existsById(path.getDestinationId())) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "Destination ClientBox not found with ID: " + path.getDestinationId());
                }
                break;
        }

        // Calculate available cores
        if (path.getCoreCount() == null) {
            path.setCoreCount(12);
        }
        if (path.getUsedCores() == null) {
            path.setUsedCores(0);
        }
        path.setAvailableCores(path.getCoreCount() - path.getUsedCores());
    }

    private FibrePathResponse toResponse(FibrePath path) {
        return FibrePathResponse.builder()
                .id(path.getId())
                .sourceType(path.getSourceType())
                .sourceId(path.getSourceId())
                .destinationType(path.getDestinationType())
                .destinationId(path.getDestinationId())
                .fibreType(path.getFibreType())
                .cableReference(path.getCableReference())
                .lengthMeters(path.getLengthMeters())
                .coreCount(path.getCoreCount())
                .usedCores(path.getUsedCores())
                .availableCores(path.getAvailableCores())
                .status(path.getStatus())
                .installationDate(path.getInstallationDate())
                .lastMaintenance(path.getLastMaintenance())
                .createdAt(path.getCreatedAt())
                .updatedAt(path.getUpdatedAt())
                .build();
    }

    @Override
    public FibrePathResponse createFibrePath(FibrePathRequest request) {
        FibrePath path = FibrePath.builder()
                .sourceType(request.getSourceType())
                .sourceId(request.getSourceId())
                .destinationType(request.getDestinationType())
                .destinationId(request.getDestinationId())
                .fibreType(request.getFibreType())
                .cableReference(request.getCableReference())
                .lengthMeters(request.getLengthMeters())
                .coreCount(request.getCoreCount())
                .usedCores(request.getUsedCores())
                .status(request.getStatus())
                .installationDate(request.getInstallationDate() != null ? request.getInstallationDate() : LocalDateTime.now())
                .lastMaintenance(request.getLastMaintenance())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        validateFibrePath(path);
        FibrePath saved = fibrePathRepository.save(path);

        // Log action
        activityLogService.log("CREATE", "FIBREPATH", saved.getId(), "Created Fibre Path: " + saved.getCableReference() + " (" + saved.getSourceType() + " -> " + saved.getDestinationType() + ")");

        return toResponse(saved);
    }

    @Override
    public List<FibrePathResponse> getAllFibrePaths() {
        return fibrePathRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FibrePathResponse getFibrePathById(String id) {
        FibrePath path = fibrePathRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FibrePath not found with ID: " + id));
        return toResponse(path);
    }

    @Override
    public FibrePathResponse updateFibrePath(String id, FibrePathRequest details) {
        FibrePath path = fibrePathRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FibrePath not found with ID: " + id));

        path.setSourceType(details.getSourceType());
        path.setSourceId(details.getSourceId());
        path.setDestinationType(details.getDestinationType());
        path.setDestinationId(details.getDestinationId());
        path.setFibreType(details.getFibreType());
        path.setCableReference(details.getCableReference());
        path.setLengthMeters(details.getLengthMeters());
        path.setCoreCount(details.getCoreCount());
        path.setUsedCores(details.getUsedCores());
        path.setStatus(details.getStatus());
        if (details.getInstallationDate() != null) {
            path.setInstallationDate(details.getInstallationDate());
        }
        path.setLastMaintenance(details.getLastMaintenance());

        validateFibrePath(path);
        path.setUpdatedAt(LocalDateTime.now());

        FibrePath saved = fibrePathRepository.save(path);

        // Log action
        activityLogService.log("UPDATE", "FIBREPATH", saved.getId(), "Updated Fibre Path: " + saved.getCableReference());

        return toResponse(saved);
    }

    @Override
    public void deleteFibrePath(String id) {
        FibrePath path = fibrePathRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FibrePath not found with ID: " + id));
        
        fibrePathRepository.delete(path);

        // Log action
        activityLogService.log("DELETE", "FIBREPATH", id, "Deleted Fibre Path: " + path.getCableReference());
    }

    @Override
    public List<FibrePathResponse> getFibrePathsByStatus(FibreStatus status) {
        return fibrePathRepository.findByStatus(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
