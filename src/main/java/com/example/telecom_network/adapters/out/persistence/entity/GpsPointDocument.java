package com.example.telecom_network.adapters.out.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GpsPointDocument {
    private Double latitude;
    private Double longitude;
    private Integer num;
}
