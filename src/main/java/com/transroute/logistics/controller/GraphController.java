package com.transroute.logistics.controller;

import com.transroute.logistics.dto.GraphRequest;
import com.transroute.logistics.service.GraphService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Controlador REST para el módulo de Grafos
 * Expone endpoints para optimización de rutas usando algoritmos de grafos
 */
@RestController
@RequestMapping("/api/graphs")
@Tag(name = "Módulo 4: Grafos")
public class GraphController {

    @Autowired
    private GraphService graphService;

    /**
     * Endpoint para encontrar el Árbol de Recubrimiento Mínimo usando Kruskal
     * Complejidad: O(E log E)
     */
    @PostMapping("/kruskal/mst")
    @Operation(summary = "Encuentra el Árbol de Recubrimiento Mínimo usando Kruskal",
                description = "Complejidad: O(E log E). Construye la red más económica conectando todos los centros.")
    public ResponseEntity<Map<String, Object>> kruskalMST(
            @Parameter(description = "Grafo con vértices y aristas", required = true)
            @RequestBody GraphRequest request) {
        
        // Convertir DTOs a objetos Edge
        List<GraphService.Edge> edges = request.getEdges().stream()
                .map(e -> new GraphService.Edge(e.getFrom(), e.getTo(), e.getWeight()))
                .collect(Collectors.toList());
        
        long startTime = System.nanoTime();
        List<GraphService.Edge> mst = graphService.kruskalMST(request.getVertices(), edges);
        long endTime = System.nanoTime();
        
        double costoTotal = graphService.calcularCostoTotal(mst);
        
        Map<String, Object> response = new HashMap<>();
        response.put("mst", mst.stream()
                .map(e -> Map.of(
                        "from", e.from,
                        "to", e.to,
                        "weight", e.weight
                ))
                .collect(Collectors.toList()));
        response.put("numeroAristas", mst.size());
        response.put("costoTotal", costoTotal);
        response.put("algoritmo", "Kruskal");
        response.put("complejidad", "O(E log E)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar el Árbol de Recubrimiento Mínimo usando Prim
     * Complejidad: O(E log V)
     */
    @PostMapping("/prim/mst")
    @Operation(summary = "Encuentra el Árbol de Recubrimiento Mínimo usando Prim",
                description = "Complejidad: O(E log V). Alternativa a Kruskal usando priority queue.")
    public ResponseEntity<Map<String, Object>> primMST(
            @Parameter(description = "Grafo con lista de adyacencia", required = true)
            @RequestBody GraphRequest request) {
        
        long startTime = System.nanoTime();
        List<GraphService.Edge> mst = graphService.primMST(
                request.getVertices(), 
                request.getAdjacencyList()
        );
        long endTime = System.nanoTime();
        
        double costoTotal = graphService.calcularCostoTotal(mst);
        
        Map<String, Object> response = new HashMap<>();
        response.put("mst", mst.stream()
                .map(e -> Map.of(
                        "from", e.from,
                        "to", e.to,
                        "weight", e.weight
                ))
                .collect(Collectors.toList()));
        response.put("numeroAristas", mst.size());
        response.put("costoTotal", costoTotal);
        response.put("algoritmo", "Prim");
        response.put("complejidad", "O(E log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar caminos más cortos desde un origen usando Dijkstra
     * Complejidad: O((V + E) log V)
     */
    @PostMapping("/dijkstra/distances")
    @Operation(summary = "Encuentra las distancias más cortas desde un origen usando Dijkstra",
                description = "Complejidad: O((V + E) log V). Calcula el camino más corto desde un centro a todos los demás.")
    public ResponseEntity<Map<String, Object>> dijkstraDistances(
            @Parameter(description = "Grafo con origen", required = true)
            @RequestBody GraphRequest request) {
        
        long startTime = System.nanoTime();
        double[] distances = graphService.dijkstra(
                request.getVertices(),
                request.getSource(),
                request.getAdjacencyList()
        );
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        Map<Integer, Double> distancesMap = new HashMap<>();
        for (int i = 0; i < distances.length; i++) {
            if (distances[i] != Double.MAX_VALUE) {
                distancesMap.put(i, distances[i]);
            } else {
                distancesMap.put(i, null); // No alcanzable
            }
        }
        
        response.put("source", request.getSource());
        response.put("distances", distancesMap);
        response.put("algoritmo", "Dijkstra");
        response.put("complejidad", "O((V + E) log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar el camino completo más corto entre dos vértices
     */
    @PostMapping("/dijkstra/path")
    @Operation(summary = "Encuentra el camino más corto entre dos vértices",
                description = "Retorna la secuencia de vértices que forman el camino más corto.")
    public ResponseEntity<Map<String, Object>> dijkstraPath(
            @Parameter(description = "Grafo con origen y destino", required = true)
            @RequestBody GraphRequest request) {
        
        long startTime = System.nanoTime();
        List<Integer> path = graphService.dijkstraPath(
                request.getVertices(),
                request.getSource(),
                request.getDestination(),
                request.getAdjacencyList()
        );
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        
        if (path != null) {
            // Calcular distancia total del camino
            double totalDistance = 0.0;
            Map<Integer, List<int[]>> adjList = request.getAdjacencyList();
            for (int i = 0; i < path.size() - 1; i++) {
                int from = path.get(i);
                int to = path.get(i + 1);
                if (adjList.containsKey(from)) {
                    for (int[] neighbor : adjList.get(from)) {
                        if (neighbor[0] == to) {
                            totalDistance += neighbor[1];
                            break;
                        }
                    }
                }
            }
            
            response.put("path", path);
            response.put("source", request.getSource());
            response.put("destination", request.getDestination());
            response.put("totalDistance", totalDistance);
            response.put("numeroVertices", path.size());
        } else {
            response.put("path", null);
            response.put("message", "No existe camino entre los vértices");
        }
        
        response.put("algoritmo", "Dijkstra");
        response.put("complejidad", "O((V + E) log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        
        return ResponseEntity.ok(response);
    }
}

