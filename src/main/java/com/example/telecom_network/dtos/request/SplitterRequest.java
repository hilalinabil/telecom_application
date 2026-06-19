package com.example.telecom_network.dtos.request;

import com.example.telecom_network.models.enums.NetworkStatus;
import com.example.telecom_network.models.enums.SplitterRatio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SplitterRequest {
    private String name;
    private SplitterRatio ratio;
    private Integer nbOutputs;
    private Integer usedOutputs;
    private String repartiteurId;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private LocalDateTime installationDate;
}
