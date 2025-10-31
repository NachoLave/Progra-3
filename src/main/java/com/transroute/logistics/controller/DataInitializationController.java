package com.transroute.logistics.controller;

import com.transroute.logistics.service.DataInitializationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para inicializar datos de prueba en Neo4j
 */
@RestController
@RequestMapping("/api/data-init")
@Tag(name = "Inicialización de Datos")
public class DataInitializationController {
    
    @Autowired
    private DataInitializationService dataInitializationService;
    
    @PostMapping("/load")
    @Operation(summary = "Carga datos iniciales de prueba en Neo4j", 
                description = "Crea centros de distribución, rutas y camiones con relaciones. Limpia datos existentes.")
    public ResponseEntity<Map<String, Object>> cargarDatos() {
        try {
            String report = dataInitializationService.inicializarDatos();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Datos cargados exitosamente");
            response.put("report", report);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al cargar datos: " + e.getMessage());
            error.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @DeleteMapping("/clear")
    @Operation(summary = "Elimina todos los datos de Neo4j")
    public ResponseEntity<Map<String, Object>> limpiarDatos() {
        try {
            dataInitializationService.limpiarDatos();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Datos eliminados exitosamente");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al eliminar datos: " + e.getMessage());
            
            return ResponseEntity.status(500).body(error);
        }
    }
}

