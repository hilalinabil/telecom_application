package com.example.telecom_network.services.impl;

import com.example.telecom_network.dtos.request.PasswordChangeRequest;
import com.example.telecom_network.dtos.request.UserCreateRequest;
import com.example.telecom_network.dtos.response.UserResponse;
import com.example.telecom_network.exceptions.ApiException;
import com.example.telecom_network.models.User;
import com.example.telecom_network.models.enums.Role;
import com.example.telecom_network.models.enums.UserStatus;
import com.example.telecom_network.repositories.UserRepository;
import com.example.telecom_network.security.UserPrincipal;
import com.example.telecom_network.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse createUser(UserCreateRequest request, UserPrincipal currentUser) {
        Role creatorRole = currentUser.getUser().getRole();
        Role targetRole = request.getRole();

        // 1. Enforce creator hierarchy rules
        if (creatorRole == Role.SUPER_ADMIN) {
            // SUPER_ADMIN can only create ADMIN accounts
            if (targetRole != Role.ADMIN) {
                throw new ApiException(HttpStatus.FORBIDDEN, "SUPER_ADMIN can only create ADMIN accounts.");
            }
        } else if (creatorRole == Role.ADMIN) {
            // ADMIN can create ADMIN and TECHNICIAN accounts
            if (targetRole != Role.ADMIN && targetRole != Role.TECHNICIAN) {
                throw new ApiException(HttpStatus.FORBIDDEN, "ADMIN can only create ADMIN or TECHNICIAN accounts.");
            }
        } else {
            // TECHNICIAN cannot create users
            throw new ApiException(HttpStatus.FORBIDDEN, "TECHNICIAN is not authorized to create users.");
        }

        // 2. Validate email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email already exists.");
        }

        // 3. Auto-generate unique matricule
        String matricule = generateNextMatricule(targetRole);

        // 4. Build and save the User
        User user = User.builder()
                .matricule(matricule)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(targetRole)
                .status(UserStatus.ACTIVE)
                .createdBy(currentUser.getUser().getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public void changePassword(PasswordChangeRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getUser().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Incorrect old password.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public void disableUser(String userId, UserPrincipal currentUser) {
        User userToDisable = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User to disable not found."));

        Role creatorRole = currentUser.getUser().getRole();
        Role targetRole = userToDisable.getRole();

        // Enforce hierarchy for disabling users
        if (creatorRole == Role.SUPER_ADMIN) {
            // SUPER_ADMIN can disable ADMIN and TECHNICIAN
            if (targetRole == Role.SUPER_ADMIN) {
                throw new ApiException(HttpStatus.FORBIDDEN, "Cannot disable another SUPER_ADMIN.");
            }
        } else if (creatorRole == Role.ADMIN) {
            // ADMIN can disable TECHNICIAN (and not other ADMINs or SUPER_ADMINs)
            if (targetRole == Role.SUPER_ADMIN || targetRole == Role.ADMIN) {
                throw new ApiException(HttpStatus.FORBIDDEN, "ADMIN can only disable TECHNICIAN users.");
            }
        } else {
            throw new ApiException(HttpStatus.FORBIDDEN, "TECHNICIAN is not authorized to disable users.");
        }

        userToDisable.setStatus(UserStatus.DISABLED);
        userToDisable.setUpdatedAt(LocalDateTime.now());
        userRepository.save(userToDisable);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
        return mapToUserResponse(user);
    }

    private synchronized String generateNextMatricule(Role role) {
        String prefix = getRolePrefix(role);
        Optional<User> lastUserOpt = userRepository.findFirstByRoleOrderByMatriculeDesc(role);
        int nextId = 1;
        if (lastUserOpt.isPresent()) {
            String lastMatricule = lastUserOpt.get().getMatricule();
            try {
                String numPart = lastMatricule.substring(lastMatricule.indexOf("-") + 1);
                nextId = Integer.parseInt(numPart) + 1;
            } catch (Exception e) {
                // fall through
            }
        }
        return String.format("%s-%04d", prefix, nextId);
    }

    private String getRolePrefix(Role role) {
        switch (role) {
            case SUPER_ADMIN:
                return "ROOT";
            case ADMIN:
                return "ADM";
            case TECHNICIAN:
                return "TECH";
            default:
                throw new IllegalArgumentException("Unknown role: " + role);
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .matricule(user.getMatricule())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .createdBy(user.getCreatedBy())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
