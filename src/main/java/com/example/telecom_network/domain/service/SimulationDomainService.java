package com.example.telecom_network.domain.service;

import com.example.telecom_network.domain.model.*;
import com.example.telecom_network.domain.ports.in.SimulationUseCase;
import com.example.telecom_network.domain.ports.out.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class SimulationDomainService implements SimulationUseCase {

    private final DatacenterRepositoryPort datacenterRepositoryPort;
    private final RepartiteurRepositoryPort repartiteurRepositoryPort;
    private final SplitterRepositoryPort splitterRepositoryPort;
    private final BoiteClientRepositoryPort boiteClientRepositoryPort;
    private final CheminRepositoryPort cheminRepositoryPort;

    public SimulationDomainService(
            DatacenterRepositoryPort datacenterRepositoryPort,
            RepartiteurRepositoryPort repartiteurRepositoryPort,
            SplitterRepositoryPort splitterRepositoryPort,
            BoiteClientRepositoryPort boiteClientRepositoryPort,
            CheminRepositoryPort cheminRepositoryPort) {
        this.datacenterRepositoryPort = datacenterRepositoryPort;
        this.repartiteurRepositoryPort = repartiteurRepositoryPort;
        this.splitterRepositoryPort = splitterRepositoryPort;
        this.boiteClientRepositoryPort = boiteClientRepositoryPort;
        this.cheminRepositoryPort = cheminRepositoryPort;
    }

    @Override
    public List<Chemin> generateVirtualFiberPaths() {
        // Clear all existing paths
        cheminRepositoryPort.deleteAll();
        List<Chemin> generatedPaths = new ArrayList<>();

        // 1. Datacenter -> Repartiteur
        List<Repartiteur> reparteurs = repartiteurRepositoryPort.findAll();
        for (Repartiteur rep : reparteurs) {
            if (rep.getDatacenterId() != null) {
                Optional<Datacenter> dcOpt = datacenterRepositoryPort.findById(rep.getDatacenterId());
                if (dcOpt.isPresent()) {
                    Datacenter dc = dcOpt.get();
                    Chemin chemin = createCheminBetween(
                            dc.getId(), dc.getLatitude(), dc.getLongitude(),
                            rep.getId(), rep.getLatitude(), rep.getLongitude()
                    );
                    Chemin saved = cheminRepositoryPort.save(chemin);
                    generatedPaths.add(saved);
                }
            }
        }

        // 2. Repartiteur -> Splitter
        List<Splitter> splitters = splitterRepositoryPort.findAll();
        for (Splitter spl : splitters) {
            if (spl.getRepartiteurId() != null) {
                Optional<Repartiteur> repOpt = repartiteurRepositoryPort.findById(spl.getRepartiteurId());
                if (repOpt.isPresent()) {
                    Repartiteur rep = repOpt.get();
                    Chemin chemin = createCheminBetween(
                            rep.getId(), rep.getLatitude(), rep.getLongitude(),
                            spl.getId(), spl.getLatitude(), spl.getLongitude()
                    );
                    Chemin saved = cheminRepositoryPort.save(chemin);
                    generatedPaths.add(saved);
                }
            }
        }

        // 3. Splitter -> BoiteClient
        List<BoiteClient> clients = boiteClientRepositoryPort.findAll();
        for (BoiteClient client : clients) {
            if (client.getSplitterId() != null) {
                Optional<Splitter> splOpt = splitterRepositoryPort.findById(client.getSplitterId());
                if (splOpt.isPresent()) {
                    Splitter spl = splOpt.get();
                    Chemin chemin = createCheminBetween(
                            spl.getId(), spl.getLatitude(), spl.getLongitude(),
                            client.getId(), client.getLatitude(), client.getLongitude()
                    );
                    Chemin saved = cheminRepositoryPort.save(chemin);
                    generatedPaths.add(saved);
                }
            }
        }

        return generatedPaths;
    }

    @Override
    public List<Chemin> getAllPaths() {
        return cheminRepositoryPort.findAll();
    }

    private Chemin createCheminBetween(String srcId, Double srcLat, Double srcLon,
                                       String destId, Double destLat, Double destLon) {
        double lat1 = srcLat != null ? srcLat : 0.0;
        double lon1 = srcLon != null ? srcLon : 0.0;
        double lat2 = destLat != null ? destLat : 0.0;
        double lon2 = destLon != null ? destLon : 0.0;

        double distance = calculateDistance(lat1, lon1, lat2, lon2);
        String longueurFormatted = String.format("%.2f km", distance);

        List<GpsPoint> points = new ArrayList<>();
        points.add(new GpsPoint(lat1, lon1, 1));
        points.add(new GpsPoint(lat2, lon2, 2));

        return Chemin.builder()
                .source(srcId)
                .destination(destId)
                .longueur(longueurFormatted)
                .statut("actif")
                .gpsPoints(points)
                .build();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
