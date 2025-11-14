# Guía de Uso - Sistema de Logística TransRoute

## Índice
1. [Módulo 1: Complejidad y Recursividad](#módulo-1-complejidad-y-recursividad)
2. [Módulo 2: Divide y Vencerás](#módulo-2-divide-y-vencerás)
3. [Módulo 3: Algoritmos Greedy](#módulo-3-algoritmos-greedy)
4. [Módulo 4: Grafos](#módulo-4-grafos)
5. [Módulo 5: Programación Dinámica](#módulo-5-programación-dinámica)

---

## Módulo 1: Complejidad y Recursividad

### ¿Qué hace este módulo?
Este módulo implementa funciones recursivas para calcular métricas operativas básicas de transporte:
- **Costo total de transporte**: Suma todos los costos de las rutas usando recursión
- **Distancia total recorrida**: Suma todas las distancias de las rutas usando recursión
- **Métricas combinadas**: Calcula costo por kilómetro usando recursión

### Algoritmos Implementados

#### 1. Calcular Costo Total Recursivo
**Complejidad**: O(n) donde n es el número de rutas
**Recurrencia**: T(n) = T(n-1) + O(1) = O(n)

**Cómo funciona**:
1. Caso base: Si hemos procesado todos los elementos, retorna 0
2. Caso recursivo: Suma el costo actual + el costo del resto de elementos

**Ejemplo de uso**:
```bash
POST /api/recursive-metrics/costo-total
Content-Type: application/json

{
  "costs": [150.5, 200.0, 75.25, 300.0]
}

# Respuesta:
{
  "costoTotal": 725.75,
  "metodo": "recursivo",
  "complejidad": "O(n)",
  "numeroTramos": 4,
  "fuente": "request"
}
```

#### 2. Calcular Distancia Total Recursivo
**Complejidad**: O(n)

**Ejemplo de uso**:
```bash
POST /api/recursive-metrics/distancia-total
Content-Type: application/json

{
  "distances": [50.0, 75.5, 30.0, 100.0]
}

# Respuesta:
{
  "distanciaTotal": 255.5,
  "metodo": "recursivo",
  "complejidad": "O(n)",
  "numeroTramos": 4
}
```

#### 3. Métricas Combinadas
Calcula costo total, distancia total y costo por kilómetro.

**Ejemplo de uso**:
```bash
POST /api/recursive-metrics/metricas-combinadas
Content-Type: application/json

{
  "costs": [150.5, 200.0, 75.25],
  "distances": [50.0, 75.5, 30.0]
}

# Respuesta:
{
  "costoTotal": 425.75,
  "distanciaTotal": 155.5,
  "costoPorKm": 2.74,
  "metodo": "recursivo"
}
```

#### 4. Comparar Rendimiento (Recursión vs Iteración)
Compara el rendimiento entre la versión recursiva e iterativa.

**Ejemplo de uso**:
```bash
POST /api/recursive-metrics/comparar-rendimiento
Content-Type: application/json

{
  "costs": [150.5, 200.0, 75.25, 300.0]
}

# Respuesta:
{
  "recursivo": {
    "costoTotal": 725.75,
    "tiempoEjecucion": 1500
  },
  "iterativo": {
    "costoTotal": 725.75,
    "tiempoEjecucion": 800
  },
  "diferenciaTiempo": 700
}
```

---

## Módulo 2: Divide y Vencerás

### ¿Qué hace este módulo?
Este módulo implementa algoritmos de ordenamiento y búsqueda eficiente:
- **MergeSort**: Ordena centros de distribución por nivel de demanda
- **QuickSort**: Ordena centros de distribución por prioridad
- **Búsqueda Binaria**: Busca centros específicos por demanda o ID
- **Búsqueda por Rango**: Busca centros en un rango de demanda

### Algoritmos Implementados

#### 1. MergeSort - Ordenar por Demanda
**Complejidad**: O(n log n)
**Estrategia**: Divide y Vencerás - Divide el array en mitades, ordena cada mitad y las combina

**Cómo funciona**:
1. Divide el array en dos mitades
2. Ordena recursivamente cada mitad
3. Combina las mitades ordenadas

**Ejemplo de uso**:
```bash
POST /api/divide-conquer/ordenar/mergesort
Content-Type: application/json

{}

# Respuesta (desde Neo4j):
{
  "centrosOrdenados": [
    {
      "id": "C4",
      "name": "Centro 4",
      "demandLevel": 90,
      "priority": 1
    },
    {
      "id": "C2",
      "name": "Centro 2",
      "demandLevel": 80,
      "priority": 1
    },
    ...
  ],
  "algoritmo": "MergeSort",
  "complejidad": "O(n log n)",
  "numeroCentros": 4
}
```

#### 2. QuickSort - Ordenar por Prioridad
**Complejidad**: O(n log n) promedio, O(n²) peor caso
**Estrategia**: Divide y Vencerás - Selecciona un pivote y particiona el array

**Cómo funciona**:
1. Selecciona un pivote
2. Particiona el array: elementos menores que el pivote a la izquierda, mayores a la derecha
3. Ordena recursivamente ambas particiones

**Ejemplo de uso**:
```bash
POST /api/divide-conquer/ordenar/quicksort
Content-Type: application/json

{}

# Respuesta:
{
  "centrosOrdenados": [
    {
      "id": "C2",
      "name": "Centro 2",
      "priority": 1,
      "demandLevel": 80
    },
    ...
  ],
  "algoritmo": "QuickSort",
  "complejidad": "O(n log n) promedio, O(n²) peor caso"
}
```

#### 3. Búsqueda Binaria - Buscar por Demanda
**Complejidad**: O(log n)
**Requisito**: La lista debe estar ordenada previamente

**Cómo funciona**:
1. Compara el elemento del medio con el objetivo
2. Si es igual, retorna el índice
3. Si el objetivo es menor, busca en la mitad izquierda
4. Si el objetivo es mayor, busca en la mitad derecha
5. Repite hasta encontrar o no encontrar

**Ejemplo de uso**:
```bash
POST /api/divide-conquer/buscar/binaria-demanda
Content-Type: application/json

{
  "targetDemand": 80
}

# Respuesta:
{
  "encontrado": true,
  "centro": {
    "id": "C2",
    "name": "Centro 2",
    "demandLevel": 80
  },
  "indice": 1,
  "algoritmo": "Búsqueda Binaria",
  "complejidad": "O(log n)"
}
```

#### 4. Búsqueda por Rango de Demanda
**Complejidad**: O(log n + k) donde k es el número de resultados

**Ejemplo de uso**:
```bash
POST /api/divide-conquer/buscar/rango-demanda?minDemand=40&maxDemand=85

# Respuesta:
{
  "centrosEnRango": [
    {
      "id": "C1",
      "name": "Centro 1",
      "demandLevel": 50
    },
    {
      "id": "C2",
      "name": "Centro 2",
      "demandLevel": 80
    }
  ],
  "cantidadEncontrados": 2,
  "rango": {
    "min": 40,
    "max": 85
  }
}
```

---

## Módulo 3: Algoritmos Greedy

### ¿Qué hace este módulo?
Este módulo implementa algoritmos Greedy para asignación de recursos:
- **Distribución de Combustible**: Usa algoritmo de cambio de monedas (Greedy)
- **Distribución de Presupuesto**: Usa mochila fraccional (Greedy)
- **Asignación a Múltiples Camiones**: Asigna combustible a varios camiones

### Algoritmos Implementados

#### 1. Distribución de Combustible Greedy
**Complejidad**: O(n) donde n es el número de tamaños disponibles
**Estrategia**: Greedy - Siempre selecciona el bidón más grande posible

**Cómo funciona**:
1. Ordena los tamaños de bidones en orden descendente
2. Para cada tamaño, calcula cuántos bidones de ese tamaño se pueden usar
3. Resta la cantidad usada del total requerido
4. Repite hasta cubrir toda la cantidad requerida

**Ejemplo de uso**:
```bash
POST /api/greedy/distribuir-combustible
Content-Type: application/json

{
  "requiredAmount": 87,
  "availableSizes": [50, 20, 10, 5, 2]
}

# Respuesta:
{
  "distribucion": {
    "50": 1,
    "20": 1,
    "10": 1,
    "5": 1,
    "2": 1
  },
  "totalDistribuido": 87,
  "cantidadBidonesUsados": 5,
  "cantidadRequerida": 87,
  "diferencia": 0,
  "algoritmo": "Greedy (Cambio de Monedas)",
  "complejidad": "O(n)"
}
```

**Explicación**:
- 87 litros = 1x50L + 1x20L + 1x10L + 1x5L + 1x2L = 87L
- El algoritmo siempre elige el bidón más grande posible sin exceder la cantidad requerida

#### 2. Distribución de Presupuesto Fraccional (Greedy)
**Complejidad**: O(n log n) por el ordenamiento
**Estrategia**: Greedy - Ordena proyectos por ratio beneficio/costo y asigna empezando por los mejores

**Cómo funciona**:
1. Calcula el ratio beneficio/costo para cada proyecto
2. Ordena proyectos por ratio descendente (mejor ratio primero)
3. Asigna presupuesto empezando por proyectos con mejor ratio
4. Si un proyecto no cabe completo, asigna una fracción

**Ejemplo de uso**:
```bash
POST /api/greedy/distribuir-presupuesto?presupuestoTotal=600
Content-Type: application/json

[
  {
    "nombre": "Proyecto A",
    "costo": 300,
    "beneficio": 400
  },
  {
    "nombre": "Proyecto B",
    "costo": 200,
    "beneficio": 350
  },
  {
    "nombre": "Proyecto C",
    "costo": 500,
    "beneficio": 600
  }
]

# Respuesta:
{
  "distribucion": {
    "Proyecto B": 200.0,
    "Proyecto A": 300.0,
    "Proyecto C": 100.0
  },
  "presupuestoTotal": 600,
  "presupuestoAsignado": 600,
  "presupuestoRestante": 0,
  "algoritmo": "Greedy (Mochila Fraccional)",
  "complejidad": "O(n log n) por el ordenamiento"
}
```

**Explicación**:
- Proyecto B: ratio = 350/200 = 1.75 (mejor) → Asigna completo: 200
- Proyecto A: ratio = 400/300 = 1.33 → Asigna completo: 300
- Proyecto C: ratio = 600/500 = 1.20 → Asigna fracción: 100

#### 3. Asignar Combustible a Múltiples Camiones
**Estrategia**: Greedy - Prioriza camiones con mayor necesidad

**Ejemplo de uso**:
```bash
POST /api/greedy/asignar-multiples-camiones?availableFuel=100&availableSizes=50,20,10,5
Content-Type: application/json

{
  "Truck1": 50,
  "Truck2": 30,
  "Truck3": 20
}

# Respuesta:
{
  "asignacion": {
    "Truck1": {
      "50": 1
    },
    "Truck2": {
      "20": 1,
      "10": 1
    },
    "Truck3": {
      "20": 1
    }
  },
  "combustibleTotalDisponible": 100,
  "combustibleTotalUsado": 100,
  "combustibleRestante": 0
}
```

---

## Módulo 4: Grafos

### ¿Qué hace este módulo?
Este módulo implementa algoritmos de grafos para optimización de rutas:
- **Kruskal**: Encuentra el Árbol de Recubrimiento Mínimo (MST)
- **Prim**: Encuentra el MST usando una estrategia diferente
- **Dijkstra**: Encuentra los caminos más cortos desde un origen
- **Dijkstra Path**: Encuentra el camino completo más corto entre dos vértices

### Algoritmos Implementados

#### 1. Kruskal - Árbol de Recubrimiento Mínimo
**Complejidad**: O(E log E) donde E es el número de aristas
**Estrategia**: Ordena aristas por peso y usa Union-Find para detectar ciclos

**Cómo funciona**:
1. Ordena todas las aristas por peso (ascendente)
2. Inicializa Union-Find para cada vértice
3. Para cada arista en orden:
   - Si los vértices están en componentes diferentes, agrega la arista al MST
   - Une los componentes usando Union-Find
4. Repite hasta tener V-1 aristas (MST completo)

**Ejemplo de uso**:
```bash
POST /api/graphs/kruskal/mst
Content-Type: application/json

{
  "vertices": 4,
  "edges": [
    {"from": 0, "to": 1, "weight": 10},
    {"from": 1, "to": 2, "weight": 15},
    {"from": 2, "to": 3, "weight": 4},
    {"from": 0, "to": 3, "weight": 5},
    {"from": 1, "to": 3, "weight": 8}
  ]
}

# Respuesta:
{
  "mst": [
    {"from": 2, "to": 3, "weight": 4},
    {"from": 0, "to": 3, "weight": 5},
    {"from": 1, "to": 3, "weight": 8}
  ],
  "edges": [
    {"from": 0, "to": 1, "weight": 10},
    {"from": 1, "to": 2, "weight": 15},
    {"from": 2, "to": 3, "weight": 4},
    {"from": 0, "to": 3, "weight": 5},
    {"from": 1, "to": 3, "weight": 8}
  ],
  "numeroAristas": 3,
  "numeroAristasOriginales": 5,
  "costoTotal": 17,
  "algoritmo": "Kruskal",
  "complejidad": "O(E log E)",
  "vertices": 4
}
```

**Explicación**:
- El MST conecta todos los vértices con el menor costo total
- Costo total = 4 + 5 + 8 = 17
- Se eliminaron las aristas (0,1) y (1,2) porque formaban ciclos o tenían mayor peso

#### 2. Prim - Árbol de Recubrimiento Mínimo
**Complejidad**: O(E log V) donde E es el número de aristas y V el número de vértices
**Estrategia**: Comienza desde un vértice y agrega la arista de menor peso que conecte con un vértice no visitado

**Cómo funciona**:
1. Comienza desde el vértice 0
2. Usa una cola de prioridad para mantener las aristas candidatas
3. En cada iteración:
   - Selecciona la arista de menor peso que conecte un vértice visitado con uno no visitado
   - Marca el vértice como visitado
   - Agrega la arista al MST
4. Repite hasta tener V-1 aristas

**Ejemplo de uso**:
```bash
POST /api/graphs/prim/mst
Content-Type: application/json

{
  "vertices": 4,
  "adjacencyList": {
    "0": [[1, 10], [3, 5]],
    "1": [[0, 10], [2, 15], [3, 8]],
    "2": [[1, 15], [3, 4]],
    "3": [[0, 5], [1, 8], [2, 4]]
  }
}

# Respuesta:
{
  "mst": [
    {"from": 0, "to": 3, "weight": 5},
    {"from": 3, "to": 2, "weight": 4},
    {"from": 3, "to": 1, "weight": 8}
  ],
  "numeroAristas": 3,
  "costoTotal": 17,
  "algoritmo": "Prim",
  "complejidad": "O(E log V)"
}
```

#### 3. Dijkstra - Caminos Más Cortos
**Complejidad**: O((V + E) log V)
**Estrategia**: Usa una cola de prioridad para explorar vértices en orden de distancia creciente

**Cómo funciona**:
1. Inicializa distancias: 0 para el origen, infinito para los demás
2. Usa una cola de prioridad con el origen
3. En cada iteración:
   - Extrae el vértice con menor distancia
   - Relaja (actualiza) las distancias a sus vecinos
   - Si encuentra una distancia menor, actualiza y agrega a la cola
4. Repite hasta procesar todos los vértices

**Ejemplo de uso**:
```bash
POST /api/graphs/dijkstra/distances
Content-Type: application/json

{
  "vertices": 4,
  "source": 0,
  "adjacencyList": {
    "0": [[1, 4], [2, 1]],
    "1": [[0, 4], [3, 2]],
    "2": [[0, 1], [1, 2], [3, 5]],
    "3": [[1, 2], [2, 5]]
  }
}

# Respuesta:
{
  "source": 0,
  "distances": {
    "0": 0.0,
    "1": 3.0,
    "2": 1.0,
    "3": 5.0
  },
  "algoritmo": "Dijkstra",
  "complejidad": "O((V + E) log V)"
}
```

**Explicación**:
- Distancia de 0 a 0: 0 (origen)
- Distancia de 0 a 1: 3 (vía vértice 2: 0→2→1 = 1+2 = 3)
- Distancia de 0 a 2: 1 (directo)
- Distancia de 0 a 3: 5 (vía vértices 2 y 1: 0→2→1→3 = 1+2+2 = 5)

#### 4. Dijkstra Path - Camino Más Corto entre Dos Vértices
**Complejidad**: O((V + E) log V)
**Estrategia**: Usa Dijkstra pero reconstruye el camino completo

**Ejemplo de uso**:
```bash
POST /api/graphs/dijkstra/path
Content-Type: application/json

{
  "vertices": 4,
  "source": 0,
  "destination": 3,
  "adjacencyList": {
    "0": [[1, 4], [2, 1]],
    "1": [[0, 4], [3, 2]],
    "2": [[0, 1], [1, 2], [3, 5]],
    "3": [[1, 2], [2, 5]]
  }
}

# Respuesta:
{
  "path": [0, 2, 1, 3],
  "source": 0,
  "destination": 3,
  "totalDistance": 5.0,
  "numeroVertices": 4,
  "algoritmo": "Dijkstra",
  "complejidad": "O((V + E) log V)"
}
```

**Explicación**:
- Camino más corto: 0 → 2 → 1 → 3
- Distancia total: 1 + 2 + 2 = 5

---

## Módulo 5: Programación Dinámica

### ¿Qué hace este módulo?
Este módulo implementa Programación Dinámica para planificación de inversiones:
- **Mochila 0/1**: Determina qué proyectos financiar para maximizar el beneficio
- **Versión Optimizada**: Versión con menor uso de memoria
- **Comparación con Greedy**: Demuestra por qué DP es mejor para este problema

### Algoritmos Implementados

#### 1. Mochila 0/1 - Problema de la Mochila
**Complejidad**: O(n × P) donde n es el número de proyectos y P es el presupuesto
**Espacio**: O(n × P) para la versión estándar, O(P) para la versión optimizada
**Estrategia**: Programación Dinámica - Construye una tabla DP donde dp[i][w] = máximo beneficio usando los primeros i proyectos con presupuesto w

**Cómo funciona**:
1. Construye una tabla DP de tamaño (n+1) × (P+1)
2. Para cada proyecto y cada presupuesto:
   - Opción 1: No tomar el proyecto → dp[i][w] = dp[i-1][w]
   - Opción 2: Tomar el proyecto → dp[i][w] = dp[i-1][w-costo] + beneficio
   - Selecciona el máximo entre ambas opciones
3. Reconstruye la solución retrocediendo desde dp[n][P]

**Ejemplo de uso**:
```bash
POST /api/dynamic-programming/mochila
Content-Type: application/json

{
  "proyectos": [
    {"nombre": "Proyecto A", "costo": 100, "beneficio": 200},
    {"nombre": "Proyecto B", "costo": 200, "beneficio": 300},
    {"nombre": "Proyecto C", "costo": 150, "beneficio": 250}
  ],
  "presupuesto": 300
}

# Respuesta:
{
  "proyectosSeleccionados": ["Proyecto A", "Proyecto C"],
  "costoTotal": 250,
  "beneficioTotal": 450,
  "presupuestoUtilizado": 250,
  "presupuestoRestante": 50,
  "presupuestoInicial": 300,
  "numeroProyectosSeleccionados": 2,
  "numeroProyectosDisponibles": 3,
  "algoritmo": "Programación Dinámica (Mochila 0/1)",
  "complejidad": "O(n × P)",
  "version": "Estándar (espacio O(n × P))"
}
```

**Explicación**:
- Con presupuesto 300, la solución óptima es seleccionar Proyecto A (costo 100, beneficio 200) y Proyecto C (costo 150, beneficio 250)
- Costo total: 100 + 150 = 250
- Beneficio total: 200 + 250 = 450
- Presupuesto restante: 300 - 250 = 50

#### 2. Mochila 0/1 Optimizada
**Complejidad**: O(n × P)
**Espacio**: O(P) (optimizado)
**Estrategia**: Usa un solo array en lugar de una matriz 2D

**Ejemplo de uso**:
```bash
POST /api/dynamic-programming/mochila
Content-Type: application/json

{
  "proyectos": [
    {"nombre": "Proyecto A", "costo": 100, "beneficio": 200},
    {"nombre": "Proyecto B", "costo": 200, "beneficio": 300},
    {"nombre": "Proyecto C", "costo": 150, "beneficio": 250}
  ],
  "presupuesto": 300,
  "optimized": true
}

# Respuesta:
{
  "proyectosSeleccionados": ["Proyecto A", "Proyecto C"],
  "costoTotal": 250,
  "beneficioTotal": 450,
  "version": "Optimizada (espacio O(P))"
}
```

#### 3. Obtener Tabla DP Completa
Útil para visualizar cómo se construye la solución.

**Ejemplo de uso**:
```bash
POST /api/dynamic-programming/mochila/tabla-dp
Content-Type: application/json

{
  "proyectos": [
    {"nombre": "Proyecto A", "costo": 100, "beneficio": 200},
    {"nombre": "Proyecto B", "costo": 200, "beneficio": 300}
  ],
  "presupuesto": 300
}

# Respuesta:
{
  "tablaDP": [
    [0, 0, 0, 0, ...],  // Fila 0: sin proyectos
    [0, 0, 0, 200, ...], // Fila 1: con Proyecto A
    [0, 0, 0, 200, 300, 300, 500] // Fila 2: con Proyectos A y B
  ],
  "numeroProyectos": 2,
  "presupuesto": 300,
  "dimensiones": "(3 × 301)",
  "explicacion": "dp[i][w] = máximo beneficio usando los primeros i proyectos con presupuesto w"
}
```

#### 4. Comparar con Greedy
Demuestra por qué DP es mejor que Greedy para este problema.

**Ejemplo de uso**:
```bash
POST /api/dynamic-programming/mochila/comparar-greedy
Content-Type: application/json

{
  "proyectos": [
    {"nombre": "Proyecto A", "costo": 100, "beneficio": 101},
    {"nombre": "Proyecto B", "costo": 100, "beneficio": 100},
    {"nombre": "Proyecto C", "costo": 200, "beneficio": 200}
  ],
  "presupuesto": 200
}

# Respuesta:
{
  "programacionDinamica": {
    "proyectosSeleccionados": ["Proyecto A", "Proyecto B"],
    "costoTotal": 200,
    "beneficioTotal": 201
  },
  "greedy": {
    "proyectosSeleccionados": ["Proyecto C"],
    "costoTotal": 200,
    "beneficioTotal": 200
  },
  "diferenciaBeneficio": 1,
  "mejorEstrategia": "Programación Dinámica"
}
```

**Explicación**:
- Greedy selecciona Proyecto C (ratio = 200/200 = 1.0) → Beneficio = 200
- DP selecciona Proyectos A y B (ratios = 1.01 y 1.0) → Beneficio = 201
- DP encuentra la solución óptima, mientras que Greedy no

---

## Uso desde Neo4j

Todos los endpoints pueden usar datos de Neo4j si no se envía un cuerpo de solicitud o si el cuerpo está vacío. Por ejemplo:

```bash
# Usar datos de Neo4j
POST /api/graphs/kruskal/mst
Content-Type: application/json

{}

# O simplemente
POST /api/graphs/kruskal/mst
```

El sistema obtendrá automáticamente las rutas y centros de distribución desde Neo4j y construirá el grafo.

---

## Swagger UI

Para explorar y probar todos los endpoints, accede a:
```
http://localhost:8080/swagger-ui.html
```

---

## Ejecutar Tests

Para ejecutar todos los tests:
```bash
mvn test
```

Para ejecutar tests de un módulo específico:
```bash
mvn test -Dtest=RecursiveMetricsServiceTest
mvn test -Dtest=DivideAndConquerServiceTest
mvn test -Dtest=GreedyServiceTest
mvn test -Dtest=GraphServiceTest
mvn test -Dtest=DynamicProgrammingServiceTest
```

---

## Notas Importantes

1. **Precisión Decimal**: Los algoritmos de grafos (Prim, Dijkstra) ahora usan `double` en lugar de `int` para preservar la precisión decimal de los pesos.

2. **Kruskal no modifica la lista original**: El algoritmo crea una copia de las aristas antes de ordenarlas, por lo que la lista original no se modifica.

3. **Divide y Vencerás maneja null**: Los algoritmos de ordenamiento manejan correctamente listas `null` o vacías.

4. **DP vs Greedy**: Programación Dinámica siempre encuentra la solución óptima para la mochila 0/1, mientras que Greedy puede no encontrarla.

5. **Complejidades**: Todas las complejidades están documentadas en los endpoints y respuestas.

---

## Contacto y Soporte

Para más información, consulta la documentación de la API en Swagger UI o revisa el código fuente.

