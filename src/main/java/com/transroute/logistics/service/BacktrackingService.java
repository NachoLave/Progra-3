package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.DistributionCenterRepository;
import com.transroute.logistics.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para algoritmos de Backtracking
 * Módulo 6: Planificación de secuencias de visitas
 * 
 * Este servicio implementa:
 * - Backtracking para encontrar la mejor secuencia de visitas a centros
 * - Considera restricciones de capacidad, tiempo y prioridad
 * 
 * Complejidad: O(n!) en el peor caso, pero optimizado con podas
 */
@Service
public class BacktrackingService {
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    
    /**
     * Representa una solución de secuencia de visitas
     */
    public static class SolucionSecuencia {
        public List<String> secuencia;
        public int costoTotal;
        public int distanciaTotal;
        public int prioridadTotal;
        public boolean cumpleRestricciones;
        
        public SolucionSecuencia(List<String> secuencia, int costoTotal, int distanciaTotal, 
                               int prioridadTotal, boolean cumpleRestricciones) {
            this.secuencia = secuencia;
            this.costoTotal = costoTotal;
            this.distanciaTotal = distanciaTotal;
            this.prioridadTotal = prioridadTotal;
            this.cumpleRestricciones = cumpleRestricciones;
        }
    }
    
    /**
     * Encuentra la mejor secuencia de visitas a centros usando Backtracking
     * Objetivo: Maximizar prioridad total minimizando costo y distancia
     * 
     * @param centerIds IDs de centros a visitar
     * @param presupuestoMaximo Presupuesto máximo disponible
     * @param distanciaMaxima Distancia máxima permitida
     * @return Mejor secuencia encontrada
     */
    public SolucionSecuencia encontrarMejorSecuencia(List<String> centerIds, 
                                                     int presupuestoMaximo, 
                                                     int distanciaMaxima) {
        // Obtener centros desde Neo4j
        List<DistributionCenter> centers = new ArrayList<>();
        for (String id : centerIds) {
            distributionCenterRepository.findById(id).ifPresent(centers::add);
        }
        
        if (centers.isEmpty()) {
            return new SolucionSecuencia(new ArrayList<>(), 0, 0, 0, false);
        }
        
        // Construir matriz de costos/distancia entre centros
        Map<String, Map<String, Double>> costMatrix = construirMatrizCostos(centers);
        
        // Variables para backtracking (usar wrappers para pasar por referencia)
        List<String> mejorSecuencia = new ArrayList<>();
        int[] mejorPrioridad = new int[]{-1};
        int[] mejorCosto = new int[]{Integer.MAX_VALUE};
        int[] mejorDistancia = new int[]{Integer.MAX_VALUE};
        
        // Iniciar backtracking
        List<String> secuenciaActual = new ArrayList<>();
        boolean[] visitado = new boolean[centers.size()];
        
        backtrack(centers, costMatrix, secuenciaActual, visitado, 0, 0, 0,
                 presupuestoMaximo, distanciaMaxima,
                 mejorSecuencia, mejorPrioridad, mejorCosto, mejorDistancia);
        
        // Calcular métricas de la mejor solución
        int costoTotal = calcularCostoTotal(mejorSecuencia, costMatrix);
        int distanciaTotal = calcularDistanciaTotal(mejorSecuencia, costMatrix);
        int prioridadTotal = calcularPrioridadTotal(mejorSecuencia, centers);
        boolean cumpleRestricciones = costoTotal <= presupuestoMaximo && 
                                     distanciaTotal <= distanciaMaxima;
        
        return new SolucionSecuencia(mejorSecuencia, costoTotal, distanciaTotal, 
                                   prioridadTotal, cumpleRestricciones);
    }
    
    /**
     * Método recursivo de backtracking
     */
    private void backtrack(List<DistributionCenter> centers,
                          Map<String, Map<String, Double>> costMatrix,
                          List<String> secuenciaActual,
                          boolean[] visitado,
                          int costoActual,
                          int distanciaActual,
                          int prioridadActual,
                          int presupuestoMaximo,
                          int distanciaMaxima,
                          List<String> mejorSecuencia,
                          int[] mejorPrioridad,
                          int[] mejorCosto,
                          int[] mejorDistancia) {
        
        // Poda: si ya excedimos restricciones, no continuar
        if (costoActual > presupuestoMaximo || distanciaActual > distanciaMaxima) {
            return;
        }
        
        // Si completamos una secuencia válida
        if (secuenciaActual.size() == centers.size()) {
            // Evaluar si es mejor solución
            if (prioridadActual > mejorPrioridad[0] || 
                (prioridadActual == mejorPrioridad[0] && costoActual < mejorCosto[0])) {
                mejorSecuencia.clear();
                mejorSecuencia.addAll(new ArrayList<>(secuenciaActual));
                mejorPrioridad[0] = prioridadActual;
                mejorCosto[0] = costoActual;
                mejorDistancia[0] = distanciaActual;
            }
            return;
        }
        
        // Poda optimista: estimar si podemos mejorar
        int prioridadRestante = calcularPrioridadRestante(centers, visitado);
        if (prioridadActual + prioridadRestante < mejorPrioridad[0]) {
            return; // No podemos mejorar
        }
        
        // Probar cada centro no visitado
        for (int i = 0; i < centers.size(); i++) {
            if (!visitado[i]) {
                DistributionCenter center = centers.get(i);
                String centerId = center.getId();
                
                // Calcular costo y distancia para llegar a este centro
                int nuevoCosto = costoActual;
                int nuevaDistancia = distanciaActual;
                
                if (!secuenciaActual.isEmpty()) {
                    String ultimoCentro = secuenciaActual.get(secuenciaActual.size() - 1);
                    Double costo = costMatrix.get(ultimoCentro).get(centerId);
                    Double distancia = costMatrix.get(ultimoCentro).get(centerId);
                    if (costo != null) {
                        nuevoCosto += costo.intValue();
                    }
                    if (distancia != null) {
                        nuevaDistancia += distancia.intValue();
                    }
                }
                
                // Hacer la elección
                secuenciaActual.add(centerId);
                visitado[i] = true;
                int nuevaPrioridad = prioridadActual + (center.getPriority() != null ? center.getPriority() : 0);
                
                // Recursión
                backtrack(centers, costMatrix, secuenciaActual, visitado,
                         nuevoCosto, nuevaDistancia, nuevaPrioridad,
                         presupuestoMaximo, distanciaMaxima,
                         mejorSecuencia, mejorPrioridad, mejorCosto, mejorDistancia);
                
                // Backtrack: deshacer la elección
                secuenciaActual.remove(secuenciaActual.size() - 1);
                visitado[i] = false;
            }
        }
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
        
        // Completar con valores por defecto si no hay ruta directa
        for (String fromId : matrix.keySet()) {
            for (String toId : matrix.keySet()) {
                if (!fromId.equals(toId) && !matrix.get(fromId).containsKey(toId)) {
                    matrix.get(fromId).put(toId, 200.0); // Valor por defecto
                }
            }
        }
        
        return matrix;
    }
    
    private int calcularCostoTotal(List<String> secuencia, Map<String, Map<String, Double>> costMatrix) {
        int total = 0;
        for (int i = 0; i < secuencia.size() - 1; i++) {
            String from = secuencia.get(i);
            String to = secuencia.get(i + 1);
            Double costo = costMatrix.get(from).get(to);
            if (costo != null) {
                total += costo.intValue();
            }
        }
        return total;
    }
    
    private int calcularDistanciaTotal(List<String> secuencia, Map<String, Map<String, Double>> costMatrix) {
        return calcularCostoTotal(secuencia, costMatrix); // Mismo cálculo
    }
    
    private int calcularPrioridadTotal(List<String> secuencia, List<DistributionCenter> centers) {
        int total = 0;
        Map<String, DistributionCenter> centerMap = new HashMap<>();
        for (DistributionCenter center : centers) {
            centerMap.put(center.getId(), center);
        }
        
        for (String id : secuencia) {
            DistributionCenter center = centerMap.get(id);
            if (center != null && center.getPriority() != null) {
                total += center.getPriority();
            }
        }
        return total;
    }
    
    private int calcularPrioridadRestante(List<DistributionCenter> centers, boolean[] visitado) {
        int total = 0;
        for (int i = 0; i < centers.size(); i++) {
            if (!visitado[i] && centers.get(i).getPriority() != null) {
                total += centers.get(i).getPriority();
            }
        }
        return total;
    }
}

