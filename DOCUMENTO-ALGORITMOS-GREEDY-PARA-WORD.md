# DOCUMENTO TÉCNICO: ALGORITMOS GREEDY EN SISTEMA DE LOGÍSTICA

**Autor:** Sistema de Logística con Neo4j  
**Fecha:** 2024  
**Versión:** 1.0

---

## ÍNDICE

1. [Introducción a los Algoritmos Greedy](#introduccion)
2. [Algoritmo 1: Distribución de Combustible Optimizado](#algoritmo1)
3. [Algoritmo 2: Distribución de Peso (First Fit Decreasing)](#algoritmo2)
4. [Algoritmo 3: Asignación de Cargas desde Centros de Distribución](#algoritmo3)
5. [Comparación y Conclusiones](#comparacion)

---

<a name="introduccion"></a>
## 1. INTRODUCCIÓN A LOS ALGORITMOS GREEDY

### 1.1 Definición

Un **algoritmo greedy** (voraz) es una técnica de diseño de algoritmos que resuelve problemas mediante la toma de decisiones locales óptimas en cada etapa, sin considerar las consecuencias futuras de estas decisiones.

### 1.2 Características Principales

- **Decisión Local Óptima**: En cada paso, selecciona la mejor opción disponible en ese momento
- **Eficiencia Temporal**: Complejidad generalmente O(n log n) o mejor
- **Simplicidad**: Fácil de implementar y entender
- **No Garantiza Óptimo Global**: Puede no encontrar la solución óptima absoluta, pero suele encontrar buenas soluciones

### 1.3 Aplicación en el Sistema de Logística

En este sistema, los algoritmos greedy se utilizan para:
- Distribuir recursos limitados (combustible) de manera eficiente
- Asignar cargas a vehículos optimizando el uso de capacidad
- Priorizar tareas según importancia y urgencia

---

<a name="algoritmo1"></a>
## 2. ALGORITMO 1: DISTRIBUCIÓN DE COMBUSTIBLE OPTIMIZADO

### 2.1 Descripción General

Este algoritmo distribuye una cantidad limitada de combustible entre múltiples camiones, priorizando aquellos que tienen menor porcentaje de combustible en su tanque.

### 2.2 Objetivo

Maximizar el número de camiones con tanque completo, priorizando los que tienen mayor necesidad de combustible.

### 2.3 Entrada y Salida

**Entrada:**
- Lista de camiones con su capacidad total y combustible actual
- Cantidad total de combustible disponible

**Salida:**
- Mapa de asignaciones (camión → litros asignados)
- Estadísticas de distribución (total asignado, sobrante, etc.)

### 2.4 PROCEDIMIENTO 1: Obtener Datos de Neo4j

**Descripción:**  
Consulta la base de datos Neo4j para obtener todos los camiones disponibles que necesitan combustible.

**Pasos:**
1. Conectar con la base de datos Neo4j mediante el repositorio `TruckRepository`
2. Ejecutar consulta para obtener camiones con estado `AVAILABLE` o `IN_TRANSIT`
3. Filtrar solo camiones que no tienen el tanque completamente lleno
4. Almacenar la lista de camiones en memoria

**Código:**
```java
List<Truck> camiones = truckRepository.findActiveTrucks();
```

**Complejidad:** O(n) donde n es el número de camiones en la base de datos

**Ejemplo:**
```
Camiones obtenidos de Neo4j:
- T001: Capacidad 150L, Actual 30L
- T002: Capacidad 150L, Actual 120L
- T003: Capacidad 150L, Actual 45L
- T004: Capacidad 150L, Actual 90L
```

---

### 2.5 PROCEDIMIENTO 2: Calcular Necesidad de Combustible

**Descripción:**  
Para cada camión, calcula cuántos litros de combustible necesita para llenar completamente su tanque.

**Fórmula:**
```
Necesidad = Capacidad Total - Combustible Actual
```

**Pasos:**
1. Para cada camión en la lista:
   - Leer capacidad total del tanque
   - Leer combustible actual
   - Calcular: Necesidad = Capacidad Total - Combustible Actual
   - Almacenar el resultado junto con los datos del camión

**Código:**
```java
List<CamionConNecesidad> camionesConNecesidad = new ArrayList<>();
for (Truck truck : camiones) {
    int necesidad = truck.getFuelCapacity() - truck.getCurrentFuel();
    // ... almacenar necesidad
}
```

**Complejidad:** O(n) donde n es el número de camiones

**Ejemplo:**
```
T001: Necesidad = 150 - 30 = 120 litros
T002: Necesidad = 150 - 120 = 30 litros
T003: Necesidad = 150 - 45 = 105 litros
T004: Necesidad = 150 - 90 = 60 litros
```

---

### 2.6 PROCEDIMIENTO 3: Calcular Porcentaje de Combustible

**Descripción:**  
Calcula el porcentaje de combustible que tiene cada camión respecto a su capacidad total. Este porcentaje se usa para determinar la prioridad.

**Fórmula:**
```
Porcentaje = (Combustible Actual / Capacidad Total) × 100
```

**Pasos:**
1. Para cada camión:
   - Obtener combustible actual y capacidad total
   - Calcular: Porcentaje = (Actual / Capacidad) × 100
   - Almacenar el porcentaje calculado

**Código:**
```java
double porcentaje = (double) truck.getCurrentFuel() / truck.getFuelCapacity();
```

**Complejidad:** O(n) donde n es el número de camiones

**Ejemplo:**
```
T001: Porcentaje = (30/150) × 100 = 20%
T002: Porcentaje = (120/150) × 100 = 80%
T003: Porcentaje = (45/150) × 100 = 30%
T004: Porcentaje = (90/150) × 100 = 60%
```

**Nota:** Menor porcentaje = Mayor necesidad = Mayor prioridad

---

### 2.7 PROCEDIMIENTO 4: Ordenar por Porcentaje (Estrategia Greedy)

**Descripción:**  
Ordena los camiones de menor a mayor porcentaje de combustible. Esta es la **estrategia greedy**: priorizar los que más necesitan combustible.

**Criterio de Ordenamiento:**
- Orden ascendente por porcentaje de combustible
- Si dos camiones tienen el mismo porcentaje, mantener orden original

**Pasos:**
1. Crear una lista con todos los camiones y sus porcentajes
2. Aplicar algoritmo de ordenamiento (quicksort, mergesort, etc.)
3. Ordenar de menor a mayor porcentaje

**Código:**
```java
camionesConNecesidad.sort((a, b) -> {
    double porcentajeA = (double) a.truck.getCurrentFuel() / a.truck.getFuelCapacity();
    double porcentajeB = (double) b.truck.getCurrentFuel() / b.truck.getFuelCapacity();
    return Double.compare(porcentajeA, porcentajeB); // Menor primero
});
```

**Complejidad:** O(n log n) - Esta es la operación más costosa del algoritmo

**Ejemplo:**
```
Orden antes de ordenar: [T001(20%), T002(80%), T003(30%), T004(60%)]
Orden después (Greedy): [T001(20%), T003(30%), T004(60%), T002(80%)]
```

**¿Por qué este orden?**  
Porque el algoritmo greedy toma decisiones locales óptimas: en este caso, llenar primero los tanques más vacíos es la mejor decisión inmediata.

---

### 2.8 PROCEDIMIENTO 5: Asignar Combustible (Distribución Greedy)

**Descripción:**  
Recorre los camiones ordenados y asigna combustible hasta agotar el disponible, empezando por los que tienen menor porcentaje.

**Estrategia:**
- Para cada camión en orden (de menor a mayor porcentaje):
  - Calcular cuánto combustible se puede asignar: min(necesidad, combustible_restante)
  - Asignar esa cantidad
  - Actualizar combustible restante
  - Continuar con el siguiente camión

**Pasos:**
1. Inicializar variable `combustibleRestante` con el total disponible
2. Inicializar mapa de asignaciones vacío
3. Para cada camión en la lista ordenada:
   - Calcular: `cantidadAsignada = min(necesidad, combustibleRestante)`
   - Si `cantidadAsignada > 0`:
     - Guardar asignación en el mapa
     - Restar `cantidadAsignada` de `combustibleRestante`
   - Si `combustibleRestante == 0`, terminar (no hay más combustible)
4. Retornar mapa de asignaciones

**Código:**
```java
int combustibleRestante = combustibleDisponible;
Map<String, Integer> asignacion = new HashMap<>();

for (CamionConNecesidad cn : camionesConNecesidad) {
    int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
    
    if (cantidadAsignada > 0) {
        asignacion.put(cn.truck.getId(), cantidadAsignada);
        combustibleRestante -= cantidadAsignada;
    }
    
    if (combustibleRestante == 0) break; // No hay más combustible
}
```

**Complejidad:** O(n) donde n es el número de camiones

**Ejemplo Paso a Paso:**
```
Combustible disponible inicial: 1000 litros

Iteración 1 - T001 (necesita 120L, porcentaje 20%):
  cantidadAsignada = min(120, 1000) = 120 litros
  combustibleRestante = 1000 - 120 = 880 litros
  Asignación: T001 → 120L ✅

Iteración 2 - T003 (necesita 105L, porcentaje 30%):
  cantidadAsignada = min(105, 880) = 105 litros
  combustibleRestante = 880 - 105 = 775 litros
  Asignación: T003 → 105L ✅

Iteración 3 - T004 (necesita 60L, porcentaje 60%):
  cantidadAsignada = min(60, 775) = 60 litros
  combustibleRestante = 775 - 60 = 715 litros
  Asignación: T004 → 60L ✅

Iteración 4 - T002 (necesita 30L, porcentaje 80%):
  cantidadAsignada = min(30, 715) = 30 litros
  combustibleRestante = 715 - 30 = 685 litros
  Asignación: T002 → 30L ✅

Resultado Final:
- Total asignado: 315 litros
- Combustible sobrante: 685 litros
- Todos los camiones quedaron con tanque lleno
```

---

### 2.9 Análisis de Complejidad del Algoritmo 1

**Complejidad Temporal:**
- Obtener datos: O(n)
- Calcular necesidad: O(n)
- Calcular porcentaje: O(n)
- Ordenar: O(n log n) ← **Operación dominante**
- Asignar: O(n)

**Complejidad Total: O(n log n)**

**Complejidad Espacial:** O(n) para almacenar la lista de camiones y asignaciones

**Ventajas:**
- Rápido y eficiente
- Garantiza que los camiones más necesitados reciban combustible primero
- Fácil de implementar

**Desventajas:**
- No garantiza la solución óptima global (aunque en este caso suele serlo)
- Puede dejar combustible sin asignar si hay muchos camiones con tanques casi llenos

---

<a name="algoritmo2"></a>
## 3. ALGORITMO 2: DISTRIBUCIÓN DE PESO (FIRST FIT DECREASING)

### 3.1 Descripción General

Este algoritmo asigna múltiples cargas (paquetes) de diferentes pesos a camiones disponibles, utilizando la estrategia **First Fit Decreasing**: primero ordena las cargas de mayor a menor peso, luego asigna cada carga al primer camión que tenga capacidad suficiente.

### 3.2 Objetivo

Maximizar el aprovechamiento de la capacidad de los camiones, minimizando el número de camiones utilizados y evitando desperdiciar espacio.

### 3.3 Entrada y Salida

**Entrada:**
- Lista de cargas (pesos en kilogramos)
- Lista de camiones disponibles con sus capacidades de peso

**Salida:**
- Mapa de asignaciones (camión → lista de cargas asignadas)
- Estadísticas de utilización por camión
- Lista de cargas no asignadas (si las hay)

### 3.4 PROCEDIMIENTO 1: Obtener Camiones de Neo4j

**Descripción:**  
Consulta la base de datos Neo4j para obtener todos los camiones disponibles que pueden transportar cargas.

**Pasos:**
1. Conectar con Neo4j mediante `TruckRepository`
2. Consultar camiones con estado `AVAILABLE`
3. Obtener la capacidad de peso de cada camión
4. Almacenar en una lista

**Código:**
```java
List<Truck> trucksDisponibles = truckRepository.findByStatus(TruckStatus.AVAILABLE);
```

**Complejidad:** O(m) donde m es el número de camiones disponibles

**Ejemplo:**
```
Camiones obtenidos:
- T001: Capacidad 15000 kg
- T002: Capacidad 15000 kg
- T003: Capacidad 15000 kg
```

---

### 3.5 PROCEDIMIENTO 2: Ordenar Cargas de Mayor a Menor (Decreasing)

**Descripción:**  
Ordena la lista de cargas en orden descendente (de mayor a menor peso). Esta es la parte "Decreasing" de la estrategia.

**¿Por qué ordenar?**  
Si colocamos primero los paquetes grandes, los espacios pequeños que queden se pueden llenar con paquetes pequeños. Si hacemos al revés, puede quedar un espacio grande (ej: 7000kg) que no se puede llenar con paquetes pequeños.

**Pasos:**
1. Crear una copia de la lista de cargas
2. Aplicar algoritmo de ordenamiento descendente
3. Almacenar la lista ordenada

**Código:**
```java
List<Integer> cargasOrdenadas = new ArrayList<>(cargasDisponibles);
cargasOrdenadas.sort(Collections.reverseOrder()); // Orden descendente
```

**Complejidad:** O(n log n) donde n es el número de cargas

**Ejemplo:**
```
Cargas originales: [5000, 3200, 8000, 1500, 6000, 2000]
Cargas ordenadas:   [8000, 6000, 5000, 3200, 2000, 1500]
```

---

### 3.6 PROCEDIMIENTO 3: Inicializar Capacidad Disponible

**Descripción:**  
Crea una estructura de datos que mantiene el seguimiento de cuánta capacidad disponible tiene cada camión en cada momento.

**Pasos:**
1. Crear un mapa (diccionario) vacío: `capacidadDisponible`
2. Para cada camión:
   - Agregar entrada: `camionId → capacidadTotal`
3. Crear un mapa para asignaciones: `asignacion`

**Código:**
```java
Map<String, Integer> capacidadDisponible = new HashMap<>();
Map<String, List<Integer>> asignacion = new HashMap<>();

for (Truck truck : trucksDisponibles) {
    capacidadDisponible.put(truck.getId(), truck.getWeightCapacity());
    asignacion.put(truck.getId(), new ArrayList<>());
}
```

**Complejidad:** O(m) donde m es el número de camiones

**Ejemplo:**
```
capacidadDisponible = {
    "T001": 15000,
    "T002": 15000,
    "T003": 15000
}

asignacion = {
    "T001": [],
    "T002": [],
    "T003": []
}
```

---

### 3.7 PROCEDIMIENTO 4: Asignar Cargas usando First Fit

**Descripción:**  
Para cada carga (en orden de mayor a menor), busca el **primer** camión que tenga capacidad suficiente y asigna la carga a ese camión. Esta es la parte "First Fit" de la estrategia.

**Estrategia Greedy:**
- No busca el "mejor" camión (el que tenga menos espacio sobrante)
- Toma el **primer** camión que tenga capacidad suficiente
- Esto hace el algoritmo más rápido

**Pasos:**
1. Para cada carga en la lista ordenada (de mayor a menor):
   - Inicializar variable `asignada = false`
   - Para cada camión en la lista de camiones:
     - Obtener capacidad disponible del camión
     - Si `capacidadDisponible >= pesoCarga`:
       - Agregar carga a la lista de asignaciones del camión
       - Actualizar: `capacidadDisponible = capacidadDisponible - pesoCarga`
       - Marcar `asignada = true`
       - **BREAK** (salir del bucle de camiones - esto es First Fit)
   - Si `asignada == false`:
     - Agregar carga a la lista de cargas no asignadas

**Código:**
```java
for (Integer carga : cargasOrdenadas) {
    boolean asignada = false;
    
    for (Truck truck : trucksDisponibles) {
        int disponible = capacidadDisponible.get(truck.getId());
        
        if (disponible >= carga) {
            // First Fit: tomar el primero que tenga capacidad
            asignacion.get(truck.getId()).add(carga);
            capacidadDisponible.put(truck.getId(), disponible - carga);
            asignada = true;
            break; // ¡Importante! No seguir buscando
        }
    }
    
    if (!asignada) {
        cargasNoAsignadas.add(carga);
    }
}
```

**Complejidad:** O(n × m) donde n es número de cargas y m es número de camiones

**Ejemplo Paso a Paso:**
```
Cargas ordenadas: [8000, 6000, 5000, 3200, 2000, 1500]
Capacidad inicial: T001=15000, T002=15000, T003=15000

Iteración 1 - Carga 8000 kg:
  T001: ¿15000 >= 8000? SÍ → Asignar a T001
  T001 disponible: 15000 - 8000 = 7000 kg
  Asignación: T001 → [8000] ✅

Iteración 2 - Carga 6000 kg:
  T001: ¿7000 >= 6000? SÍ → Asignar a T001
  T001 disponible: 7000 - 6000 = 1000 kg
  Asignación: T001 → [8000, 6000] ✅

Iteración 3 - Carga 5000 kg:
  T001: ¿1000 >= 5000? NO
  T002: ¿15000 >= 5000? SÍ → Asignar a T002
  T002 disponible: 15000 - 5000 = 10000 kg
  Asignación: T002 → [5000] ✅

Iteración 4 - Carga 3200 kg:
  T001: ¿1000 >= 3200? NO
  T002: ¿10000 >= 3200? SÍ → Asignar a T002
  T002 disponible: 10000 - 3200 = 6800 kg
  Asignación: T002 → [5000, 3200] ✅

Iteración 5 - Carga 2000 kg:
  T001: ¿1000 >= 2000? NO
  T002: ¿6800 >= 2000? SÍ → Asignar a T002
  T002 disponible: 6800 - 2000 = 4800 kg
  Asignación: T002 → [5000, 3200, 2000] ✅

Iteración 6 - Carga 1500 kg:
  T001: ¿1000 >= 1500? NO
  T002: ¿4800 >= 1500? SÍ → Asignar a T002
  T002 disponible: 4800 - 1500 = 3300 kg
  Asignación: T002 → [5000, 3200, 2000, 1500] ✅

Resultado Final:
- T001: [8000, 6000] → Total: 14000 kg (93.3% utilizado)
- T002: [5000, 3200, 2000, 1500] → Total: 11700 kg (78% utilizado)
- T003: [] → Sin cargas (0% utilizado)
```

---

### 3.8 Análisis de Complejidad del Algoritmo 2

**Complejidad Temporal:**
- Obtener camiones: O(m)
- Ordenar cargas: O(n log n)
- Inicializar capacidad: O(m)
- Asignar cargas: O(n × m) ← **Operación dominante**

**Complejidad Total: O(n log n + n × m)**

**Complejidad Espacial:** O(n + m) para almacenar cargas, camiones y asignaciones

**Ventajas:**
- Mejor aprovechamiento del espacio que First Fit sin ordenar
- Más rápido que Best Fit (que busca el mejor camión)
- Fácil de implementar

**Desventajas:**
- No garantiza el número mínimo de camiones necesarios
- Puede dejar algunos camiones sin usar si hay muchas cargas pequeñas

---

<a name="algoritmo3"></a>
## 4. ALGORITMO 3: ASIGNACIÓN DE CARGAS DESDE CENTROS DE DISTRIBUCIÓN

### 4.1 Descripción General

Este algoritmo asigna cargas generadas desde centros de distribución a camiones disponibles, priorizando los centros con mayor prioridad (menor número = más importante) y mayor nivel de demanda.

### 4.2 Objetivo

Garantizar que los centros de distribución más importantes y con mayor demanda sean atendidos primero, asegurando que los clientes críticos reciban sus productos a tiempo.

### 4.3 Entrada y Salida

**Entrada:**
- Lista de centros de distribución con prioridad y nivel de demanda
- Lista de camiones disponibles con sus capacidades

**Salida:**
- Mapa de asignaciones (camión → lista de cargas de centros)
- Estadísticas de utilización
- Lista de cargas no asignadas (si las hay)

### 4.4 PROCEDIMIENTO 1: Obtener Datos de Neo4j

**Descripción:**  
Consulta Neo4j para obtener tanto los centros de distribución como los camiones disponibles.

**Pasos:**
1. Conectar con `DistributionCenterRepository`
2. Obtener todos los centros de distribución con sus atributos:
   - ID del centro
   - Nombre del centro
   - Prioridad (1 = más importante, mayor número = menos importante)
   - Nivel de demanda (1-10, donde 10 = mucha demanda)
3. Conectar con `TruckRepository`
4. Obtener camiones con estado `AVAILABLE`

**Código:**
```java
List<DistributionCenter> centros = distributionCenterRepository.findAll();
List<Truck> trucksDisponibles = truckRepository.findByStatus(TruckStatus.AVAILABLE);
```

**Complejidad:** O(n + m) donde n es número de centros y m es número de camiones

**Ejemplo:**
```
Centros obtenidos:
- DC001: Prioridad 1, Demanda 9
- DC002: Prioridad 1, Demanda 8
- DC003: Prioridad 2, Demanda 7
- DC004: Prioridad 3, Demanda 5

Camiones obtenidos:
- T001: Capacidad 15000 kg
- T002: Capacidad 15000 kg
```

---

### 4.5 PROCEDIMIENTO 2: Calcular Peso de Carga por Centro

**Descripción:**  
Convierte el nivel de demanda de cada centro en un peso de carga concreto (en kilogramos).

**Fórmula:**
```
Peso de Carga = Nivel de Demanda × 100 kg
```

**Pasos:**
1. Crear lista vacía de cargas
2. Para cada centro de distribución:
   - Leer nivel de demanda
   - Calcular: `peso = demanda × 100`
   - Crear objeto `CargaCentro` con:
     - ID del centro
     - Nombre del centro
     - Peso calculado
     - Prioridad del centro
   - Agregar a la lista de cargas

**Código:**
```java
List<CargaCentro> cargas = new ArrayList<>();
for (DistributionCenter centro : centros) {
    int peso = centro.getDemandLevel() * 100; // Demanda × 100 kg
    cargas.add(new CargaCentro(
        centro.getId(), 
        centro.getName(), 
        peso, 
        centro.getPriority()
    ));
}
```

**Complejidad:** O(n) donde n es el número de centros

**Ejemplo:**
```
DC001: Demanda 9 → Peso = 9 × 100 = 900 kg
DC002: Demanda 8 → Peso = 8 × 100 = 800 kg
DC003: Demanda 7 → Peso = 7 × 100 = 700 kg
DC004: Demanda 5 → Peso = 5 × 100 = 500 kg
```

---

### 4.6 PROCEDIMIENTO 3: Ordenar Cargas por Prioridad y Peso

**Descripción:**  
Ordena las cargas usando un criterio compuesto: primero por prioridad (menor número = más importante), y si tienen la misma prioridad, por peso (mayor primero).

**Criterio de Ordenamiento:**
1. **Primer criterio:** Prioridad (ascendente - menor primero)
2. **Segundo criterio:** Peso (descendente - mayor primero)

**Pasos:**
1. Aplicar algoritmo de ordenamiento con comparador personalizado
2. Comparar primero por prioridad
3. Si las prioridades son iguales, comparar por peso (mayor primero)

**Código:**
```java
cargas.sort((a, b) -> {
    // Primero comparar por prioridad (menor = más importante)
    int priComp = Integer.compare(a.prioridad, b.prioridad);
    if (priComp != 0) return priComp;
    
    // Si tienen la misma prioridad, ordenar por peso (mayor primero)
    return Integer.compare(b.peso, a.peso);
});
```

**Complejidad:** O(n log n) donde n es el número de cargas

**Ejemplo:**
```
Cargas antes de ordenar:
- DC001: Prioridad 1, Peso 900 kg
- DC002: Prioridad 1, Peso 800 kg
- DC003: Prioridad 2, Peso 700 kg
- DC004: Prioridad 3, Peso 500 kg

Cargas después de ordenar (Greedy):
1. DC001: Prioridad 1, Peso 900 kg ← Más importante y más carga
2. DC002: Prioridad 1, Peso 800 kg ← Misma prioridad, segunda carga
3. DC003: Prioridad 2, Peso 700 kg ← Menor prioridad
4. DC004: Prioridad 3, Peso 500 kg ← Menor prioridad
```

**¿Por qué este orden?**  
El algoritmo greedy prioriza:
1. **Importancia:** Centros con prioridad 1 deben atenderse antes que los de prioridad 2
2. **Urgencia:** Entre centros de igual prioridad, atender primero el que tiene más demanda (más peso)

---

### 4.7 PROCEDIMIENTO 4: Inicializar Estructuras de Asignación

**Descripción:**  
Prepara las estructuras de datos necesarias para realizar las asignaciones y llevar el control de capacidad disponible.

**Pasos:**
1. Crear mapa `capacidadDisponible`: camión → capacidad actual
2. Crear mapa `asignaciones`: camión → lista de asignaciones
3. Para cada camión:
   - Inicializar capacidad disponible con su capacidad total
   - Inicializar lista de asignaciones vacía

**Código:**
```java
Map<String, Integer> capacidadDisponible = new HashMap<>();
Map<String, List<AsignacionCarga>> asignaciones = new HashMap<>();

for (Truck truck : trucksDisponibles) {
    capacidadDisponible.put(truck.getId(), truck.getWeightCapacity());
    asignaciones.put(truck.getId(), new ArrayList<>());
}
```

**Complejidad:** O(m) donde m es el número de camiones

**Ejemplo:**
```
capacidadDisponible = {
    "T001": 15000,
    "T002": 15000
}

asignaciones = {
    "T001": [],
    "T002": []
}
```

---

### 4.8 PROCEDIMIENTO 5: Asignar Cargas usando First Fit con Prioridades

**Descripción:**  
Recorre las cargas ordenadas y asigna cada una al primer camión que tenga capacidad suficiente, respetando el orden de prioridad establecido.

**Estrategia:**
- Las cargas ya están ordenadas por prioridad y peso
- Para cada carga, buscar el primer camión con capacidad
- Asignar inmediatamente (First Fit) sin buscar el "mejor" camión

**Pasos:**
1. Para cada carga en la lista ordenada:
   - Inicializar `asignada = false`
   - Para cada camión en la lista de camiones:
     - Obtener capacidad disponible del camión
     - Si `capacidadDisponible >= pesoCarga`:
       - Crear objeto `AsignacionCarga` con datos del centro
       - Agregar a la lista de asignaciones del camión
       - Actualizar: `capacidadDisponible = capacidadDisponible - pesoCarga`
       - Marcar `asignada = true`
       - **BREAK** (salir del bucle - First Fit)
   - Si `asignada == false`:
     - Agregar carga a la lista de cargas no asignadas

**Código:**
```java
for (CargaCentro carga : cargas) {
    boolean asignada = false;
    
    for (Truck truck : trucksDisponibles) {
        int disponible = capacidadDisponible.get(truck.getId());
        
        if (disponible >= carga.peso) {
            // Greedy: asignar al primer camión disponible
            asignaciones.get(truck.getId()).add(
                new AsignacionCarga(carga.centroId, carga.centroNombre, carga.peso)
            );
            capacidadDisponible.put(truck.getId(), disponible - carga.peso);
            asignada = true;
            break; // No seguir buscando
        }
    }
    
    if (!asignada) {
        cargasNoAsignadas.add(carga);
    }
}
```

**Complejidad:** O(n × m) donde n es número de cargas y m es número de camiones

**Ejemplo Paso a Paso:**
```
Cargas ordenadas: [DC001(900), DC002(800), DC003(700), DC004(500)]
Capacidad inicial: T001=15000, T002=15000

Iteración 1 - DC001 (900 kg, Prioridad 1):
  T001: ¿15000 >= 900? SÍ → Asignar DC001 a T001
  T001 disponible: 15000 - 900 = 14100 kg
  Asignación: T001 → [DC001(900)] ✅

Iteración 2 - DC002 (800 kg, Prioridad 1):
  T001: ¿14100 >= 800? SÍ → Asignar DC002 a T001
  T001 disponible: 14100 - 800 = 13300 kg
  Asignación: T001 → [DC001(900), DC002(800)] ✅

Iteración 3 - DC003 (700 kg, Prioridad 2):
  T001: ¿13300 >= 700? SÍ → Asignar DC003 a T001
  T001 disponible: 13300 - 700 = 12600 kg
  Asignación: T001 → [DC001(900), DC002(800), DC003(700)] ✅

Iteración 4 - DC004 (500 kg, Prioridad 3):
  T001: ¿12600 >= 500? SÍ → Asignar DC004 a T001
  T001 disponible: 12600 - 500 = 12100 kg
  Asignación: T001 → [DC001(900), DC002(800), DC003(700), DC004(500)] ✅

Resultado Final:
- T001: [DC001(900), DC002(800), DC003(700), DC004(500)]
  Total: 2900 kg (19.3% utilizado)
- T002: [] (sin asignaciones)
```

---

### 4.9 Análisis de Complejidad del Algoritmo 3

**Complejidad Temporal:**
- Obtener datos: O(n + m)
- Calcular pesos: O(n)
- Ordenar cargas: O(n log n)
- Inicializar estructuras: O(m)
- Asignar cargas: O(n × m) ← **Operación dominante**

**Complejidad Total: O(n log n + n × m)**

**Complejidad Espacial:** O(n + m) para almacenar cargas, camiones y asignaciones

**Ventajas:**
- Respeta prioridades de los centros
- Considera tanto importancia como urgencia (demanda)
- Garantiza que centros críticos sean atendidos primero
- Eficiente para problemas prácticos

**Desventajas:**
- No garantiza el número mínimo de camiones
- Puede dejar algunos camiones sin usar

---

<a name="comparacion"></a>
## 5. COMPARACIÓN Y CONCLUSIONES

### 5.1 Tabla Comparativa de los Tres Algoritmos

| Característica | Algoritmo 1: Combustible | Algoritmo 2: Peso | Algoritmo 3: Centros |
|----------------|-------------------------|-------------------|---------------------|
| **Estrategia Greedy** | Menor porcentaje primero | First Fit Decreasing | Prioridad + Demanda |
| **Datos de Neo4j** | Solo camiones | Solo camiones | Centros + Camiones |
| **Criterio de Orden** | Porcentaje de combustible | Peso (descendente) | Prioridad, luego peso |
| **Complejidad Temporal** | O(n log n) | O(n log n + n×m) | O(n log n + n×m) |
| **Complejidad Espacial** | O(n) | O(n + m) | O(n + m) |
| **Cuándo Usar** | Combustible limitado | Múltiples cargas | Prioridades importantes |

### 5.2 Ventajas Comunes de los Algoritmos Greedy

1. **Eficiencia**: Todos tienen complejidad polinomial, muy eficientes
2. **Simplicidad**: Fáciles de entender e implementar
3. **Decisiones Locales Óptimas**: Cada paso toma la mejor decisión inmediata
4. **Integración con Neo4j**: Usan datos reales en tiempo real
5. **Escalabilidad**: Funcionan bien con grandes volúmenes de datos

### 5.3 Limitaciones Comunes

1. **No Garantizan Óptimo Global**: Pueden no encontrar la solución perfecta
2. **Sensibles al Orden**: El orden inicial afecta el resultado
3. **Decisiones Irreversibles**: Una vez tomada una decisión, no se reconsidera

### 5.4 ¿Por qué Greedy y no otros algoritmos?

**Comparación con Programación Dinámica:**
- Greedy: O(n log n) - Rápido
- Programación Dinámica: O(2^n) o peor - Muy lento
- **Conclusión:** Greedy es suficiente y mucho más rápido

**Comparación con Fuerza Bruta:**
- Greedy: O(n log n) - Práctico
- Fuerza Bruta: O(n!) - Imposible con muchos elementos
- **Conclusión:** Greedy es la única opción práctica

**Comparación con Algoritmos Aleatorios:**
- Greedy: Respeta criterios (prioridad, necesidad, tamaño)
- Aleatorio: No considera nada, resultados impredecibles
- **Conclusión:** Greedy garantiza resultados consistentes y lógicos

### 5.5 Aplicaciones Prácticas

Estos algoritmos greedy son ideales para:
- ✅ Sistemas de logística en tiempo real
- ✅ Distribución de recursos limitados
- ✅ Asignación de tareas con prioridades
- ✅ Optimización de capacidad de transporte
- ✅ Sistemas que requieren respuestas rápidas

### 5.6 Conclusiones Finales

Los tres algoritmos greedy implementados en este sistema de logística:

1. **Son eficientes**: Complejidad O(n log n) o mejor, permiten procesar grandes volúmenes de datos rápidamente

2. **Son prácticos**: Proporcionan soluciones "suficientemente buenas" en tiempo razonable, lo cual es más valioso que soluciones perfectas que tardan demasiado

3. **Están bien diseñados**: Cada uno resuelve un problema específico con la estrategia greedy más adecuada:
   - Distribución de combustible: Prioriza necesidad
   - Distribución de peso: Optimiza espacio
   - Asignación desde centros: Respeta prioridades

4. **Se integran con Neo4j**: Utilizan datos reales del sistema, no datos ficticios, lo que los hace útiles en producción

5. **Son mantenibles**: Código simple y claro, fácil de modificar y extender

---

## GLOSARIO DE TÉRMINOS

- **Algoritmo Greedy**: Algoritmo que toma decisiones locales óptimas en cada paso
- **First Fit**: Estrategia que asigna al primer recurso disponible que funcione
- **First Fit Decreasing**: Primero ordena de mayor a menor, luego aplica First Fit
- **Complejidad O(n log n)**: Tiempo de ejecución proporcional a n × log(n), muy eficiente
- **Neo4j**: Base de datos de grafos utilizada para almacenar datos del sistema
- **Prioridad**: Número que indica importancia (menor = más importante)
- **Caso Base**: Condición que detiene la recursión o el algoritmo

---

## REFERENCIAS

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.
- Johnson, D. S. (1974). "Fast algorithms for bin packing". *Journal of Computer and System Sciences*, 8(3), 272-314.
- Spring Data Neo4j Documentation: https://spring.io/projects/spring-data-neo4j

---

**FIN DEL DOCUMENTO**





