package com.transroute.logistics.controller;

import com.transroute.logistics.service.BranchAndBoundService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controlador REST para el módulo de Branch & Bound
 * Expone endpoints para optimización de rutas con restricciones
 */
@RestController
@RequestMapping("/api/branch-bound")
@Tag(name = "Módulo 7: Branch & Bound")
public class BranchAndBoundController {
    
    @Autowired
    private BranchAndBoundService branchAndBoundService;
    
    /**
     * Endpoint para encontrar la ruta óptima usando Branch & Bound
     * Complejidad: O(n!) en el peor caso, pero optimizado con podas agresivas
     */
    @PostMapping("/ruta-optima")
    @Operation(summary = "Encuentra la ruta óptima que visita todos los centros usando Branch & Bound",
                description = "Complejidad: O(n!) optimizado. Similar al TSP pero con restricciones de recursos.")
    public ResponseEntity<Map<String, Object>> encontrarRutaOptima(
            @Parameter(description = "Request con IDs de centros, presupuesto, distancia y opción de regreso", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> centerIds = (List<String>) request.get("centerIds");
        Integer presupuestoMaximo = request.get("presupuestoMaximo") != null ? 
                                   ((Number) request.get("presupuestoMaximo")).intValue() : 2000;
        Integer distanciaMaxima = request.get("distanciaMaxima") != null ? 
                                 ((Number) request.get("distanciaMaxima")).intValue() : 1000;
        Boolean debeRegresarOrigen = request.get("debeRegresarOrigen") != null ? 
                                     (Boolean) request.get("debeRegresarOrigen") : false;
        
        if (centerIds == null || centerIds.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe proporcionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        BranchAndBoundService.SolucionOptima solucion = 
            branchAndBoundService.encontrarRutaOptima(centerIds, presupuestoMaximo, 
                                                      distanciaMaxima, debeRegresarOrigen);
        
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("rutaOptima", solucion.rutaOptima);
        response.put("costoTotal", solucion.costoTotal);
        response.put("distanciaTotal", solucion.distanciaTotal);
        response.put("prioridadTotal", solucion.prioridadTotal);
        response.put("factible", solucion.factible);
        response.put("nodosExplorados", solucion.nodosExplorados);
        response.put("nodosPodados", solucion.nodosPodados);
        response.put("eficienciaPoda", solucion.nodosExplorados > 0 ? 
                    (double) solucion.nodosPodados / (solucion.nodosExplorados + solucion.nodosPodados) * 100 : 0);
        response.put("presupuestoMaximo", presupuestoMaximo);
        response.put("distanciaMaxima", distanciaMaxima);
        response.put("debeRegresarOrigen", debeRegresarOrigen);
        response.put("algoritmo", "Branch & Bound");
        response.put("complejidad", "O(n!) optimizado con podas agresivas");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("numeroCentros", centerIds.size());
        
        return ResponseEntity.ok(response);
    }
}


