package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.RepartiteurRequest;
import com.example.telecom_network.dtos.response.RepartiteurResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.Datacenter;
import com.example.telecom_network.models.Repartiteur;
import com.example.telecom_network.repositories.DatacenterRepository;
import com.example.telecom_network.repositories.RepartiteurRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.RepartiteurService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepartiteurServiceImpl implements RepartiteurService {

    private final RepartiteurRepository repartiteurRepository;
    private final DatacenterRepository datacenterRepository;
    private final ActivityLogService activityLogService;

    public RepartiteurServiceImpl(RepartiteurRepository repartiteurRepository,
                                  DatacenterRepository datacenterRepository,
                                  ActivityLogService activityLogService) {
        this.repartiteurRepository = repartiteurRepository;
        this.datacenterRepository = datacenterRepository;
        this.activityLogService = activityLogService;
    }

    private RepartiteurResponse toResponse(Repartiteur r) {
        return RepartiteurResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .datacenterId(r.getDatacenterId())
                .nbPorts(r.getNbPorts())
                .usedPorts(r.getUsedPorts())
                .availablePorts(r.getAvailablePorts())
                .ipAddress(r.getIpAddress())
                .latitude(r.getLatitude())
                .longitude(r.getLongitude())
                .status(r.getStatus())
                .zone(r.getZone())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    @Override
    public RepartiteurResponse createRepartiteur(RepartiteurRequest request) {
        int usedPorts = request.getUsedPorts() != null ? request.getUsedPorts() : 0;
        int totalPorts = request.getNbPorts() != null ? request.getNbPorts() : 0;
        int availablePorts = totalPorts - usedPorts;

        Repartiteur repartiteur = Repartiteur.builder()
                .name(request.getName())
                .datacenterId(request.getDatacenterId())
                .nbPorts(totalPorts)
                .usedPorts(usedPorts)
                .availablePorts(availablePorts)
                .ipAddress(request.getIpAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus())
                .zone(request.getZone())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Connect to Datacenter & Update Used Capacity
        if (repartiteur.getDatacenterId() != null) {
            Datacenter datacenter = datacenterRepository.findById(repartiteur.getDatacenterId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Datacenter not found with ID: " + repartiteur.getDatacenterId()));
            datacenter.setUsedCapacity(datacenter.getUsedCapacity() + 1);
            datacenterRepository.save(datacenter);
        }

        Repartiteur saved = repartiteurRepository.save(repartiteur);

        // Log action
        activityLogService.log("CREATE", "REPARTITEUR", saved.getId(), "Created Repartiteur (OLT): " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public List<RepartiteurResponse> getAllRepartiteurs() {
        return repartiteurRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RepartiteurResponse getRepartiteurById(String id) {
        Repartiteur r = repartiteurRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + id));
        return toResponse(r);
    }

    @Override
    public RepartiteurResponse updateRepartiteur(String id, RepartiteurRequest details) {
        Repartiteur repartiteur = repartiteurRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + id));

        String oldDcId = repartiteur.getDatacenterId();
        String newDcId = details.getDatacenterId();

        // Capacity adjustments
        if (oldDcId != null && !oldDcId.equals(newDcId)) {
            datacenterRepository.findById(oldDcId).ifPresent(dc -> {
                dc.setUsedCapacity(Math.max(0, dc.getUsedCapacity() - 1));
                datacenterRepository.save(dc);
            });
        }
        if (newDcId != null && !newDcId.equals(oldDcId)) {
            Datacenter newDc = datacenterRepository.findById(newDcId)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Datacenter not found with ID: " + newDcId));
            newDc.setUsedCapacity(newDc.getUsedCapacity() + 1);
            datacenterRepository.save(newDc);
        }

        repartiteur.setName(details.getName());
        repartiteur.setDatacenterId(details.getDatacenterId());
        repartiteur.setNbPorts(details.getNbPorts());
        if (details.getUsedPorts() != null) {
            repartiteur.setUsedPorts(details.getUsedPorts());
        }
        if (repartiteur.getNbPorts() != null) {
            repartiteur.setAvailablePorts(repartiteur.getNbPorts() - repartiteur.getUsedPorts());
        }
        repartiteur.setIpAddress(details.getIpAddress());
        repartiteur.setLatitude(details.getLatitude());
        repartiteur.setLongitude(details.getLongitude());
        repartiteur.setStatus(details.getStatus());
        repartiteur.setZone(details.getZone());
        repartiteur.setUpdatedAt(LocalDateTime.now());

        Repartiteur saved = repartiteurRepository.save(repartiteur);

        // Log action
        activityLogService.log("UPDATE", "REPARTITEUR", saved.getId(), "Updated Repartiteur (OLT): " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public void deleteRepartiteur(String id) {
        Repartiteur repartiteur = repartiteurRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + id));

        // Decrement datacenter capacity
        if (repartiteur.getDatacenterId() != null) {
            datacenterRepository.findById(repartiteur.getDatacenterId()).ifPresent(dc -> {
                dc.setUsedCapacity(Math.max(0, dc.getUsedCapacity() - 1));
                datacenterRepository.save(dc);
            });
        }

        repartiteurRepository.delete(repartiteur);

        // Log action
        activityLogService.log("DELETE", "REPARTITEUR", id, "Deleted Repartiteur (OLT): " + repartiteur.getName());
    }

    @Override
    public List<RepartiteurResponse> getRepartiteursByZone(String zone) {
        return repartiteurRepository.findByZone(zone).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
