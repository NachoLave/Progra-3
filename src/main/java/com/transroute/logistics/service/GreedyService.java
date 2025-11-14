package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import com.transroute.logistics.model.Truck;
import com.transroute.logistics.repository.DistributionCenterRepository;
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
    
    @Autowired
    private DistributionCenterRepository distributionCenterRepository;
    
    /**
     * Obtiene todos los camiones disponibles en Neo4j
     * @return Lista de todos los camiones con su información
     */
    public List<Map<String, Object>> obtenerTodosCamiones() {
        // NOTA: Este método necesita todos los camiones, así que findAll() está bien aquí
        List<Truck> trucks = truckRepository.findAll();
        List<Map<String, Object>> camionesInfo = new ArrayList<>();
        
        for (Truck truck : trucks) {
            Map<String, Object> info = new HashMap<>();
            info.put("id", truck.getId());
            info.put("licensePlate", truck.getLicensePlate());
            info.put("capacity", truck.getCapacity());
            info.put("fuelCapacity", truck.getFuelCapacity());
            info.put("currentFuel", truck.getCurrentFuel());
            info.put("status", truck.getStatus());
            
            // Calcular porcentaje de combustible
            if (truck.getFuelCapacity() != null && truck.getCurrentFuel() != null) {
                double porcentaje = (double) truck.getCurrentFuel() / truck.getFuelCapacity() * 100;
                info.put("fuelPercentage", porcentaje);
                info.put("fuelNeeded", truck.getFuelCapacity() - truck.getCurrentFuel());
            }
            
            camionesInfo.add(info);
        }
        
        return camionesInfo;
    }
    
    /**
     * Obtiene camiones desde Neo4j y distribuye combustible usando sus capacidades
     */
    public Map<Integer, Integer> distribuirCombustibleDesdeNeo4j(int requiredAmount) {
        // NOTA: Este método necesita todas las capacidades únicas, así que findAll() está bien aquí
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
        // NOTA: Este método necesita todos los camiones, así que findAll() está bien aquí
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
    
    // ==========================================
    // NUEVOS MÉTODOS CONECTADOS A NEO4J
    // ==========================================
    
    /**
     * Distribuye combustible a camiones SELECCIONADOS por el usuario
     * Algoritmo Greedy: Prioriza camiones con menor combustible actual
     * 
     * @param truckIds Lista de IDs de camiones seleccionados
     * @param combustibleDisponible Total de combustible disponible para distribuir
     * @return Mapa con asignación detallada
     */
    public Map<String, Object> distribuirCombustiblePersonalizado(List<String> truckIds, int combustibleDisponible) {
        // Obtener solo los camiones seleccionados por el usuario
        // OPTIMIZACIÓN: Usar findAllByIds() en lugar de múltiples findById() para evitar problema N+1
        List<Truck> trucksSeleccionados = truckRepository.findAllByIds(truckIds);
        
        if (trucksSeleccionados.isEmpty()) {
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("error", "Ninguno de los camiones seleccionados fue encontrado");
            resultado.put("truckIdsNoEncontrados", truckIds);
            return resultado;
        }
        
        // Calcular necesidad de combustible para cada camión seleccionado
        List<CamionConNecesidad> camionesConNecesidad = new ArrayList<>();
        for (Truck truck : trucksSeleccionados) {
            int capacidad = truck.getFuelCapacity() != null ? truck.getFuelCapacity() : 0;
            int actual = truck.getCurrentFuel() != null ? truck.getCurrentFuel() : 0;
            int necesidad = capacidad - actual;
            
            if (necesidad > 0) {
                camionesConNecesidad.add(new CamionConNecesidad(truck, necesidad));
            } else {
                // Incluir camiones sin necesidad también en el resultado
                camionesConNecesidad.add(new CamionConNecesidad(truck, 0));
            }
        }
        
        // Estrategia Greedy: Ordenar por menor porcentaje de combustible
        camionesConNecesidad.sort((a, b) -> {
            double porcentajeA = (double) a.truck.getCurrentFuel() / a.truck.getFuelCapacity();
            double porcentajeB = (double) b.truck.getCurrentFuel() / b.truck.getFuelCapacity();
            return Double.compare(porcentajeA, porcentajeB);
        });
        
        // Distribuir combustible usando estrategia Greedy
        Map<String, Integer> asignacion = new LinkedHashMap<>();
        int combustibleRestante = combustibleDisponible;
        int totalAsignado = 0;
        int camionesLlenos = 0;
        
        for (CamionConNecesidad cn : camionesConNecesidad) {
            if (combustibleRestante <= 0 || cn.necesidad == 0) {
                asignacion.put(cn.truck.getId(), 0);
                if (cn.necesidad == 0) {
                    camionesLlenos++;
                }
                continue;
            }
            
            // Asignar lo que se pueda
            int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
            asignacion.put(cn.truck.getId(), cantidadAsignada);
            combustibleRestante -= cantidadAsignada;
            totalAsignado += cantidadAsignada;
            
            if (cantidadAsignada == cn.necesidad) {
                camionesLlenos++;
            }
        }
        
        // Preparar respuesta detallada
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("asignacion", asignacion);
        resultado.put("totalCamionesSeleccionados", trucksSeleccionados.size());
        resultado.put("camionesConNecesidad", camionesConNecesidad.size());
        resultado.put("camionesLlenos", camionesLlenos);
        resultado.put("combustibleDisponible", combustibleDisponible);
        resultado.put("combustibleAsignado", totalAsignado);
        resultado.put("combustibleRestante", combustibleRestante);
        resultado.put("camionesDetalle", generarDetalleCamiones(camionesConNecesidad, asignacion));
        
        return resultado;
    }
    
    /**
     * Distribuye combustible a camiones desde Neo4j de forma óptima
     * Algoritmo Greedy: Prioriza camiones con menor combustible actual
     * y asigna combustible hasta llenar su capacidad
     * 
     * @param combustibleDisponible Total de combustible disponible para distribuir
     * @return Mapa con asignación: TruckID -> cantidad de combustible asignado
     */
    public Map<String, Object> distribuirCombustibleOptimizado(int combustibleDisponible) {
        // OPTIMIZACIÓN: Usar consulta específica con filtro en Neo4j en lugar de findAll() + filtro en memoria
        List<Truck> trucksActivos = truckRepository.findActiveTrucks();
        
        // Calcular necesidad de combustible para cada camión
        List<CamionConNecesidad> camionesConNecesidad = new ArrayList<>();
        for (Truck truck : trucksActivos) {
            int capacidad = truck.getFuelCapacity() != null ? truck.getFuelCapacity() : 0;
            int actual = truck.getCurrentFuel() != null ? truck.getCurrentFuel() : 0;
            int necesidad = capacidad - actual;
            
            if (necesidad > 0) {
                camionesConNecesidad.add(new CamionConNecesidad(truck, necesidad));
            }
        }
        
        // Estrategia Greedy: Ordenar por mayor necesidad (o por menor combustible actual)
        camionesConNecesidad.sort((a, b) -> {
            // Priorizar por porcentaje de combustible (menor porcentaje primero)
            double porcentajeA = (double) a.truck.getCurrentFuel() / a.truck.getFuelCapacity();
            double porcentajeB = (double) b.truck.getCurrentFuel() / b.truck.getFuelCapacity();
            return Double.compare(porcentajeA, porcentajeB);
        });
        
        // Distribuir combustible usando estrategia Greedy
        Map<String, Integer> asignacion = new LinkedHashMap<>();
        int combustibleRestante = combustibleDisponible;
        int totalAsignado = 0;
        
        for (CamionConNecesidad cn : camionesConNecesidad) {
            if (combustibleRestante <= 0) {
                asignacion.put(cn.truck.getId(), 0);
                continue;
            }
            
            // Asignar lo que se pueda: mínimo entre necesidad y combustible disponible
            int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
            asignacion.put(cn.truck.getId(), cantidadAsignada);
            combustibleRestante -= cantidadAsignada;
            totalAsignado += cantidadAsignada;
        }
        
        // Preparar respuesta detallada
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("asignacion", asignacion);
        resultado.put("totalCamiones", camionesConNecesidad.size());
        resultado.put("combustibleDisponible", combustibleDisponible);
        resultado.put("combustibleAsignado", totalAsignado);
        resultado.put("combustibleRestante", combustibleRestante);
        resultado.put("camionesDetalle", generarDetalleCamiones(camionesConNecesidad, asignacion));
        
        return resultado;
    }
    
    /**
     * Distribuye peso/carga a camiones usando algoritmo Greedy
     * Algoritmo: First Fit Decreasing - Ordena cargas por peso (descendente)
     * y asigna cada carga al primer camión que tenga capacidad disponible
     * 
     * @param cargasDisponibles Lista de pesos de cargas a distribuir
     * @return Mapa con asignación: TruckID -> lista de cargas asignadas
     */
    public Map<String, Object> distribuirPesoGreedy(List<Integer> cargasDisponibles) {
        // OPTIMIZACIÓN: Usar consulta específica con filtro en Neo4j en lugar de findAll() + filtro en memoria
        List<Truck> trucksDisponibles = truckRepository.findByStatus("AVAILABLE");
        
        if (trucksDisponibles.isEmpty()) {
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("error", "No hay camiones disponibles");
            resultado.put("cargasNoAsignadas", cargasDisponibles);
            return resultado;
        }
        
        // Ordenar cargas de mayor a menor (First Fit Decreasing)
        List<Integer> cargasOrdenadas = new ArrayList<>(cargasDisponibles);
        cargasOrdenadas.sort(Collections.reverseOrder());
        
        // Inicializar capacidades disponibles de cada camión
        Map<String, Integer> capacidadDisponible = new HashMap<>();
        Map<String, List<Integer>> asignacion = new LinkedHashMap<>();
        
        for (Truck truck : trucksDisponibles) {
            capacidadDisponible.put(truck.getId(), truck.getCapacity());
            asignacion.put(truck.getId(), new ArrayList<>());
        }
        
        // Distribuir cargas usando First Fit Decreasing
        List<Integer> cargasNoAsignadas = new ArrayList<>();
        
        for (Integer carga : cargasOrdenadas) {
            boolean asignada = false;
            
            // Intentar asignar a cada camión (Greedy: primer camión que pueda)
            for (Truck truck : trucksDisponibles) {
                int disponible = capacidadDisponible.get(truck.getId());
                
                if (disponible >= carga) {
                    // Asignar carga a este camión
                    asignacion.get(truck.getId()).add(carga);
                    capacidadDisponible.put(truck.getId(), disponible - carga);
                    asignada = true;
                    break;
                }
            }
            
            if (!asignada) {
                cargasNoAsignadas.add(carga);
            }
        }
        
        // Calcular estadísticas
        int totalAsignado = cargasOrdenadas.size() - cargasNoAsignadas.size();
        int pesoTotalAsignado = cargasOrdenadas.stream()
                .mapToInt(Integer::intValue)
                .sum() - cargasNoAsignadas.stream().mapToInt(Integer::intValue).sum();
        
        // Preparar respuesta
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("asignacion", asignacion);
        resultado.put("totalCamiones", trucksDisponibles.size());
        resultado.put("totalCargas", cargasDisponibles.size());
        resultado.put("cargasAsignadas", totalAsignado);
        resultado.put("cargasNoAsignadas", cargasNoAsignadas);
        resultado.put("pesoTotalAsignado", pesoTotalAsignado);
        resultado.put("detalleUtilizacion", generarDetalleUtilizacionCamiones(trucksDisponibles, asignacion, capacidadDisponible));
        
        return resultado;
    }
    
    /**
     * Asigna cargas desde centros de distribución a camiones
     * considerando demandas de los centros y capacidades de rutas
     * 
     * @return Mapa con plan de distribución completo
     */
    public Map<String, Object> asignarCargasDesdeNeo4j() {
        // Obtener datos de Neo4j
        List<DistributionCenter> centros = distributionCenterRepository.findAllOrderedByPriority();
        
        // OPTIMIZACIÓN: Usar consulta específica con filtro en Neo4j en lugar de findAll() + filtro en memoria
        List<Truck> trucksDisponibles = truckRepository.findByStatus("AVAILABLE");
        
        // Filtrar centros con carga pendiente
        List<DistributionCenter> centrosConCarga = centros.stream()
                .filter(dc -> dc.getCurrentLoad() != null && dc.getCurrentLoad() > 0)
                .toList();
        
        if (trucksDisponibles.isEmpty()) {
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("error", "No hay camiones disponibles");
            return resultado;
        }
        
        // Crear lista de cargas basadas en demanda de centros
        List<CargaCentro> cargas = new ArrayList<>();
        for (DistributionCenter centro : centrosConCarga) {
            // Calcular carga basada en nivel de demanda
            int carga = (centro.getDemandLevel() * 100); // Simplificado
            cargas.add(new CargaCentro(centro.getId(), centro.getName(), carga, centro.getPriority()));
        }
        
        // Ordenar por prioridad del centro (menor número = mayor prioridad) y luego por peso
        cargas.sort((a, b) -> {
            int priComp = Integer.compare(a.prioridad, b.prioridad);
            if (priComp != 0) return priComp;
            return Integer.compare(b.peso, a.peso); // Mayor peso primero
        });
        
        // Asignar cargas a camiones usando Greedy
        Map<String, List<AsignacionCarga>> asignaciones = new LinkedHashMap<>();
        Map<String, Integer> capacidadDisponible = new HashMap<>();
        
        for (Truck truck : trucksDisponibles) {
            asignaciones.put(truck.getId(), new ArrayList<>());
            capacidadDisponible.put(truck.getId(), truck.getCapacity());
        }
        
        List<CargaCentro> cargasNoAsignadas = new ArrayList<>();
        
        for (CargaCentro carga : cargas) {
            boolean asignada = false;
            
            // Greedy: Asignar al primer camión con capacidad suficiente
            for (Truck truck : trucksDisponibles) {
                int disponible = capacidadDisponible.get(truck.getId());
                
                if (disponible >= carga.peso) {
                    asignaciones.get(truck.getId()).add(
                        new AsignacionCarga(carga.centroId, carga.centroNombre, carga.peso)
                    );
                    capacidadDisponible.put(truck.getId(), disponible - carga.peso);
                    asignada = true;
                    break;
                }
            }
            
            if (!asignada) {
                cargasNoAsignadas.add(carga);
            }
        }
        
        // Preparar respuesta
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("asignaciones", asignaciones);
        resultado.put("totalCamiones", trucksDisponibles.size());
        resultado.put("totalCargas", cargas.size());
        resultado.put("cargasAsignadas", cargas.size() - cargasNoAsignadas.size());
        resultado.put("cargasNoAsignadas", cargasNoAsignadas);
        resultado.put("detalleAsignaciones", generarDetalleAsignaciones(trucksDisponibles, asignaciones, capacidadDisponible));
        
        return resultado;
    }
    
    // ==========================================
    // MÉTODOS AUXILIARES
    // ==========================================
    
    private List<Map<String, Object>> generarDetalleCamiones(
            List<CamionConNecesidad> camiones, 
            Map<String, Integer> asignacion) {
        
        List<Map<String, Object>> detalle = new ArrayList<>();
        
        for (CamionConNecesidad cn : camiones) {
            Map<String, Object> info = new HashMap<>();
            info.put("truckId", cn.truck.getId());
            info.put("licensePlate", cn.truck.getLicensePlate());
            info.put("capacidadTotal", cn.truck.getFuelCapacity());
            info.put("combustibleActual", cn.truck.getCurrentFuel());
            info.put("necesidad", cn.necesidad);
            info.put("combustibleAsignado", asignacion.getOrDefault(cn.truck.getId(), 0));
            
            int nuevoNivel = cn.truck.getCurrentFuel() + asignacion.getOrDefault(cn.truck.getId(), 0);
            info.put("combustibleFinal", nuevoNivel);
            info.put("porcentajeFinal", (double) nuevoNivel / cn.truck.getFuelCapacity() * 100);
            
            detalle.add(info);
        }
        
        return detalle;
    }
    
    private List<Map<String, Object>> generarDetalleUtilizacionCamiones(
            List<Truck> trucks,
            Map<String, List<Integer>> asignacion,
            Map<String, Integer> capacidadDisponible) {
        
        List<Map<String, Object>> detalle = new ArrayList<>();
        
        for (Truck truck : trucks) {
            Map<String, Object> info = new HashMap<>();
            info.put("truckId", truck.getId());
            info.put("licensePlate", truck.getLicensePlate());
            info.put("capacidadTotal", truck.getCapacity());
            
            List<Integer> cargas = asignacion.get(truck.getId());
            int pesoAsignado = cargas.stream().mapToInt(Integer::intValue).sum();
            
            info.put("cargasAsignadas", cargas);
            info.put("numeroCargasAsignadas", cargas.size());
            info.put("pesoAsignado", pesoAsignado);
            info.put("capacidadDisponible", capacidadDisponible.get(truck.getId()));
            info.put("porcentajeUtilizacion", (double) pesoAsignado / truck.getCapacity() * 100);
            
            detalle.add(info);
        }
        
        return detalle;
    }
    
    private List<Map<String, Object>> generarDetalleAsignaciones(
            List<Truck> trucks,
            Map<String, List<AsignacionCarga>> asignaciones,
            Map<String, Integer> capacidadDisponible) {
        
        List<Map<String, Object>> detalle = new ArrayList<>();
        
        for (Truck truck : trucks) {
            Map<String, Object> info = new HashMap<>();
            info.put("truckId", truck.getId());
            info.put("licensePlate", truck.getLicensePlate());
            info.put("capacidadTotal", truck.getCapacity());
            
            List<AsignacionCarga> cargas = asignaciones.get(truck.getId());
            int pesoTotal = cargas.stream().mapToInt(ac -> ac.peso).sum();
            
            info.put("asignaciones", cargas);
            info.put("numeroAsignaciones", cargas.size());
            info.put("pesoTotal", pesoTotal);
            info.put("capacidadDisponible", capacidadDisponible.get(truck.getId()));
            info.put("porcentajeUtilizacion", (double) pesoTotal / truck.getCapacity() * 100);
            
            detalle.add(info);
        }
        
        return detalle;
    }
    
    // ==========================================
    // CLASES INTERNAS AUXILIARES
    // ==========================================
    
    private static class CamionConNecesidad {
        Truck truck;
        int necesidad;
        
        CamionConNecesidad(Truck truck, int necesidad) {
            this.truck = truck;
            this.necesidad = necesidad;
        }
    }
    
    private static class CargaCentro {
        String centroId;
        String centroNombre;
        int peso;
        int prioridad;
        
        CargaCentro(String centroId, String centroNombre, int peso, int prioridad) {
            this.centroId = centroId;
            this.centroNombre = centroNombre;
            this.peso = peso;
            this.prioridad = prioridad;
        }
    }
    
    public static class AsignacionCarga {
        public String centroId;
        public String centroNombre;
        public int peso;
        
        public AsignacionCarga(String centroId, String centroNombre, int peso) {
            this.centroId = centroId;
            this.centroNombre = centroNombre;
            this.peso = peso;
        }
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

