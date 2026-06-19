package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.EquipementRequest;
import com.example.telecom_network.dtos.response.EquipementResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.Equipement;
import com.example.telecom_network.models.Repartiteur;
import com.example.telecom_network.models.enums.NetworkStatus;
import com.example.telecom_network.repositories.EquipementRepository;
import com.example.telecom_network.repositories.RepartiteurRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.EquipementService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipementServiceImpl implements EquipementService {

    private final EquipementRepository equipementRepository;
    private final RepartiteurRepository repartiteurRepository;
    private final ActivityLogService activityLogService;

    public EquipementServiceImpl(EquipementRepository equipementRepository,
                                 RepartiteurRepository repartiteurRepository,
                                 ActivityLogService activityLogService) {
        this.equipementRepository = equipementRepository;
        this.repartiteurRepository = repartiteurRepository;
        this.activityLogService = activityLogService;
    }

    private EquipementResponse toResponse(Equipement e) {
        return EquipementResponse.builder()
                .id(e.getId())
                .name(e.getName())
                .type(e.getType())
                .manufacturer(e.getManufacturer())
                .model(e.getModel())
                .serialNumber(e.getSerialNumber())
                .ipAddress(e.getIpAddress())
                .macAddress(e.getMacAddress())
                .firmwareVersion(e.getFirmwareVersion())
                .status(e.getStatus())
                .repartiteurId(e.getRepartiteurId())
                .installationDate(e.getInstallationDate())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    @Override
    public EquipementResponse createEquipement(EquipementRequest request) {
        if (request.getRepartiteurId() != null) {
            repartiteurRepository.findById(request.getRepartiteurId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + request.getRepartiteurId()));
        }

        LocalDateTime instDate = request.getInstallationDate() != null ? request.getInstallationDate() : LocalDateTime.now();

        Equipement equipement = Equipement.builder()
                .name(request.getName())
                .type(request.getType())
                .manufacturer(request.getManufacturer())
                .model(request.getModel())
                .serialNumber(request.getSerialNumber())
                .ipAddress(request.getIpAddress())
                .macAddress(request.getMacAddress())
                .firmwareVersion(request.getFirmwareVersion())
                .status(request.getStatus())
                .repartiteurId(request.getRepartiteurId())
                .installationDate(instDate)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Equipement saved = equipementRepository.save(equipement);

        // Log action
        activityLogService.log("CREATE", "EQUIPEMENT", saved.getId(), "Created Equipement: " + saved.getName() + " (" + saved.getType() + ")");

        return toResponse(saved);
    }

    @Override
    public List<EquipementResponse> getAllEquipements() {
        return equipementRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EquipementResponse getEquipementById(String id) {
        Equipement e = equipementRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipement not found with ID: " + id));
        return toResponse(e);
    }

    @Override
    public EquipementResponse updateEquipement(String id, EquipementRequest details) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipement not found with ID: " + id));

        if (details.getRepartiteurId() != null) {
            repartiteurRepository.findById(details.getRepartiteurId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + details.getRepartiteurId()));
        }

        equipement.setName(details.getName());
        equipement.setType(details.getType());
        equipement.setManufacturer(details.getManufacturer());
        equipement.setModel(details.getModel());
        equipement.setSerialNumber(details.getSerialNumber());
        equipement.setIpAddress(details.getIpAddress());
        equipement.setMacAddress(details.getMacAddress());
        equipement.setFirmwareVersion(details.getFirmwareVersion());
        equipement.setStatus(details.getStatus());
        equipement.setRepartiteurId(details.getRepartiteurId());
        if (details.getInstallationDate() != null) {
            equipement.setInstallationDate(details.getInstallationDate());
        }
        equipement.setUpdatedAt(LocalDateTime.now());

        Equipement saved = equipementRepository.save(equipement);

        // Log action
        activityLogService.log("UPDATE", "EQUIPEMENT", saved.getId(), "Updated Equipement: " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public void deleteEquipement(String id) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipement not found with ID: " + id));
        
        equipementRepository.delete(equipement);

        // Log action
        activityLogService.log("DELETE", "EQUIPEMENT", id, "Deleted Equipement: " + equipement.getName());
    }

    @Override
    public List<EquipementResponse> getEquipementsByStatus(NetworkStatus status) {
        return equipementRepository.findByStatus(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EquipementResponse> getEquipementsByZone(String zone) {
        List<Repartiteur> repartiteurs = repartiteurRepository.findByZone(zone);
        if (repartiteurs.isEmpty()) {
            return new ArrayList<>();
        }
        List<String> repartiteurIds = repartiteurs.stream()
                .map(Repartiteur::getId)
                .collect(Collectors.toList());
        return equipementRepository.findByRepartiteurIdIn(repartiteurIds).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
