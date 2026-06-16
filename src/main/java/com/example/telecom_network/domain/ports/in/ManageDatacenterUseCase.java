package com.example.telecom_network.domain.ports.in;

import com.example.telecom_network.domain.model.Datacenter;
import java.util.List;
import java.util.Optional;

public interface ManageDatacenterUseCase {
    Datacenter createDatacenter(Datacenter datacenter);
    Optional<Datacenter> getDatacenterById(String id);
    List<Datacenter> getAllDatacenters();
    Datacenter updateDatacenter(String id, Datacenter datacenter);
    void deleteDatacenter(String id);
}
