package com.transroute.logistics.controller;

import com.transroute.logistics.dto.FuelDistributionRequest;
import com.transroute.logistics.service.GreedyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el módulo de Algoritmos Greedy
 * Expone endpoints para asignación de recursos en tiempo real
 */
@RestController
@RequestMapping("/api/greedy")
@Tag(name = "Módulo 3: Algoritmos Greedy")
public class GreedyController {

    @Autowired
    private GreedyService greedyService;

    /**
     * Endpoint para distribuir combustible usando algoritmo Greedy
     * Ejemplo: 87 litros con bidones de [50, 20, 10, 5, 2]
     * Resultado: 1x50 + 1x20 + 1x10 + 1x5 + 1x2 = 87
     * 
     * Complejidad: O(n) donde n es el número de tamaños disponibles
     */
    @PostMapping("/distribuir-combustible")
    @Operation(summary = "Distribuye combustible de forma óptima usando algoritmo Greedy",
                description = "Ejemplo: 87 litros con bidones [50,20,10,5,2] → 1x50 + 1x20 + 1x10 + 1x5 + 1x2")
    public ResponseEntity<Map<String, Object>> distribuirCombustible(
            @Parameter(description = "Cantidad requerida y tamaños disponibles", required = true)
            @RequestBody FuelDistributionRequest request) {
        
        long startTime = System.nanoTime();
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(
                request.getRequiredAmount(), 
                request.getAvailableSizes()
        );
        long endTime = System.nanoTime();
        
        // Calcular total distribuido
        int totalDistribuido = distribucion.entrySet().stream()
                .mapToInt(e -> e.getKey() * e.getValue())
                .sum();
        
        // Calcular cantidad de bidones usados
        int cantidadBidones = distribucion.values().stream()
                .mapToInt(Integer::intValue)
                .sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("distribucion", distribucion);
        response.put("totalDistribuido", totalDistribuido);
        response.put("cantidadBidonesUsados", cantidadBidones);
        response.put("cantidadRequerida", request.getRequiredAmount());
        response.put("diferencia", totalDistribuido - request.getRequiredAmount());
        response.put("algoritmo", "Greedy (Cambio de Monedas)");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para asignar combustible a múltiples camiones
     */
    @PostMapping("/asignar-multiples-camiones")
    @Operation(summary = "Asigna combustible a múltiples camiones usando estrategia Greedy")
    public ResponseEntity<Map<String, Object>> asignarMultiplesCamiones(
            @RequestParam Map<String, Integer> trucks,
            @RequestParam int availableFuel,
            @RequestBody List<Integer> availableSizes) {
        
        long startTime = System.nanoTime();
        Map<String, Map<Integer, Integer>> asignacion = greedyService.asignarCombustibleMultiplesCamiones(
                trucks, availableFuel, availableSizes
        );
        long endTime = System.nanoTime();
        
        // Calcular estadísticas
        int totalUsado = 0;
        for (Map<Integer, Integer> dist : asignacion.values()) {
            totalUsado += dist.entrySet().stream()
                    .mapToInt(e -> e.getKey() * e.getValue())
                    .sum();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("asignacion", asignacion);
        response.put("combustibleTotalDisponible", availableFuel);
        response.put("combustibleTotalUsado", totalUsado);
        response.put("combustibleRestante", availableFuel - totalUsado);
        response.put("algoritmo", "Greedy");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para distribución de presupuesto usando mochila fraccional (Greedy)
     */
    @PostMapping("/distribuir-presupuesto")
    @Operation(summary = "Distribuye presupuesto usando mochila fraccional (Greedy)",
                description = "Ordena proyectos por ratio beneficio/costo y asigna empezando por los mejores")
    public ResponseEntity<Map<String, Object>> distribuirPresupuesto(
            @RequestBody List<GreedyService.Proyecto> proyectos,
            @RequestParam double presupuestoTotal) {
        
        long startTime = System.nanoTime();
        Map<String, Double> distribucion = greedyService.distribuirPresupuestoFraccional(
                proyectos, presupuestoTotal
        );
        long endTime = System.nanoTime();
        
        double totalAsignado = distribucion.values().stream()
                .mapToDouble(Double::doubleValue)
                .sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("distribucion", distribucion);
        response.put("presupuestoTotal", presupuestoTotal);
        response.put("presupuestoAsignado", totalAsignado);
        response.put("presupuestoRestante", presupuestoTotal - totalAsignado);
        response.put("algoritmo", "Greedy (Mochila Fraccional)");
        response.put("complejidad", "O(n log n) por el ordenamiento");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }
}

