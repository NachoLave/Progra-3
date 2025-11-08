package com.transroute.logistics.controller;

import com.transroute.logistics.dto.BinarySearchRequest;
import com.transroute.logistics.dto.CenterSortRequest;
import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.service.DivideAndConquerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST para el módulo de Divide y Vencerás
 * Expone endpoints para ordenamiento y búsqueda eficiente de centros
 */
@RestController
@RequestMapping("/api/divide-conquer")
@Tag(name = "Módulo 2: Divide y Vencerás")
public class DivideAndConquerController {

    @Autowired
    private DivideAndConquerService divideAndConquerService;

    /**
     * Endpoint para ordenar centros por demanda usando MergeSort
     * Complejidad: O(n log n)
     */
    @PostMapping("/ordenar/mergesort")
    @Operation(summary = "Ordena centros por demanda usando MergeSort desde Neo4j", 
                description = "Complejidad: O(n log n). Obtiene centros de Neo4j y los ordena usando Divide y Vencerás.")
    public ResponseEntity<Map<String, Object>> ordenarPorDemandaMergeSort(
            @Parameter(description = "Request opcional con IDs específicos (si está vacío, usa todos)", required = false)
            @RequestBody(required = false) CenterSortRequest request) {
        
        long startTime = System.nanoTime();
        List<DistributionCenter> sorted;
        
        // Si se especifican IDs, filtrar solo esos centros. Sino, todos.
        if (request != null && request.getCenterIds() != null && !request.getCenterIds().isEmpty()) {
            sorted = divideAndConquerService.obtenerYOrdenarPorDemandaMergeSortConIds(request.getCenterIds());
        } else {
            sorted = divideAndConquerService.obtenerYOrdenarPorDemandaMergeSort();
        }
        
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("centrosOrdenados", sorted.stream()
                .map(c -> Map.of(
                        "id", c.getId(),
                        "name", c.getName(),
                        "demandLevel", c.getDemandLevel(),
                        "priority", c.getPriority()
                ))
                .collect(Collectors.toList()));
        response.put("algoritmo", "MergeSort");
        response.put("complejidad", "O(n log n)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("numeroCentros", sorted.size());
        response.put("idsEspecificados", request != null && request.getCenterIds() != null ? request.getCenterIds() : "Todos");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para ordenar centros por prioridad usando QuickSort
     * Complejidad: O(n log n) promedio, O(n²) peor caso
     */
    @PostMapping("/ordenar/quicksort")
    @Operation(summary = "Ordena centros por prioridad usando QuickSort desde Neo4j",
                description = "Complejidad: O(n log n) promedio. Obtiene centros de Neo4j y los ordena.")
    public ResponseEntity<Map<String, Object>> ordenarPorPrioridadQuickSort(
            @Parameter(description = "Request opcional con IDs específicos (si está vacío, usa todos)", required = false)
            @RequestBody(required = false) CenterSortRequest request) {
        
        long startTime = System.nanoTime();
        List<DistributionCenter> sorted;
        
        // Si se especifican IDs, filtrar solo esos centros. Sino, todos.
        if (request != null && request.getCenterIds() != null && !request.getCenterIds().isEmpty()) {
            sorted = divideAndConquerService.obtenerYOrdenarPorPrioridadQuickSortConIds(request.getCenterIds());
        } else {
            sorted = divideAndConquerService.obtenerYOrdenarPorPrioridadQuickSort();
        }
        
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("centrosOrdenados", sorted.stream()
                .map(c -> Map.of(
                        "id", c.getId(),
                        "name", c.getName(),
                        "priority", c.getPriority(),
                        "demandLevel", c.getDemandLevel()
                ))
                .collect(Collectors.toList()));
        response.put("algoritmo", "QuickSort");
        response.put("complejidad", "O(n log n) promedio, O(n²) peor caso");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("numeroCentros", sorted.size());
        response.put("idsEspecificados", request != null && request.getCenterIds() != null ? request.getCenterIds() : "Todos");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para buscar centro por demanda usando Búsqueda Binaria
     * Complejidad: O(log n)
     * REQUIERE: Lista previamente ordenada
     */
    @PostMapping("/buscar/binaria-demanda")
    @Operation(summary = "Busca centro por nivel de demanda usando Búsqueda Binaria desde Neo4j",
                description = "Complejidad: O(log n). Obtiene centros de Neo4j, los ordena y busca.")
    public ResponseEntity<Map<String, Object>> buscarPorDemandaBinaria(
            @Parameter(description = "Request con demanda objetivo y opcionalmente IDs específicos", required = true)
            @RequestBody BinarySearchRequest request) {
        
        long startTime = System.nanoTime();
        
        // Si se especifican IDs, buscar solo en esos centros
        if (request.getCenterIds() != null && !request.getCenterIds().isEmpty()) {
            Map<String, Object> result = divideAndConquerService.buscarPorDemandaBinariaConIds(
                    request.getCenterIds(), request.getTargetDemand());
            long endTime = System.nanoTime();
            
            result.put("algoritmo", "Búsqueda Binaria");
            result.put("complejidad", "O(log n)");
            result.put("tiempoEjecucionNanosegundos", endTime - startTime);
            result.put("demandaBuscada", request.getTargetDemand());
            
            return ResponseEntity.ok(result);
        } else {
            // Obtener desde Neo4j y ordenar primero por demanda
            List<DistributionCenter> sorted = divideAndConquerService.obtenerYOrdenarPorDemandaMergeSort();
            
            int index = divideAndConquerService.buscarPorDemandaBinaria(sorted, request.getTargetDemand());
            long endTime = System.nanoTime();
            
            Map<String, Object> response = new HashMap<>();
            if (index != -1) {
                DistributionCenter found = sorted.get(index);
                response.put("encontrado", true);
                response.put("centro", found);
                response.put("indice", index);
            } else {
                response.put("encontrado", false);
            }
            response.put("algoritmo", "Búsqueda Binaria");
            response.put("complejidad", "O(log n)");
            response.put("tiempoEjecucionNanosegundos", endTime - startTime);
            response.put("centrosOrdenados", sorted);
            response.put("demandaBuscada", request.getTargetDemand());
            response.put("idsEspecificados", "Todos");
            
            return ResponseEntity.ok(response);
        }
    }

    /**
     * Endpoint para buscar centros en un rango de demanda
     * Complejidad: O(log n + k) donde k es el número de resultados
     */
    @PostMapping("/buscar/rango-demanda")
    @Operation(summary = "Busca centros en un rango de demanda desde Neo4j",
                description = "Complejidad: O(log n + k). Obtiene centros de Neo4j y busca en rango.")
    public ResponseEntity<Map<String, Object>> buscarPorRangoDemanda(
            @RequestParam int minDemand,
            @RequestParam int maxDemand) {
        
        // Obtener desde Neo4j y ordenar
        List<DistributionCenter> sorted = divideAndConquerService.obtenerYOrdenarPorDemandaMergeSort();
        
        long startTime = System.nanoTime();
        List<DistributionCenter> resultados = divideAndConquerService.buscarPorRangoDemanda(sorted, minDemand, maxDemand);
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("centrosEnRango", resultados.stream()
                .map(c -> Map.of(
                        "id", c.getId(),
                        "name", c.getName(),
                        "demandLevel", c.getDemandLevel()
                ))
                .collect(Collectors.toList()));
        response.put("cantidadEncontrados", resultados.size());
        response.put("rango", Map.of("min", minDemand, "max", maxDemand));
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

}

