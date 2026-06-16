package com.example.telecom_network.adapters.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EquipementReqDto {
    @NotBlank(message = "Le type est obligatoire")
    private String type; // OLT / Switch
    
    private String ip;
    private String statut; // actif / hs
    private String repartiteurId;
}
