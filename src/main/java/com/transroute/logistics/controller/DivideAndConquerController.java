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

import java.util.ArrayList;
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
    @Operation(summary = "Ordena centros por demanda usando MergeSort", 
                description = "Complejidad: O(n log n). Divide el problema en mitades, ordena cada mitad y las combina.")
    public ResponseEntity<Map<String, Object>> ordenarPorDemandaMergeSort(
            @Parameter(description = "Lista de IDs de centros a ordenar", required = true)
            @RequestBody CenterSortRequest request) {
        
        // En una implementación real, estos centros vendrían de la base de datos
        // Por ahora, creamos datos de ejemplo basados en los IDs
        List<DistributionCenter> centers = crearCentrosEjemplo(request.getCenterIds());
        
        long startTime = System.nanoTime();
        List<DistributionCenter> sorted = divideAndConquerService.ordenarPorDemandaMergeSort(centers);
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
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para ordenar centros por prioridad usando QuickSort
     * Complejidad: O(n log n) promedio, O(n²) peor caso
     */
    @PostMapping("/ordenar/quicksort")
    @Operation(summary = "Ordena centros por prioridad usando QuickSort",
                description = "Complejidad: O(n log n) promedio. Particiona el array y ordena recursivamente.")
    public ResponseEntity<Map<String, Object>> ordenarPorPrioridadQuickSort(
            @Parameter(description = "Lista de IDs de centros a ordenar", required = true)
            @RequestBody CenterSortRequest request) {
        
        List<DistributionCenter> centers = crearCentrosEjemplo(request.getCenterIds());
        
        long startTime = System.nanoTime();
        List<DistributionCenter> sorted = divideAndConquerService.ordenarPorPrioridadQuickSort(centers);
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
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para buscar centro por demanda usando Búsqueda Binaria
     * Complejidad: O(log n)
     * REQUIERE: Lista previamente ordenada
     */
    @PostMapping("/buscar/binaria-demanda")
    @Operation(summary = "Busca centro por nivel de demanda usando Búsqueda Binaria",
                description = "Complejidad: O(log n). REQUIERE lista ordenada previamente.")
    public ResponseEntity<Map<String, Object>> buscarPorDemandaBinaria(
            @Parameter(description = "Request con IDs de centros y demanda objetivo", required = true)
            @RequestBody BinarySearchRequest request) {
        
        List<DistributionCenter> centers = crearCentrosEjemplo(request.getCenterIds());
        
        // Ordenar primero por demanda
        List<DistributionCenter> sorted = divideAndConquerService.ordenarPorDemandaMergeSort(centers);
        
        long startTime = System.nanoTime();
        int index = divideAndConquerService.buscarPorDemandaBinaria(sorted, request.getTargetDemand());
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        if (index != -1) {
            DistributionCenter found = sorted.get(index);
            response.put("encontrado", true);
            response.put("centro", Map.of(
                    "id", found.getId(),
                    "name", found.getName(),
                    "demandLevel", found.getDemandLevel()
            ));
            response.put("indice", index);
        } else {
            response.put("encontrado", false);
        }
        response.put("algoritmo", "Búsqueda Binaria");
        response.put("complejidad", "O(log n)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para buscar centros en un rango de demanda
     * Complejidad: O(log n + k) donde k es el número de resultados
     */
    @PostMapping("/buscar/rango-demanda")
    @Operation(summary = "Busca centros en un rango de demanda",
                description = "Complejidad: O(log n + k). Encuentra todos los centros con demanda entre min y max.")
    public ResponseEntity<Map<String, Object>> buscarPorRangoDemanda(
            @RequestParam List<String> centerIds,
            @RequestParam int minDemand,
            @RequestParam int maxDemand) {
        
        List<DistributionCenter> centers = crearCentrosEjemplo(centerIds);
        List<DistributionCenter> sorted = divideAndConquerService.ordenarPorDemandaMergeSort(centers);
        
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

    /**
     * Método auxiliar para crear centros de ejemplo
     * En una implementación real, esto vendría de un repositorio
     */
    private List<DistributionCenter> crearCentrosEjemplo(List<String> ids) {
        List<DistributionCenter> centers = new ArrayList<>();
        
        // Generar datos de ejemplo con diferentes niveles de demanda y prioridad
        String[] nombres = {"Centro Norte", "Centro Sur", "Centro Este", "Centro Oeste", "Centro Central"};
        int[] demandas = {85, 45, 70, 30, 95};
        int[] prioridades = {2, 4, 3, 5, 1};
        
        for (int i = 0; i < ids.size() && i < nombres.length; i++) {
            String id = ids.get(i);
            DistributionCenter center = new DistributionCenter(
                    id,
                    nombres[i % nombres.length],
                    "Ciudad " + i,
                    "Provincia " + i,
                    demandas[i % demandas.length],
                    10000,
                    5000.0,
                    prioridades[i % prioridades.length],
                    "0.0,0.0"
            );
            centers.add(center);
        }
        
        return centers;
    }
}

