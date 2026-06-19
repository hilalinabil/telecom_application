package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.GeoPointRequest;
import com.example.telecom_network.dtos.response.GeoPointResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.GeoPoint;
import com.example.telecom_network.repositories.FibrePathRepository;
import com.example.telecom_network.repositories.GeoPointRepository;
import com.example.telecom_network.services.ActivityLogService;
import com.example.telecom_network.services.GeoPointService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeoPointServiceImpl implements GeoPointService {

    private final GeoPointRepository geoPointRepository;
    private final FibrePathRepository fibrePathRepository;
    private final ActivityLogService activityLogService;

    public GeoPointServiceImpl(GeoPointRepository geoPointRepository,
                               FibrePathRepository fibrePathRepository,
                               ActivityLogService activityLogService) {
        this.geoPointRepository = geoPointRepository;
        this.fibrePathRepository = fibrePathRepository;
        this.activityLogService = activityLogService;
    }

    private GeoPointResponse toResponse(GeoPoint point) {
        return GeoPointResponse.builder()
                .id(point.getId())
                .pathId(point.getPathId())
                .pointNumber(point.getPointNumber())
                .latitude(point.getLatitude())
                .longitude(point.getLongitude())
                .altitude(point.getAltitude())
                .description(point.getDescription())
                .createdAt(point.getCreatedAt())
                .build();
    }

    @Override
    public GeoPointResponse createGeoPoint(GeoPointRequest request) {
        if (request.getPathId() != null) {
            fibrePathRepository.findById(request.getPathId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FibrePath not found with ID: " + request.getPathId()));
        }

        GeoPoint point = GeoPoint.builder()
                .pathId(request.getPathId())
                .pointNumber(request.getPointNumber())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .altitude(request.getAltitude())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .build();

        GeoPoint saved = geoPointRepository.save(point);

        // Log action
        activityLogService.log("CREATE", "GEOPOINT", saved.getId(), "Created GeoPoint #" + saved.getPointNumber() + " for path: " + saved.getPathId());

        return toResponse(saved);
    }

    @Override
    public List<GeoPointResponse> getAllGeoPoints() {
        return geoPointRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GeoPointResponse getGeoPointById(String id) {
        GeoPoint point = geoPointRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GeoPoint not found with ID: " + id));
        return toResponse(point);
    }

    @Override
    public GeoPointResponse updateGeoPoint(String id, GeoPointRequest details) {
        GeoPoint point = geoPointRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GeoPoint not found with ID: " + id));

        if (details.getPathId() != null) {
            fibrePathRepository.findById(details.getPathId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FibrePath not found with ID: " + details.getPathId()));
        }

        point.setPathId(details.getPathId());
        point.setPointNumber(details.getPointNumber());
        point.setLatitude(details.getLatitude());
        point.setLongitude(details.getLongitude());
        point.setAltitude(details.getAltitude());
        point.setDescription(details.getDescription());

        GeoPoint saved = geoPointRepository.save(point);

        // Log action
        activityLogService.log("UPDATE", "GEOPOINT", saved.getId(), "Updated GeoPoint #" + saved.getPointNumber() + " for path: " + saved.getPathId());

        return toResponse(saved);
    }

    @Override
    public void deleteGeoPoint(String id) {
        GeoPoint point = geoPointRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "GeoPoint not found with ID: " + id));
        
        geoPointRepository.delete(point);

        // Log action
        activityLogService.log("DELETE", "GEOPOINT", id, "Deleted GeoPoint #" + point.getPointNumber() + " from path: " + point.getPathId());
    }

    @Override
    public List<GeoPointResponse> getGeoPointsByPathId(String pathId) {
        return geoPointRepository.findByPathIdOrderByPointNumberAsc(pathId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
