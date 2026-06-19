package com.example.telecom_network.dtos.request;

import com.example.telecom_network.models.enums.ClientBoxType;
import com.example.telecom_network.models.enums.NetworkStatus;
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
public class ClientBoxRequest {
    private String name;
    private ClientBoxType type;
    private String splitterId;
    private Integer totalPorts;
    private Integer usedPorts;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private String zone;
    private LocalDateTime installationDate;
}
