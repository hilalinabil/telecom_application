package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.LoginRequest;
import com.example.telecom_network.dtos.response.AuthResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.User;
import com.example.telecom_network.models.enums.UserStatus;
import com.example.telecom_network.repositories.UserRepository;
import com.example.telecom_network.security.JwtService;
import com.example.telecom_network.security.UserPrincipal;
import com.example.telecom_network.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByMatricule(request.getMatricule())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid matricule or password."));

        if (user.getStatus() == UserStatus.DISABLED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Account is disabled. Please contact the administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid matricule or password.");
        }

        // Generate JWT token
        UserPrincipal userPrincipal = new UserPrincipal(user);
        String token = jwtService.generateToken(userPrincipal);

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return AuthResponse.builder()
                .token(token)
                .matricule(user.getMatricule())
                .role(user.getRole().name())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
