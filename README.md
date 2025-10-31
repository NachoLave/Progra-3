# TransRoute S.A. - Sistema de Logística Inteligente

## Descripción General

Sistema completo de planificación de rutas y recursos para una empresa de logística inteligente, implementando diversos algoritmos de programación avanzada usando Spring Boot + Neo4j.

## Arquitectura del Sistema

El sistema está organizado en módulos que abordan diferentes perspectivas del mismo problema logístico:

### Módulo 1: Complejidad y Recursividad ✅
**Perspectiva:** Cálculo de métricas operativas básicas  
**Problema:** Calcular recursivamente el costo total de transporte o la distancia total recorrida  
**Algoritmos:** Recursión simple para sumas acumulativas  
**Complejidad:** O(n) con recurrencia T(n) = T(n-1) + O(1)

### Módulo 2: Divide y Vencerás ✅
**Perspectiva:** Ordenamiento y búsqueda en grandes volúmenes de datos  
**Problema:** Ordenar centros logísticos por demanda/prioridad y búsquedas rápidas  
**Algoritmos:** MergeSort, QuickSort, Búsqueda Binaria  
**Complejidades:** 
- Ordenamiento → O(n log n)
- Búsqueda → O(log n)

### Módulo 3: Algoritmos Greedy ✅
**Perspectiva:** Asignación de recursos en tiempo real  
**Problema:** Distribuir combustible o dinero entre camiones con la menor cantidad de unidades  
**Algoritmos:** Cambio de monedas, Mochila fraccional  
**Complejidad:** O(n) donde n es el número de unidades disponibles

### Módulo 4: Grafos ✅
**Perspectiva:** Optimización de rutas  
**Problema:** Modelar conexiones entre centros y encontrar rutas óptimas  
**Algoritmos:** Kruskal, Prim (MST), Dijkstra (caminos más cortos)  
**Complejidades:**
- Kruskal → O(E log E)
- Prim → O(E log V)
- Dijkstra → O((V + E) log V)

### Módulo 5: Programación Dinámica ✅
**Perspectiva:** Planificación de inversiones y presupuestos  
**Problema:** Determinar qué proyectos financiar con presupuesto fijo  
**Algoritmos:** Mochila 0/1  
**Complejidad:** O(n × P) donde n = proyectos, P = presupuesto

## Configuración del Proyecto

### Prerrequisitos
- Java 17+
- Maven 3.6+
- Neo4j 4.0+

### Instalación
1. Clonar el repositorio
2. Configurar Neo4j:
   ```bash
   # Instalar Neo4j
   # Configurar usuario: neo4j, password: password
   # Puerto: 7687
   ```
3. Ejecutar la aplicación:
   ```bash
   mvn spring-boot:run
   ```

### Configuración de Base de Datos
Editar `src/main/resources/application.properties`:
```properties
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=password
```

## API Documentation

### Swagger UI
Una vez iniciada la aplicación, acceder a: `http://localhost:8080/swagger-ui.html`

## Módulos Implementados

### Módulo 1: Complejidad y Recursividad

#### Endpoints Disponibles

##### 1. Calcular Costo Total Recursivo
**POST** `/api/recursive-metrics/costo-total`

**Entrada:**
```json
{
  "costs": [150.5, 200.0, 75.25, 300.0]
}
```

**Salida:**
```json
{
  "costoTotal": 725.75,
  "metodo": "recursivo",
  "complejidad": "O(n)",
  "tiempoEjecucionNanosegundos": 1500,
  "numeroTramos": 4
}
```

#### 2. Calcular Distancia Total Recursivo
**POST** `/api/recursive-metrics/distancia-total`

**Entrada:**
```json
{
  "distances": [50.0, 75.5, 30.0, 100.0]
}
```

**Salida:**
```json
{
  "distanciaTotal": 255.5,
  "metodo": "recursivo",
  "complejidad": "O(n)",
  "tiempoEjecucionNanosegundos": 1200,
  "numeroTramos": 4
}
```

#### 3. Comparar Rendimiento Recursivo vs Iterativo
**POST** `/api/recursive-metrics/comparar-rendimiento`

**Entrada:**
```json
{
  "costs": [150.5, 200.0, 75.25, 300.0]
}
```

**Salida:**
```json
{
  "recursivo": {
    "costoTotal": 725.75,
    "tiempoEjecucion": 1500
  },
  "iterativo": {
    "costoTotal": 725.75,
    "tiempoEjecucion": 800
  },
  "diferenciaTiempo": 700,
  "analisis": "La versión iterativa generalmente es más eficiente en memoria"
}
```

#### 4. Calcular Métricas Combinadas
**POST** `/api/recursive-metrics/metricas-combinadas`

**Entrada:**
```json
{
  "costs": [150.5, 200.0, 75.25],
  "distances": [50.0, 75.5, 30.0]
}
```

**Salida:**
```json
{
  "costoTotal": 425.75,
  "distanciaTotal": 155.5,
  "costoPorKm": 2.74,
  "metodo": "recursivo",
  "complejidad": "O(n)"
}
```

## Ejemplos de Uso con cURL

### Calcular Costo Total
```bash
curl -X POST "http://localhost:8080/api/recursive-metrics/costo-total" \
  -H "Content-Type: application/json" \
  -d '{"costs": [150.5, 200.0, 75.25, 300.0]}'
```

### Calcular Distancia Total
```bash
curl -X POST "http://localhost:8080/api/recursive-metrics/distancia-total" \
  -H "Content-Type: application/json" \
  -d '{"distances": [50.0, 75.5, 30.0, 100.0]}'
```

### Comparar Rendimiento
```bash
curl -X POST "http://localhost:8080/api/recursive-metrics/comparar-rendimiento" \
  -H "Content-Type: application/json" \
  -d '{"costs": [150.5, 200.0, 75.25, 300.0]}'
```

## Análisis de Complejidad

### Algoritmo Recursivo de Suma
- **Recurrencia:** T(n) = T(n-1) + O(1)
- **Complejidad Temporal:** O(n)
- **Complejidad Espacial:** O(n) debido al stack de recursión
- **Caso Base:** T(0) = O(1)

### Comparación con Versión Iterativa
- **Complejidad Temporal:** O(n) (igual)
- **Complejidad Espacial:** O(1) (mejor)
- **Rendimiento:** Generalmente más rápido en la práctica

## Módulo 2: Divide y Vencerás

### Endpoints Disponibles

#### 1. Ordenar por Demanda (MergeSort)
**POST** `/api/divide-conquer/ordenar/mergesort`

#### 2. Ordenar por Prioridad (QuickSort)
**POST** `/api/divide-conquer/ordenar/quicksort`

#### 3. Búsqueda Binaria por Demanda
**POST** `/api/divide-conquer/buscar/binaria-demanda`

#### 4. Búsqueda por Rango de Demanda
**POST** `/api/divide-conquer/buscar/rango-demanda`

## Módulo 3: Algoritmos Greedy

### Endpoints Disponibles

#### 1. Distribuir Combustible
**POST** `/api/greedy/distribuir-combustible`

**Ejemplo:** Distribuir 87 litros con bidones de [50, 20, 10, 5, 2] → 1x50 + 1x20 + 1x10 + 1x5 + 1x2 = 87

#### 2. Asignar a Múltiples Camiones
**POST** `/api/greedy/asignar-multiples-camiones`

#### 3. Distribuir Presupuesto (Mochila Fraccional)
**POST** `/api/greedy/distribuir-presupuesto`

## Módulo 4: Grafos

### Endpoints Disponibles

#### 1. Árbol de Recubrimiento Mínimo (Kruskal)
**POST** `/api/graphs/kruskal/mst`

#### 2. Árbol de Recubrimiento Mínimo (Prim)
**POST** `/api/graphs/prim/mst`

#### 3. Caminos Más Cortos (Dijkstra)
**POST** `/api/graphs/dijkstra/distances`

#### 4. Camino Completo Más Corto
**POST** `/api/graphs/dijkstra/path`

## Módulo 5: Programación Dinámica

### Endpoints Disponibles

#### 1. Resolver Mochila 0/1
**POST** `/api/dynamic-programming/mochila`

Determina qué proyectos financiar para maximizar el beneficio sin superar el presupuesto.

**Ejemplo de entrada:**
```json
{
  "proyectos": [
    {"nombre": "Proyecto A", "costo": 100, "beneficio": 150},
    {"nombre": "Proyecto B", "costo": 200, "beneficio": 250},
    {"nombre": "Proyecto C", "costo": 150, "beneficio": 200}
  ],
  "presupuesto": 300
}
```

#### 2. Obtener Tabla DP
**POST** `/api/dynamic-programming/mochila/tabla-dp`

Muestra la tabla DP completa para análisis detallado.

#### 3. Comparar con Greedy
**POST** `/api/dynamic-programming/mochila/comparar-greedy`

Demuestra por qué Programación Dinámica garantiza la solución óptima.

## Estado del Proyecto

1. ✅ **Completado:** Módulo 1 - Recursividad
2. ✅ **Completado:** Módulo 2 - Divide y Vencerás
3. ✅ **Completado:** Módulo 3 - Algoritmos Greedy
4. ✅ **Completado:** Módulo 4 - Grafos
5. ✅ **Completado:** Módulo 5 - Programación Dinámica

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/com/transroute/logistics/
│   │   ├── LogisticsSystemApplication.java
│   │   ├── config/
│   │   │   └── SwaggerConfig.java
│   │   ├── controller/
│   │   │   ├── RecursiveMetricsController.java      (Módulo 1)
│   │   │   ├── DivideAndConquerController.java      (Módulo 2)
│   │   │   ├── GreedyController.java                 (Módulo 3)
│   │   │   ├── GraphController.java                  (Módulo 4)
│   │   │   └── DynamicProgrammingController.java    (Módulo 5)
│   │   ├── dto/
│   │   │   ├── CostCalculationRequest.java
│   │   │   ├── DistanceCalculationRequest.java
│   │   │   ├── CombinedMetricsRequest.java
│   │   │   ├── CenterSortRequest.java
│   │   │   ├── BinarySearchRequest.java
│   │   │   ├── FuelDistributionRequest.java
│   │   │   ├── GraphRequest.java
│   │   │   └── KnapsackRequest.java
│   │   ├── model/
│   │   │   ├── DistributionCenter.java
│   │   │   ├── Route.java
│   │   │   └── Truck.java
│   │   └── service/
│   │       ├── RecursiveMetricsService.java          (Módulo 1)
│   │       ├── DivideAndConquerService.java          (Módulo 2)
│   │       ├── GreedyService.java                    (Módulo 3)
│   │       ├── GraphService.java                     (Módulo 4)
│   │       └── DynamicProgrammingService.java       (Módulo 5)
│   └── resources/
│       └── application.properties
└── test/
```



