package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.DatacenterRequest;
import com.example.telecom_network.dtos.response.DatacenterResponse;
import java.util.List;

public interface DatacenterService {
    DatacenterResponse createDatacenter(DatacenterRequest request);
    List<DatacenterResponse> getAllDatacenters();
    DatacenterResponse getDatacenterById(String id);
    DatacenterResponse updateDatacenter(String id, DatacenterRequest details);
    void deleteDatacenter(String id);
}
