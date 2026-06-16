package com.example.telecom_network.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DatacenterReqDto {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "La localisation est obligatoire")
    private String localisation;
    
    @NotNull(message = "La capacité est obligatoire")
    private Integer capacite;
    
    private Double latitude;
    private Double longitude;
}
