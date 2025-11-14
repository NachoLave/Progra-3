package com.transroute.logistics.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.transroute.logistics.repository.RouteRepository;
import com.transroute.logistics.model.Route;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para RecursiveMetricsService
 * Módulo 1: Complejidad y Recursividad
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para RecursiveMetricsService - Módulo 1: Recursividad")
class RecursiveMetricsServiceTest {

    @Mock
    private RouteRepository routeRepository;

    @InjectMocks
    private RecursiveMetricsService recursiveMetricsService;

    @BeforeEach
    void setUp() {
        // Setup inicial si es necesario
    }

    @Test
    @DisplayName("Test: Calcular costo total recursivo con array vacío")
    void testCalcularCostoTotalRecursivo_ArrayVacio() {
        double[] costs = {};
        double resultado = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        assertEquals(0.0, resultado, 0.001);
    }

    @Test
    @DisplayName("Test: Calcular costo total recursivo con valores positivos")
    void testCalcularCostoTotalRecursivo_ValoresPositivos() {
        double[] costs = {100.0, 200.0, 150.5, 75.25};
        double resultado = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        assertEquals(525.75, resultado, 0.001);
    }

    @Test
    @DisplayName("Test: Calcular costo total recursivo con un solo elemento")
    void testCalcularCostoTotalRecursivo_UnSoloElemento() {
        double[] costs = {250.0};
        double resultado = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        assertEquals(250.0, resultado, 0.001);
    }

    @Test
    @DisplayName("Test: Calcular distancia total recursivo")
    void testCalcularDistanciaTotalRecursivo() {
        double[] distances = {50.0, 75.5, 30.0, 100.0};
        double resultado = recursiveMetricsService.calcularDistanciaTotalRecursivo(distances, 0);
        assertEquals(255.5, resultado, 0.001);
    }

    @Test
    @DisplayName("Test: Comparar recursivo vs iterativo - mismos resultados")
    void testCompararRecursivoVsIterativo() {
        double[] costs = {100.0, 200.0, 150.5, 75.25};
        
        double resultadoRecursivo = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
        double resultadoIterativo = recursiveMetricsService.calcularCostoTotalIterativo(costs);
        
        assertEquals(resultadoRecursivo, resultadoIterativo, 0.001);
        assertEquals(525.75, resultadoRecursivo, 0.001);
    }

    @Test
    @DisplayName("Test: Calcular métricas combinadas")
    void testCalcularMetricasCombinadas() {
        double[] costs = {100.0, 200.0};
        double[] distances = {50.0, 75.0};
        
        RecursiveMetricsService.RouteMetrics metrics = 
            recursiveMetricsService.calcularMetricasCombinadas(costs, distances, 0);
        
        assertEquals(300.0, metrics.getCostoTotal(), 0.001);
        assertEquals(125.0, metrics.getDistanciaTotal(), 0.001);
        assertEquals(2.4, metrics.getCostoPorKm(), 0.001); // 300 / 125 = 2.4
    }

    @Test
    @DisplayName("Test: Calcular métricas combinadas con distancia cero")
    void testCalcularMetricasCombinadas_DistanciaCero() {
        double[] costs = {100.0, 200.0};
        double[] distances = {0.0, 0.0};
        
        RecursiveMetricsService.RouteMetrics metrics = 
            recursiveMetricsService.calcularMetricasCombinadas(costs, distances, 0);
        
        assertEquals(300.0, metrics.getCostoTotal(), 0.001);
        assertEquals(0.0, metrics.getDistanciaTotal(), 0.001);
        assertEquals(0.0, metrics.getCostoPorKm(), 0.001); // Evita división por cero
    }

    @Test
    @DisplayName("Test: Verificar complejidad O(n) - tiempo de ejecución")
    void testComplejidadTemporal() {
        // Test con diferentes tamaños de entrada
        int[] sizes = {10, 100, 1000};
        
        for (int size : sizes) {
            double[] costs = new double[size];
            Arrays.fill(costs, 1.0);
            
            long startTime = System.nanoTime();
            recursiveMetricsService.calcularCostoTotalRecursivo(costs, 0);
            long endTime = System.nanoTime();
            
            long tiempo = endTime - startTime;
            assertTrue(tiempo > 0, "El algoritmo debe tomar tiempo en ejecutarse");
        }
    }

    @Test
    @DisplayName("Test: Caso base de recursión")
    void testCasoBaseRecursion() {
        double[] costs = {100.0};
        // Cuando index == costs.length, debe retornar 0
        double resultado = recursiveMetricsService.calcularCostoTotalRecursivo(costs, 1);
        assertEquals(0.0, resultado, 0.001);
    }
}

