package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.DatacenterRequest;
import com.example.telecom_network.dtos.response.DatacenterResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.Datacenter;
import com.example.telecom_network.repositories.DatacenterRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.DatacenterService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DatacenterServiceImpl implements DatacenterService {

    private final DatacenterRepository datacenterRepository;
    private final ActivityLogService activityLogService;

    public DatacenterServiceImpl(DatacenterRepository datacenterRepository, ActivityLogService activityLogService) {
        this.datacenterRepository = datacenterRepository;
        this.activityLogService = activityLogService;
    }

    private DatacenterResponse toResponse(Datacenter dc) {
        return DatacenterResponse.builder()
                .id(dc.getId())
                .name(dc.getName())
                .location(dc.getLocation())
                .capacity(dc.getCapacity())
                .usedCapacity(dc.getUsedCapacity())
                .latitude(dc.getLatitude())
                .longitude(dc.getLongitude())
                .status(dc.getStatus())
                .description(dc.getDescription())
                .createdAt(dc.getCreatedAt())
                .updatedAt(dc.getUpdatedAt())
                .build();
    }

    @Override
    public DatacenterResponse createDatacenter(DatacenterRequest request) {
        Datacenter datacenter = Datacenter.builder()
                .name(request.getName())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .usedCapacity(0)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Datacenter saved = datacenterRepository.save(datacenter);
        
        // Log action
        activityLogService.log("CREATE", "DATACENTER", saved.getId(), "Created Datacenter: " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public List<DatacenterResponse> getAllDatacenters() {
        return datacenterRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public DatacenterResponse getDatacenterById(String id) {
        Datacenter dc = datacenterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Datacenter not found with ID: " + id));
        return toResponse(dc);
    }

    @Override
    public DatacenterResponse updateDatacenter(String id, DatacenterRequest details) {
        Datacenter dc = datacenterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Datacenter not found with ID: " + id));

        dc.setName(details.getName());
        dc.setLocation(details.getLocation());
        dc.setCapacity(details.getCapacity());
        dc.setLatitude(details.getLatitude());
        dc.setLongitude(details.getLongitude());
        dc.setStatus(details.getStatus());
        dc.setDescription(details.getDescription());
        dc.setUpdatedAt(LocalDateTime.now());

        Datacenter saved = datacenterRepository.save(dc);

        // Log action
        activityLogService.log("UPDATE", "DATACENTER", saved.getId(), "Updated Datacenter: " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public void deleteDatacenter(String id) {
        Datacenter dc = datacenterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Datacenter not found with ID: " + id));
        
        datacenterRepository.delete(dc);

        // Log action
        activityLogService.log("DELETE", "DATACENTER", id, "Deleted Datacenter: " + dc.getName());
    }
}
