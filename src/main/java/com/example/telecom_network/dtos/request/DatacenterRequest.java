package com.example.telecom_network.dtos.request;

import com.example.telecom_network.models.enums.NetworkStatus;
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
public class DatacenterRequest {
    private String name;
    private String location;
    private Integer capacity;
    private Double latitude;
    private Double longitude;
    private NetworkStatus status;
    private String description;
}
