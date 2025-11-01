package com.transroute.logistics.controller;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.model.Truck;
import com.transroute.logistics.repository.DistributionCenterRepository;
import com.transroute.logistics.repository.RouteRepository;
import com.transroute.logistics.repository.TruckRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador para probar la conexión con Neo4j
 */
@RestController
@RequestMapping("/api/neo4j")
@Tag(name = "Neo4j Test")
public class Neo4jTestController {
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private TruckRepository truckRepository;
    
    @GetMapping("/test")
    @Operation(summary = "Prueba la conexión con Neo4j y cuenta las entidades")
    public ResponseEntity<Map<String, Object>> testConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            long centersCount = distributionCenterRepository.count();
            long routesCount = routeRepository.count();
            long trucksCount = truckRepository.count();
            
            result.put("connected", true);
            result.put("message", "Conexión exitosa con Neo4j Aura");
            result.put("counts", Map.of(
                    "centros", centersCount,
                    "rutas", routesCount,
                    "camiones", trucksCount
            ));
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("connected", false);
            result.put("message", "Error al conectar con Neo4j: " + e.getMessage());
            result.put("error", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(result);
        }
    }

    @GetMapping("/data")
    @Operation(summary = "Obtiene todos los datos detallados de Neo4j")
    public ResponseEntity<Map<String, Object>> getData() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Verificar conexión primero
            long centersCount = distributionCenterRepository.count();
            long routesCount = routeRepository.count();
            long trucksCount = truckRepository.count();
            
            // Si no hay datos, retornar listas vacías
            if (centersCount == 0 && routesCount == 0 && trucksCount == 0) {
                result.put("centros", List.of());
                result.put("rutas", List.of());
                result.put("camiones", List.of());
                result.put("summary", Map.of(
                        "totalCentros", 0,
                        "totalRutas", 0,
                        "totalCamiones", 0
                ));
                result.put("message", "No hay datos cargados en Neo4j. Por favor, carga los datos primero.");
                return ResponseEntity.ok(result);
            }
            
            List<DistributionCenter> centers = distributionCenterRepository.findAll();
            List<Route> routes = routeRepository.findAll();
            List<Truck> trucks = truckRepository.findAll();
            
            result.put("centros", centers.stream().map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", c.getId() != null ? c.getId() : "");
                map.put("name", c.getName() != null ? c.getName() : "");
                map.put("city", c.getCity() != null ? c.getCity() : "");
                map.put("demandLevel", c.getDemandLevel() != null ? c.getDemandLevel() : 0);
                map.put("capacity", c.getCapacity() != null ? c.getCapacity() : 0);
                map.put("priority", c.getPriority() != null ? c.getPriority() : 0);
                return map;
            }).collect(Collectors.toList()));
            
            result.put("rutas", routes.stream().map(r -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId() != null ? r.getId() : "");
                map.put("name", r.getName() != null ? r.getName() : "");
                map.put("distance", r.getDistance() != null ? r.getDistance() : 0.0);
                map.put("cost", r.getCost() != null ? r.getCost() : 0.0);
                try {
                    DistributionCenter from = r.getFromCenter();
                    DistributionCenter to = r.getToCenter();
                    map.put("fromCenter", from != null && from.getId() != null ? from.getId() : "N/A");
                    map.put("toCenter", to != null && to.getId() != null ? to.getId() : "N/A");
                } catch (Exception e) {
                    map.put("fromCenter", "N/A");
                    map.put("toCenter", "N/A");
                }
                return map;
            }).collect(Collectors.toList()));
            
            result.put("camiones", trucks.stream().map(t -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", t.getId() != null ? t.getId() : "");
                map.put("licensePlate", t.getLicensePlate() != null ? t.getLicensePlate() : "");
                map.put("capacity", t.getCapacity() != null ? t.getCapacity() : 0);
                map.put("fuelCapacity", t.getFuelCapacity() != null ? t.getFuelCapacity() : 0);
                map.put("currentFuel", t.getCurrentFuel() != null ? t.getCurrentFuel() : 0);
                map.put("status", t.getStatus() != null ? t.getStatus() : "UNKNOWN");
                return map;
            }).collect(Collectors.toList()));
            
            result.put("summary", Map.of(
                    "totalCentros", centers.size(),
                    "totalRutas", routes.size(),
                    "totalCamiones", trucks.size()
            ));
            
            return ResponseEntity.ok(result);
        } catch (org.springframework.transaction.TransactionSystemException e) {
            // Manejo específico para errores de transacción de Neo4j
            String errorMsg = e.getMessage();
            if (errorMsg != null && (errorMsg.contains("No routing server available") || 
                                     errorMsg.contains("Could not perform discovery"))) {
                result.put("error", "No se puede conectar a Neo4j Aura. El servidor de routing no está disponible.");
                result.put("errorDetails", "TransactionSystemException - Problema de conexión");
                result.put("suggestions", List.of(
                    "Verifica que la instancia de Neo4j Aura esté en estado 'Running' (no pausada)",
                    "Espera 1-2 minutos después de reactivar la instancia",
                    "Reinicia la aplicación Spring Boot",
                    "Verifica la URI en application.properties: neo4j+s://9b399f10.databases.neo4j.io",
                    "Prueba la conexión desde Neo4j Browser en el dashboard"
                ));
            } else {
                result.put("error", "Error de transacción: " + errorMsg);
                result.put("errorDetails", e.getClass().getSimpleName());
            }
            e.printStackTrace(); // Para debugging
            return ResponseEntity.status(500).body(result);
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            result.put("error", "Error al obtener datos: " + (errorMsg != null ? errorMsg : e.getClass().getSimpleName()));
            result.put("errorDetails", e.getClass().getSimpleName());
            
            // Agregar sugerencias si es un error de conexión
            if (errorMsg != null && (errorMsg.contains("No routing server") || 
                                     errorMsg.contains("Could not perform discovery") ||
                                     errorMsg.contains("Connection refused"))) {
                result.put("suggestions", List.of(
                    "Verifica que Neo4j Aura esté activo y no pausado",
                    "Espera unos minutos después de reactivar la instancia",
                    "Reinicia la aplicación Spring Boot"
                ));
            }
            
            e.printStackTrace(); // Para debugging
            return ResponseEntity.status(500).body(result);
        }
    }
}

