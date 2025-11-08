package com.transroute.logistics.controller;

import com.transroute.logistics.dto.DistribucionCombustiblePersonalizadaRequest;
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
     * Endpoint para obtener todos los camiones disponibles
     */
    @GetMapping("/camiones")
    @Operation(summary = "Obtiene todos los camiones desde Neo4j",
                description = "Retorna información completa de todos los camiones con su estado de combustible")
    public ResponseEntity<Map<String, Object>> obtenerTodosCamiones() {
        List<Map<String, Object>> camiones = greedyService.obtenerTodosCamiones();
        
        Map<String, Object> response = new HashMap<>();
        response.put("camiones", camiones);
        response.put("totalCamiones", camiones.size());
        response.put("fuente", "Neo4j");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para distribuir combustible a camiones SELECCIONADOS por el usuario
     */
    @PostMapping("/distribuir-combustible-personalizado")
    @Operation(summary = "Distribuye combustible a camiones seleccionados por el usuario",
                description = "Permite seleccionar qué camiones usar y especificar la cantidad de combustible disponible")
    public ResponseEntity<Map<String, Object>> distribuirCombustiblePersonalizado(
            @Parameter(description = "Lista de IDs de camiones seleccionados y combustible disponible")
            @RequestBody DistribucionCombustiblePersonalizadaRequest request) {
        
        long startTime = System.nanoTime();
        Map<String, Object> resultado = greedyService.distribuirCombustiblePersonalizado(
                request.getTruckIds(), 
                request.getCombustibleDisponible()
        );
        long endTime = System.nanoTime();
        
        // Agregar información del algoritmo
        resultado.put("algoritmo", "Greedy - Distribución Personalizada");
        resultado.put("estrategia", "Prioriza camiones seleccionados con menor porcentaje de combustible");
        resultado.put("complejidad", "O(n log n)");
        resultado.put("tiempoEjecucionNanosegundos", endTime - startTime);
        resultado.put("fuente", "Neo4j (camiones seleccionados)");
        
        return ResponseEntity.ok(resultado);
    }

    /**
     * Endpoint para distribuir combustible usando algoritmo Greedy
     * Ejemplo: 87 litros con bidones de [50, 20, 10, 5, 2]
     * Resultado: 1x50 + 1x20 + 1x10 + 1x5 + 1x2 = 87
     * 
     * Complejidad: O(n) donde n es el número de tamaños disponibles
     */
    @PostMapping("/distribuir-combustible")
    @Operation(summary = "Distribuye combustible usando algoritmo Greedy desde Neo4j",
                description = "Obtiene camiones de Neo4j y usa sus capacidades de combustible.")
    public ResponseEntity<Map<String, Object>> distribuirCombustible(
            @Parameter(description = "Cantidad requerida y tamaños (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) FuelDistributionRequest request) {
        
        long startTime = System.nanoTime();
        Map<Integer, Integer> distribucion;
        String fuente;
        List<Integer> tamanosDisponibles;
        
        if (request != null && request.getAvailableSizes() != null && !request.getAvailableSizes().isEmpty()) {
            tamanosDisponibles = request.getAvailableSizes();
            distribucion = greedyService.distribuirCombustibleGreedy(
                    request.getRequiredAmount(), 
                    tamanosDisponibles
            );
            fuente = "request";
        } else {
            int requiredAmount = request != null ? request.getRequiredAmount() : greedyService.obtenerCombustibleTotalDisponible() / 2;
            distribucion = greedyService.distribuirCombustibleDesdeNeo4j(requiredAmount);
            // Obtener los tamaños disponibles de la distribución para el caso Neo4j
            tamanosDisponibles = distribucion.keySet().stream().sorted((a, b) -> b - a).toList();
            fuente = "neo4j";
        }
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
        int cantidadRequerida = request != null ? request.getRequiredAmount() : 
                                greedyService.obtenerCombustibleTotalDisponible() / 2;
        response.put("cantidadRequerida", cantidadRequerida);
        response.put("diferencia", totalDistribuido - cantidadRequerida);
        response.put("tamanosDisponibles", tamanosDisponibles); // ✅ Agregar TODOS los tamaños disponibles
        response.put("algoritmo", "Greedy (Cambio de Monedas)");
        response.put("complejidad", "O(n)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("fuente", fuente);
        
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
        response.put("proyectos", proyectos); // Enviar los proyectos para la visualización
        response.put("presupuestoTotal", presupuestoTotal);
        response.put("presupuestoAsignado", totalAsignado);
        response.put("presupuestoRestante", presupuestoTotal - totalAsignado);
        response.put("algoritmo", "Greedy (Mochila Fraccional)");
        response.put("complejidad", "O(n log n) por el ordenamiento");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para distribuir combustible de forma optimizada usando datos de Neo4j
     * Prioriza camiones con menor nivel de combustible
     */
    @PostMapping("/distribuir-combustible-optimizado")
    @Operation(summary = "Distribuye combustible a camiones desde Neo4j de forma optimizada",
                description = "Usa algoritmo Greedy para asignar combustible priorizando camiones con menor nivel de combustible actual")
    public ResponseEntity<Map<String, Object>> distribuirCombustibleOptimizado(
            @Parameter(description = "Cantidad total de combustible disponible para distribuir")
            @RequestParam int combustibleDisponible) {
        
        long startTime = System.nanoTime();
        Map<String, Object> resultado = greedyService.distribuirCombustibleOptimizado(combustibleDisponible);
        long endTime = System.nanoTime();
        
        // Agregar información del algoritmo
        resultado.put("algoritmo", "Greedy - Distribución de Combustible Optimizado");
        resultado.put("estrategia", "Prioriza camiones con menor porcentaje de combustible");
        resultado.put("complejidad", "O(n log n) por el ordenamiento de camiones");
        resultado.put("tiempoEjecucionNanosegundos", endTime - startTime);
        resultado.put("fuente", "Neo4j");
        
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * Endpoint para distribuir peso/carga a camiones usando algoritmo Greedy
     * Usa First Fit Decreasing: ordena cargas de mayor a menor y asigna al primer camión disponible
     */
    @PostMapping("/distribuir-peso")
    @Operation(summary = "Distribuye peso/carga a camiones usando algoritmo Greedy",
                description = "Usa First Fit Decreasing para asignar cargas a camiones disponibles de Neo4j")
    public ResponseEntity<Map<String, Object>> distribuirPeso(
            @Parameter(description = "Lista de pesos de las cargas a distribuir (en kg)")
            @RequestBody List<Integer> cargasDisponibles) {
        
        long startTime = System.nanoTime();
        Map<String, Object> resultado = greedyService.distribuirPesoGreedy(cargasDisponibles);
        long endTime = System.nanoTime();
        
        // Agregar información del algoritmo
        resultado.put("algoritmo", "Greedy - First Fit Decreasing");
        resultado.put("estrategia", "Ordena cargas por peso (descendente) y asigna al primer camión con capacidad");
        resultado.put("complejidad", "O(n log n + n*m) donde n=cargas, m=camiones");
        resultado.put("tiempoEjecucionNanosegundos", endTime - startTime);
        resultado.put("fuente", "Neo4j (camiones)");
        
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * Endpoint para asignar cargas desde centros de distribución a camiones
     * Considera prioridades de los centros y demanda
     */
    @GetMapping("/asignar-cargas-desde-centros")
    @Operation(summary = "Asigna cargas desde centros de distribución a camiones",
                description = "Usa datos completos de Neo4j: centros, camiones y rutas. Prioriza centros con mayor prioridad y mayor demanda")
    public ResponseEntity<Map<String, Object>> asignarCargasDesdeNeo4j() {
        
        long startTime = System.nanoTime();
        Map<String, Object> resultado = greedyService.asignarCargasDesdeNeo4j();
        long endTime = System.nanoTime();
        
        // Agregar información del algoritmo
        resultado.put("algoritmo", "Greedy - Asignación de Cargas con Prioridades");
        resultado.put("estrategia", "Ordena centros por prioridad y demanda, asigna al primer camión disponible");
        resultado.put("complejidad", "O(n log n + n*m) donde n=centros, m=camiones");
        resultado.put("tiempoEjecucionNanosegundos", endTime - startTime);
        resultado.put("fuente", "Neo4j (centros, camiones, rutas)");
        
        return ResponseEntity.ok(resultado);
    }
}

