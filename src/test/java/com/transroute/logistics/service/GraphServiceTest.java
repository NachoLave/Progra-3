package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.DistributionCenterRepository;
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
 * Tests unitarios para GraphService
 * Módulo 4: Grafos
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests para GraphService - Módulo 4: Grafos")
class GraphServiceTest {

    @Mock
    private RouteRepository routeRepository;

    @Mock
    private DistributionCenterRepository distributionCenterRepository;

    @InjectMocks
    private GraphService graphService;

    @Test
    @DisplayName("Test: Kruskal MST - caso básico")
    void testKruskalMST_CasoBasico() {
        int vertices = 4;
        List<GraphService.Edge> edges = Arrays.asList(
            new GraphService.Edge(0, 1, 10.0),
            new GraphService.Edge(1, 2, 15.0),
            new GraphService.Edge(2, 3, 4.0),
            new GraphService.Edge(0, 3, 5.0),
            new GraphService.Edge(1, 3, 8.0)
        );
        
        List<GraphService.Edge> mst = graphService.kruskalMST(vertices, edges);
        
        assertNotNull(mst);
        // MST debe tener V-1 = 3 aristas para 4 vértices
        assertEquals(3, mst.size());
        
        // Verificar que no hay ciclos (todas las aristas deben estar presentes)
        Set<Integer> verticesEnMST = new HashSet<>();
        for (GraphService.Edge edge : mst) {
            verticesEnMST.add(edge.from);
            verticesEnMST.add(edge.to);
        }
        // Todos los vértices deben estar conectados
        assertEquals(vertices, verticesEnMST.size());
    }

    @Test
    @DisplayName("Test: Kruskal MST - verificar que selecciona aristas de menor peso")
    void testKruskalMST_SeleccionaMenorPeso() {
        int vertices = 3;
        List<GraphService.Edge> edges = Arrays.asList(
            new GraphService.Edge(0, 1, 10.0), // Mayor peso
            new GraphService.Edge(1, 2, 5.0),  // Menor peso
            new GraphService.Edge(0, 2, 8.0)   // Peso medio
        );
        
        List<GraphService.Edge> mst = graphService.kruskalMST(vertices, edges);
        
        assertEquals(2, mst.size());
        // Debe seleccionar las dos aristas de menor peso: (1,2,5.0) y (0,2,8.0)
        double costoTotal = mst.stream().mapToDouble(e -> e.weight).sum();
        assertEquals(13.0, costoTotal, 0.001); // 5.0 + 8.0 = 13.0
    }

    @Test
    @DisplayName("Test: Kruskal MST - grafo desconectado")
    void testKruskalMST_GrafoDesconectado() {
        int vertices = 4;
        // Grafo con dos componentes desconectados
        List<GraphService.Edge> edges = Arrays.asList(
            new GraphService.Edge(0, 1, 10.0), // Componente 1
            new GraphService.Edge(2, 3, 5.0)   // Componente 2 (desconectado)
        );
        
        List<GraphService.Edge> mst = graphService.kruskalMST(vertices, edges);
        
        // MST debe tener solo 2 aristas (una por cada componente)
        assertTrue(mst.size() < vertices - 1); // No puede conectar todos los vértices
    }

    @Test
    @DisplayName("Test: Kruskal no modifica lista original")
    void testKruskalMST_NoModificaListaOriginal() {
        int vertices = 3;
        List<GraphService.Edge> edges = new ArrayList<>(Arrays.asList(
            new GraphService.Edge(0, 1, 10.0),
            new GraphService.Edge(1, 2, 5.0),
            new GraphService.Edge(0, 2, 8.0)
        ));
        
        List<GraphService.Edge> copiaOriginal = new ArrayList<>(edges);
        
        graphService.kruskalMST(vertices, edges);
        
        // Verificar que la lista original no fue modificada
        assertEquals(copiaOriginal.size(), edges.size());
        for (int i = 0; i < edges.size(); i++) {
            assertEquals(copiaOriginal.get(i).from, edges.get(i).from);
            assertEquals(copiaOriginal.get(i).to, edges.get(i).to);
            assertEquals(copiaOriginal.get(i).weight, edges.get(i).weight, 0.001);
        }
    }

    @Test
    @DisplayName("Test: Prim MST - caso básico")
    void testPrimMST_CasoBasico() {
        int vertices = 4;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 10.0});
        list0.add(new Double[]{3.0, 5.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 10.0});
        list1.add(new Double[]{2.0, 15.0});
        list1.add(new Double[]{3.0, 8.0});
        adjacencyList.put(1, list1);
        
        List<Double[]> list2 = new ArrayList<>();
        list2.add(new Double[]{1.0, 15.0});
        list2.add(new Double[]{3.0, 4.0});
        adjacencyList.put(2, list2);
        
        List<Double[]> list3 = new ArrayList<>();
        list3.add(new Double[]{0.0, 5.0});
        list3.add(new Double[]{1.0, 8.0});
        list3.add(new Double[]{2.0, 4.0});
        adjacencyList.put(3, list3);
        
        List<GraphService.Edge> mst = graphService.primMST(vertices, adjacencyList);
        
        assertNotNull(mst);
        assertEquals(3, mst.size()); // V-1 aristas
        
        // Verificar que todas las aristas están presentes
        double costoTotal = mst.stream().mapToDouble(e -> e.weight).sum();
        assertTrue(costoTotal > 0);
    }

    @Test
    @DisplayName("Test: Prim MST - verificar que comienza desde vértice 0")
    void testPrimMST_ComienzaDesdeVértice0() {
        int vertices = 3;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 5.0});
        list0.add(new Double[]{2.0, 10.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 5.0});
        list1.add(new Double[]{2.0, 8.0});
        adjacencyList.put(1, list1);
        
        List<Double[]> list2 = new ArrayList<>();
        list2.add(new Double[]{0.0, 10.0});
        list2.add(new Double[]{1.0, 8.0});
        adjacencyList.put(2, list2);
        
        List<GraphService.Edge> mst = graphService.primMST(vertices, adjacencyList);
        
        assertEquals(2, mst.size());
        // El primer vértice debe ser 0 (origen)
        boolean contieneVertice0 = mst.stream()
            .anyMatch(e -> e.from == 0 || e.to == 0);
        assertTrue(contieneVertice0, "El MST debe contener el vértice 0 como origen");
    }

    @Test
    @DisplayName("Test: Dijkstra - caso básico")
    void testDijkstra_CasoBasico() {
        int vertices = 4;
        int source = 0;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 4.0});
        list0.add(new Double[]{2.0, 1.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 4.0});
        list1.add(new Double[]{3.0, 2.0});
        adjacencyList.put(1, list1);
        
        List<Double[]> list2 = new ArrayList<>();
        list2.add(new Double[]{0.0, 1.0});
        list2.add(new Double[]{1.0, 2.0});
        list2.add(new Double[]{3.0, 5.0});
        adjacencyList.put(2, list2);
        
        List<Double[]> list3 = new ArrayList<>();
        list3.add(new Double[]{1.0, 2.0});
        list3.add(new Double[]{2.0, 5.0});
        adjacencyList.put(3, list3);
        
        double[] distances = graphService.dijkstra(vertices, source, adjacencyList);
        
        assertNotNull(distances);
        assertEquals(vertices, distances.length);
        assertEquals(0.0, distances[source], 0.001); // Distancia a sí mismo es 0
        
        // Verificar que las distancias son correctas
        // 0 -> 2: 1.0 (directo)
        assertEquals(1.0, distances[2], 0.001);
        // 0 -> 1: 4.0 (directo) o 3.0 (vía 2)
        assertTrue(distances[1] <= 4.0);
    }

    @Test
    @DisplayName("Test: Dijkstra - vértices no alcanzables")
    void testDijkstra_VerticesNoAlcanzables() {
        int vertices = 3;
        int source = 0;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 5.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 5.0});
        adjacencyList.put(1, list1);
        // Vértice 2 no está conectado
        
        double[] distances = graphService.dijkstra(vertices, source, adjacencyList);
        
        assertEquals(Double.MAX_VALUE, distances[2], 0.001); // No alcanzable
        assertEquals(0.0, distances[0], 0.001);
        assertEquals(5.0, distances[1], 0.001);
    }

    @Test
    @DisplayName("Test: Dijkstra Path - encontrar camino")
    void testDijkstraPath_EncontrarCamino() {
        int vertices = 4;
        int source = 0;
        int destination = 3;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 4.0});
        list0.add(new Double[]{2.0, 1.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 4.0});
        list1.add(new Double[]{3.0, 2.0});
        adjacencyList.put(1, list1);
        
        List<Double[]> list2 = new ArrayList<>();
        list2.add(new Double[]{0.0, 1.0});
        list2.add(new Double[]{1.0, 2.0});
        list2.add(new Double[]{3.0, 5.0});
        adjacencyList.put(2, list2);
        
        List<Double[]> list3 = new ArrayList<>();
        list3.add(new Double[]{1.0, 2.0});
        list3.add(new Double[]{2.0, 5.0});
        adjacencyList.put(3, list3);
        
        List<Integer> path = graphService.dijkstraPath(vertices, source, destination, adjacencyList);
        
        assertNotNull(path);
        assertFalse(path.isEmpty());
        assertEquals(source, path.get(0).intValue()); // Debe comenzar en el origen
        assertEquals(destination, path.get(path.size() - 1).intValue()); // Debe terminar en el destino
    }

    @Test
    @DisplayName("Test: Dijkstra Path - no hay camino")
    void testDijkstraPath_NoHayCamino() {
        int vertices = 3;
        int source = 0;
        int destination = 2;
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        List<Double[]> list0 = new ArrayList<>();
        list0.add(new Double[]{1.0, 5.0});
        adjacencyList.put(0, list0);
        
        List<Double[]> list1 = new ArrayList<>();
        list1.add(new Double[]{0.0, 5.0});
        adjacencyList.put(1, list1);
        // Vértice 2 no está conectado
        
        List<Integer> path = graphService.dijkstraPath(vertices, source, destination, adjacencyList);
        
        assertNull(path); // No hay camino
    }

    @Test
    @DisplayName("Test: Calcular costo total de MST")
    void testCalcularCostoTotal() {
        List<GraphService.Edge> edges = Arrays.asList(
            new GraphService.Edge(0, 1, 10.0),
            new GraphService.Edge(1, 2, 15.0),
            new GraphService.Edge(2, 3, 5.0)
        );
        
        double costoTotal = graphService.calcularCostoTotal(edges);
        
        assertEquals(30.0, costoTotal, 0.001); // 10 + 15 + 5 = 30
    }

    @Test
    @DisplayName("Test: Kruskal y Prim deben dar el mismo costo total para el mismo grafo")
    void testKruskalVsPrim_MismoCosto() {
        int vertices = 4;
        List<GraphService.Edge> edges = Arrays.asList(
            new GraphService.Edge(0, 1, 10.0),
            new GraphService.Edge(1, 2, 15.0),
            new GraphService.Edge(2, 3, 4.0),
            new GraphService.Edge(0, 3, 5.0),
            new GraphService.Edge(1, 3, 8.0)
        );
        
        // Construir lista de adyacencia para Prim
        Map<Integer, List<Double[]>> adjacencyList = new HashMap<>();
        for (int i = 0; i < vertices; i++) {
            adjacencyList.put(i, new ArrayList<>());
        }
        for (GraphService.Edge edge : edges) {
            adjacencyList.get(edge.from).add(new Double[]{(double) edge.to, edge.weight});
            adjacencyList.get(edge.to).add(new Double[]{(double) edge.from, edge.weight});
        }
        
        List<GraphService.Edge> mstKruskal = graphService.kruskalMST(vertices, edges);
        List<GraphService.Edge> mstPrim = graphService.primMST(vertices, adjacencyList);
        
        double costKruskal = graphService.calcularCostoTotal(mstKruskal);
        double costPrim = graphService.calcularCostoTotal(mstPrim);
        
        // Ambos algoritmos deben encontrar el mismo costo total (puede haber diferentes aristas pero mismo costo)
        assertEquals(costKruskal, costPrim, 0.001);
    }
}

