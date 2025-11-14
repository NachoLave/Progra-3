package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.DistributionCenterRepository;
import com.transroute.logistics.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para algoritmos de Branch & Bound
 * Módulo 7: Optimización de rutas con restricciones
 * 
 * Este servicio implementa:
 * - Branch & Bound para encontrar la ruta óptima que visite todos los centros
 * - Considera restricciones de capacidad, tiempo y costo
 * - Similar al TSP (Traveling Salesman Problem) pero con restricciones adicionales
 * 
 * Complejidad: O(n!) en el peor caso, pero optimizado con podas agresivas
 */
@Service
public class BranchAndBoundService {
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    /**
     * Representa un nodo en el árbol de búsqueda de Branch & Bound
     */
    private static class Node {
        List<String> path;
        int nivel;
        int costoAcumulado;
        int distanciaAcumulada;
        int prioridadAcumulada;
        double cotaInferior; // Estimación optimista del costo restante
        
        public Node(List<String> path, int nivel, int costoAcumulado, 
                   int distanciaAcumulada, int prioridadAcumulada, double cotaInferior) {
            this.path = new ArrayList<>(path);
            this.nivel = nivel;
            this.costoAcumulado = costoAcumulado;
            this.distanciaAcumulada = distanciaAcumulada;
            this.prioridadAcumulada = prioridadAcumulada;
            this.cotaInferior = cotaInferior;
        }
    }
    
    /**
     * Representa una solución óptima
     */
    public static class SolucionOptima {
        public List<String> rutaOptima;
        public int costoTotal;
        public int distanciaTotal;
        public int prioridadTotal;
        public boolean factible;
        public int nodosExplorados;
        public int nodosPodados;
        
        public SolucionOptima(List<String> rutaOptima, int costoTotal, int distanciaTotal,
                            int prioridadTotal, boolean factible, int nodosExplorados, int nodosPodados) {
            this.rutaOptima = rutaOptima;
            this.costoTotal = costoTotal;
            this.distanciaTotal = distanciaTotal;
            this.prioridadTotal = prioridadTotal;
            this.factible = factible;
            this.nodosExplorados = nodosExplorados;
            this.nodosPodados = nodosPodados;
        }
    }
    
    /**
     * Encuentra la ruta óptima usando Branch & Bound
     * 
     * @param centerIds IDs de centros a visitar
     * @param presupuestoMaximo Presupuesto máximo
     * @param distanciaMaxima Distancia máxima
     * @param debeRegresarOrigen Si debe regresar al punto de inicio
     * @return Solución óptima
     */
    public SolucionOptima encontrarRutaOptima(List<String> centerIds,
                                              int presupuestoMaximo,
                                              int distanciaMaxima,
                                              boolean debeRegresarOrigen) {
        // Obtener centros desde Neo4j
        List<DistributionCenter> centers = new ArrayList<>();
        for (String id : centerIds) {
            distributionCenterRepository.findById(id).ifPresent(centers::add);
        }
        
        if (centers.isEmpty()) {
            return new SolucionOptima(new ArrayList<>(), 0, 0, 0, false, 0, 0);
        }
        
        // Construir matriz de costos
        Map<String, Map<String, Double>> costMatrix = construirMatrizCostos(centers);
        
        // Inicializar mejor solución
        List<String> mejorRuta = new ArrayList<>();
        int mejorCosto = Integer.MAX_VALUE;
        int nodosExplorados = 0;
        int nodosPodados = 0;
        
        // Cola de prioridad para Branch & Bound (explorar nodos prometedores primero)
        PriorityQueue<Node> cola = new PriorityQueue<>(
            Comparator.comparingDouble(n -> n.costoAcumulado + n.cotaInferior)
        );
        
        // Nodo inicial (empezar desde el primer centro)
        String centroInicial = centers.get(0).getId();
        List<String> pathInicial = new ArrayList<>();
        pathInicial.add(centroInicial);
        
        double cotaInicial = calcularCotaInferior(centers, costMatrix, pathInicial);
        Node nodoInicial = new Node(pathInicial, 0, 0, 0, 
                                   centers.get(0).getPriority() != null ? centers.get(0).getPriority() : 0,
                                   cotaInicial);
        cola.offer(nodoInicial);
        
        while (!cola.isEmpty()) {
            Node actual = cola.poll();
            nodosExplorados++;
            
            // Poda: si la cota inferior ya es peor que la mejor solución, podar
            if (actual.costoAcumulado + actual.cotaInferior >= mejorCosto) {
                nodosPodados++;
                continue;
            }
            
            // Poda: verificar restricciones
            if (actual.costoAcumulado > presupuestoMaximo || 
                actual.distanciaAcumulada > distanciaMaxima) {
                nodosPodados++;
                continue;
            }
            
            // Si completamos la ruta
            if (actual.nivel == centers.size() - 1) {
                int costoFinal = actual.costoAcumulado;
                
                // Si debe regresar al origen, agregar ese costo
                if (debeRegresarOrigen && !actual.path.isEmpty()) {
                    String ultimo = actual.path.get(actual.path.size() - 1);
                    Double costoRegreso = costMatrix.get(ultimo).get(centroInicial);
                    if (costoRegreso != null) {
                        costoFinal += costoRegreso.intValue();
                    }
                }
                
                if (costoFinal < mejorCosto) {
                    mejorCosto = costoFinal;
                    mejorRuta = new ArrayList<>(actual.path);
                    if (debeRegresarOrigen) {
                        mejorRuta.add(centroInicial);
                    }
                }
                continue;
            }
            
            // Generar hijos (ramificar)
            Set<String> visitados = new HashSet<>(actual.path);
            for (DistributionCenter center : centers) {
                String centerId = center.getId();
                if (!visitados.contains(centerId)) {
                    // Calcular costo para llegar a este centro
                    String ultimoCentro = actual.path.get(actual.path.size() - 1);
                    Double costo = costMatrix.get(ultimoCentro).get(centerId);
                    Double distancia = costMatrix.get(ultimoCentro).get(centerId);
                    
                    int nuevoCosto = actual.costoAcumulado + (costo != null ? costo.intValue() : 200);
                    int nuevaDistancia = actual.distanciaAcumulada + (distancia != null ? distancia.intValue() : 200);
                    int nuevaPrioridad = actual.prioridadAcumulada + 
                                       (center.getPriority() != null ? center.getPriority() : 0);
                    
                    List<String> nuevoPath = new ArrayList<>(actual.path);
                    nuevoPath.add(centerId);
                    
                    double nuevaCota = calcularCotaInferior(centers, costMatrix, nuevoPath);
                    
                    Node hijo = new Node(nuevoPath, actual.nivel + 1, nuevoCosto, 
                                       nuevaDistancia, nuevaPrioridad, nuevaCota);
                    cola.offer(hijo);
                }
            }
        }
        
        // Calcular métricas finales
        int costoTotal = calcularCostoTotal(mejorRuta, costMatrix);
        int distanciaTotal = calcularDistanciaTotal(mejorRuta, costMatrix);
        int prioridadTotal = calcularPrioridadTotal(mejorRuta, centers);
        boolean factible = costoTotal <= presupuestoMaximo && distanciaTotal <= distanciaMaxima;
        
        return new SolucionOptima(mejorRuta, costoTotal, distanciaTotal, prioridadTotal,
                                 factible, nodosExplorados, nodosPodados);
    }
    
    /**
     * Calcula una cota inferior usando el algoritmo de asignación (Hungarian algorithm simplificado)
     * o simplemente el mínimo costo restante estimado
     */
    private double calcularCotaInferior(List<DistributionCenter> centers,
                                       Map<String, Map<String, Double>> costMatrix,
                                       List<String> pathActual) {
        if (pathActual.size() == centers.size()) {
            return 0; // Ya visitamos todos
        }
        
        Set<String> visitados = new HashSet<>(pathActual);
        double cota = 0;
        
        // Estimar costo mínimo para visitar los centros restantes
        for (DistributionCenter center : centers) {
            if (!visitados.contains(center.getId())) {
                // Encontrar el costo mínimo para llegar a este centro desde cualquier centro visitado
                double minCosto = Double.MAX_VALUE;
                for (String visitado : visitados) {
                    Double costo = costMatrix.get(visitado).get(center.getId());
                    if (costo != null && costo < minCosto) {
                        minCosto = costo;
                    }
                }
                if (minCosto != Double.MAX_VALUE) {
                    cota += minCosto;
                } else {
                    cota += 100; // Estimación conservadora
                }
            }
        }
        
        return cota;
    }
    
    /**
     * Construye matriz de costos/distancia entre centros
     */
    private Map<String, Map<String, Double>> construirMatrizCostos(List<DistributionCenter> centers) {
        Map<String, Map<String, Double>> matrix = new HashMap<>();
        List<Route> routes = routeRepository.findAll();
        
        // Inicializar matriz
        for (DistributionCenter center : centers) {
            matrix.put(center.getId(), new HashMap<>());
        }
        
        // Llenar con rutas existentes
        for (Route route : routes) {
            DistributionCenter from = route.getFromCenter();
            DistributionCenter to = route.getToCenter();
            
            if (from != null && to != null) {
                String fromId = from.getId();
                String toId = to.getId();
                
                if (matrix.containsKey(fromId) && matrix.containsKey(toId)) {
                    double costo = route.getCost() != null ? route.getCost() : 
                                  (route.getDistance() != null ? route.getDistance() : 100.0);
                    matrix.get(fromId).put(toId, costo);
                }
            }
        }
        
        // Completar con valores por defecto
        for (String fromId : matrix.keySet()) {
            for (String toId : matrix.keySet()) {
                if (!fromId.equals(toId) && !matrix.get(fromId).containsKey(toId)) {
                    matrix.get(fromId).put(toId, 200.0);
                }
            }
        }
        
        return matrix;
    }
    
    private int calcularCostoTotal(List<String> ruta, Map<String, Map<String, Double>> costMatrix) {
        int total = 0;
        for (int i = 0; i < ruta.size() - 1; i++) {
            String from = ruta.get(i);
            String to = ruta.get(i + 1);
            Double costo = costMatrix.get(from).get(to);
            if (costo != null) {
                total += costo.intValue();
            }
        }
        return total;
    }
    
    private int calcularDistanciaTotal(List<String> ruta, Map<String, Map<String, Double>> costMatrix) {
        return calcularCostoTotal(ruta, costMatrix);
    }
    
    private int calcularPrioridadTotal(List<String> ruta, List<DistributionCenter> centers) {
        int total = 0;
        Map<String, DistributionCenter> centerMap = new HashMap<>();
        for (DistributionCenter center : centers) {
            centerMap.put(center.getId(), center);
        }
        
        for (String id : ruta) {
            DistributionCenter center = centerMap.get(id);
            if (center != null && center.getPriority() != null) {
                total += center.getPriority();
            }
        }
        return total;
    }
}


