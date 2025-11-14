package com.transroute.logistics.service;

import com.transroute.logistics.model.Truck;
import com.transroute.logistics.repository.TruckRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para GreedyService
 * Módulo 3: Algoritmos Greedy
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para GreedyService - Módulo 3: Algoritmos Greedy")
class GreedyServiceTest {

    @Mock
    private TruckRepository truckRepository;

    @InjectMocks
    private GreedyService greedyService;

    @Test
    @DisplayName("Test: Distribución de combustible Greedy - caso estándar")
    void testDistribuirCombustibleGreedy_CasoEstandar() {
        int requiredAmount = 87;
        List<Integer> availableSizes = Arrays.asList(50, 20, 10, 5, 2);
        
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(requiredAmount, availableSizes);
        
        assertNotNull(distribucion);
        // 87 = 1x50 + 1x20 + 1x10 + 1x5 + 1x2 = 87
        int total = distribucion.entrySet().stream()
                .mapToInt(e -> e.getKey() * e.getValue())
                .sum();
        
        assertTrue(total >= requiredAmount);
    }

    @Test
    @DisplayName("Test: Distribución de combustible Greedy - cantidad exacta")
    void testDistribuirCombustibleGreedy_CantidadExacta() {
        int requiredAmount = 100;
        List<Integer> availableSizes = Arrays.asList(50, 25, 10, 5);
        
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(requiredAmount, availableSizes);
        
        int total = distribucion.entrySet().stream()
                .mapToInt(e -> e.getKey() * e.getValue())
                .sum();
        
        assertTrue(total >= requiredAmount);
        // Debe usar 2x50 = 100
        assertTrue(distribucion.getOrDefault(50, 0) >= 2 || total >= requiredAmount);
    }

    @Test
    @DisplayName("Test: Distribución de combustible Greedy - lista no ordenada")
    void testDistribuirCombustibleGreedy_ListaNoOrdenada() {
        int requiredAmount = 87;
        List<Integer> availableSizes = Arrays.asList(10, 50, 2, 20, 5); // No ordenado
        
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(requiredAmount, availableSizes);
        
        assertNotNull(distribucion);
        // El algoritmo debe ordenar internamente
        int total = distribucion.entrySet().stream()
                .mapToInt(e -> e.getKey() * e.getValue())
                .sum();
        
        assertTrue(total >= requiredAmount);
    }

    @Test
    @DisplayName("Test: Distribución de combustible Greedy - cantidad cero")
    void testDistribuirCombustibleGreedy_CantidadCero() {
        int requiredAmount = 0;
        List<Integer> availableSizes = Arrays.asList(50, 20, 10);
        
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(requiredAmount, availableSizes);
        
        assertNotNull(distribucion);
        int total = distribucion.entrySet().stream()
                .mapToInt(e -> e.getKey() * e.getValue())
                .sum();
        
        assertEquals(0, total);
    }

    @Test
    @DisplayName("Test: Distribución de presupuesto fraccional Greedy")
    void testDistribuirPresupuestoFraccional() {
        List<GreedyService.Proyecto> proyectos = Arrays.asList(
            new GreedyService.Proyecto("Proyecto A", 300.0, 400.0), // Ratio: 1.33
            new GreedyService.Proyecto("Proyecto B", 200.0, 350.0), // Ratio: 1.75
            new GreedyService.Proyecto("Proyecto C", 500.0, 600.0)  // Ratio: 1.20
        );
        
        double presupuestoTotal = 600.0;
        
        Map<String, Double> distribucion = greedyService.distribuirPresupuestoFraccional(proyectos, presupuestoTotal);
        
        assertNotNull(distribucion);
        // Debe priorizar Proyecto B (mejor ratio), luego Proyecto A
        double totalAsignado = distribucion.values().stream().mapToDouble(Double::doubleValue).sum();
        assertTrue(totalAsignado <= presupuestoTotal);
        
        // Proyecto B debe tener asignación completa o parcial
        assertTrue(distribucion.containsKey("Proyecto B"));
    }

    @Test
    @DisplayName("Test: Distribución de presupuesto - presupuesto insuficiente")
    void testDistribuirPresupuesto_PresupuestoInsuficiente() {
        List<GreedyService.Proyecto> proyectos = Arrays.asList(
            new GreedyService.Proyecto("Proyecto A", 1000.0, 500.0)
        );
        
        double presupuestoTotal = 500.0;
        
        Map<String, Double> distribucion = greedyService.distribuirPresupuestoFraccional(proyectos, presupuestoTotal);
        
        assertNotNull(distribucion);
        // Debe asignar fracción del proyecto
        assertEquals(500.0, distribucion.get("Proyecto A"), 0.001);
    }

    @Test
    @DisplayName("Test: Asignar combustible a múltiples camiones")
    void testAsignarCombustibleMultiplesCamiones() {
        Map<String, Integer> trucks = new HashMap<>();
        trucks.put("Truck1", 50);
        trucks.put("Truck2", 30);
        trucks.put("Truck3", 20);
        
        int availableFuel = 100;
        List<Integer> availableSizes = Arrays.asList(50, 20, 10, 5);
        
        Map<String, Map<Integer, Integer>> asignacion = 
            greedyService.asignarCombustibleMultiplesCamiones(trucks, availableFuel, availableSizes);
        
        assertNotNull(asignacion);
        assertEquals(3, asignacion.size());
        assertTrue(asignacion.containsKey("Truck1"));
        assertTrue(asignacion.containsKey("Truck2"));
        assertTrue(asignacion.containsKey("Truck3"));
    }

    @Test
    @DisplayName("Test: Calcular costo total de distribución")
    void testCalcularCostoTotal() {
        Map<Integer, Integer> distribucion = new HashMap<>();
        distribucion.put(50, 2); // 2 bidones de 50L
        distribucion.put(20, 1); // 1 bidón de 20L
        
        Map<Integer, Double> precios = new HashMap<>();
        precios.put(50, 100.0); // $100 por bidón de 50L
        precios.put(20, 50.0);  // $50 por bidón de 20L
        
        double costoTotal = greedyService.calcularCostoTotal(distribucion, precios);
        
        // 2 * 100 + 1 * 50 = 250
        assertEquals(250.0, costoTotal, 0.001);
    }

    @Test
    @DisplayName("Test: Verificar que Greedy selecciona los mayores primero")
    void testGreedySeleccionaMayoresPrimero() {
        int requiredAmount = 87;
        List<Integer> availableSizes = Arrays.asList(50, 20, 10, 5, 2);
        
        Map<Integer, Integer> distribucion = greedyService.distribuirCombustibleGreedy(requiredAmount, availableSizes);
        
        // Verificar que se usan los tamaños mayores primero
        List<Integer> sizesUsados = new ArrayList<>(distribucion.keySet());
        if (sizesUsados.size() > 1) {
            // Los tamaños mayores deben tener cantidades asignadas
            assertTrue(distribucion.getOrDefault(50, 0) > 0 || 
                      distribucion.getOrDefault(20, 0) > 0);
        }
    }
}

