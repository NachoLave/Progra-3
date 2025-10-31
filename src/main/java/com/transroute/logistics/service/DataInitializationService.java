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
        
        // Centros principales y regionales (15 centros)
        centros.add(new DistributionCenter("DC001", "Centro Principal Buenos Aires", "Buenos Aires", "Buenos Aires", 95, 15000, 8000.0, 1, "-34.6037,-58.3816"));
        centros.add(new DistributionCenter("DC002", "Centro Regional Córdoba", "Córdoba", "Córdoba", 88, 12000, 6500.0, 1, "-31.4201,-64.1888"));
        centros.add(new DistributionCenter("DC003", "Centro Regional Rosario", "Rosario", "Santa Fe", 85, 11000, 6000.0, 2, "-32.9442,-60.6505"));
        centros.add(new DistributionCenter("DC004", "Centro Regional Mendoza", "Mendoza", "Mendoza", 75, 10000, 5500.0, 2, "-32.8895,-68.8458"));
        centros.add(new DistributionCenter("DC005", "Centro Regional Tucumán", "San Miguel de Tucumán", "Tucumán", 72, 9500, 5000.0, 2, "-26.8083,-65.2176"));
        centros.add(new DistributionCenter("DC006", "Centro Regional Mar del Plata", "Mar del Plata", "Buenos Aires", 68, 9000, 4800.0, 3, "-38.0055,-57.5426"));
        centros.add(new DistributionCenter("DC007", "Centro Regional La Plata", "La Plata", "Buenos Aires", 78, 8500, 5200.0, 2, "-34.9215,-57.9545"));
        centros.add(new DistributionCenter("DC008", "Centro Regional Salta", "Salta", "Salta", 65, 8000, 4500.0, 3, "-24.7859,-65.4117"));
        centros.add(new DistributionCenter("DC009", "Centro Regional Corrientes", "Corrientes", "Corrientes", 60, 7500, 4200.0, 3, "-27.4692,-58.8306"));
        centros.add(new DistributionCenter("DC010", "Centro Regional Neuquén", "Neuquén", "Neuquén", 70, 8200, 4700.0, 3, "-38.9516,-68.0591"));
        centros.add(new DistributionCenter("DC011", "Centro Regional Bahía Blanca", "Bahía Blanca", "Buenos Aires", 62, 7800, 4400.0, 4, "-38.7183,-62.2663"));
        centros.add(new DistributionCenter("DC012", "Centro Regional San Juan", "San Juan", "San Juan", 58, 7000, 4000.0, 4, "-31.5375,-68.5364"));
        centros.add(new DistributionCenter("DC013", "Centro Regional Santa Fe", "Santa Fe", "Santa Fe", 66, 7200, 4100.0, 3, "-31.6333,-60.7"));
        centros.add(new DistributionCenter("DC014", "Centro Regional Resistencia", "Resistencia", "Chaco", 55, 6800, 3800.0, 4, "-27.4514,-58.9867"));
        centros.add(new DistributionCenter("DC015", "Centro Regional Paraná", "Paraná", "Entre Ríos", 64, 7100, 3900.0, 4, "-31.7333,-60.5333"));
        
        return centros;
    }
    
    private List<Truck> crearCamiones() {
        List<Truck> camiones = new ArrayList<>();
        
        // 20 camiones con diferentes capacidades y estados
        String[] placas = {"ABC123", "DEF456", "GHI789", "JKL012", "MNO345", "PQR678", "STU901", "VWX234", "YZA567", "BCD890",
                          "EFG123", "HIJ456", "KLM789", "NOP012", "QRS345", "TUV678", "WXY901", "ZAB234", "CDE567", "FGH890"};
        int[] capacidades = {15000, 12000, 18000, 10000, 20000, 14000, 16000, 13000, 17000, 19000, 11000, 15000, 12500, 17500, 14500, 16500, 13500, 15500, 18500, 19500};
        int[] fuelCapacities = {200, 180, 220, 150, 250, 190, 210, 170, 230, 240, 160, 200, 175, 225, 185, 215, 165, 205, 235, 245};
        String[] estados = {"AVAILABLE", "AVAILABLE", "IN_TRANSIT", "AVAILABLE", "MAINTENANCE", "AVAILABLE", "AVAILABLE", "AVAILABLE", "IN_TRANSIT", "AVAILABLE",
                           "AVAILABLE", "AVAILABLE", "MAINTENANCE", "AVAILABLE", "IN_TRANSIT", "AVAILABLE", "AVAILABLE", "AVAILABLE", "AVAILABLE", "IN_TRANSIT"};
        
        for (int i = 0; i < 20; i++) {
            Truck t = new Truck("T" + String.format("%03d", i + 1), placas[i], capacidades[i], fuelCapacities[i]);
            // Establecer combustible actual como porcentaje aleatorio entre 50% y 100%
            int fuelPercentage = 50 + (int)(Math.random() * 50);
            t.setCurrentFuel((fuelCapacities[i] * fuelPercentage) / 100);
            t.setStatus(estados[i]);
            camiones.add(t);
        }
        
        return camiones;
    }
    
    private List<Route> crearRutas() {
        List<Route> rutas = new ArrayList<>();
        
        // Matriz de conexiones principales entre ciudades (35 rutas)
        String[][] conexiones = {
            // Desde BA
            {"BA", "Córdoba", "700.0", "1500.0", "HIGHWAY"},
            {"BA", "Rosario", "300.0", "800.0", "HIGHWAY"},
            {"BA", "Mar del Plata", "400.0", "900.0", "HIGHWAY"},
            {"BA", "La Plata", "60.0", "250.0", "CITY"},
            {"BA", "Tucumán", "1300.0", "2800.0", "HIGHWAY"},
            {"BA", "Mendoza", "1050.0", "2200.0", "HIGHWAY"},
            {"BA", "Bahía Blanca", "650.0", "1400.0", "HIGHWAY"},
            // Desde Córdoba
            {"Córdoba", "Mendoza", "650.0", "1400.0", "HIGHWAY"},
            {"Córdoba", "Rosario", "400.0", "850.0", "HIGHWAY"},
            {"Córdoba", "Tucumán", "550.0", "1200.0", "HIGHWAY"},
            {"Córdoba", "Salta", "750.0", "1600.0", "HIGHWAY"},
            // Desde Rosario
            {"Rosario", "Santa Fe", "150.0", "400.0", "HIGHWAY"},
            {"Rosario", "Paraná", "180.0", "450.0", "HIGHWAY"},
            {"Rosario", "Tucumán", "800.0", "1700.0", "HIGHWAY"},
            // Desde Mendoza
            {"Mendoza", "San Juan", "170.0", "420.0", "HIGHWAY"},
            {"Mendoza", "Tucumán", "950.0", "2100.0", "RURAL"},
            // Desde Tucumán
            {"Tucumán", "Salta", "140.0", "350.0", "HIGHWAY"},
            {"Tucumán", "Corrientes", "850.0", "1800.0", "HIGHWAY"},
            // Regiones
            {"Mar del Plata", "Bahía Blanca", "220.0", "550.0", "HIGHWAY"},
            {"La Plata", "Mar del Plata", "380.0", "850.0", "HIGHWAY"},
            {"Salta", "Jujuy", "80.0", "200.0", "RURAL"},
            {"Corrientes", "Resistencia", "45.0", "120.0", "CITY"},
            {"Corrientes", "Paraná", "280.0", "650.0", "HIGHWAY"},
            {"Santa Fe", "Paraná", "30.0", "100.0", "CITY"},
            {"Neuquén", "Bahía Blanca", "550.0", "1200.0", "HIGHWAY"},
            {"Neuquén", "Mendoza", "520.0", "1100.0", "RURAL"},
            // Conexiones adicionales
            {"BA", "Paraná", "420.0", "950.0", "HIGHWAY"},
            {"BA", "Santa Fe", "470.0", "1000.0", "HIGHWAY"},
            {"Córdoba", "Paraná", "380.0", "850.0", "HIGHWAY"},
            {"Rosario", "Bahía Blanca", "480.0", "1050.0", "HIGHWAY"},
            {"Mendoza", "Neuquén", "520.0", "1100.0", "RURAL"},
            {"Salta", "Jujuy", "80.0", "200.0", "RURAL"},
            {"Tucumán", "Santiago del Estero", "120.0", "280.0", "HIGHWAY"},
            {"Corrientes", "Posadas", "320.0", "750.0", "HIGHWAY"},
            {"Paraná", "Resistencia", "350.0", "800.0", "HIGHWAY"}
        };
        
        String[] ciudades = {"BA", "Córdoba", "Rosario", "Mendoza", "Tucumán", "Mar del Plata", "La Plata", "Salta", "Corrientes", 
                            "Neuquén", "Bahía Blanca", "San Juan", "Santa Fe", "Resistencia", "Paraná"};
        
        for (int i = 0; i < conexiones.length; i++) {
            String[] conn = conexiones[i];
            double distance = Double.parseDouble(conn[2]);
            double cost = Double.parseDouble(conn[3]);
            int duration = (int)(distance / 60.0 * 60); // Aproximado: 60 km/h promedio
            double fuelConsumption = 0.10 + (Math.random() * 0.08); // Entre 0.10 y 0.18
            int trafficLevel = conn[4].equals("CITY") ? 4 : (conn[4].equals("RURAL") ? 1 : 2 + (int)(Math.random() * 2));
            double tollCost = distance * 0.15; // Aproximado
            double maintenanceCost = 0.3 + (Math.random() * 0.4); // Entre 0.3 y 0.7
            int maxWeight = 15000 + (int)(Math.random() * 15000); // Entre 15000 y 30000
            
            Route ruta = new Route(
                "R" + String.format("%03d", i + 1),
                "Ruta " + conn[0] + "-" + conn[1],
                distance,
                cost,
                duration,
                fuelConsumption,
                conn[4],
                trafficLevel,
                tollCost,
                maintenanceCost,
                maxWeight
            );
            rutas.add(ruta);
        }
        
        return rutas;
    }
    
    private void asociarCamionesACentros(List<DistributionCenter> centros, List<Truck> camiones) {
        // Distribuir camiones entre todos los centros
        int camionesPorCentro = camiones.size() / centros.size();
        int resto = camiones.size() % centros.size();
        
        int indiceCamion = 0;
        for (int i = 0; i < centros.size(); i++) {
            List<Truck> camionesCentro = new ArrayList<>();
            int cantidadParaEsteCentro = camionesPorCentro + (i < resto ? 1 : 0);
            
            for (int j = 0; j < cantidadParaEsteCentro && indiceCamion < camiones.size(); j++) {
                camionesCentro.add(camiones.get(indiceCamion));
                indiceCamion++;
            }
            
            centros.get(i).setTrucks(camionesCentro);
        }
    }
}

