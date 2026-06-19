package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.FibrePathRequest;
import com.example.telecom_network.dtos.response.FibrePathResponse;
import com.example.telecom_network.models.enums.FibreStatus;
import java.util.List;

public interface FibrePathService {
    FibrePathResponse createFibrePath(FibrePathRequest request);
    List<FibrePathResponse> getAllFibrePaths();
    FibrePathResponse getFibrePathById(String id);
    FibrePathResponse updateFibrePath(String id, FibrePathRequest details);
    void deleteFibrePath(String id);
    List<FibrePathResponse> getFibrePathsByStatus(FibreStatus status);
}
