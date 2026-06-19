package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.GeoPointRequest;
import com.example.telecom_network.dtos.response.GeoPointResponse;
import java.util.List;

public interface GeoPointService {
    GeoPointResponse createGeoPoint(GeoPointRequest request);
    List<GeoPointResponse> getAllGeoPoints();
    GeoPointResponse getGeoPointById(String id);
    GeoPointResponse updateGeoPoint(String id, GeoPointRequest details);
    void deleteGeoPoint(String id);
    List<GeoPointResponse> getGeoPointsByPathId(String pathId);
}
