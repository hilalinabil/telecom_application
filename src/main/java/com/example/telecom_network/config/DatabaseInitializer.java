package com.example.telecom_network.config;

import com.example.telecom_network.models.User;
import com.example.telecom_network.models.enums.Role;
import com.example.telecom_network.models.enums.UserStatus;
import com.example.telecom_network.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User superAdmin = User.builder()
                    .matricule("ROOT-0001")
                    .firstName("Super")
                    .lastName("Admin")
                    .email("superadmin@telecom.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.SUPER_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .createdBy("SYSTEM")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(superAdmin);
            System.out.println("=================================================");
            System.out.println("No users found. Seeding initial SUPER_ADMIN account:");
            System.out.println("Matricule: ROOT-0001");
            System.out.println("Password:  admin123");
            System.out.println("=================================================");
        }
    }
}
