package com.example.telecom_network.adapters.in.web.dto;

import com.example.telecom_network.domain.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserReqDto {
    @NotBlank(message = "Username is mandatory")
    private String username;
    
    @NotBlank(message = "Password is mandatory")
    private String password;
    
    @NotNull(message = "Role is mandatory")
    private Role role;
}
