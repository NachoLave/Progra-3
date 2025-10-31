package com.transroute.logistics.controller;

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
import java.util.Map;

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
}

