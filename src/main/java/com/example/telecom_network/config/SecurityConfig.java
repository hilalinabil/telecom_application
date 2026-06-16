package com.example.telecom_network.config;

import com.example.telecom_network.security.JwtAuthenticationFilter;
import com.example.telecom_network.security.JwtService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/datacenters/**", "/api/datacenter/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/splitters/**", "/api/splitter/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/repartiteurs/**", "/api/repartiteur/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/equipements/**", "/api/equipement/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/boites-clients/**", "/api/boite-client/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/chemins/**", "/api/chemin/**").hasAnyRole("ADMIN", "TECHNICIEN")
                        .requestMatchers(HttpMethod.GET, "/api/reseau", "/api/network").hasAnyRole("ADMIN", "TECHNICIEN")

                        // Technicians can add links and update status
                        .requestMatchers(HttpMethod.POST, "/api/chemins/**", "/api/chemin/**").hasAnyRole("ADMIN", "TECHNICIEN")

                        // Admins can trigger simulation
                        .requestMatchers("/api/simulation/**").hasRole("ADMIN")

                        // Admins have write access to all CRUD
                        .requestMatchers(HttpMethod.POST, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/**").hasRole("ADMIN")
                        
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*")); // Allow any frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Collections.singletonList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
