package com.transroute.logistics.service;

import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio para cálculos recursivos de métricas operativas básicas
 * Módulo 1: Complejidad y Recursividad
 * 
 * Este servicio implementa funciones recursivas para calcular:
 * - Costo total de transporte
 * - Distancia total recorrida
 * - Análisis de complejidad temporal O(n)
 */
@Service
public class RecursiveMetricsService {
    
    @Autowired
    private RouteRepository routeRepository;
    
    /**
     * Obtiene todas las rutas desde Neo4j y calcula el costo total recursivamente
     */
    public double obtenerRutasYCalcularCostoTotalRecursivo() {
        List<Route> routes = routeRepository.findAll();
        double[] costs = routes.stream()
                .mapToDouble(r -> r.getCost() != null ? r.getCost() : 0.0)
                .toArray();
        return calcularCostoTotalRecursivo(costs, 0);
    }
    
    /**
     * Obtiene todas las rutas desde Neo4j y calcula la distancia total recursivamente
     */
    public double obtenerRutasYCalcularDistanciaTotalRecursivo() {
        List<Route> routes = routeRepository.findAll();
        double[] distances = routes.stream()
                .mapToDouble(r -> r.getDistance() != null ? r.getDistance() : 0.0)
                .toArray();
        return calcularDistanciaTotalRecursivo(distances, 0);
    }
    
    /**
     * Obtiene todas las rutas desde Neo4j y calcula métricas combinadas recursivamente
     */
    public RouteMetrics obtenerRutasYCalcularMetricasCombinadas() {
        List<Route> routes = routeRepository.findAll();
        double[] costs = routes.stream()
                .mapToDouble(r -> r.getCost() != null ? r.getCost() : 0.0)
                .toArray();
        double[] distances = routes.stream()
                .mapToDouble(r -> r.getDistance() != null ? r.getDistance() : 0.0)
                .toArray();
        return calcularMetricasCombinadas(costs, distances, 0);
    }
    
    /**
     * Obtiene el número de rutas en Neo4j
     */
    public int getNumeroRutas() {
        return (int) routeRepository.count();
    }

    /**
     * Calcula recursivamente el costo total de transporte
     * Complejidad: O(n) donde n es el número de tramos
     * Recurrencia: T(n) = T(n-1) + O(1) = O(n)
     * 
     * @param costs Array de costos por tramo
     * @param index Índice actual para la recursión
     * @return Costo total acumulado
     */
    public double calcularCostoTotalRecursivo(double[] costs, int index) {
        // Caso base: cuando llegamos al final del array
        if (index == costs.length) {
            return 0;
        }
        
        // Caso recursivo: suma el costo actual + el resto
        return costs[index] + calcularCostoTotalRecursivo(costs, index + 1);
    }
    
    /**
     * Calcula recursivamente la distancia total recorrida
     * Complejidad: O(n) donde n es el número de tramos
     * 
     * @param distances Array de distancias por tramo
     * @param index Índice actual para la recursión
     * @return Distancia total acumulada
     */
    public double calcularDistanciaTotalRecursivo(double[] distances, int index) {
        // Caso base: cuando llegamos al final del array
        if (index == distances.length) {
            return 0;
        }
        
        // Caso recursivo: suma la distancia actual + el resto
        return distances[index] + calcularDistanciaTotalRecursivo(distances, index + 1);
    }
    
    /**
     * Versión iterativa para comparar rendimiento con la recursiva
     * Complejidad: O(n) pero con mejor rendimiento en la práctica
     * 
     * @param costs Array de costos por tramo
     * @return Costo total calculado iterativamente
     */
    public double calcularCostoTotalIterativo(double[] costs) {
        double total = 0;
        for (double cost : costs) {
            total += cost;
        }
        return total;
    }
    
    /**
     * Calcula métricas combinadas usando recursión
     * Ejemplo práctico: calcular costo por kilómetro de una ruta
     * 
     * @param costs Array de costos por tramo
     * @param distances Array de distancias por tramo
     * @param index Índice actual para la recursión
     * @return Objeto con métricas calculadas
     */
    public RouteMetrics calcularMetricasCombinadas(double[] costs, double[] distances, int index) {
        if (index == costs.length) {
            return new RouteMetrics(0, 0, 0);
        }
        
        RouteMetrics resto = calcularMetricasCombinadas(costs, distances, index + 1);
        
        double costoTotal = costs[index] + resto.getCostoTotal();
        double distanciaTotal = distances[index] + resto.getDistanciaTotal();
        double costoPorKm = distanciaTotal > 0 ? costoTotal / distanciaTotal : 0;
        
        return new RouteMetrics(costoTotal, distanciaTotal, costoPorKm);
    }
    
    /**
     * Clase interna para encapsular las métricas de una ruta
     */
    public static class RouteMetrics {
        private double costoTotal;
        private double distanciaTotal;
        private double costoPorKm;
        
        public RouteMetrics(double costoTotal, double distanciaTotal, double costoPorKm) {
            this.costoTotal = costoTotal;
            this.distanciaTotal = distanciaTotal;
            this.costoPorKm = costoPorKm;
        }
        
        // Getters
        public double getCostoTotal() { return costoTotal; }
        public double getDistanciaTotal() { return distanciaTotal; }
        public double getCostoPorKm() { return costoPorKm; }
    }
}



