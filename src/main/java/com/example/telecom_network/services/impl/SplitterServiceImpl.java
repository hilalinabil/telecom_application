package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.SplitterRequest;
import com.example.telecom_network.dtos.response.SplitterResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.Splitter;
import com.example.telecom_network.repositories.RepartiteurRepository;
import com.example.telecom_network.repositories.SplitterRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.SplitterService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SplitterServiceImpl implements SplitterService {

    private final SplitterRepository splitterRepository;
    private final RepartiteurRepository repartiteurRepository;
    private final ActivityLogService activityLogService;

    public SplitterServiceImpl(SplitterRepository splitterRepository,
                               RepartiteurRepository repartiteurRepository,
                               ActivityLogService activityLogService) {
        this.splitterRepository = splitterRepository;
        this.repartiteurRepository = repartiteurRepository;
        this.activityLogService = activityLogService;
    }

    private void configureOutputs(Splitter splitter) {
        if (splitter.getRatio() != null) {
            int outputs = 8;
            switch (splitter.getRatio()) {
                case R_1_8:
                    outputs = 8;
                    break;
                case R_1_16:
                    outputs = 16;
                    break;
                case R_1_32:
                    outputs = 32;
                    break;
            }
            splitter.setNbOutputs(outputs);
        } else if (splitter.getNbOutputs() == null) {
            splitter.setNbOutputs(8);
        }

        if (splitter.getUsedOutputs() == null) {
            splitter.setUsedOutputs(0);
        }
        splitter.setAvailableOutputs(splitter.getNbOutputs() - splitter.getUsedOutputs());
    }

    private SplitterResponse toResponse(Splitter s) {
        return SplitterResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .ratio(s.getRatio())
                .nbOutputs(s.getNbOutputs())
                .usedOutputs(s.getUsedOutputs())
                .availableOutputs(s.getAvailableOutputs())
                .repartiteurId(s.getRepartiteurId())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .status(s.getStatus())
                .installationDate(s.getInstallationDate())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }

    @Override
    public SplitterResponse createSplitter(SplitterRequest request) {
        if (request.getRepartiteurId() != null) {
            repartiteurRepository.findById(request.getRepartiteurId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + request.getRepartiteurId()));
        }

        Splitter splitter = Splitter.builder()
                .name(request.getName())
                .ratio(request.getRatio())
                .nbOutputs(request.getNbOutputs())
                .usedOutputs(request.getUsedOutputs())
                .repartiteurId(request.getRepartiteurId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus())
                .installationDate(request.getInstallationDate() != null ? request.getInstallationDate() : LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        configureOutputs(splitter);
        Splitter saved = splitterRepository.save(splitter);

        // Log action
        activityLogService.log("CREATE", "SPLITTER", saved.getId(), "Created Splitter: " + saved.getName() + " (" + saved.getRatio() + ")");

        return toResponse(saved);
    }

    @Override
    public List<SplitterResponse> getAllSplitters() {
        return splitterRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SplitterResponse getSplitterById(String id) {
        Splitter s = splitterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Splitter not found with ID: " + id));
        return toResponse(s);
    }

    @Override
    public SplitterResponse updateSplitter(String id, SplitterRequest details) {
        Splitter splitter = splitterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Splitter not found with ID: " + id));

        if (details.getRepartiteurId() != null) {
            repartiteurRepository.findById(details.getRepartiteurId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Repartiteur not found with ID: " + details.getRepartiteurId()));
        }

        splitter.setName(details.getName());
        splitter.setRatio(details.getRatio());
        splitter.setRepartiteurId(details.getRepartiteurId());
        splitter.setLatitude(details.getLatitude());
        splitter.setLongitude(details.getLongitude());
        splitter.setStatus(details.getStatus());
        if (details.getInstallationDate() != null) {
            splitter.setInstallationDate(details.getInstallationDate());
        }
        
        if (details.getUsedOutputs() != null) {
            splitter.setUsedOutputs(details.getUsedOutputs());
        }
        configureOutputs(splitter);
        splitter.setUpdatedAt(LocalDateTime.now());

        Splitter saved = splitterRepository.save(splitter);

        // Log action
        activityLogService.log("UPDATE", "SPLITTER", saved.getId(), "Updated Splitter: " + saved.getName());

        return toResponse(saved);
    }

    @Override
    public void deleteSplitter(String id) {
        Splitter splitter = splitterRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Splitter not found with ID: " + id));
        
        splitterRepository.delete(splitter);

        // Log action
        activityLogService.log("DELETE", "SPLITTER", id, "Deleted Splitter: " + splitter.getName());
    }
}
