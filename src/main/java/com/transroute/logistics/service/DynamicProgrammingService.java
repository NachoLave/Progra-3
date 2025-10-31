package com.transroute.logistics.service;

import com.transroute.logistics.model.Route;
import com.transroute.logistics.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Servicio para Programación Dinámica
 * Módulo 5: Planificación de inversiones y presupuestos
 * 
 * Este servicio implementa:
 * - Mochila 0/1 para optimización de inversiones
 * - Determinación de qué proyectos financiar con presupuesto fijo
 * - Maximización de beneficio sin superar el presupuesto
 * 
 * Complejidad: O(n × P) donde n es el número de proyectos y P es el presupuesto
 */
@Service
public class DynamicProgrammingService {
    
    @Autowired
    private RouteRepository routeRepository;
    
    /**
     * Crea proyectos basados en rutas de Neo4j
     * Cada ruta se convierte en un proyecto de inversión
     */
    public List<Proyecto> crearProyectosDesdeRutas() {
        List<Route> routes = routeRepository.findAll();
        List<Proyecto> proyectos = new ArrayList<>();
        
        for (Route route : routes) {
            // El costo del proyecto es el costo de la ruta
            int costo = route.getCost() != null ? route.getCost().intValue() : 0;
            // El beneficio es estimado basado en distancia/eficiencia
            int beneficio = route.getDistance() != null ? (int) (route.getDistance() * 10) : 0;
            
            String nombre = route.getName() != null ? route.getName() : 
                           route.getId() != null ? "Proyecto " + route.getId() : "Proyecto Ruta";
            
            proyectos.add(new Proyecto(nombre, costo, beneficio));
        }
        
        return proyectos;
    }

    /**
     * Representa un proyecto de inversión
     */
    public static class Proyecto {
        public String nombre;
        public int costo;
        public int beneficio;
        
        public Proyecto(String nombre, int costo, int beneficio) {
            this.nombre = nombre;
            this.costo = costo;
            this.beneficio = beneficio;
        }
    }

    /**
     * Solución del problema de la mochila
     */
    public static class SolucionMochila {
        public List<String> proyectosSeleccionados;
        public int costoTotal;
        public int beneficioTotal;
        public int presupuestoUtilizado;
        public int presupuestoDisponible;
        
        public SolucionMochila(List<String> proyectosSeleccionados, int costoTotal, 
                              int beneficioTotal, int presupuestoUtilizado, int presupuestoDisponible) {
            this.proyectosSeleccionados = proyectosSeleccionados;
            this.costoTotal = costoTotal;
            this.beneficioTotal = beneficioTotal;
            this.presupuestoUtilizado = presupuestoUtilizado;
            this.presupuestoDisponible = presupuestoDisponible;
        }
    }

    /**
     * Resuelve el problema de la mochila 0/1 usando Programación Dinámica
     * Determina qué proyectos financiar para maximizar el beneficio
     * 
     * Complejidad: O(n × P) donde n = número de proyectos, P = presupuesto
     * Espacio: O(n × P) para la tabla DP
     * 
     * @param proyectos Lista de proyectos disponibles
     * @param presupuesto Presupuesto disponible
     * @return Solución con proyectos seleccionados y métricas
     */
    public SolucionMochila resolverMochila01(List<Proyecto> proyectos, int presupuesto) {
        int n = proyectos.size();
        
        // Tabla DP: dp[i][w] = máximo beneficio usando los primeros i proyectos con presupuesto w
        int[][] dp = new int[n + 1][presupuesto + 1];
        
        // Rellenar la tabla DP
        for (int i = 1; i <= n; i++) {
            Proyecto proyecto = proyectos.get(i - 1);
            
            for (int w = 0; w <= presupuesto; w++) {
                // Opción 1: No tomar el proyecto actual
                dp[i][w] = dp[i - 1][w];
                
                // Opción 2: Tomar el proyecto actual (si el costo cabe en el presupuesto)
                if (proyecto.costo <= w) {
                    dp[i][w] = Math.max(dp[i][w], 
                                       dp[i - 1][w - proyecto.costo] + proyecto.beneficio);
                }
            }
        }
        
        // Reconstruir la solución: determinar qué proyectos se seleccionaron
        List<String> proyectosSeleccionados = new ArrayList<>();
        int w = presupuesto;
        
        for (int i = n; i > 0 && w > 0; i--) {
            // Si el beneficio cambió al agregar este proyecto, entonces fue seleccionado
            if (dp[i][w] != dp[i - 1][w]) {
                Proyecto proyecto = proyectos.get(i - 1);
                proyectosSeleccionados.add(proyecto.nombre);
                w -= proyecto.costo;
            }
        }
        
        Collections.reverse(proyectosSeleccionados); // Para mantener el orden original
        
        int costoTotal = presupuesto - w;
        int beneficioTotal = dp[n][presupuesto];
        int presupuestoUtilizado = costoTotal;
        int presupuestoRestante = presupuesto - presupuestoUtilizado;
        
        return new SolucionMochila(
                proyectosSeleccionados,
                costoTotal,
                beneficioTotal,
                presupuestoUtilizado,
                presupuestoRestante
        );
    }
    
    /**
     * Versión optimizada con espacio O(P) en lugar de O(n × P)
     * Usa un solo array y lo procesa de derecha a izquierda
     * 
     * Complejidad: O(n × P), Espacio: O(P)
     */
    public SolucionMochila resolverMochila01Optimizado(List<Proyecto> proyectos, int presupuesto) {
        int n = proyectos.size();
        
        // Array 1D para espacio optimizado
        int[] dp = new int[presupuesto + 1];
        
        // Matriz para rastrear qué proyectos fueron seleccionados (para reconstrucción)
        boolean[][] seleccionados = new boolean[n][presupuesto + 1];
        
        // Rellenar el array DP
        for (int i = 0; i < n; i++) {
            Proyecto proyecto = proyectos.get(i);
            
            // Procesar de derecha a izquierda para evitar usar valores ya actualizados
            for (int w = presupuesto; w >= proyecto.costo; w--) {
                int beneficioConProyecto = dp[w - proyecto.costo] + proyecto.beneficio;
                
                if (beneficioConProyecto > dp[w]) {
                    dp[w] = beneficioConProyecto;
                    seleccionados[i][w] = true;
                }
            }
        }
        
        // Reconstruir la solución
        List<String> proyectosSeleccionados = new ArrayList<>();
        int w = presupuesto;
        
        for (int i = n - 1; i >= 0 && w > 0; i--) {
            if (seleccionados[i][w]) {
                Proyecto proyecto = proyectos.get(i);
                proyectosSeleccionados.add(proyecto.nombre);
                w -= proyecto.costo;
            }
        }
        
        Collections.reverse(proyectosSeleccionados);
        
        int costoTotal = presupuesto - w;
        int beneficioTotal = dp[presupuesto];
        int presupuestoUtilizado = costoTotal;
        int presupuestoRestante = presupuesto - presupuestoUtilizado;
        
        return new SolucionMochila(
                proyectosSeleccionados,
                costoTotal,
                beneficioTotal,
                presupuestoUtilizado,
                presupuestoRestante
        );
    }
    
    /**
     * Calcula la tabla DP completa para análisis detallado
     * Útil para visualizar cómo se construye la solución
     * 
     * @param proyectos Lista de proyectos
     * @param presupuesto Presupuesto disponible
     * @return Tabla DP como lista de listas
     */
    public List<List<Integer>> obtenerTablaDP(List<Proyecto> proyectos, int presupuesto) {
        int n = proyectos.size();
        int[][] dp = new int[n + 1][presupuesto + 1];
        
        // Rellenar la tabla
        for (int i = 1; i <= n; i++) {
            Proyecto proyecto = proyectos.get(i - 1);
            
            for (int w = 0; w <= presupuesto; w++) {
                dp[i][w] = dp[i - 1][w];
                
                if (proyecto.costo <= w) {
                    dp[i][w] = Math.max(dp[i][w], 
                                       dp[i - 1][w - proyecto.costo] + proyecto.beneficio);
                }
            }
        }
        
        // Convertir a lista para la respuesta
        List<List<Integer>> tabla = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            List<Integer> fila = new ArrayList<>();
            for (int w = 0; w <= presupuesto; w++) {
                fila.add(dp[i][w]);
            }
            tabla.add(fila);
        }
        
        return tabla;
    }
    
    /**
     * Compara la solución de Programación Dinámica con una solución Greedy
     * para demostrar por qué DP es mejor para este problema
     * 
     * @param proyectos Lista de proyectos
     * @param presupuesto Presupuesto disponible
     * @return Comparación entre ambas estrategias
     */
    public Map<String, Object> compararConGreedy(List<Proyecto> proyectos, int presupuesto) {
        // Solución DP
        long startDP = System.nanoTime();
        SolucionMochila solucionDP = resolverMochila01(proyectos, presupuesto);
        long endDP = System.nanoTime();
        
        // Solución Greedy (por ratio beneficio/costo)
        long startGreedy = System.nanoTime();
        List<Proyecto> proyectosGreedy = new ArrayList<>(proyectos);
        proyectosGreedy.sort((a, b) -> {
            double ratioA = (double) a.beneficio / a.costo;
            double ratioB = (double) b.beneficio / b.costo;
            return Double.compare(ratioB, ratioA); // Descendente
        });
        
        List<String> seleccionadosGreedy = new ArrayList<>();
        int costoGreedy = 0;
        int beneficioGreedy = 0;
        
        for (Proyecto p : proyectosGreedy) {
            if (costoGreedy + p.costo <= presupuesto) {
                seleccionadosGreedy.add(p.nombre);
                costoGreedy += p.costo;
                beneficioGreedy += p.beneficio;
            }
        }
        long endGreedy = System.nanoTime();
        
        Map<String, Object> comparacion = new HashMap<>();
        comparacion.put("programacionDinamica", Map.of(
                "proyectosSeleccionados", solucionDP.proyectosSeleccionados,
                "costoTotal", solucionDP.costoTotal,
                "beneficioTotal", solucionDP.beneficioTotal,
                "tiempoEjecucionNanosegundos", endDP - startDP
        ));
        
        comparacion.put("greedy", Map.of(
                "proyectosSeleccionados", seleccionadosGreedy,
                "costoTotal", costoGreedy,
                "beneficioTotal", beneficioGreedy,
                "tiempoEjecucionNanosegundos", endGreedy - startGreedy
        ));
        
        comparacion.put("diferenciaBeneficio", solucionDP.beneficioTotal - beneficioGreedy);
        comparacion.put("mejorEstrategia", 
                solucionDP.beneficioTotal >= beneficioGreedy ? "Programación Dinámica" : "Greedy");
        
        return comparacion;
    }
}

