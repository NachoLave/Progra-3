package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.DistributionCenterRepository;
import com.transroute.logistics.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para algoritmos de Grafos
 * Módulo 4: Optimización de rutas
 * 
 * Este servicio implementa:
 * - Kruskal para Árbol de Recubrimiento Mínimo (MST)
 * - Prim para Árbol de Recubrimiento Mínimo alternativo
 * - Dijkstra para caminos más cortos desde un origen
 * 
 * Complejidades:
 * - Kruskal: O(E log E) con Union-Find
 * - Prim: O(E log V) con heap
 * - Dijkstra: O((V + E) log V) con heap
 */
@Service
public class GraphService {
    
    @Autowired
    private RouteRepository routeRepository;
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    /**
     * Obtiene todas las rutas desde Neo4j y construye el grafo automáticamente
     * Usa el costo como peso de las aristas
     */
    public List<Edge> obtenerRutasYConstruirGrafoParaKruskal() {
        List<Route> routes = routeRepository.findAll();
        List<DistributionCenter> centers = distributionCenterRepository.findAll();
        
        // Crear mapa de ID de centro a índice
        Map<String, Integer> centerToIndex = new HashMap<>();
        for (int i = 0; i < centers.size(); i++) {
            centerToIndex.put(centers.get(i).getId(), i);
        }
        
        List<Edge> edges = new ArrayList<>();
        
        // Por ahora, asignamos índices secuenciales a las rutas
        // En una implementación real, necesitaríamos relaciones en Neo4j
        for (int i = 0; i < routes.size(); i++) {
            Route route = routes.get(i);
            // Para simplicidad, usamos índices basados en orden
            // Esto debería mejorarse con relaciones reales en Neo4j
            int from = i % centers.size();
            int to = (i + 1) % centers.size();
            if (from == to) to = (to + 1) % centers.size();
            
            double weight = route.getCost() != null ? route.getCost() : route.getDistance() != null ? route.getDistance() : 0.0;
            edges.add(new Edge(from, to, weight));
        }
        
        return edges;
    }
    
    /**
     * Obtiene rutas desde Neo4j y construye lista de adyacencia para Prim/Dijkstra
     */
    public Map<Integer, List<int[]>> obtenerRutasYConstruirListaAdyacencia() {
        List<Route> routes = routeRepository.findAll();
        List<DistributionCenter> centers = distributionCenterRepository.findAll();
        
        Map<Integer, List<int[]>> adjacencyList = new HashMap<>();
        
        // Inicializar listas de adyacencia para cada centro
        for (int i = 0; i < centers.size(); i++) {
            adjacencyList.put(i, new ArrayList<>());
        }
        
        // Agregar aristas basadas en rutas
        // Nota: Esto es una simplificación. Idealmente, las relaciones en Neo4j deberían indicar
        // qué centros conecta cada ruta
        for (int i = 0; i < routes.size(); i++) {
            Route route = routes.get(i);
            int from = i % centers.size();
            int to = (i + 1) % centers.size();
            if (from == to) to = (to + 1) % centers.size();
            
            double weight = route.getCost() != null ? route.getCost() : route.getDistance() != null ? route.getDistance() : 0.0;
            
            adjacencyList.get(from).add(new int[]{to, (int) weight});
            adjacencyList.get(to).add(new int[]{from, (int) weight}); // Grafo no dirigido
        }
        
        return adjacencyList;
    }
    
    /**
     * Obtiene el número de vértices (centros de distribución)
     */
    public int obtenerNumeroVertices() {
        return (int) distributionCenterRepository.count();
    }
    
    /**
     * Obtiene todos los centros de distribución para selección
     */
    public List<Map<String, Object>> obtenerCentrosParaSeleccion() {
        List<DistributionCenter> centers = distributionCenterRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (DistributionCenter center : centers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", center.getId() != null ? center.getId() : "");
            map.put("name", center.getName() != null ? center.getName() : "");
            map.put("city", center.getCity() != null ? center.getCity() : "");
            map.put("province", center.getProvince() != null ? center.getProvince() : "");
            map.put("demandLevel", center.getDemandLevel() != null ? center.getDemandLevel() : 0);
            map.put("capacity", center.getCapacity() != null ? center.getCapacity() : 0);
            map.put("priority", center.getPriority() != null ? center.getPriority() : 0);
            result.add(map);
        }
        
        return result;
    }
    
    /**
     * Obtiene todas las rutas para selección
     */
    public List<Map<String, Object>> obtenerRutasParaSeleccion() {
        List<Route> routes = routeRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (Route route : routes) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", route.getId() != null ? route.getId() : "");
            map.put("name", route.getName() != null ? route.getName() : "");
            map.put("distance", route.getDistance() != null ? route.getDistance() : 0.0);
            map.put("cost", route.getCost() != null ? route.getCost() : 0.0);
            
            // Obtener información de centros conectados
            try {
                DistributionCenter from = route.getFromCenter();
                DistributionCenter to = route.getToCenter();
                map.put("fromCenterId", from != null && from.getId() != null ? from.getId() : "N/A");
                map.put("fromCenterName", from != null && from.getName() != null ? from.getName() : "N/A");
                map.put("toCenterId", to != null && to.getId() != null ? to.getId() : "N/A");
                map.put("toCenterName", to != null && to.getName() != null ? to.getName() : "N/A");
            } catch (Exception e) {
                map.put("fromCenterId", "N/A");
                map.put("fromCenterName", "N/A");
                map.put("toCenterId", "N/A");
                map.put("toCenterName", "N/A");
            }
            
            result.add(map);
        }
        
        return result;
    }
    
    /**
     * Construye el grafo usando centros y rutas seleccionados
     */
    public List<Edge> construirGrafoConSeleccion(List<String> selectedCenterIds, List<String> selectedRouteIds) {
        if (selectedCenterIds == null || selectedCenterIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Obtener centros seleccionados
        List<DistributionCenter> selectedCenters = new ArrayList<>();
        for (String centerId : selectedCenterIds) {
            distributionCenterRepository.findById(centerId).ifPresent(selectedCenters::add);
        }
        
        // Crear mapa de ID de centro a índice
        Map<String, Integer> centerToIndex = new HashMap<>();
        for (int i = 0; i < selectedCenters.size(); i++) {
            centerToIndex.put(selectedCenters.get(i).getId(), i);
        }
        
        // Obtener rutas seleccionadas
        List<Route> selectedRoutes = new ArrayList<>();
        if (selectedRouteIds != null && !selectedRouteIds.isEmpty()) {
            for (String routeId : selectedRouteIds) {
                routeRepository.findById(routeId).ifPresent(selectedRoutes::add);
            }
        }
        
        // Construir aristas solo para rutas que conectan centros seleccionados
        List<Edge> edges = new ArrayList<>();
        for (Route route : selectedRoutes) {
            DistributionCenter from = route.getFromCenter();
            DistributionCenter to = route.getToCenter();
            
            if (from != null && to != null && 
                centerToIndex.containsKey(from.getId()) && 
                centerToIndex.containsKey(to.getId())) {
                
                int fromIndex = centerToIndex.get(from.getId());
                int toIndex = centerToIndex.get(to.getId());
                
                // Usar costo total si está disponible, sino distancia
                double weight = route.getCost() != null ? route.getCost() : 
                               (route.getDistance() != null ? route.getDistance() : 0.0);
                
                edges.add(new Edge(fromIndex, toIndex, weight));
            }
        }
        
        return edges;
    }

    /**
     * Construye una lista de adyacencia para Dijkstra usando centros y rutas seleccionados
     * @param selectedCenterIds Lista de IDs de centros seleccionados
     * @param selectedRouteIds Lista de IDs de rutas seleccionadas
     * @return Mapa de índice de vértice a lista de vecinos [índice_vecino, peso]
     */
    public Map<Integer, List<int[]>> construirListaAdyacenciaConSeleccion(List<String> selectedCenterIds, List<String> selectedRouteIds) {
        Map<Integer, List<int[]>> adjacencyList = new HashMap<>();
        
        if (selectedCenterIds == null || selectedCenterIds.isEmpty()) {
            return adjacencyList;
        }
        
        // Obtener centros seleccionados
        List<DistributionCenter> selectedCenters = new ArrayList<>();
        for (String centerId : selectedCenterIds) {
            distributionCenterRepository.findById(centerId).ifPresent(selectedCenters::add);
        }
        
        // Crear mapa de ID de centro a índice
        Map<String, Integer> centerToIndex = new HashMap<>();
        for (int i = 0; i < selectedCenters.size(); i++) {
            centerToIndex.put(selectedCenters.get(i).getId(), i);
        }
        
        // Obtener rutas seleccionadas
        List<Route> selectedRoutes = new ArrayList<>();
        if (selectedRouteIds != null && !selectedRouteIds.isEmpty()) {
            for (String routeId : selectedRouteIds) {
                routeRepository.findById(routeId).ifPresent(selectedRoutes::add);
            }
        }
        
        // Construir lista de adyacencia solo para rutas que conectan centros seleccionados
        for (Route route : selectedRoutes) {
            DistributionCenter from = route.getFromCenter();
            DistributionCenter to = route.getToCenter();
            
            if (from != null && to != null && 
                centerToIndex.containsKey(from.getId()) && 
                centerToIndex.containsKey(to.getId())) {
                
                int fromIndex = centerToIndex.get(from.getId());
                int toIndex = centerToIndex.get(to.getId());
                
                // Usar costo total si está disponible, sino distancia
                double weight = route.getCost() != null ? route.getCost() : 
                               (route.getDistance() != null ? route.getDistance() : 0.0);
                
                // Agregar a la lista de adyacencia
                adjacencyList.computeIfAbsent(fromIndex, k -> new ArrayList<>())
                             .add(new int[]{toIndex, (int) Math.round(weight)});
            }
        }
        
        return adjacencyList;
    }

    /**
     * Obtiene el índice de un centro en la lista de centros seleccionados
     * @param selectedCenterIds Lista de IDs de centros seleccionados
     * @param sourceCenterId ID del centro origen
     * @return Índice del centro origen, o -1 si no está seleccionado
     */
    public int obtenerIndiceCentroOrigen(List<String> selectedCenterIds, String sourceCenterId) {
        if (selectedCenterIds == null || sourceCenterId == null) {
            return -1;
        }
        
        for (int i = 0; i < selectedCenterIds.size(); i++) {
            if (selectedCenterIds.get(i).equals(sourceCenterId)) {
                return i;
            }
        }
        
        return -1;
    }

    /**
     * Representa una arista en el grafo
     */
    public static class Edge {
        public int from;
        public int to;
        public double weight;
        
        public Edge(int from, int to, double weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
    }

    /**
     * Representa un nodo con distancia para Dijkstra
     */
    private static class Node implements Comparable<Node> {
        public int id;
        public double distance;
        
        public Node(int id, double distance) {
            this.id = id;
            this.distance = distance;
        }
        
        @Override
        public int compareTo(Node other) {
            return Double.compare(this.distance, other.distance);
        }
    }

    /**
     * Implementación de Kruskal para encontrar el Árbol de Recubrimiento Mínimo (MST)
     * Complejidad: O(E log E) debido al ordenamiento
     * 
     * @param vertices Número de vértices
     * @param edges Lista de aristas con sus pesos
     * @return Lista de aristas que forman el MST
     */
    public List<Edge> kruskalMST(int vertices, List<Edge> edges) {
        // Ordenar aristas por peso (ascendente)
        edges.sort(Comparator.comparingDouble(e -> e.weight));
        
        // Union-Find para detectar ciclos
        int[] parent = new int[vertices];
        int[] rank = new int[vertices];
        for (int i = 0; i < vertices; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
        
        List<Edge> mst = new ArrayList<>();
        
        for (Edge edge : edges) {
            int rootFrom = find(parent, edge.from);
            int rootTo = find(parent, edge.to);
            
            // Si están en componentes diferentes, agregar al MST
            if (rootFrom != rootTo) {
                mst.add(edge);
                union(parent, rank, rootFrom, rootTo);
                
                // Si ya tenemos V-1 aristas, el MST está completo
                if (mst.size() == vertices - 1) {
                    break;
                }
            }
        }
        
        return mst;
    }
    
    /**
     * Implementación de Prim para encontrar el MST
     * Complejidad: O(E log V) con priority queue
     * 
     * @param vertices Número de vértices
     * @param adjacencyList Lista de adyacencia: vértice -> lista de (vecino, peso)
     * @return Lista de aristas que forman el MST
     */
    public List<Edge> primMST(int vertices, Map<Integer, List<int[]>> adjacencyList) {
        List<Edge> mst = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        
        // Empezar desde el vértice 0
        pq.offer(new int[]{0, 0, -1}); // {from, weight, to}
        
        while (!pq.isEmpty() && mst.size() < vertices - 1) {
            int[] current = pq.poll();
            int to = current[0];
            double weight = current[1];
            int from = current[2];
            
            if (visited[to]) {
                continue;
            }
            
            visited[to] = true;
            
            if (from != -1) {
                mst.add(new Edge(from, to, weight));
            }
            
            // Agregar vecinos a la cola
            if (adjacencyList.containsKey(to)) {
                for (int[] neighbor : adjacencyList.get(to)) {
                    if (!visited[neighbor[0]]) {
                        pq.offer(new int[]{neighbor[0], neighbor[1], to});
                    }
                }
            }
        }
        
        return mst;
    }
    
    /**
     * Implementación de Dijkstra para encontrar caminos más cortos desde un origen
     * Complejidad: O((V + E) log V) con priority queue
     * 
     * @param vertices Número de vértices
     * @param source Vértice origen
     * @param adjacencyList Lista de adyacencia: vértice -> lista de (vecino, peso)
     * @return Array de distancias desde el origen a cada vértice
     */
    public double[] dijkstra(int vertices, int source, Map<Integer, List<int[]>> adjacencyList) {
        double[] distances = new double[vertices];
        Arrays.fill(distances, Double.MAX_VALUE);
        distances[source] = 0.0;
        
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0.0));
        boolean[] visited = new boolean[vertices];
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;
            
            if (visited[u]) {
                continue;
            }
            
            visited[u] = true;
            
            // Relajar aristas vecinas
            if (adjacencyList.containsKey(u)) {
                for (int[] neighbor : adjacencyList.get(u)) {
                    int v = neighbor[0];
                    double weight = neighbor[1];
                    
                    if (!visited[v] && distances[u] + weight < distances[v]) {
                        distances[v] = distances[u] + weight;
                        pq.offer(new Node(v, distances[v]));
                    }
                }
            }
        }
        
        return distances;
    }
    
    /**
     * Encuentra el camino completo desde el origen hasta un destino usando Dijkstra
     * 
     * @param vertices Número de vértices
     * @param source Vértice origen
     * @param destination Vértice destino
     * @param adjacencyList Lista de adyacencia
     * @return Lista de vértices que forman el camino más corto, o null si no hay camino
     */
    public List<Integer> dijkstraPath(int vertices, int source, int destination, 
                                      Map<Integer, List<int[]>> adjacencyList) {
        double[] distances = new double[vertices];
        int[] previous = new int[vertices];
        Arrays.fill(distances, Double.MAX_VALUE);
        Arrays.fill(previous, -1);
        distances[source] = 0.0;
        
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.offer(new Node(source, 0.0));
        boolean[] visited = new boolean[vertices];
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int u = current.id;
            
            if (visited[u]) {
                continue;
            }
            
            visited[u] = true;
            
            if (u == destination) {
                break; // Llegamos al destino
            }
            
            // Relajar aristas vecinas
            if (adjacencyList.containsKey(u)) {
                for (int[] neighbor : adjacencyList.get(u)) {
                    int v = neighbor[0];
                    double weight = neighbor[1];
                    
                    if (!visited[v] && distances[u] + weight < distances[v]) {
                        distances[v] = distances[u] + weight;
                        previous[v] = u;
                        pq.offer(new Node(v, distances[v]));
                    }
                }
            }
        }
        
        // Reconstruir el camino
        if (distances[destination] == Double.MAX_VALUE) {
            return null; // No hay camino
        }
        
        List<Integer> path = new ArrayList<>();
        int current = destination;
        while (current != -1) {
            path.add(current);
            current = previous[current];
        }
        Collections.reverse(path);
        
        return path;
    }
    
    /**
     * Calcula el costo total de un conjunto de aristas
     */
    public double calcularCostoTotal(List<Edge> edges) {
        return edges.stream()
                .mapToDouble(e -> e.weight)
                .sum();
    }
    
    /**
     * Implementación de BFS (Breadth-First Search) para explorar todas las rutas desde un origen
     * Útil para encontrar todos los centros alcanzables y rutas alternativas
     * Complejidad: O(V + E)
     * 
     * @param vertices Número de vértices
     * @param source Vértice origen
     * @param adjacencyList Lista de adyacencia
     * @return Lista de vértices visitados en orden BFS y sus distancias
     */
    public Map<String, Object> bfs(int vertices, int source, Map<Integer, List<int[]>> adjacencyList) {
        List<Integer> visitOrder = new ArrayList<>();
        Map<Integer, Integer> distances = new HashMap<>();
        Map<Integer, Integer> parent = new HashMap<>();
        boolean[] visited = new boolean[vertices];
        
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(source);
        visited[source] = true;
        distances.put(source, 0);
        parent.put(source, -1);
        
        while (!queue.isEmpty()) {
            int current = queue.poll();
            visitOrder.add(current);
            
            if (adjacencyList.containsKey(current)) {
                for (int[] neighbor : adjacencyList.get(current)) {
                    int v = neighbor[0];
                    if (!visited[v]) {
                        visited[v] = true;
                        distances.put(v, distances.get(current) + 1);
                        parent.put(v, current);
                        queue.offer(v);
                    }
                }
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("visitOrder", visitOrder);
        result.put("distances", distances);
        result.put("parent", parent);
        result.put("reachableVertices", visitOrder.size());
        return result;
    }
    
    /**
     * Implementación de DFS (Depth-First Search) para explorar rutas en profundidad
     * Útil para encontrar caminos específicos y detectar ciclos
     * Complejidad: O(V + E)
     * 
     * @param vertices Número de vértices
     * @param source Vértice origen
     * @param adjacencyList Lista de adyacencia
     * @return Lista de vértices visitados en orden DFS y todos los caminos encontrados
     */
    public Map<String, Object> dfs(int vertices, int source, Map<Integer, List<int[]>> adjacencyList) {
        List<Integer> visitOrder = new ArrayList<>();
        List<List<Integer>> allPaths = new ArrayList<>();
        boolean[] visited = new boolean[vertices];
        List<Integer> currentPath = new ArrayList<>();
        
        dfsRecursive(source, adjacencyList, visited, visitOrder, currentPath, allPaths);
        
        Map<String, Object> result = new HashMap<>();
        result.put("visitOrder", visitOrder);
        result.put("allPaths", allPaths);
        result.put("totalPaths", allPaths.size());
        return result;
    }
    
    /**
     * Método recursivo auxiliar para DFS
     */
    private void dfsRecursive(int vertex, Map<Integer, List<int[]>> adjacencyList, 
                             boolean[] visited, List<Integer> visitOrder,
                             List<Integer> currentPath, List<List<Integer>> allPaths) {
        visited[vertex] = true;
        visitOrder.add(vertex);
        currentPath.add(vertex);
        
        // Guardar el camino actual
        allPaths.add(new ArrayList<>(currentPath));
        
        if (adjacencyList.containsKey(vertex)) {
            for (int[] neighbor : adjacencyList.get(vertex)) {
                int v = neighbor[0];
                if (!visited[v]) {
                    dfsRecursive(v, adjacencyList, visited, visitOrder, currentPath, allPaths);
                }
            }
        }
        
        // Backtrack
        currentPath.remove(currentPath.size() - 1);
        visited[vertex] = false; // Permitir explorar otros caminos
    }
    
    /**
     * BFS para encontrar todos los caminos entre dos vértices
     */
    public List<List<Integer>> bfsFindAllPaths(int vertices, int source, int destination,
                                               Map<Integer, List<int[]>> adjacencyList) {
        List<List<Integer>> allPaths = new ArrayList<>();
        Queue<List<Integer>> queue = new LinkedList<>();
        List<Integer> initialPath = new ArrayList<>();
        initialPath.add(source);
        queue.offer(initialPath);
        
        while (!queue.isEmpty()) {
            List<Integer> currentPath = queue.poll();
            int lastVertex = currentPath.get(currentPath.size() - 1);
            
            if (lastVertex == destination) {
                allPaths.add(new ArrayList<>(currentPath));
            } else {
                if (adjacencyList.containsKey(lastVertex)) {
                    for (int[] neighbor : adjacencyList.get(lastVertex)) {
                        int v = neighbor[0];
                        if (!currentPath.contains(v)) { // Evitar ciclos
                            List<Integer> newPath = new ArrayList<>(currentPath);
                            newPath.add(v);
                            queue.offer(newPath);
                        }
                    }
                }
            }
        }
        
        return allPaths;
    }
    
    // Métodos auxiliares para Union-Find (Kruskal)
    private int find(int[] parent, int x) {
        if (parent[x] != x) {
            parent[x] = find(parent, parent[x]); // Path compression
        }
        return parent[x];
    }
    
    private void union(int[] parent, int[] rank, int x, int y) {
        int rootX = find(parent, x);
        int rootY = find(parent, y);
        
        if (rootX != rootY) {
            // Union by rank
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
        }
    }
}

