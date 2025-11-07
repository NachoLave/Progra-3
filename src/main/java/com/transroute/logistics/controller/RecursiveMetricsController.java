package com.transroute.logistics.controller;

import com.transroute.logistics.dto.CostCalculationRequest;
import com.transroute.logistics.dto.DistanceCalculationRequest;
import com.transroute.logistics.dto.CombinedMetricsRequest;
import com.transroute.logistics.service.RecursiveMetricsService;
import com.transroute.logistics.service.RecursiveMetricsService.RouteData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        
        double[] costs;
        String fuente;

        if (request != null && request.getCosts() != null && !request.getCosts().isEmpty()) {
            costs = request.getCosts().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            fuente = "request";
        } else {
            RouteData routeData = recursiveMetricsService.obtenerDatosRutasDesdeNeo4j();
            costs = routeData.getCosts();
            fuente = "neo4j";
        }

        costoTotal = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        numeroTramos = costs.length;

        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;

        Map<String, Object> response = new HashMap<>();
        response.put("costoTotal", costoTotal);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", executionTime);
        response.put("numeroTramos", numeroTramos);
        response.put("fuente", fuente);
        response.put("valoresOriginales", Arrays.stream(costs).boxed().collect(Collectors.toList()));
        response.put("acumulados", Arrays.stream(calcularAcumulados(costs)).boxed().collect(Collectors.toList()));
        response.put("pasosRecursion", construirPasos(costs));

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
        
        double[] distances;
        String fuente;

        if (request != null && request.getDistances() != null && !request.getDistances().isEmpty()) {
            distances = request.getDistances().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            fuente = "request";
        } else {
            RouteData routeData = recursiveMetricsService.obtenerDatosRutasDesdeNeo4j();
            distances = routeData.getDistances();
            fuente = "neo4j";
        }

        distanciaTotal = recursiveMetricsService.calcularDistanciaTotalRecursivo(distances, 0);
        numeroTramos = distances.length;

        long endTime = System.nanoTime();
        long executionTime = endTime - startTime;

        Map<String, Object> response = new HashMap<>();
        response.put("distanciaTotal", distanciaTotal);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", executionTime);
        response.put("numeroTramos", numeroTramos);
        response.put("fuente", fuente);
        response.put("valoresOriginales", Arrays.stream(distances).boxed().collect(Collectors.toList()));
        response.put("acumulados", Arrays.stream(calcularAcumulados(distances)).boxed().collect(Collectors.toList()));
        response.put("pasosRecursion", construirPasos(distances));

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
        
        double[] costs;
        double[] distances;

        if (request != null && request.getCosts() != null && !request.getCosts().isEmpty()) {
            if (request.getDistances() == null || request.getDistances().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Debe proporcionar distancias para calcular las métricas combinadas");
                return ResponseEntity.badRequest().body(error);
            }

            costs = request.getCosts().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();
            distances = request.getDistances().stream()
                    .mapToDouble(Double::doubleValue)
                    .toArray();

            if (costs.length != distances.length) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Los arrays de costos y distancias deben tener la misma longitud");
                return ResponseEntity.badRequest().body(error);
            }

            metrics = recursiveMetricsService.calcularMetricasCombinadas(costs, distances, 0);
            fuente = "request";
        } else {
            RouteData routeData = recursiveMetricsService.obtenerDatosRutasDesdeNeo4j();
            costs = routeData.getCosts();
            distances = routeData.getDistances();
            metrics = recursiveMetricsService.calcularMetricasCombinadas(costs, distances, 0);
            fuente = "neo4j";
        }

        Map<String, Object> response = new HashMap<>();
        response.put("costoTotal", metrics.getCostoTotal());
        response.put("distanciaTotal", metrics.getDistanciaTotal());
        response.put("costoPorKm", Math.round(metrics.getCostoPorKm() * 100.0) / 100.0);
        response.put("metodo", "recursivo");
        response.put("complejidad", "O(n)");
        response.put("fuente", fuente);
        response.put("numeroTramos", costs.length);
        response.put("costosOriginales", Arrays.stream(costs).boxed().collect(Collectors.toList()));
        response.put("distanciasOriginales", Arrays.stream(distances).boxed().collect(Collectors.toList()));
        response.put("acumuladosCostos", Arrays.stream(calcularAcumulados(costs)).boxed().collect(Collectors.toList()));
        response.put("acumuladosDistancias", Arrays.stream(calcularAcumulados(distances)).boxed().collect(Collectors.toList()));
        response.put("pasosCombinados", construirPasosCombinados(costs, distances));

        return ResponseEntity.ok(response);
    }

    private double[] calcularAcumulados(double[] valores) {
        double[] acumulados = new double[valores.length];
        double suma = 0;
        for (int i = 0; i < valores.length; i++) {
            suma += valores[i];
            acumulados[i] = suma;
        }
        return acumulados;
    }

    private List<Map<String, Object>> construirPasos(double[] valores) {
        List<Map<String, Object>> pasos = new ArrayList<>();
        double acumulado = 0;
        for (int i = 0; i < valores.length; i++) {
            acumulado += valores[i];
            Map<String, Object> paso = new HashMap<>();
            paso.put("indice", i);
            paso.put("valor", valores[i]);
            paso.put("acumulado", acumulado);
            pasos.add(paso);
        }
        return pasos;
    }

    private List<Map<String, Object>> construirPasosCombinados(double[] costs, double[] distances) {
        List<Map<String, Object>> pasos = new ArrayList<>();
        double acumuladoCosto = 0;
        double acumuladoDistancia = 0;
        for (int i = 0; i < costs.length && i < distances.length; i++) {
            acumuladoCosto += costs[i];
            acumuladoDistancia += distances[i];
            Map<String, Object> paso = new HashMap<>();
            paso.put("indice", i);
            paso.put("costo", costs[i]);
            paso.put("distancia", distances[i]);
            paso.put("costoAcumulado", acumuladoCosto);
            paso.put("distanciaAcumulada", acumuladoDistancia);
            paso.put("costoPorKm", acumuladoDistancia > 0 ? acumuladoCosto / acumuladoDistancia : 0);
            pasos.add(paso);
        }
        return pasos;
    }
}
