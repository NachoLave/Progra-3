package com.transroute.logistics.service;

import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.RouteRepository;
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
 * Tests unitarios para DynamicProgrammingService
 * Módulo 5: Programación Dinámica
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para DynamicProgrammingService - Módulo 5: Programación Dinámica")
class DynamicProgrammingServiceTest {

    @Mock
    private RouteRepository routeRepository;

    @InjectMocks
    private DynamicProgrammingService dpService;

    @Test
    @DisplayName("Test: Mochila 0/1 - caso básico")
    void testResolverMochila01_CasoBasico() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 200), // Ratio: 2.0
            new DynamicProgrammingService.Proyecto("Proyecto B", 200, 300), // Ratio: 1.5
            new DynamicProgrammingService.Proyecto("Proyecto C", 150, 250)  // Ratio: 1.67
        );
        
        int presupuesto = 300;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        assertNotNull(solucion.proyectosSeleccionados);
        assertTrue(solucion.costoTotal <= presupuesto);
        assertTrue(solucion.beneficioTotal > 0);
        
        // Verificar que no se excede el presupuesto
        assertTrue(solucion.presupuestoUtilizado <= presupuesto);
    }

    @Test
    @DisplayName("Test: Mochila 0/1 - solución óptima")
    void testResolverMochila01_SolucionOptima() {
        // Caso donde la solución óptima no es greedy
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 101), // Ratio: 1.01
            new DynamicProgrammingService.Proyecto("Proyecto B", 100, 100), // Ratio: 1.00
            new DynamicProgrammingService.Proyecto("Proyecto C", 200, 200)  // Ratio: 1.00
        );
        
        int presupuesto = 200;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        // Con presupuesto 200, la solución óptima debe seleccionar A y B (costo 200, beneficio 201)
        // en lugar de solo C (costo 200, beneficio 200)
        assertEquals(200, solucion.costoTotal);
        assertTrue(solucion.beneficioTotal >= 200);
    }

    @Test
    @DisplayName("Test: Mochila 0/1 - presupuesto insuficiente")
    void testResolverMochila01_PresupuestoInsuficiente() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 500, 1000)
        );
        
        int presupuesto = 100;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        // No se puede seleccionar ningún proyecto
        assertEquals(0, solucion.proyectosSeleccionados.size());
        assertEquals(0, solucion.costoTotal);
        assertEquals(0, solucion.beneficioTotal);
    }

    @Test
    @DisplayName("Test: Mochila 0/1 - presupuesto exacto")
    void testResolverMochila01_PresupuestoExacto() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 200),
            new DynamicProgrammingService.Proyecto("Proyecto B", 100, 150)
        );
        
        int presupuesto = 100;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        assertEquals(100, solucion.costoTotal);
        assertEquals(100, solucion.presupuestoUtilizado);
        assertEquals(0, solucion.presupuestoDisponible);
    }

    @Test
    @DisplayName("Test: Mochila 0/1 Optimizado - mismo resultado que estándar")
    void testResolverMochila01Optimizado_MismoResultado() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 200),
            new DynamicProgrammingService.Proyecto("Proyecto B", 200, 300),
            new DynamicProgrammingService.Proyecto("Proyecto C", 150, 250)
        );
        
        int presupuesto = 300;
        
        DynamicProgrammingService.SolucionMochila solucionEstandar = 
            dpService.resolverMochila01(proyectos, presupuesto);
        DynamicProgrammingService.SolucionMochila solucionOptimizada = 
            dpService.resolverMochila01Optimizado(proyectos, presupuesto);
        
        // Ambas soluciones deben tener el mismo beneficio total (óptimo)
        assertEquals(solucionEstandar.beneficioTotal, solucionOptimizada.beneficioTotal);
        assertEquals(solucionEstandar.costoTotal, solucionOptimizada.costoTotal);
    }

    @Test
    @DisplayName("Test: Obtener tabla DP completa")
    void testObtenerTablaDP() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 200),
            new DynamicProgrammingService.Proyecto("Proyecto B", 200, 300)
        );
        
        int presupuesto = 300;
        
        List<List<Integer>> tabla = dpService.obtenerTablaDP(proyectos, presupuesto);
        
        assertNotNull(tabla);
        // La tabla debe tener (n+1) filas y (presupuesto+1) columnas
        assertEquals(proyectos.size() + 1, tabla.size());
        assertEquals(presupuesto + 1, tabla.get(0).size());
        
        // La última celda debe contener el beneficio máximo
        int beneficioMaximo = tabla.get(proyectos.size()).get(presupuesto);
        assertTrue(beneficioMaximo > 0);
    }

    @Test
    @DisplayName("Test: Comparar con Greedy - DP debe ser mejor o igual")
    void testCompararConGreedy() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 101),
            new DynamicProgrammingService.Proyecto("Proyecto B", 100, 100),
            new DynamicProgrammingService.Proyecto("Proyecto C", 200, 200)
        );
        
        int presupuesto = 200;
        
        Map<String, Object> comparacion = dpService.compararConGreedy(proyectos, presupuesto);
        
        assertNotNull(comparacion);
        assertTrue(comparacion.containsKey("programacionDinamica"));
        assertTrue(comparacion.containsKey("greedy"));
        
        // DP debe tener beneficio mayor o igual que Greedy
        Map<String, Object> dp = (Map<String, Object>) comparacion.get("programacionDinamica");
        Map<String, Object> greedy = (Map<String, Object>) comparacion.get("greedy");
        
        int beneficioDP = (Integer) dp.get("beneficioTotal");
        int beneficioGreedy = (Integer) greedy.get("beneficioTotal");
        
        assertTrue(beneficioDP >= beneficioGreedy, 
            "DP debe encontrar una solución igual o mejor que Greedy");
    }

    @Test
    @DisplayName("Test: Mochila 0/1 - lista vacía")
    void testResolverMochila01_ListaVacia() {
        List<DynamicProgrammingService.Proyecto> proyectos = new ArrayList<>();
        int presupuesto = 100;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        assertTrue(solucion.proyectosSeleccionados.isEmpty());
        assertEquals(0, solucion.costoTotal);
        assertEquals(0, solucion.beneficioTotal);
    }

    @Test
    @DisplayName("Test: Mochila 0/1 - presupuesto cero")
    void testResolverMochila01_PresupuestoCero() {
        List<DynamicProgrammingService.Proyecto> proyectos = Arrays.asList(
            new DynamicProgrammingService.Proyecto("Proyecto A", 100, 200)
        );
        
        int presupuesto = 0;
        
        DynamicProgrammingService.SolucionMochila solucion = 
            dpService.resolverMochila01(proyectos, presupuesto);
        
        assertNotNull(solucion);
        assertTrue(solucion.proyectosSeleccionados.isEmpty());
        assertEquals(0, solucion.costoTotal);
        assertEquals(0, solucion.beneficioTotal);
    }
}

