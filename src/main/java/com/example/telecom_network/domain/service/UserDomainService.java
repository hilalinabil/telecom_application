package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.User;
import com.example.telecom_network.domain.ports.in.AuthUseCase;
import com.example.telecom_network.domain.ports.out.UserRepositoryPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;

public class UserDomainService implements AuthUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    public UserDomainService(UserRepositoryPort userRepositoryPort, PasswordEncoder passwordEncoder) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(User user) {
        Optional<User> existing = userRepositoryPort.findByUsername(user.getUsername());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepositoryPort.save(user);
    }

    @Override
    public String login(String username, String password) {
        // Authenticate credentials
        Optional<User> userOpt = userRepositoryPort.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        // Token generation is handled in the web adapter (REST Controller) or a dedicated JWT service,
        // but here we just return the username to verify auth success.
        return userOpt.get().getUsername();
    }

    @Override
    public Optional<User> getByUsername(String username) {
        return userRepositoryPort.findByUsername(username);
    }
}
