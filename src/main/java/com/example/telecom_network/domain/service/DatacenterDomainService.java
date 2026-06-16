package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.Datacenter;
import com.example.telecom_network.domain.ports.in.ManageDatacenterUseCase;
import com.example.telecom_network.domain.ports.out.DatacenterRepositoryPort;
import java.util.List;
import java.util.Optional;

public class DatacenterDomainService implements ManageDatacenterUseCase {

    private final DatacenterRepositoryPort datacenterRepositoryPort;

    public DatacenterDomainService(DatacenterRepositoryPort datacenterRepositoryPort) {
        this.datacenterRepositoryPort = datacenterRepositoryPort;
    }

    @Override
    public Datacenter createDatacenter(Datacenter datacenter) {
        return datacenterRepositoryPort.save(datacenter);
    }

    @Override
    public Optional<Datacenter> getDatacenterById(String id) {
        return datacenterRepositoryPort.findById(id);
    }

    @Override
    public List<Datacenter> getAllDatacenters() {
        return datacenterRepositoryPort.findAll();
    }

    @Override
    public Datacenter updateDatacenter(String id, Datacenter datacenter) {
        if (!datacenterRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Datacenter not found with id: " + id);
        }
        datacenter.setId(id);
        return datacenterRepositoryPort.save(datacenter);
    }

    @Override
    public void deleteDatacenter(String id) {
        if (!datacenterRepositoryPort.existsById(id)) {
            throw new IllegalArgumentException("Datacenter not found with id: " + id);
        }
        datacenterRepositoryPort.deleteById(id);
    }
}
