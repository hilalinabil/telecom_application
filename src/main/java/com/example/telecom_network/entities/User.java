package com.example.telecom_network.entities;


import com.example.telecom_network.enums.Role;
import com.example.telecom_network.enums.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Document(collection = "users")
public class User {
    @Id
    private String userId;

    @Indexed(unique = true)
    @Size(min =5, max = 50)
    @NotNull(message = "matricule can't be empty")
    private String matricule;

    @NotNull(message = "First name can't be empty ")
    @Size(min = 4, max = 25)
    private String firstName;

    @NotNull(message = "Last name can't be empty")
    @Size(min = 4, max = 25)
    private String lastName;

    private String middleName;

    @Indexed(unique = true)
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password can't be empty")
    private String hashedPasswrd;

    private Role role;
    private Status status;

    @NotNull(message = "Phone number can't be empty")
    private String phoneNumber;

    private User cretedBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;






}
