package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.model.Truck;
import com.transroute.logistics.repository.DistributionCenterRepository;
import com.transroute.logistics.repository.RouteRepository;
import com.transroute.logistics.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para inicializar datos de prueba en Neo4j
 * Carga centros de distribución, rutas y camiones con relaciones
 */
@Service
public class DataInitializationService {
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private TruckRepository truckRepository;
    
    @Transactional
    public String inicializarDatos() {
        StringBuilder report = new StringBuilder();
        report.append("=== Inicialización de Datos TransRoute S.A. ===\n\n");
        
        // Limpiar datos existentes
        report.append("Limpiando datos existentes...\n");
        limpiarDatos();
        
        // Crear centros de distribución
        report.append("\nCreando centros de distribución...\n");
        List<DistributionCenter> centros = crearCentrosDistribucion();
        distributionCenterRepository.saveAll(centros);
        report.append("✓ ").append(centros.size()).append(" centros creados\n");
        
        // Crear camiones
        report.append("\nCreando camiones...\n");
        List<Truck> camiones = crearCamiones();
        truckRepository.saveAll(camiones);
        report.append("✓ ").append(camiones.size()).append(" camiones creados\n");
        
        // Crear rutas
        report.append("\nCreando rutas...\n");
        List<Route> rutas = crearRutas();
        routeRepository.saveAll(rutas);
        report.append("✓ ").append(rutas.size()).append(" rutas creadas\n");
        
        // Asociar camiones a centros
        report.append("\nAsociando camiones a centros...\n");
        asociarCamionesACentros(centros, camiones);
        distributionCenterRepository.saveAll(centros);
        report.append("✓ Camiones asociados\n");
        
        report.append("\n=== Inicialización completada exitosamente ===\n");
        report.append("Total: ").append(centros.size()).append(" centros, ")
               .append(rutas.size()).append(" rutas, ").append(camiones.size()).append(" camiones\n");
        
        return report.toString();
    }
    
    @Transactional
    public void limpiarDatos() {
        routeRepository.deleteAll();
        truckRepository.deleteAll();
        distributionCenterRepository.deleteAll();
    }
    
    private List<DistributionCenter> crearCentrosDistribucion() {
        List<DistributionCenter> centros = new ArrayList<>();
        
        centros.add(new DistributionCenter(
            "DC001", 
            "Centro Principal Buenos Aires", 
            "Buenos Aires", 
            "Buenos Aires",
            95, // demandLevel
            10000, // capacity
            5000.0, // operatingCost
            1, // priority (más alta)
            "-34.6037,-58.3816" // coordinates
        ));
        
        centros.add(new DistributionCenter(
            "DC002",
            "Centro Regional Córdoba",
            "Córdoba",
            "Córdoba",
            78,
            8000,
            4000.0,
            2,
            "-31.4201,-64.1888"
        ));
        
        centros.add(new DistributionCenter(
            "DC003",
            "Centro Regional Rosario",
            "Rosario",
            "Santa Fe",
            82,
            7500,
            3800.0,
            2,
            "-32.9442,-60.6505"
        ));
        
        centros.add(new DistributionCenter(
            "DC004",
            "Centro Regional Mendoza",
            "Mendoza",
            "Mendoza",
            65,
            6000,
            3500.0,
            3,
            "-32.8895,-68.8458"
        ));
        
        centros.add(new DistributionCenter(
            "DC005",
            "Centro Regional Tucumán",
            "San Miguel de Tucumán",
            "Tucumán",
            70,
            5500,
            3200.0,
            3,
            "-26.8083,-65.2176"
        ));
        
        centros.add(new DistributionCenter(
            "DC006",
            "Centro Regional Mar del Plata",
            "Mar del Plata",
            "Buenos Aires",
            58,
            5000,
            3000.0,
            4,
            "-38.0055,-57.5426"
        ));
        
        centros.add(new DistributionCenter(
            "DC007",
            "Centro Regional La Plata",
            "La Plata",
            "Buenos Aires",
            72,
            6500,
            3400.0,
            2,
            "-34.9215,-57.9545"
        ));
        
        return centros;
    }
    
    private List<Truck> crearCamiones() {
        List<Truck> camiones = new ArrayList<>();
        
        Truck t1 = new Truck("T001", "ABC123", 15000, 200);
        t1.setCurrentFuel(200);
        t1.setStatus("AVAILABLE");
        camiones.add(t1);
        
        Truck t2 = new Truck("T002", "DEF456", 12000, 180);
        t2.setCurrentFuel(150);
        t2.setStatus("AVAILABLE");
        camiones.add(t2);
        
        Truck t3 = new Truck("T003", "GHI789", 18000, 220);
        t3.setCurrentFuel(220);
        t3.setStatus("IN_TRANSIT");
        camiones.add(t3);
        
        Truck t4 = new Truck("T004", "JKL012", 10000, 150);
        t4.setCurrentFuel(120);
        t4.setStatus("AVAILABLE");
        camiones.add(t4);
        
        Truck t5 = new Truck("T005", "MNO345", 20000, 250);
        t5.setCurrentFuel(180);
        t5.setStatus("MAINTENANCE");
        camiones.add(t5);
        
        Truck t6 = new Truck("T006", "PQR678", 14000, 190);
        t6.setCurrentFuel(190);
        t6.setStatus("AVAILABLE");
        camiones.add(t6);
        
        Truck t7 = new Truck("T007", "STU901", 16000, 210);
        t7.setCurrentFuel(100);
        t7.setStatus("AVAILABLE");
        camiones.add(t7);
        
        return camiones;
    }
    
    private List<Route> crearRutas() {
        List<Route> rutas = new ArrayList<>();
        
        // Ruta 1: Buenos Aires -> Córdoba
        rutas.add(new Route(
            "R001",
            "Ruta BA-Córdoba",
            700.0, // distance
            1500.0, // cost
            480, // duration (minutos)
            0.12, // fuelConsumption
            "HIGHWAY",
            2, // trafficLevel
            150.0, // tollCost
            0.5, // maintenanceCost
            25000 // maxWeight
        ));
        
        // Ruta 2: Buenos Aires -> Rosario
        rutas.add(new Route(
            "R002",
            "Ruta BA-Rosario",
            300.0,
            800.0,
            240,
            0.11,
            "HIGHWAY",
            3,
            80.0,
            0.4,
            20000
        ));
        
        // Ruta 3: Córdoba -> Mendoza
        rutas.add(new Route(
            "R003",
            "Ruta Córdoba-Mendoza",
            650.0,
            1400.0,
            420,
            0.13,
            "HIGHWAY",
            2,
            120.0,
            0.5,
            24000
        ));
        
        // Ruta 4: Rosario -> Tucumán
        rutas.add(new Route(
            "R004",
            "Ruta Rosario-Tucumán",
            550.0,
            1200.0,
            360,
            0.12,
            "HIGHWAY",
            2,
            100.0,
            0.45,
            22000
        ));
        
        // Ruta 5: Buenos Aires -> Mar del Plata
        rutas.add(new Route(
            "R005",
            "Ruta BA-Mar del Plata",
            400.0,
            900.0,
            300,
            0.10,
            "HIGHWAY",
            4,
            60.0,
            0.35,
            18000
        ));
        
        // Ruta 6: Buenos Aires -> La Plata
        rutas.add(new Route(
            "R006",
            "Ruta BA-La Plata",
            60.0,
            250.0,
            60,
            0.08,
            "CITY",
            4,
            20.0,
            0.3,
            15000
        ));
        
        // Ruta 7: Córdoba -> Rosario
        rutas.add(new Route(
            "R007",
            "Ruta Córdoba-Rosario",
            400.0,
            850.0,
            280,
            0.11,
            "HIGHWAY",
            3,
            70.0,
            0.4,
            20000
        ));
        
        // Ruta 8: Mendoza -> Tucumán
        rutas.add(new Route(
            "R008",
            "Ruta Mendoza-Tucumán",
            950.0,
            2100.0,
            600,
            0.14,
            "RURAL",
            1,
            180.0,
            0.6,
            26000
        ));
        
        // Ruta 9: La Plata -> Mar del Plata
        rutas.add(new Route(
            "R009",
            "Ruta La Plata-Mar del Plata",
            380.0,
            850.0,
            270,
            0.10,
            "HIGHWAY",
            3,
            55.0,
            0.35,
            19000
        ));
        
        // Ruta 10: Buenos Aires -> Tucumán
        rutas.add(new Route(
            "R010",
            "Ruta BA-Tucumán",
            1300.0,
            2800.0,
            780,
            0.15,
            "HIGHWAY",
            2,
            250.0,
            0.7,
            28000
        ));
        
        return rutas;
    }
    
    private void asociarCamionesACentros(List<DistributionCenter> centros, List<Truck> camiones) {
        // Asociar camiones a centros de forma distribuida
        if (centros.size() > 0 && camiones.size() > 0) {
            // Buenos Aires (DC001) tiene más camiones
            List<Truck> camionesBA = new ArrayList<>();
            camionesBA.add(camiones.get(0)); // T001
            camionesBA.add(camiones.get(2)); // T003
            camionesBA.add(camiones.get(5)); // T006
            centros.get(0).setTrucks(camionesBA);
            
            // Córdoba (DC002) tiene 2 camiones
            List<Truck> camionesCBA = new ArrayList<>();
            camionesCBA.add(camiones.get(1)); // T002
            camionesCBA.add(camiones.get(6)); // T007
            centros.get(1).setTrucks(camionesCBA);
            
            // Rosario (DC003) tiene 1 camión
            List<Truck> camionesRO = new ArrayList<>();
            camionesRO.add(camiones.get(3)); // T004
            centros.get(2).setTrucks(camionesRO);
            
            // Mendoza (DC004) tiene 1 camión
            List<Truck> camionesMDZ = new ArrayList<>();
            camionesMDZ.add(camiones.get(4)); // T005
            centros.get(3).setTrucks(camionesMDZ);
        }
    }
}

