package com.example.telecom_network.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RepartiteurReqDto {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    private String datacenterId;
    
    @NotNull(message = "Le nombre de ports est obligatoire")
    private Integer nbPorts;
    
    private Double latitude;
    private Double longitude;
}
