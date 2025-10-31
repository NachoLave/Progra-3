package com.transroute.logistics.service;

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

