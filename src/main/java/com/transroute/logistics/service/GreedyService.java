package com.transroute.logistics.service;

import com.transroute.logistics.model.Truck;
import com.transroute.logistics.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para algoritmos Greedy
 * Módulo 3: Asignación de recursos en tiempo real
 * 
 * Este servicio implementa:
 * - Distribución de combustible usando algoritmo de cambio de monedas
 * - Asignación óptima de recursos con decisiones localmente óptimas
 * 
 * Objetivo: Distribuir combustible o dinero entre camiones con la menor
 * cantidad de unidades posibles usando una estrategia Greedy.
 * 
 * Complejidad: O(n) donde n es el número de unidades disponibles
 */
@Service
public class GreedyService {
    
    @Autowired
    private TruckRepository truckRepository;
    
    /**
     * Obtiene camiones desde Neo4j y distribuye combustible usando sus capacidades
     */
    public Map<Integer, Integer> distribuirCombustibleDesdeNeo4j(int requiredAmount) {
        List<Truck> trucks = truckRepository.findAll();
        List<Integer> availableSizes = new ArrayList<>();
        
        // Obtener capacidades únicas de combustible de los camiones
        Set<Integer> uniqueCapacities = new HashSet<>();
        for (Truck truck : trucks) {
            if (truck.getFuelCapacity() != null) {
                uniqueCapacities.add(truck.getFuelCapacity());
            }
        }
        
        availableSizes.addAll(uniqueCapacities);
        availableSizes.sort(Collections.reverseOrder());
        
        return distribuirCombustibleGreedy(requiredAmount, availableSizes);
    }
    
    /**
     * Obtiene la cantidad total de combustible disponible en todos los camiones
     */
    public int obtenerCombustibleTotalDisponible() {
        List<Truck> trucks = truckRepository.findAll();
        return trucks.stream()
                .filter(t -> t.getCurrentFuel() != null)
                .mapToInt(Truck::getCurrentFuel)
                .sum();
    }

    /**
     * Distribuye combustible de forma óptima usando algoritmo Greedy
     * Ejemplo: un camión necesita 87 litros y hay bidones de 50, 20, 10, 5 y 2 litros
     * El algoritmo elige los mayores posibles sin exceder la capacidad
     * 
     * @param requiredAmount Cantidad total requerida (en litros)
     * @param availableSizes Tamaños disponibles de bidones (debe estar ordenado descendente)
     * @return Mapa con la distribución: tamaño del bidón -> cantidad utilizada
     */
    public Map<Integer, Integer> distribuirCombustibleGreedy(int requiredAmount, List<Integer> availableSizes) {
        Map<Integer, Integer> distribucion = new LinkedHashMap<>();
        
        // Asegurar que esté ordenado descendente (Greedy siempre elige el mayor)
        List<Integer> sortedSizes = new ArrayList<>(availableSizes);
        Collections.sort(sortedSizes, Collections.reverseOrder());
        
        int remaining = requiredAmount;
        
        // Estrategia Greedy: elegir siempre el bidón más grande que no exceda lo que falta
        for (Integer size : sortedSizes) {
            if (remaining <= 0) {
                break;
            }
            
            int cantidad = remaining / size;
            if (cantidad > 0) {
                distribucion.put(size, cantidad);
                remaining = remaining % size;
            }
        }
        
        // Si queda algo sin cubrir, devolver error o usar el bidón más pequeño
        if (remaining > 0) {
            // Opcional: agregar el bidón más pequeño para cubrir el resto
            Integer smallestSize = sortedSizes.get(sortedSizes.size() - 1);
            distribucion.put(smallestSize, distribucion.getOrDefault(smallestSize, 0) + 1);
        }
        
        return distribucion;
    }
    
    /**
     * Calcula el costo total de una distribución
     * 
     * @param distribucion Mapa de distribución
     * @param precios Mapa de precios por tamaño
     * @return Costo total
     */
    public double calcularCostoTotal(Map<Integer, Integer> distribucion, Map<Integer, Double> precios) {
        double costoTotal = 0.0;
        for (Map.Entry<Integer, Integer> entry : distribucion.entrySet()) {
            Integer size = entry.getKey();
            Integer cantidad = entry.getValue();
            Double precio = precios.getOrDefault(size, 0.0);
            costoTotal += cantidad * precio;
        }
        return costoTotal;
    }
    
    /**
     * Asigna combustible a múltiples camiones usando estrategia Greedy
     * Prioriza camiones con mayor necesidad o mayor prioridad
     * 
     * @param trucks Map con ID del camión y cantidad requerida
     * @param availableFuel Combustible total disponible
     * @param availableSizes Tamaños de bidones disponibles
     * @return Mapa con asignación por camión
     */
    public Map<String, Map<Integer, Integer>> asignarCombustibleMultiplesCamiones(
            Map<String, Integer> trucks, 
            int availableFuel, 
            List<Integer> availableSizes) {
        
        // Ordenar camiones por cantidad requerida (descendente - Greedy)
        List<Map.Entry<String, Integer>> sortedTrucks = new ArrayList<>(trucks.entrySet());
        sortedTrucks.sort((a, b) -> b.getValue().compareTo(a.getValue()));
        
        Map<String, Map<Integer, Integer>> asignacion = new LinkedHashMap<>();
        int remainingFuel = availableFuel;
        
        // Asignar a cada camión usando estrategia Greedy
        for (Map.Entry<String, Integer> truck : sortedTrucks) {
            if (remainingFuel <= 0) {
                asignacion.put(truck.getKey(), new HashMap<>());
                continue;
            }
            
            int required = Math.min(truck.getValue(), remainingFuel);
            Map<Integer, Integer> distribucion = distribuirCombustibleGreedy(required, availableSizes);
            
            // Calcular cuánto se usó realmente
            int used = distribucion.entrySet().stream()
                    .mapToInt(e -> e.getKey() * e.getValue())
                    .sum();
            
            remainingFuel -= used;
            asignacion.put(truck.getKey(), distribucion);
        }
        
        return asignacion;
    }
    
    /**
     * Distribución óptima de presupuesto usando mochila fraccional (Greedy)
     * Se puede tomar una fracción de cada proyecto
     * 
     * @param proyectos Lista de proyectos con costo y beneficio
     * @param presupuestoTotal Presupuesto disponible
     * @return Distribución de presupuesto por proyecto
     */
    public Map<String, Double> distribuirPresupuestoFraccional(
            List<Proyecto> proyectos, 
            double presupuestoTotal) {
        
        // Calcular ratio beneficio/costo y ordenar descendente (Greedy)
        List<ProyectoRatio> ratios = new ArrayList<>();
        for (Proyecto p : proyectos) {
            double ratio = p.beneficio / p.costo;
            ratios.add(new ProyectoRatio(p, ratio));
        }
        
        ratios.sort((a, b) -> Double.compare(b.ratio, a.ratio));
        
        Map<String, Double> distribucion = new LinkedHashMap<>();
        double remainingBudget = presupuestoTotal;
        
        // Asignar presupuesto empezando por proyectos con mejor ratio
        for (ProyectoRatio pr : ratios) {
            if (remainingBudget <= 0) {
                distribucion.put(pr.proyecto.nombre, 0.0);
                continue;
            }
            
            if (remainingBudget >= pr.proyecto.costo) {
                // Asignar todo el proyecto
                distribucion.put(pr.proyecto.nombre, pr.proyecto.costo);
                remainingBudget -= pr.proyecto.costo;
            } else {
                // Asignar fracción del proyecto
                distribucion.put(pr.proyecto.nombre, remainingBudget);
                remainingBudget = 0;
            }
        }
        
        return distribucion;
    }
    
    /**
     * Clase interna para representar un proyecto
     */
    public static class Proyecto {
        public String nombre;
        public double costo;
        public double beneficio;
        
        public Proyecto(String nombre, double costo, double beneficio) {
            this.nombre = nombre;
            this.costo = costo;
            this.beneficio = beneficio;
        }
    }
    
    /**
     * Clase interna para almacenar proyecto con su ratio
     */
    private static class ProyectoRatio {
        Proyecto proyecto;
        double ratio;
        
        ProyectoRatio(Proyecto proyecto, double ratio) {
            this.proyecto = proyecto;
            this.ratio = ratio;
        }
    }
}

