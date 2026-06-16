package com.example.telecom_network.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BoiteClientReqDto {
    @NotBlank(message = "Le type est obligatoire")
    private String type; // e.g. "16FO"
    
    private String splitterId;
    
    @NotNull(message = "Le nombre de ports utilisés est obligatoire")
    private Integer portsUtilises;
    
    private Double latitude;
    private Double longitude;
}
