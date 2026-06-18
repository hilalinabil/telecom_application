package com.example.telecom_network.dtos.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Matricule cannot be blank")
    private String matricule;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
