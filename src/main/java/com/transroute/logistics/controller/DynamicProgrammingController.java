package com.transroute.logistics.controller;

import com.transroute.logistics.dto.KnapsackRequest;
import com.transroute.logistics.service.DynamicProgrammingService;
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
 * Controlador REST para el módulo de Programación Dinámica
 * Expone endpoints para planificación de inversiones usando mochila 0/1
 */
@RestController
@RequestMapping("/api/dynamic-programming")
@Tag(name = "Módulo 5: Programación Dinámica")
public class DynamicProgrammingController {

    @Autowired
    private DynamicProgrammingService dpService;

    /**
     * Endpoint para resolver el problema de la mochila 0/1
     * Determina qué proyectos financiar para maximizar el beneficio
     * 
     * Complejidad: O(n × P) donde n = proyectos, P = presupuesto
     */
    @PostMapping("/mochila")
    @Operation(summary = "Resuelve el problema de la mochila 0/1 para optimizar inversiones",
                description = "Complejidad: O(n × P). Determina qué proyectos financiar con presupuesto fijo para maximizar beneficio.")
    public ResponseEntity<Map<String, Object>> resolverMochila(
            @Parameter(description = "Lista de proyectos y presupuesto disponible", required = true)
            @RequestBody KnapsackRequest request) {
        
        long startTime = System.nanoTime();
        
        DynamicProgrammingService.SolucionMochila solucion;
        if (request.getOptimized()) {
            solucion = dpService.resolverMochila01Optimizado(request.getProyectos(), request.getPresupuesto());
        } else {
            solucion = dpService.resolverMochila01(request.getProyectos(), request.getPresupuesto());
        }
        
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("proyectosSeleccionados", solucion.proyectosSeleccionados);
        response.put("costoTotal", solucion.costoTotal);
        response.put("beneficioTotal", solucion.beneficioTotal);
        response.put("presupuestoUtilizado", solucion.presupuestoUtilizado);
        response.put("presupuestoRestante", solucion.presupuestoDisponible);
        response.put("presupuestoInicial", request.getPresupuesto());
        response.put("numeroProyectosSeleccionados", solucion.proyectosSeleccionados.size());
        response.put("numeroProyectosDisponibles", request.getProyectos().size());
        response.put("algoritmo", "Programación Dinámica (Mochila 0/1)");
        response.put("complejidad", "O(n × P)");
        response.put("version", request.getOptimized() ? "Optimizada (espacio O(P))" : "Estándar (espacio O(n × P))");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para obtener la tabla DP completa
     * Útil para visualizar cómo se construye la solución
     */
    @PostMapping("/mochila/tabla-dp")
    @Operation(summary = "Obtiene la tabla DP completa para análisis detallado",
                description = "Muestra cómo se construye la solución paso a paso")
    public ResponseEntity<Map<String, Object>> obtenerTablaDP(
            @Parameter(description = "Lista de proyectos y presupuesto", required = true)
            @RequestBody KnapsackRequest request) {
        
        long startTime = System.nanoTime();
        List<List<Integer>> tabla = dpService.obtenerTablaDP(request.getProyectos(), request.getPresupuesto());
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("tablaDP", tabla);
        response.put("numeroProyectos", request.getProyectos().size());
        response.put("presupuesto", request.getPresupuesto());
        response.put("dimensiones", "(" + (request.getProyectos().size() + 1) + " × " + (request.getPresupuesto() + 1) + ")");
        response.put("explicacion", "dp[i][w] = máximo beneficio usando los primeros i proyectos con presupuesto w");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para comparar DP con Greedy
     * Demuestra por qué DP es óptimo para este problema
     */
    @PostMapping("/mochila/comparar-greedy")
    @Operation(summary = "Compara Programación Dinámica con algoritmo Greedy",
                description = "Demuestra que DP siempre encuentra la solución óptima, mientras que Greedy puede fallar")
    public ResponseEntity<Map<String, Object>> compararConGreedy(
            @Parameter(description = "Lista de proyectos y presupuesto", required = true)
            @RequestBody KnapsackRequest request) {
        
        long startTime = System.nanoTime();
        Map<String, Object> comparacion = dpService.compararConGreedy(request.getProyectos(), request.getPresupuesto());
        long endTime = System.nanoTime();
        
        comparacion.put("tiempoEjecucionTotalNanosegundos", endTime - startTime);
        comparacion.put("analisis", "Programación Dinámica garantiza la solución óptima, mientras que Greedy puede no encontrarla en todos los casos");
        
        return ResponseEntity.ok(comparacion);
    }

    /**
     * Endpoint para obtener estadísticas de eficiencia
     */
    @PostMapping("/mochila/estadisticas")
    @Operation(summary = "Obtiene estadísticas de eficiencia del algoritmo")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(
            @Parameter(description = "Lista de proyectos y presupuesto", required = true)
            @RequestBody KnapsackRequest request) {
        
        int n = request.getProyectos().size();
        int P = request.getPresupuesto();
        
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("numeroProyectos", n);
        estadisticas.put("presupuesto", P);
        estadisticas.put("complejidadTemporal", "O(n × P) = O(" + (n * P) + ")");
        estadisticas.put("complejidadEspacialEstandar", "O(n × P) = O(" + (n * P) + ")");
        estadisticas.put("complejidadEspacialOptimizada", "O(P) = O(" + P + ")");
        estadisticas.put("explicacion", 
                "El algoritmo construye una tabla DP donde cada celda representa el máximo beneficio " +
                "posible usando los primeros i proyectos con presupuesto w. La solución óptima se encuentra " +
                "en dp[n][P] y luego se reconstruye el camino para identificar qué proyectos fueron seleccionados.");
        
        return ResponseEntity.ok(estadisticas);
    }
}

