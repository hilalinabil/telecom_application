package com.example.telecom_network.dtos.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class RegisterRequestDto {
    @NotBlank(message ="First name can't be empty")
    @Size(min = 4, max = 25 )
    private String firstName;

    @NotBlank(message = "Last name can't be empty ")
    @Size(min = 4, max = 25 )
    private String lastName;
    @NotBlank(message = "Email can't be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Passsword can't be empty")
    @Size(min = 8)
    private String password;
}
