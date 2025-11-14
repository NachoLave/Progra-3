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
     * Endpoint para obtener todos los centros de distribución
     */
    @GetMapping("/centers")
    @Operation(summary = "Obtiene todos los centros de distribución de Neo4j")
    public ResponseEntity<List<Map<String, Object>>> getCenters() {
        return ResponseEntity.ok(graphService.obtenerCentrosParaSeleccion());
    }
    
    /**
     * Endpoint para obtener todas las rutas
     */
    @GetMapping("/routes")
    @Operation(summary = "Obtiene todas las rutas de Neo4j")
    public ResponseEntity<List<Map<String, Object>>> getRoutes() {
        return ResponseEntity.ok(graphService.obtenerRutasParaSeleccion());
    }
    
    /**
     * Endpoint para calcular MST con centros y rutas seleccionados
     */
    @PostMapping("/kruskal/mst/selected")
    @Operation(summary = "Calcula MST usando centros y rutas seleccionados de Neo4j")
    public ResponseEntity<Map<String, Object>> kruskalMSTSelected(
            @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        List<String> selectedCenters = (List<String>) request.get("selectedCenters");
        @SuppressWarnings("unchecked")
        List<String> selectedRoutes = (List<String>) request.get("selectedRoutes");
        
        long startTime = System.nanoTime();
        List<GraphService.Edge> edges = graphService.construirGrafoConSeleccion(selectedCenters, selectedRoutes);
        int vertices = selectedCenters != null ? selectedCenters.size() : 0;
        
        List<GraphService.Edge> mst = graphService.kruskalMST(vertices, edges);
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
        response.put("fuente", "neo4j-selected");
        response.put("centrosSeleccionados", selectedCenters != null ? selectedCenters.size() : 0);
        response.put("rutasSeleccionadas", selectedRoutes != null ? selectedRoutes.size() : 0);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar el Árbol de Recubrimiento Mínimo usando Kruskal
     * Complejidad: O(E log E)
     */
    @PostMapping("/kruskal/mst")
    @Operation(summary = "Encuentra el Árbol de Recubrimiento Mínimo usando Kruskal desde Neo4j",
                description = "Complejidad: O(E log E). Obtiene rutas de Neo4j y construye el MST.")
    public ResponseEntity<Map<String, Object>> kruskalMST(
            @Parameter(description = "Grafo con vértices y aristas (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) GraphRequest request) {
        
        long startTime = System.nanoTime();
        int vertices;
        List<GraphService.Edge> edges;
        String fuente;
        
        if (request != null && request.getEdges() != null && !request.getEdges().isEmpty()) {
            vertices = request.getVertices();
            edges = request.getEdges().stream()
                    .map(e -> new GraphService.Edge(e.getFrom(), e.getTo(), e.getWeight()))
                    .collect(Collectors.toList());
            fuente = "request";
        } else {
            vertices = graphService.obtenerNumeroVertices();
            edges = graphService.obtenerRutasYConstruirGrafoParaKruskal();
            fuente = "neo4j";
        }
        
        List<GraphService.Edge> mst = graphService.kruskalMST(vertices, edges);
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
        response.put("fuente", fuente);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar el Árbol de Recubrimiento Mínimo usando Prim
     * Complejidad: O(E log V)
     */
    @PostMapping("/prim/mst")
    @Operation(summary = "Encuentra el Árbol de Recubrimiento Mínimo usando Prim desde Neo4j",
                description = "Complejidad: O(E log V). Obtiene rutas de Neo4j y construye el MST.")
    public ResponseEntity<Map<String, Object>> primMST(
            @Parameter(description = "Grafo con lista de adyacencia (opcional, si está vacío usa Neo4j)", required = false)
            @RequestBody(required = false) GraphRequest request) {
        
        long startTime = System.nanoTime();
        int vertices;
        Map<Integer, List<int[]>> adjacencyList;
        String fuente;
        
        if (request != null && request.getAdjacencyList() != null && !request.getAdjacencyList().isEmpty()) {
            vertices = request.getVertices();
            adjacencyList = request.getAdjacencyList();
            fuente = "request";
        } else {
            vertices = graphService.obtenerNumeroVertices();
            adjacencyList = graphService.obtenerRutasYConstruirListaAdyacencia();
            fuente = "neo4j";
        }
        
        List<GraphService.Edge> mst = graphService.primMST(vertices, adjacencyList);
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
        response.put("fuente", fuente);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar caminos más cortos usando Dijkstra con centros y rutas seleccionados
     * Complejidad: O((V + E) log V)
     */
    @PostMapping("/dijkstra/distances/selected")
    @Operation(summary = "Encuentra las distancias más cortas usando Dijkstra con selección de Neo4j",
                description = "Complejidad: O((V + E) log V). Usa centros y rutas seleccionados de Neo4j.")
    public ResponseEntity<Map<String, Object>> dijkstraDistancesSelected(
            @Parameter(description = "Request con centros, rutas y origen seleccionados", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> selectedCenters = (List<String>) request.get("selectedCenters");
        @SuppressWarnings("unchecked")
        List<String> selectedRoutes = (List<String>) request.get("selectedRoutes");
        String sourceCenterId = (String) request.get("sourceCenterId");
        
        if (selectedCenters == null || selectedCenters.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (sourceCenterId == null || sourceCenterId.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar un centro de origen");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Obtener índice del centro origen
        int source = graphService.obtenerIndiceCentroOrigen(selectedCenters, sourceCenterId);
        if (source < 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "El centro de origen debe estar en la lista de centros seleccionados");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        // Construir lista de adyacencia con selección
        Map<Integer, List<int[]>> adjacencyList = graphService.construirListaAdyacenciaConSeleccion(selectedCenters, selectedRoutes);
        int vertices = selectedCenters.size();
        
        double[] distances = graphService.dijkstra(vertices, source, adjacencyList);
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
        
        response.put("source", source);
        response.put("distances", distancesMap);
        response.put("algoritmo", "Dijkstra");
        response.put("complejidad", "O((V + E) log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("fuente", "neo4j-selected");
        response.put("centrosSeleccionados", selectedCenters.size());
        response.put("rutasSeleccionadas", selectedRoutes != null ? selectedRoutes.size() : 0);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar caminos más cortos desde un origen usando Dijkstra
     * Complejidad: O((V + E) log V)
     */
    @PostMapping("/dijkstra/distances")
    @Operation(summary = "Encuentra las distancias más cortas desde un origen usando Dijkstra desde Neo4j",
                description = "Complejidad: O((V + E) log V). Obtiene rutas de Neo4j y calcula distancias.")
    public ResponseEntity<Map<String, Object>> dijkstraDistances(
            @Parameter(description = "Grafo con origen (opcional, usa Neo4j si source=0 por defecto)", required = false)
            @RequestBody(required = false) GraphRequest request) {
        
        long startTime = System.nanoTime();
        int vertices;
        int source;
        Map<Integer, List<int[]>> adjacencyList;
        String fuente;
        
        if (request != null && request.getAdjacencyList() != null && !request.getAdjacencyList().isEmpty()) {
            vertices = request.getVertices();
            source = request.getSource();
            adjacencyList = request.getAdjacencyList();
            fuente = "request";
        } else {
            vertices = graphService.obtenerNumeroVertices();
            source = 0; // Por defecto, origen es el primer centro
            adjacencyList = graphService.obtenerRutasYConstruirListaAdyacencia();
            fuente = "neo4j";
        }
        
        double[] distances = graphService.dijkstra(vertices, source, adjacencyList);
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
        
        response.put("source", source);
        response.put("distances", distancesMap);
        response.put("algoritmo", "Dijkstra");
        response.put("complejidad", "O((V + E) log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("fuente", fuente);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para encontrar el camino completo más corto entre dos vértices
     */
    @PostMapping("/dijkstra/path")
    @Operation(summary = "Encuentra el camino más corto entre dos vértices desde Neo4j",
                description = "Obtiene rutas de Neo4j y calcula el camino más corto.")
    public ResponseEntity<Map<String, Object>> dijkstraPath(
            @Parameter(description = "Grafo con origen y destino (opcional, usa Neo4j por defecto)", required = false)
            @RequestBody(required = false) GraphRequest request) {
        
        long startTime = System.nanoTime();
        int vertices;
        int source;
        int destination;
        Map<Integer, List<int[]>> adjacencyList;
        String fuente;
        
        if (request != null && request.getAdjacencyList() != null && !request.getAdjacencyList().isEmpty()) {
            vertices = request.getVertices();
            source = request.getSource();
            destination = request.getDestination();
            adjacencyList = request.getAdjacencyList();
            fuente = "request";
        } else {
            vertices = graphService.obtenerNumeroVertices();
            source = 0;
            destination = vertices > 1 ? 1 : 0;
            adjacencyList = graphService.obtenerRutasYConstruirListaAdyacencia();
            fuente = "neo4j";
        }
        
        List<Integer> path = graphService.dijkstraPath(vertices, source, destination, adjacencyList);
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        
        if (path != null) {
            // Calcular distancia total del camino
            double totalDistance = 0.0;
            for (int i = 0; i < path.size() - 1; i++) {
                int from = path.get(i);
                int to = path.get(i + 1);
                if (adjacencyList.containsKey(from)) {
                    for (int[] neighbor : adjacencyList.get(from)) {
                        if (neighbor[0] == to) {
                            totalDistance += neighbor[1];
                            break;
                        }
                    }
                }
            }
            
            response.put("path", path);
            response.put("source", source);
            response.put("destination", destination);
            response.put("totalDistance", totalDistance);
            response.put("numeroVertices", path.size());
        } else {
            response.put("path", null);
            response.put("message", "No existe camino entre los vértices");
        }
        
        response.put("algoritmo", "Dijkstra");
        response.put("complejidad", "O((V + E) log V)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("fuente", fuente);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para BFS (Breadth-First Search) con centros y rutas seleccionados
     * Complejidad: O(V + E)
     */
    @PostMapping("/bfs/explore/selected")
    @Operation(summary = "Explora la red usando BFS con selección de Neo4j",
                description = "Complejidad: O(V + E). Encuentra todos los centros alcanzables desde un origen.")
    public ResponseEntity<Map<String, Object>> bfsExploreSelected(
            @Parameter(description = "Request con centros, rutas y origen seleccionados", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> selectedCenters = (List<String>) request.get("selectedCenters");
        @SuppressWarnings("unchecked")
        List<String> selectedRoutes = (List<String>) request.get("selectedRoutes");
        String sourceCenterId = (String) request.get("sourceCenterId");
        
        if (selectedCenters == null || selectedCenters.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (sourceCenterId == null || sourceCenterId.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar un centro de origen");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        int source = graphService.obtenerIndiceCentroOrigen(selectedCenters, sourceCenterId);
        if (source < 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "El centro de origen debe estar en la lista de centros seleccionados");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<Integer, List<int[]>> adjacencyList = graphService.construirListaAdyacenciaConSeleccion(selectedCenters, selectedRoutes);
        int vertices = selectedCenters.size();
        
        Map<String, Object> bfsResult = graphService.bfs(vertices, source, adjacencyList);
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>(bfsResult);
        response.put("algoritmo", "BFS (Breadth-First Search)");
        response.put("complejidad", "O(V + E)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("source", source);
        response.put("sourceCenterId", sourceCenterId);
        response.put("fuente", "neo4j-selected");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para DFS (Depth-First Search) con centros y rutas seleccionados
     * Complejidad: O(V + E)
     */
    @PostMapping("/dfs/explore/selected")
    @Operation(summary = "Explora la red usando DFS con selección de Neo4j",
                description = "Complejidad: O(V + E). Encuentra todos los caminos posibles desde un origen.")
    public ResponseEntity<Map<String, Object>> dfsExploreSelected(
            @Parameter(description = "Request con centros, rutas y origen seleccionados", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> selectedCenters = (List<String>) request.get("selectedCenters");
        @SuppressWarnings("unchecked")
        List<String> selectedRoutes = (List<String>) request.get("selectedRoutes");
        String sourceCenterId = (String) request.get("sourceCenterId");
        
        if (selectedCenters == null || selectedCenters.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        if (sourceCenterId == null || sourceCenterId.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar un centro de origen");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        int source = graphService.obtenerIndiceCentroOrigen(selectedCenters, sourceCenterId);
        if (source < 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "El centro de origen debe estar en la lista de centros seleccionados");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<Integer, List<int[]>> adjacencyList = graphService.construirListaAdyacenciaConSeleccion(selectedCenters, selectedRoutes);
        int vertices = selectedCenters.size();
        
        Map<String, Object> dfsResult = graphService.dfs(vertices, source, adjacencyList);
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>(dfsResult);
        response.put("algoritmo", "DFS (Depth-First Search)");
        response.put("complejidad", "O(V + E)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("source", source);
        response.put("sourceCenterId", sourceCenterId);
        response.put("fuente", "neo4j-selected");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Endpoint para encontrar todos los caminos entre dos centros usando BFS
     */
    @PostMapping("/bfs/all-paths/selected")
    @Operation(summary = "Encuentra todos los caminos entre dos centros usando BFS",
                description = "Encuentra todas las rutas alternativas entre origen y destino.")
    public ResponseEntity<Map<String, Object>> bfsFindAllPathsSelected(
            @Parameter(description = "Request con centros, rutas, origen y destino", required = true)
            @RequestBody Map<String, Object> request) {
        
        long startTime = System.nanoTime();
        
        @SuppressWarnings("unchecked")
        List<String> selectedCenters = (List<String>) request.get("selectedCenters");
        @SuppressWarnings("unchecked")
        List<String> selectedRoutes = (List<String>) request.get("selectedRoutes");
        String sourceCenterId = (String) request.get("sourceCenterId");
        String destCenterId = (String) request.get("destCenterId");
        
        if (selectedCenters == null || selectedCenters.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Debe seleccionar al menos un centro");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        int source = graphService.obtenerIndiceCentroOrigen(selectedCenters, sourceCenterId);
        int dest = graphService.obtenerIndiceCentroOrigen(selectedCenters, destCenterId);
        
        if (source < 0 || dest < 0) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Origen y destino deben estar en la lista de centros seleccionados");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        Map<Integer, List<int[]>> adjacencyList = graphService.construirListaAdyacenciaConSeleccion(selectedCenters, selectedRoutes);
        int vertices = selectedCenters.size();
        
        List<List<Integer>> allPaths = graphService.bfsFindAllPaths(vertices, source, dest, adjacencyList);
        long endTime = System.nanoTime();
        
        Map<String, Object> response = new HashMap<>();
        response.put("allPaths", allPaths);
        response.put("totalPaths", allPaths.size());
        response.put("source", source);
        response.put("destination", dest);
        response.put("sourceCenterId", sourceCenterId);
        response.put("destCenterId", destCenterId);
        response.put("algoritmo", "BFS - Todos los Caminos");
        response.put("complejidad", "O(V + E)");
        response.put("tiempoEjecucionNanosegundos", endTime - startTime);
        response.put("fuente", "neo4j-selected");
        
        return ResponseEntity.ok(response);
    }
}

