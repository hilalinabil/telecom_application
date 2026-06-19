package com.example.telecom_network.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {
    private Long usedFibers;
    private Long freeFibers;
    private Double occupationRate;
    private Long outagesCount;
    private String overallNetworkState;
}
