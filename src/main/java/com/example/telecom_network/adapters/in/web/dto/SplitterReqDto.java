package com.example.telecom_network.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SplitterReqDto {
    @NotBlank(message = "Le ratio est obligatoire")
    private String ratio; // e.g. "1:16"
    
    private String repartiteurId;
    
    @NotNull(message = "Le nombre de sorties est obligatoire")
    private Integer nbSorties;
    
    private Double latitude;
    private Double longitude;
}
