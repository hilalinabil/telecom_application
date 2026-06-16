package com.example.telecom_network.adapters.in.web;

import com.example.telecom_network.adapters.in.web.dto.*;
import com.example.telecom_network.domain.model.User;
import com.example.telecom_network.domain.ports.in.AuthUseCase;
import com.example.telecom_network.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final JwtService jwtService;

    public AuthController(AuthUseCase authUseCase, JwtService jwtService) {
        this.authUseCase = authUseCase;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserReqDto dto) {
        try {
            User user = User.builder()
                    .username(dto.getUsername())
                    .password(dto.getPassword())
                    .role(dto.getRole())
                    .build();
            User registered = authUseCase.register(user);
            // Hide password in return
            registered.setPassword(null);
            return new ResponseEntity<>(registered, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginReqDto dto) {
        try {
            String username = authUseCase.login(dto.getUsername(), dto.getPassword());
            Optional<User> userOpt = authUseCase.getByUsername(username);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = jwtService.generateToken(user.getUsername(), user.getRole());
                LoginResDto res = LoginResDto.builder()
                        .token(token)
                        .username(user.getUsername())
                        .role(user.getRole().name())
                        .build();
                return ResponseEntity.ok(res);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User mapping error");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
