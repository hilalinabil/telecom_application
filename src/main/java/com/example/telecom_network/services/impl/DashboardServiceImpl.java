package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.response.DashboardStatsResponse;
import com.example.telecom_network.models.FibrePath;
import com.example.telecom_network.models.enums.FibreStatus;
import com.example.telecom_network.models.enums.NetworkStatus;
import com.example.telecom_network.repositories.EquipementRepository;
import com.example.telecom_network.repositories.FibrePathRepository;
import com.example.telecom_network.services.DashboardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final FibrePathRepository fibrePathRepository;
    private final EquipementRepository equipementRepository;

    public DashboardServiceImpl(FibrePathRepository fibrePathRepository, EquipementRepository equipementRepository) {
        this.fibrePathRepository = fibrePathRepository;
        this.equipementRepository = equipementRepository;
    }

    @Override
    public DashboardStatsResponse getDashboardStats() {
        List<FibrePath> paths = fibrePathRepository.findAll();

        long usedFibers = 0;
        long freeFibers = 0;

        for (FibrePath path : paths) {
            if (path.getUsedCores() != null) {
                usedFibers += path.getUsedCores();
            }
            if (path.getAvailableCores() != null) {
                freeFibers += path.getAvailableCores();
            }
        }

        double occupationRate = 0.0;
        long totalCores = usedFibers + freeFibers;
        if (totalCores > 0) {
            occupationRate = (double) usedFibers * 100.0 / totalCores;
            // Round to 2 decimal places
            occupationRate = Math.round(occupationRate * 100.0) / 100.0;
        }

        // Count outages from equipment statuses
        long inactiveEquipments = equipementRepository.countByStatus(NetworkStatus.INACTIVE);
        long maintenanceEquipments = equipementRepository.countByStatus(NetworkStatus.MAINTENANCE);
        
        // Count outages from CUT fibers
        long cutFibers = paths.stream()
                .filter(path -> path.getStatus() == FibreStatus.CUT)
                .count();

        long outagesCount = inactiveEquipments + maintenanceEquipments + cutFibers;

        String overallNetworkState = "EXCELLENT";
        if (outagesCount > 2) {
            overallNetworkState = "CRITICAL";
        } else if (outagesCount > 0) {
            overallNetworkState = "WARNING";
        } else if (occupationRate > 85.0) {
            overallNetworkState = "GOOD (HIGH OCCUPANCY)";
        }

        return DashboardStatsResponse.builder()
                .usedFibers(usedFibers)
                .freeFibers(freeFibers)
                .occupationRate(occupationRate)
                .outagesCount(outagesCount)
                .overallNetworkState(overallNetworkState)
                .build();
    }
}
