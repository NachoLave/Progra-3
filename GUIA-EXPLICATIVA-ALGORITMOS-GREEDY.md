# 📚 Guía Explicativa Detallada: Algoritmos Greedy en Logística

## 🎯 ¿Qué es un Algoritmo Greedy?

Un **algoritmo greedy** (voraz) es una estrategia de resolución de problemas que toma la **mejor decisión en cada momento** sin pensar en las consecuencias futuras. Es como cuando tienes hambre y comes el plato más grande primero, sin pensar si después habrá algo mejor.

### Características Principales:
- ✅ **Decisión local óptima**: En cada paso, elige la opción que parece mejor en ese momento
- ✅ **Rápido**: No explora todas las posibilidades, solo toma decisiones inmediatas
- ✅ **Simple**: Fácil de entender e implementar
- ⚠️ **No siempre óptimo**: Puede no dar la mejor solución global, pero suele dar una buena solución

---

## 🚛 Algoritmo 1: Distribución de Combustible Optimizado

### 📖 ¿Qué hace este algoritmo?

Este algoritmo **distribuye combustible disponible entre los camiones** priorizando a los que tienen **menos combustible** en su tanque.

### 🎯 ¿Para qué sirve?

Imagina que tienes 1000 litros de combustible y 20 camiones. Algunos tienen el tanque casi vacío (20%) y otros casi lleno (80%). Este algoritmo asegura que los camiones que más lo necesitan reciban combustible primero, evitando que se queden sin gasolina.

### 🔍 ¿Por qué usar este algoritmo y no otros?

| Algoritmo Alternativo | ¿Por qué NO usarlo? | ¿Por qué SÍ usar Greedy? |
|----------------------|---------------------|--------------------------|
| **Distribución Equitativa** (dar lo mismo a todos) | Un camión con 80% recibe lo mismo que uno con 20%, desperdiciando recursos | Prioriza necesidad real |
| **Distribución Aleatoria** | No considera urgencia, puede dejar sin combustible a camiones críticos | Garantiza que los más necesitados reciban primero |
| **Programación Dinámica** (explorar todas las combinaciones) | Muy lento (O(2^n)), innecesario para este problema | Rápido (O(n log n)) y suficiente |
| **Fuerza Bruta** (probar todas las combinaciones) | Extremadamente lento, imposible con muchos camiones | Eficiente y práctico |

### 📝 ¿Cómo funciona? (Paso a Paso con Ejemplo)

#### **Situación Inicial:**
- **Combustible disponible**: 1000 litros
- **Camiones disponibles**:
  - Camión T001: 30 litros de 150 (20% - ¡muy bajo!)
  - Camión T002: 120 litros de 150 (80% - casi lleno)
  - Camión T003: 45 litros de 150 (30% - bajo)
  - Camión T004: 90 litros de 150 (60% - medio)

#### **Paso 1: Obtener datos de Neo4j**
```
El algoritmo consulta la base de datos Neo4j y obtiene:
- Todos los camiones con estado AVAILABLE o IN_TRANSIT
- Su capacidad total de combustible
- Su combustible actual
```

#### **Paso 2: Calcular necesidad de cada camión**
```
Necesidad = Capacidad Total - Combustible Actual

T001: 150 - 30 = 120 litros necesarios
T002: 150 - 120 = 30 litros necesarios
T003: 150 - 45 = 105 litros necesarios
T004: 150 - 90 = 60 litros necesarios
```

#### **Paso 3: Calcular porcentaje de combustible**
```
Porcentaje = (Combustible Actual / Capacidad Total) × 100

T001: (30/150) × 100 = 20% ← MÁS NECESITADO
T002: (120/150) × 100 = 80%
T003: (45/150) × 100 = 30% ← SEGUNDO MÁS NECESITADO
T004: (90/150) × 100 = 60%
```

#### **Paso 4: Ordenar por porcentaje (menor primero) - ESTRATEGIA GREEDY**
```
Orden Greedy (menor porcentaje = mayor prioridad):
1. T001: 20% (necesita 120 litros)
2. T003: 30% (necesita 105 litros)
3. T004: 60% (necesita 60 litros)
4. T002: 80% (necesita 30 litros)
```

#### **Paso 5: Asignar combustible (Greedy)**
```
Combustible disponible: 1000 litros

Iteración 1: T001 (necesita 120)
  - Asignar: min(120, 1000) = 120 litros
  - Restante: 1000 - 120 = 880 litros
  - T001 ahora tiene: 30 + 120 = 150 litros (100% lleno) ✅

Iteración 2: T003 (necesita 105)
  - Asignar: min(105, 880) = 105 litros
  - Restante: 880 - 105 = 775 litros
  - T003 ahora tiene: 45 + 105 = 150 litros (100% lleno) ✅

Iteración 3: T004 (necesita 60)
  - Asignar: min(60, 775) = 60 litros
  - Restante: 775 - 60 = 715 litros
  - T004 ahora tiene: 90 + 60 = 150 litros (100% lleno) ✅

Iteración 4: T002 (necesita 30)
  - Asignar: min(30, 715) = 30 litros
  - Restante: 715 - 30 = 685 litros
  - T002 ahora tiene: 120 + 30 = 150 litros (100% lleno) ✅
```

#### **Resultado Final:**
```
✅ Todos los camiones quedaron con tanque lleno
✅ Combustible usado: 315 litros
✅ Combustible sobrante: 685 litros
```

### 💻 Código Explicado

```java
// Paso 1: Obtener camiones de Neo4j
List<Truck> camiones = truckRepository.findActiveTrucks();

// Paso 2 y 3: Calcular necesidad y porcentaje
List<CamionConNecesidad> camionesConNecesidad = new ArrayList<>();
for (Truck truck : camiones) {
    int necesidad = truck.getFuelCapacity() - truck.getCurrentFuel();
    double porcentaje = (double) truck.getCurrentFuel() / truck.getFuelCapacity();
    
    camionesConNecesidad.add(new CamionConNecesidad(truck, necesidad, porcentaje));
}

// Paso 4: ORDENAR por porcentaje (menor = más prioritario) - ESTO ES GREEDY
camionesConNecesidad.sort((a, b) -> {
    return Double.compare(a.porcentaje, b.porcentaje); // Menor porcentaje primero
});

// Paso 5: ASIGNAR combustible (estrategia greedy)
int combustibleRestante = combustibleDisponible;
Map<String, Integer> asignacion = new HashMap<>();

for (CamionConNecesidad cn : camionesConNecesidad) {
    // Greedy: dar lo máximo posible al más necesitado
    int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
    
    if (cantidadAsignada > 0) {
        asignacion.put(cn.truck.getId(), cantidadAsignada);
        combustibleRestante -= cantidadAsignada;
    }
}
```

### ⏱️ Complejidad: O(n log n)
- **O(n log n)**: Ordenar los camiones por porcentaje
- **O(n)**: Recorrer y asignar combustible
- **Total**: O(n log n) - Muy eficiente

---

## 📦 Algoritmo 2: Distribución de Peso (First Fit Decreasing)

### 📖 ¿Qué hace este algoritmo?

Este algoritmo **asigna cargas (paquetes) a camiones** usando la estrategia **First Fit Decreasing**: primero ordena las cargas de **mayor a menor peso**, y luego asigna cada carga al **primer camión** que tenga capacidad suficiente.

### 🎯 ¿Para qué sirve?

Imagina que tienes 6 paquetes de diferentes pesos: [8000kg, 6000kg, 5000kg, 3200kg, 2000kg, 1500kg] y varios camiones con capacidad de 15000kg cada uno. Este algoritmo asegura que los paquetes grandes se coloquen primero, aprovechando mejor el espacio de los camiones.

### 🔍 ¿Por qué usar First Fit Decreasing y no otros?

| Algoritmo Alternativo | ¿Por qué NO usarlo? | ¿Por qué SÍ usar First Fit Decreasing? |
|----------------------|---------------------|----------------------------------------|
| **First Fit** (sin ordenar) | Puede dejar espacios pequeños que no se pueden llenar | Ordenar primero evita desperdiciar espacio |
| **Best Fit** (buscar el camión con menos espacio sobrante) | Más lento, requiere buscar en todos los camiones | Más rápido, solo busca el primero que quepa |
| **Worst Fit** (buscar el camión con más espacio) | Puede dejar muchos espacios pequeños sin usar | Mejor aprovechamiento del espacio |
| **Next Fit** (solo usar el siguiente camión) | Muy ineficiente, desperdicia mucho espacio | Permite elegir cualquier camión disponible |

### 📝 ¿Cómo funciona? (Paso a Paso con Ejemplo)

#### **Situación Inicial:**
- **Cargas a distribuir**: [5000, 3200, 8000, 1500, 6000, 2000] kg
- **Camiones disponibles**:
  - T001: Capacidad 15000 kg (disponible: 15000)
  - T002: Capacidad 15000 kg (disponible: 15000)
  - T003: Capacidad 15000 kg (disponible: 15000)

#### **Paso 1: Obtener camiones de Neo4j**
```
El algoritmo consulta Neo4j y obtiene todos los camiones con estado AVAILABLE
```

#### **Paso 2: Ordenar cargas de MAYOR a MENOR (Decreasing) - ESTRATEGIA GREEDY**
```
Cargas originales: [5000, 3200, 8000, 1500, 6000, 2000]
Cargas ordenadas:   [8000, 6000, 5000, 3200, 2000, 1500] ← De mayor a menor
```

**¿Por qué ordenar?** Porque si colocamos primero los paquetes grandes, los espacios pequeños que queden se pueden llenar con paquetes pequeños. Si hacemos al revés, puede quedar un espacio de 7000kg que no se puede llenar con nada.

#### **Paso 3: Para cada carga, buscar el PRIMER camión con capacidad (First Fit)**
```
Carga 1: 8000 kg
  - T001: ¿15000 >= 8000? SÍ ✅
  - Asignar a T001
  - T001 disponible: 15000 - 8000 = 7000 kg

Carga 2: 6000 kg
  - T001: ¿7000 >= 6000? SÍ ✅
  - Asignar a T001
  - T001 disponible: 7000 - 6000 = 1000 kg

Carga 3: 5000 kg
  - T001: ¿1000 >= 5000? NO ❌
  - T002: ¿15000 >= 5000? SÍ ✅
  - Asignar a T002
  - T002 disponible: 15000 - 5000 = 10000 kg

Carga 4: 3200 kg
  - T001: ¿1000 >= 3200? NO ❌
  - T002: ¿10000 >= 3200? SÍ ✅
  - Asignar a T002
  - T002 disponible: 10000 - 3200 = 6800 kg

Carga 5: 2000 kg
  - T001: ¿1000 >= 2000? NO ❌
  - T002: ¿6800 >= 2000? SÍ ✅
  - Asignar a T002
  - T002 disponible: 6800 - 2000 = 4800 kg

Carga 6: 1500 kg
  - T001: ¿1000 >= 1500? NO ❌
  - T002: ¿4800 >= 1500? SÍ ✅
  - Asignar a T002
  - T002 disponible: 4800 - 1500 = 3300 kg
```

#### **Resultado Final:**
```
T001: [8000, 6000] → Total: 14000 kg (93.3% utilizado)
T002: [5000, 3200, 2000, 1500] → Total: 11700 kg (78% utilizado)
T003: [] → Sin cargas (0% utilizado)
```

### 💻 Código Explicado

```java
// Paso 1: Obtener camiones de Neo4j
List<Truck> trucksDisponibles = truckRepository.findByStatus(TruckStatus.AVAILABLE);

// Paso 2: ORDENAR cargas de mayor a menor (DECREASING) - ESTO ES GREEDY
List<Integer> cargasOrdenadas = new ArrayList<>(cargasDisponibles);
cargasOrdenadas.sort(Collections.reverseOrder()); // [8000, 6000, 5000, ...]

// Inicializar capacidad disponible de cada camión
Map<String, Integer> capacidadDisponible = new HashMap<>();
for (Truck truck : trucksDisponibles) {
    capacidadDisponible.put(truck.getId(), truck.getWeightCapacity());
}

// Paso 3: Para cada carga, buscar el PRIMER camión que quepa (FIRST FIT)
for (Integer carga : cargasOrdenadas) {
    boolean asignada = false;
    
    // Buscar el PRIMER camión con capacidad suficiente
    for (Truck truck : trucksDisponibles) {
        int disponible = capacidadDisponible.get(truck.getId());
        
        if (disponible >= carga) {
            // Greedy: tomar el primero que funcione, no buscar el mejor
            asignacion.get(truck.getId()).add(carga);
            capacidadDisponible.put(truck.getId(), disponible - carga);
            asignada = true;
            break; // ¡Importante! No seguir buscando
        }
    }
    
    if (!asignada) {
        cargasNoAsignadas.add(carga); // No hay camión con capacidad
    }
}
```

### ⏱️ Complejidad: O(n log n + n×m)
- **O(n log n)**: Ordenar las cargas
- **O(n×m)**: Para cada carga (n), buscar en todos los camiones (m)
- **Total**: O(n log n + n×m) - Eficiente para problemas prácticos

---

## 🏢 Algoritmo 3: Asignación de Cargas desde Centros de Distribución

### 📖 ¿Qué hace este algoritmo?

Este algoritmo **asigna cargas desde centros de distribución a camiones**, priorizando los centros con **mayor prioridad** (menor número = más importante) y **mayor demanda**.

### 🎯 ¿Para qué sirve?

Imagina que tienes 15 centros de distribución (DC001, DC002, DC003...) y cada uno tiene:
- Una **prioridad** (1 = más importante, 5 = menos importante)
- Un **nivel de demanda** (1-10, donde 10 = mucha demanda)

Este algoritmo asegura que los centros más importantes y con mayor demanda sean atendidos primero, garantizando que los clientes críticos reciban sus productos a tiempo.

### 🔍 ¿Por qué usar este algoritmo y no otros?

| Algoritmo Alternativo | ¿Por qué NO usarlo? | ¿Por qué SÍ usar este Greedy? |
|----------------------|---------------------|-------------------------------|
| **Asignación Aleatoria** | No respeta prioridades, puede dejar centros críticos sin atender | Respeta prioridades y urgencia |
| **Asignación Equitativa** (mismo peso a todos) | Ignora que algunos centros son más importantes | Prioriza según importancia |
| **Solo por Prioridad** (ignorar demanda) | Un centro prioritario con poca demanda recibe lo mismo que uno con mucha | Considera ambos factores |
| **Programación Dinámica** | Muy lento, innecesario para este problema | Rápido y suficiente |

### 📝 ¿Cómo funciona? (Paso a Paso con Ejemplo)

#### **Situación Inicial:**
- **Centros de distribución** (desde Neo4j):
  - DC001: Prioridad 1, Demanda 9 → Carga = 9 × 100 = 900 kg
  - DC002: Prioridad 1, Demanda 8 → Carga = 8 × 100 = 800 kg
  - DC003: Prioridad 2, Demanda 7 → Carga = 7 × 100 = 700 kg
  - DC004: Prioridad 3, Demanda 5 → Carga = 5 × 100 = 500 kg

- **Camiones disponibles**:
  - T001: Capacidad 15000 kg
  - T002: Capacidad 15000 kg

#### **Paso 1: Obtener datos de Neo4j**
```
- Centros de distribución con sus prioridades y niveles de demanda
- Camiones disponibles (status = AVAILABLE)
```

#### **Paso 2: Calcular carga de cada centro**
```
Carga = Nivel de Demanda × 100 kg

DC001: 9 × 100 = 900 kg
DC002: 8 × 100 = 800 kg
DC003: 7 × 100 = 700 kg
DC004: 5 × 100 = 500 kg
```

#### **Paso 3: Ordenar por prioridad y peso (Greedy)**
```
Criterio de ordenamiento:
1. Primero por PRIORIDAD (menor número = más importante)
2. Si tienen la misma prioridad, por PESO (mayor primero)

Orden resultante:
1. DC001: Prioridad 1, Peso 900 kg ← Más importante y más carga
2. DC002: Prioridad 1, Peso 800 kg ← Misma prioridad, segunda carga
3. DC003: Prioridad 2, Peso 700 kg ← Menor prioridad
4. DC004: Prioridad 3, Peso 500 kg ← Menor prioridad
```

#### **Paso 4: Asignar cada carga al primer camión disponible (First Fit)**
```
Carga 1: DC001 (900 kg)
  - T001: ¿15000 >= 900? SÍ ✅
  - Asignar DC001 a T001
  - T001 disponible: 15000 - 900 = 14100 kg

Carga 2: DC002 (800 kg)
  - T001: ¿14100 >= 800? SÍ ✅
  - Asignar DC002 a T001
  - T001 disponible: 14100 - 800 = 13300 kg

Carga 3: DC003 (700 kg)
  - T001: ¿13300 >= 700? SÍ ✅
  - Asignar DC003 a T001
  - T001 disponible: 13300 - 700 = 12600 kg

Carga 4: DC004 (500 kg)
  - T001: ¿12600 >= 500? SÍ ✅
  - Asignar DC004 a T001
  - T001 disponible: 12600 - 500 = 12100 kg
```

#### **Resultado Final:**
```
T001: [DC001 (900), DC002 (800), DC003 (700), DC004 (500)]
      Total: 2900 kg (19.3% utilizado)
T002: [] (sin asignaciones)
```

### 💻 Código Explicado

```java
// Paso 1: Obtener centros y camiones de Neo4j
List<DistributionCenter> centros = distributionCenterRepository.findAll();
List<Truck> trucksDisponibles = truckRepository.findByStatus(TruckStatus.AVAILABLE);

// Paso 2: Crear cargas basadas en demanda
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

// Paso 3: ORDENAR por prioridad y peso (GREEDY)
cargas.sort((a, b) -> {
    // Primero comparar por prioridad (menor = más importante)
    int priComp = Integer.compare(a.prioridad, b.prioridad);
    if (priComp != 0) return priComp;
    
    // Si tienen la misma prioridad, ordenar por peso (mayor primero)
    return Integer.compare(b.peso, a.peso);
});

// Paso 4: Asignar usando First Fit (GREEDY)
Map<String, Integer> capacidadDisponible = new HashMap<>();
for (Truck truck : trucksDisponibles) {
    capacidadDisponible.put(truck.getId(), truck.getWeightCapacity());
}

for (CargaCentro carga : cargas) {
    boolean asignada = false;
    
    // Buscar el PRIMER camión con capacidad suficiente
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

### ⏱️ Complejidad: O(n log n + n×m)
- **O(n log n)**: Ordenar las cargas por prioridad y peso
- **O(n×m)**: Para cada carga (n), buscar en todos los camiones (m)
- **Total**: O(n log n + n×m)

---

## 🎓 Comparación General de los Tres Algoritmos

| Característica | Distribución Combustible | Distribución Peso | Asignación Centros |
|----------------|-------------------------|-------------------|-------------------|
| **Estrategia Greedy** | Menor porcentaje primero | First Fit Decreasing | Prioridad + Demanda |
| **Datos de Neo4j** | Solo camiones | Solo camiones | Centros + Camiones |
| **Criterio de Orden** | Porcentaje de combustible | Peso (descendente) | Prioridad, luego peso |
| **Complejidad** | O(n log n) | O(n log n + n×m) | O(n log n + n×m) |
| **Cuándo Usar** | Cuando hay combustible limitado | Cuando hay múltiples cargas | Cuando hay prioridades |

---

## 🤔 Preguntas Frecuentes

### ¿Por qué "Greedy" se llama "voraz"?

Porque el algoritmo es "codicioso" o "voraz": en cada paso toma la mejor opción disponible **sin pensar en el futuro**. Es como comer el postre más grande primero sin pensar si después habrá algo mejor.

### ¿Los algoritmos greedy siempre dan la mejor solución?

**No siempre**, pero suelen dar **buenas soluciones** de forma **rápida**. Para algunos problemas (como el de distribución de combustible), el greedy puede dar la solución óptima. Para otros (como el problema del viajante), no garantiza la óptima, pero da una solución aceptable en tiempo razonable.

### ¿Cuándo usar un algoritmo greedy?

✅ **Usa greedy cuando:**
- Necesitas una solución rápida
- El problema tiene estructura de "elección local óptima"
- Una solución "suficientemente buena" es aceptable
- El problema es muy grande para algoritmos más complejos

❌ **NO uses greedy cuando:**
- Necesitas garantizar la solución óptima absoluta
- Las decisiones locales afectan mucho el resultado global
- Tienes tiempo para algoritmos más complejos (programación dinámica, backtracking)

### ¿Por qué estos algoritmos se conectan con Neo4j?

Neo4j es una base de datos que almacena:
- Los **camiones** con sus capacidades y estado actual
- Los **centros de distribución** con sus prioridades y demandas
- Las **rutas** y relaciones entre entidades

Los algoritmos greedy **leen estos datos en tiempo real** de Neo4j para tomar decisiones basadas en el estado actual del sistema, no en datos ficticios o hardcodeados.

---

## 📊 Ejemplo Visual: Distribución de Combustible

```
ANTES (Estado Inicial):
┌─────────┬──────────┬──────────┬──────────┐
│ Camión  │ Actual   │ Capacidad│ %        │
├─────────┼──────────┼──────────┼──────────┤
│ T001    │ 30/150   │ 150      │ 20% ⚠️   │
│ T002    │ 120/150  │ 150      │ 80% ✅   │
│ T003    │ 45/150   │ 150      │ 30% ⚠️   │
│ T004    │ 90/150   │ 150      │ 60% 🟡   │
└─────────┴──────────┴──────────┴──────────┘

Combustible disponible: 1000 litros

DESPUÉS (Después del algoritmo):
┌─────────┬──────────┬──────────┬──────────┐
│ Camión  │ Actual   │ Capacidad│ %        │
├─────────┼──────────┼──────────┼──────────┤
│ T001    │ 150/150  │ 150      │ 100% ✅  │ ← Recibió 120 litros
│ T002    │ 150/150  │ 150      │ 100% ✅  │ ← Recibió 30 litros
│ T003    │ 150/150  │ 150      │ 100% ✅  │ ← Recibió 105 litros
│ T004    │ 150/150  │ 150      │ 100% ✅  │ ← Recibió 60 litros
└─────────┴──────────┴──────────┴──────────┘

Combustible usado: 315 litros
Combustible sobrante: 685 litros
```

---

## 🎯 Resumen Final

### Algoritmo 1: Distribución de Combustible
- **Qué hace**: Llena primero los tanques más vacíos
- **Por qué funciona**: Prioriza necesidad real
- **Complejidad**: O(n log n) - Muy rápido

### Algoritmo 2: Distribución de Peso
- **Qué hace**: Coloca primero los paquetes grandes en camiones
- **Por qué funciona**: Evita desperdiciar espacio
- **Complejidad**: O(n log n + n×m) - Rápido

### Algoritmo 3: Asignación desde Centros
- **Qué hace**: Atiende primero los centros más importantes
- **Por qué funciona**: Respeta prioridades y urgencia
- **Complejidad**: O(n log n + n×m) - Rápido

---

## 📚 Conceptos Clave para Recordar

1. **Greedy = Voraz**: Toma la mejor decisión en cada momento
2. **First Fit**: Usa el primer recurso disponible que funcione
3. **Decreasing**: Ordena de mayor a menor para mejor aprovechamiento
4. **Priorización**: Ordena según criterios importantes (prioridad, necesidad, tamaño)
5. **Eficiencia**: Complejidad O(n log n) es muy buena para problemas grandes

---

¡Esperamos que esta guía te haya ayudado a entender cómo funcionan los algoritmos greedy en la práctica! 🚀





