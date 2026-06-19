package com.example.telecom_network.services;

import com.example.telecom_network.dtos.request.SplitterRequest;
import com.example.telecom_network.dtos.response.SplitterResponse;
import java.util.List;

public interface SplitterService {
    SplitterResponse createSplitter(SplitterRequest request);
    List<SplitterResponse> getAllSplitters();
    SplitterResponse getSplitterById(String id);
    SplitterResponse updateSplitter(String id, SplitterRequest details);
    void deleteSplitter(String id);
}
