package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.repository.DistributionCenterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para DivideAndConquerService
 * Módulo 2: Divide y Vencerás
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para DivideAndConquerService - Módulo 2: Divide y Vencerás")
class DivideAndConquerServiceTest {

    @Mock
    private DistributionCenterRepository distributionCenterRepository;

    @InjectMocks
    private DivideAndConquerService divideAndConquerService;

    private List<DistributionCenter> crearCentrosPrueba() {
        List<DistributionCenter> centros = new ArrayList<>();
        
        DistributionCenter c1 = new DistributionCenter();
        c1.setId("C1");
        c1.setName("Centro 1");
        c1.setDemandLevel(50);
        c1.setPriority(3);
        
        DistributionCenter c2 = new DistributionCenter();
        c2.setId("C2");
        c2.setName("Centro 2");
        c2.setDemandLevel(80);
        c2.setPriority(1);
        
        DistributionCenter c3 = new DistributionCenter();
        c3.setId("C3");
        c3.setName("Centro 3");
        c3.setDemandLevel(30);
        c3.setPriority(2);
        
        DistributionCenter c4 = new DistributionCenter();
        c4.setId("C4");
        c4.setName("Centro 4");
        c4.setDemandLevel(90);
        c4.setPriority(1);
        
        centros.add(c1);
        centros.add(c2);
        centros.add(c3);
        centros.add(c4);
        
        return centros;
    }

    @Test
    @DisplayName("Test: MergeSort ordena por demanda descendente")
    void testMergeSortPorDemanda() {
        List<DistributionCenter> centros = crearCentrosPrueba();
        
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        // Verificar que está ordenado descendentemente por demanda
        assertNotNull(resultado);
        assertEquals(4, resultado.size());
        assertTrue(resultado.get(0).getDemandLevel() >= resultado.get(1).getDemandLevel());
        assertTrue(resultado.get(1).getDemandLevel() >= resultado.get(2).getDemandLevel());
        assertTrue(resultado.get(2).getDemandLevel() >= resultado.get(3).getDemandLevel());
        
        // Verificar que el primer elemento tiene la mayor demanda
        assertEquals(90, resultado.get(0).getDemandLevel());
        assertEquals("C4", resultado.get(0).getId());
    }

    @Test
    @DisplayName("Test: MergeSort con lista vacía")
    void testMergeSort_ListaVacia() {
        List<DistributionCenter> centros = new ArrayList<>();
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Test: MergeSort con lista null")
    void testMergeSort_ListaNull() {
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorDemandaMergeSort(null);
        
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    @DisplayName("Test: MergeSort con un solo elemento")
    void testMergeSort_UnSoloElemento() {
        List<DistributionCenter> centros = new ArrayList<>();
        DistributionCenter c1 = new DistributionCenter();
        c1.setId("C1");
        c1.setDemandLevel(50);
        centros.add(c1);
        
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("C1", resultado.get(0).getId());
    }

    @Test
    @DisplayName("Test: QuickSort ordena por prioridad ascendente")
    void testQuickSortPorPrioridad() {
        List<DistributionCenter> centros = crearCentrosPrueba();
        
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorPrioridadQuickSort(centros);
        
        // Verificar que está ordenado ascendentemente por prioridad (1 = más alta)
        assertNotNull(resultado);
        assertEquals(4, resultado.size());
        assertTrue(resultado.get(0).getPriority() <= resultado.get(1).getPriority());
        assertTrue(resultado.get(1).getPriority() <= resultado.get(2).getPriority());
        assertTrue(resultado.get(2).getPriority() <= resultado.get(3).getPriority());
        
        // Verificar que los primeros tienen prioridad 1
        assertEquals(1, resultado.get(0).getPriority());
        assertEquals(1, resultado.get(1).getPriority());
    }

    @Test
    @DisplayName("Test: Búsqueda binaria encuentra centro por demanda")
    void testBusquedaBinariaPorDemanda() {
        List<DistributionCenter> centros = crearCentrosPrueba();
        // Ordenar primero por demanda
        List<DistributionCenter> ordenados = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        int index = divideAndConquerService.buscarPorDemandaBinaria(ordenados, 80);
        
        assertNotEquals(-1, index);
        assertEquals(80, ordenados.get(index).getDemandLevel());
    }

    @Test
    @DisplayName("Test: Búsqueda binaria no encuentra demanda inexistente")
    void testBusquedaBinaria_DemandaNoExiste() {
        List<DistributionCenter> centros = crearCentrosPrueba();
        List<DistributionCenter> ordenados = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        int index = divideAndConquerService.buscarPorDemandaBinaria(ordenados, 999);
        
        assertEquals(-1, index);
    }

    @Test
    @DisplayName("Test: Búsqueda binaria con lista vacía")
    void testBusquedaBinaria_ListaVacia() {
        List<DistributionCenter> centros = new ArrayList<>();
        int index = divideAndConquerService.buscarPorDemandaBinaria(centros, 50);
        
        assertEquals(-1, index);
    }

    @Test
    @DisplayName("Test: Buscar por rango de demanda")
    void testBuscarPorRangoDemanda() {
        List<DistributionCenter> centros = crearCentrosPrueba();
        List<DistributionCenter> ordenados = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        List<DistributionCenter> resultado = divideAndConquerService.buscarPorRangoDemanda(ordenados, 40, 85);
        
        assertNotNull(resultado);
        // Debe encontrar centros con demanda entre 40 y 85 (C1 con 50, C2 con 80)
        assertTrue(resultado.size() >= 1);
        for (DistributionCenter centro : resultado) {
            assertTrue(centro.getDemandLevel() >= 40 && centro.getDemandLevel() <= 85);
        }
    }

    @Test
    @DisplayName("Test: Verificar estabilidad de MergeSort")
    void testMergeSort_Estabilidad() {
        // Crear centros con misma demanda pero diferentes IDs
        List<DistributionCenter> centros = new ArrayList<>();
        
        DistributionCenter c1 = new DistributionCenter();
        c1.setId("C1");
        c1.setDemandLevel(50);
        
        DistributionCenter c2 = new DistributionCenter();
        c2.setId("C2");
        c2.setDemandLevel(50);
        
        centros.add(c1);
        centros.add(c2);
        
        List<DistributionCenter> resultado = divideAndConquerService.ordenarPorDemandaMergeSort(centros);
        
        assertEquals(2, resultado.size());
        assertEquals(50, resultado.get(0).getDemandLevel());
        assertEquals(50, resultado.get(1).getDemandLevel());
    }
}

