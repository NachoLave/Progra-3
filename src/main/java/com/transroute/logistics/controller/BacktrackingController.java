package com.transroute.logistics.controller;

import com.transroute.logistics.service.BacktrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controlador REST para el módulo de Backtracking
 * Expone endpoints para encontrar secuencias óptimas de visitas a centros
 */
@RestController
@RequestMapping("/api/backtracking")
@Tag(name = "Módulo 6: Backtracking")
public class BacktrackingController {
    
    @Autowired
    private BacktrackingService backtrackingService;
    
    /**
     * Endpoint para encontrar la mejor secuencia de visitas usando Backtracking
     * Complejidad: O(n!) en el peor caso, pero optimizado con podas
     */
    @PostMapping("/mejor-secuencia")
    @Operation(summary = "Encuentra la mejor secuencia de visitas a centros usando Backtracking",
                description = "Complejidad: O(n!) optimizado. Encuentra la secuencia que maximiza prioridad respetando restricciones de presupuesto y distancia.")
    public ResponseEntity<Map<String, Object>> encontrarMejorSecuencia(
            @Parameter(description = "Request con IDs de centros, presupuesto y distancia máxima", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> centerIds = (List<String>) request.get("centerIds");
        Integer presupuestoMaximo = request.get("presupuestoMaximo") != null ? 
                                   ((Number) request.get("presupuestoMaximo")).intValue() : 1000;
        Integer distanciaMaxima = request.get("distanciaMaxima") != null ? 
                                 ((Number) request.get("distanciaMaxima")).intValue() : 500;
        
        if (centerIds == null || centerIds.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe proporcionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        BacktrackingService.SolucionSecuencia solucion = 
            backtrackingService.encontrarMejorSecuencia(centerIds, presupuestoMaximo, distanciaMaxima);
        
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("secuencia", solucion.secuencia);
        response.put("costoTotal", solucion.costoTotal);
        response.put("distanciaTotal", solucion.distanciaTotal);
        response.put("prioridadTotal", solucion.prioridadTotal);
        response.put("cumpleRestricciones", solucion.cumpleRestricciones);
        response.put("presupuestoMaximo", presupuestoMaximo);
        response.put("distanciaMaxima", distanciaMaxima);
        response.put("presupuestoUtilizado", solucion.costoTotal);
        response.put("presupuestoRestante", presupuestoMaximo - solucion.costoTotal);
        response.put("distanciaUtilizada", solucion.distanciaTotal);
        response.put("distanciaRestante", distanciaMaxima - solucion.distanciaTotal);
        response.put("algoritmo", "Backtracking");
        response.put("complejidad", "O(n!) optimizado con podas");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("numeroCentros", centerIds.size());
        
        return ResponseEntity.ok(response);
    }
}


