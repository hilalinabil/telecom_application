package com.example.telecom_network.config;

import com.example.telecom_network.domain.ports.in.*;
import com.example.telecom_network.domain.ports.out.*;
import com.example.telecom_network.domain.service.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public ManageDatacenterUseCase datacenterUseCase(DatacenterRepositoryPort port) {
        return new DatacenterDomainService(port);
    }

    @Bean
    public ManageSplitterUseCase splitterUseCase(SplitterRepositoryPort port, RepartiteurRepositoryPort repPort) {
        return new SplitterDomainService(port, repPort);
    }

    @Bean
    public ManageRepartiteurUseCase repartiteurUseCase(RepartiteurRepositoryPort port, DatacenterRepositoryPort dcPort) {
        return new RepartiteurDomainService(port, dcPort);
    }

    @Bean
    public ManageEquipementUseCase equipementUseCase(EquipementRepositoryPort port, RepartiteurRepositoryPort repPort) {
        return new EquipementDomainService(port, repPort);
    }

    @Bean
    public ManageBoiteClientUseCase boiteClientUseCase(BoiteClientRepositoryPort port, SplitterRepositoryPort splPort) {
        return new BoiteClientDomainService(port, splPort);
    }

    @Bean
    public SimulationUseCase simulationUseCase(
            DatacenterRepositoryPort dcPort,
            RepartiteurRepositoryPort repPort,
            SplitterRepositoryPort splPort,
            BoiteClientRepositoryPort bcPort,
            CheminRepositoryPort chPort) {
        return new SimulationDomainService(dcPort, repPort, splPort, bcPort, chPort);
    }

    @Bean
    public AuthUseCase authUseCase(UserRepositoryPort port, PasswordEncoder encoder) {
        return new UserDomainService(port, encoder);
    }
}
