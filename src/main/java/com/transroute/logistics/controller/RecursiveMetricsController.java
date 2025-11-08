package com.transroute.logistics.controller;

import com.transroute.logistics.dto.CostCalculationRequest;
import com.transroute.logistics.dto.DistanceCalculationRequest;
import com.transroute.logistics.dto.CombinedMetricsRequest;
import com.transroute.logistics.service.RecursiveMetricsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST para el módulo de Complejidad y Recursividad
 * Expone endpoints para cálculos recursivos de métricas operativas
 */
@RestController
@RequestMapping("/api/recursive-metrics")
@Tag(name = "Módulo 1: Complejidad y Recursividad")
public class RecursiveMetricsController {

    @Autowired
    private RecursiveMetricsService recursiveMetricsService;

    /**
     * Endpoint para calcular costo total usando recursión
     * 
     * Ejemplo de entrada:
     * {
     *   "costs": [150.5, 200.0, 75.25, 300.0]
     * }
     * 
     * Ejemplo de salida:
     * {
     *   "costoTotal": 725.75,
     *   "metodo": "recursivo",
     *   "complejidad": "O(n)"
     * }
     */
    @PostMapping("/costo-total")
    @Operation(summary = "Calcula el costo total de transporte usando recursión desde Neo4j", 
                description = "Implementa T(n) = T(n-1) + O(1) = O(n). Obtiene rutas de Neo4j.")
    public ResponseEntity<Map<String, Object>> calcularCostoTotal(
            @Parameter(description = "Array de costos por tramo (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) CostCalculationRequest request) {
        
        long startTime = System.nanoTime();
        double costoTotal;
        int numeroTramos;
        double[] costsArray = null;
        
        if (request != null && request.getCosts() != null && !request.getCosts().isEmpty()) {
            // Usar datos del request
            costsArray = request.getCosts().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            costoTotal = recursiveMetricsService.calcularCostoTotalRecursivo(costsArray, 0);
            numeroTramos = costsArray.length;
        } else {
            // Obtener desde Neo4j
            costoTotal = recursiveMetricsService.obtenerRutasYCalcularCostoTotalRecursivo();
            numeroTramos = recursiveMetricsService.getNumeroRutas();
        }
        
        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;
        
        Map<String, Object> response = new HashMap<>();
        response.put("costoTotal", costoTotal);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", executionTime);
        response.put("numeroTramos", numeroTramos);
        response.put("fuente", request != null && request.getCosts() != null && !request.getCosts().isEmpty() ? "request" : "neo4j");
        
        // Agregar los costos individuales si están disponibles
        if (costsArray != null) {
            response.put("costosIndividuales", costsArray);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para calcular distancia total usando recursión
     * 
     * Ejemplo de entrada:
     * {
     *   "distances": [50.0, 75.5, 30.0, 100.0]
     * }
     * 
     * Ejemplo de salida:
     * {
     *   "distanciaTotal": 255.5,
     *   "metodo": "recursivo",
     *   "complejidad": "O(n)"
     * }
     */
    @PostMapping("/distancia-total")
    @Operation(summary = "Calcula la distancia total recorrida usando recursión desde Neo4j")
    public ResponseEntity<Map<String, Object>> calcularDistanciaTotal(
            @Parameter(description = "Array de distancias por tramo (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) DistanceCalculationRequest request) {
        
        long startTime = System.nanoTime();
        double distanciaTotal;
        int numeroTramos;
        double[] distancesArray = null;
        
        if (request != null && request.getDistances() != null && !request.getDistances().isEmpty()) {
            distancesArray = request.getDistances().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            distanciaTotal = recursiveMetricsService.calcularDistanciaTotalRecursivo(distancesArray, 0);
            numeroTramos = distancesArray.length;
        } else {
            distanciaTotal = recursiveMetricsService.obtenerRutasYCalcularDistanciaTotalRecursivo();
            numeroTramos = recursiveMetricsService.getNumeroRutas();
        }
        
        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;
        
        Map<String, Object> response = new HashMap<>();
        response.put("distanciaTotal", distanciaTotal);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", executionTime);
        response.put("numeroTramos", numeroTramos);
        response.put("fuente", request != null && request.getDistances() != null && !request.getDistances().isEmpty() ? "request" : "neo4j");
        
        // Agregar las distancias individuales si están disponibles
        if (distancesArray != null) {
            response.put("distanciasIndividuales", distancesArray);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para comparar rendimiento entre recursión e iteración
     * 
     * Ejemplo de entrada:
     * {
     *   "costs": [150.5, 200.0, 75.25, 300.0]
     * }
     * 
     * Ejemplo de salida:
     * {
     *   "recursivo": {
     *     "costoTotal": 725.75,
     *     "tiempoEjecucion": 1500
     *   },
     *   "iterativo": {
     *     "costoTotal": 725.75,
     *     "tiempoEjecucion": 800
     *   },
     *   "diferenciaTiempo": 700
     * }
     */
    @PostMapping("/comparar-rendimiento")
    @Operation(summary = "Compara rendimiento entre recursión e iteración")
    public ResponseEntity<Map<String, Object>> compararRendimiento(
            @Parameter(description = "Array de costos para comparar", required = true)
            @RequestBody CostCalculationRequest request) {
        
        // Convertir List<Double> a double[]
        double[] costs = request.getCosts().stream()
                .mapToDouble(Double::doubleValue)
                .toArray();
        
        // Medir tiempo recursivo
        long startRecursive = System.nanoTime();
        double costoRecursivo = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        long endRecursive = System.nanoTime();
        long tiempoRecursivo = endRecursive - startRecursive;
        
        // Medir tiempo iterativo
        long startIterative = System.nanoTime();
        double costoIterativo = recursiveMetricsService.calcularCostoTotalIterativo(costs);
        long endIterative = System.nanoTime();
        long tiempoIterativo = endIterative - startIterative;
        
        Map<String, Object> response = new HashMap<>();
        
        Map<String, Object> recursivo = new HashMap<>();
        recursivo.put("costoTotal", costoRecursivo);
        recursivo.put("tiempoEjecucion", tiempoRecursivo);
        
        Map<String, Object> iterativo = new HashMap<>();
        iterativo.put("costoTotal", costoIterativo);
        iterativo.put("tiempoEjecucion", tiempoIterativo);
        
        response.put("recursivo", recursivo);
        response.put("iterativo", iterativo);
        response.put("diferenciaTiempo", Math.abs(tiempoRecursivo - tiempoIterativo));
        response.put("analisis", "La versión iterativa generalmente es más eficiente en memoria");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para calcular métricas combinadas de una ruta
     * 
     * Ejemplo de entrada:
     * {
     *   "costs": [150.5, 200.0, 75.25],
     *   "distances": [50.0, 75.5, 30.0]
     * }
     * 
     * Ejemplo de salida:
     * {
     *   "costoTotal": 425.75,
     *   "distanciaTotal": 155.5,
     *   "costoPorKm": 2.74,
     *   "metodo": "recursivo"
     * }
     */
    @PostMapping("/metricas-combinadas")
    @Operation(summary = "Calcula métricas combinadas de costo y distancia usando recursión desde Neo4j")
    public ResponseEntity<Map<String, Object>> calcularMetricasCombinadas(
            @Parameter(description = "Arrays de costos y distancias (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) CombinedMetricsRequest request) {
        
        RecursiveMetricsService.RouteMetrics metrics;
        String fuente;
        double[] costsArray = null;
        double[] distancesArray = null;
        
        if (request != null && request.getCosts() != null && !request.getCosts().isEmpty()) {
            costsArray = request.getCosts().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            distancesArray = request.getDistances().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            
            if (costsArray.length != distancesArray.length) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Los arrays de costos y distancias deben tener la misma longitud");
                return ResponseEntity.badRequest().body(error);
            }
            
            metrics = recursiveMetricsService.calcularMetricasCombinadas(costsArray, distancesArray, 0);
            fuente = "request";
        } else {
            metrics = recursiveMetricsService.obtenerRutasYCalcularMetricasCombinadas();
            fuente = "neo4j";
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("costoTotal", metrics.getCostoTotal());
        response.put("distanciaTotal", metrics.getDistanciaTotal());
        response.put("costoPorKm", Math.round(metrics.getCostoPorKm() * 100.0) / 100.0);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("fuente", fuente);
        
        // Agregar los arrays individuales si están disponibles
        if (costsArray != null && distancesArray != null) {
            response.put("costosIndividuales", costsArray);
            response.put("distanciasIndividuales", distancesArray);
        }
        
        return ResponseEntity.ok(response);
    }
}
