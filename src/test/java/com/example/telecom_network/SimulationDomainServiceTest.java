package com.example.telecom_network;

import com.example.telecom_network.domain.model.*;
import com.example.telecom_network.domain.ports.out.*;
import com.example.telecom_network.domain.service.SimulationDomainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SimulationDomainServiceTest {

    private DatacenterRepositoryPort dcPort;
    private RepartiteurRepositoryPort repPort;
    private SplitterRepositoryPort splPort;
    private BoiteClientRepositoryPort bcPort;
    private CheminRepositoryPort chPort;
    private SimulationDomainService simulationService;

    @BeforeEach
    void setUp() {
        dcPort = mock(DatacenterRepositoryPort.class);
        repPort = mock(RepartiteurRepositoryPort.class);
        splPort = mock(SplitterRepositoryPort.class);
        bcPort = mock(BoiteClientRepositoryPort.class);
        chPort = mock(CheminRepositoryPort.class);
        simulationService = new SimulationDomainService(dcPort, repPort, splPort, bcPort, chPort);
    }

    @Test
    void testGenerateVirtualFiberPaths() {
        // Setup data: Casablanca coordinates
        Datacenter dc = Datacenter.builder()
                .id("dc-1")
                .nom("DC Casablanca")
                .latitude(33.5898)
                .longitude(-7.6038)
                .build();

        Repartiteur rep = Repartiteur.builder()
                .id("rep-1")
                .nom("Repartiteur OLT-01")
                .datacenterId("dc-1")
                .latitude(33.5880)
                .longitude(-7.6030)
                .build();

        when(datacenterRepositoryPort().findById("dc-1")).thenReturn(Optional.of(dc));
        when(repartiteurRepositoryPort().findAll()).thenReturn(Collections.singletonList(rep));
        when(splitterRepositoryPort().findAll()).thenReturn(Collections.emptyList());
        when(boiteClientRepositoryPort().findAll()).thenReturn(Collections.emptyList());
        when(cheminRepositoryPort().save(any(Chemin.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<Chemin> paths = simulationService.generateVirtualFiberPaths();

        verify(cheminRepositoryPort()).deleteAll();
        assertEquals(1, paths.size());

        Chemin generated = paths.get(0);
        assertEquals("dc-1", generated.getSource());
        assertEquals("rep-1", generated.getDestination());
        assertEquals("actif", generated.getStatut());
        assertNotNull(generated.getLongueur());
        assertTrue(generated.getLongueur().contains("km"));

        // Let's verify coordinates are present in the path points
        List<GpsPoint> points = generated.getGpsPoints();
        assertEquals(2, points.size());
        assertEquals(33.5898, points.get(0).getLatitude());
        assertEquals(33.5880, points.get(1).getLatitude());
    }

    private DatacenterRepositoryPort datacenterRepositoryPort() {
        return dcPort;
    }

    private RepartiteurRepositoryPort repartiteurRepositoryPort() {
        return repPort;
    }

    private SplitterRepositoryPort splitterRepositoryPort() {
        return splPort;
    }

    private BoiteClientRepositoryPort boiteClientRepositoryPort() {
        return bcPort;
    }

    private CheminRepositoryPort cheminRepositoryPort() {
        return chPort;
    }
}
