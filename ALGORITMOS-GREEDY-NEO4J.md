# Algoritmos Greedy Conectados a Neo4j

## 📋 Descripción General

Este documento explica cómo los algoritmos greedy de **Distribución de Combustible** y **Distribución de Peso** se conectan con la base de datos Neo4j para utilizar datos reales del sistema de logística.

## 🔗 Conexión con Neo4j

Los algoritmos obtienen datos directamente de Neo4j a través de los repositorios:
- **TruckRepository**: Acceso a los 20 camiones con sus capacidades
- **DistributionCenterRepository**: Acceso a los 15 centros de distribución
- **RouteRepository**: Acceso a las 35 rutas con sus restricciones

## 🚛 1. Distribución de Combustible Optimizado

### Algoritmo Greedy Utilizado
**Estrategia**: Priorizar camiones con menor porcentaje de combustible actual

### Cómo Funciona
```
1. Obtener todos los camiones desde Neo4j
2. Filtrar solo camiones AVAILABLE o IN_TRANSIT
3. Calcular la necesidad de combustible: capacidad - combustible_actual
4. Ordenar por menor porcentaje de combustible (Greedy)
5. Asignar combustible empezando por los más necesitados
```

### Endpoint REST
```
POST /api/greedy/distribuir-combustible-optimizado?combustibleDisponible=1000
```

### Ejemplo de Uso

**Petición:**
```bash
curl -X POST "http://localhost:8080/api/greedy/distribuir-combustible-optimizado?combustibleDisponible=1000"
```

**Respuesta:**
```json
{
  "asignacion": {
    "T004": 30,
    "T007": 60,
    "T013": 45,
    "T020": 65
  },
  "totalCamiones": 15,
  "combustibleDisponible": 1000,
  "combustibleAsignado": 950,
  "combustibleRestante": 50,
  "camionesDetalle": [
    {
      "truckId": "T004",
      "licensePlate": "JKL012",
      "capacidadTotal": 150,
      "combustibleActual": 120,
      "necesidad": 30,
      "combustibleAsignado": 30,
      "combustibleFinal": 150,
      "porcentajeFinal": 100.0
    }
  ],
  "algoritmo": "Greedy - Distribución de Combustible Optimizado",
  "estrategia": "Prioriza camiones con menor porcentaje de combustible",
  "complejidad": "O(n log n)",
  "fuente": "Neo4j"
}
```

### Código Java - Lógica Principal
```java
// Ordenar por porcentaje de combustible (menor primero)
camionesConNecesidad.sort((a, b) -> {
    double porcentajeA = (double) a.truck.getCurrentFuel() / a.truck.getFuelCapacity();
    double porcentajeB = (double) b.truck.getCurrentFuel() / b.truck.getFuelCapacity();
    return Double.compare(porcentajeA, porcentajeB);
});

// Asignar combustible usando estrategia Greedy
for (CamionConNecesidad cn : camionesConNecesidad) {
    int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
    asignacion.put(cn.truck.getId(), cantidadAsignada);
    combustibleRestante -= cantidadAsignada;
}
```

## 📦 2. Distribución de Peso (First Fit Decreasing)

### Algoritmo Greedy Utilizado
**Estrategia**: First Fit Decreasing - Ordenar cargas por peso descendente y asignar al primer camión disponible

### Cómo Funciona
```
1. Obtener camiones disponibles desde Neo4j (status = AVAILABLE)
2. Recibir lista de cargas a distribuir
3. Ordenar cargas de mayor a menor peso (Decreasing)
4. Para cada carga, buscar el primer camión con capacidad suficiente (First Fit)
5. Asignar la carga y actualizar capacidad disponible del camión
```

### Endpoint REST
```
POST /api/greedy/distribuir-peso
Content-Type: application/json

[5000, 3200, 8000, 1500, 6000, 2000]
```

### Ejemplo de Uso

**Petición:**
```bash
curl -X POST "http://localhost:8080/api/greedy/distribuir-peso" \
  -H "Content-Type: application/json" \
  -d '[5000, 3200, 8000, 1500, 6000, 2000]'
```

**Respuesta:**
```json
{
  "asignacion": {
    "T001": [8000, 6000],
    "T002": [5000, 3200, 2000],
    "T004": [1500],
    "T006": [],
    "T007": []
  },
  "totalCamiones": 15,
  "totalCargas": 6,
  "cargasAsignadas": 6,
  "cargasNoAsignadas": [],
  "pesoTotalAsignado": 25700,
  "detalleUtilizacion": [
    {
      "truckId": "T001",
      "licensePlate": "ABC123",
      "capacidadTotal": 15000,
      "cargasAsignadas": [8000, 6000],
      "numeroCargasAsignadas": 2,
      "pesoAsignado": 14000,
      "capacidadDisponible": 1000,
      "porcentajeUtilizacion": 93.33
    }
  ],
  "algoritmo": "Greedy - First Fit Decreasing",
  "estrategia": "Ordena cargas por peso (descendente) y asigna al primer camión con capacidad",
  "complejidad": "O(n log n + n*m)",
  "fuente": "Neo4j (camiones)"
}
```

### Código Java - Lógica Principal
```java
// Ordenar cargas de mayor a menor (First Fit Decreasing)
List<Integer> cargasOrdenadas = new ArrayList<>(cargasDisponibles);
cargasOrdenadas.sort(Collections.reverseOrder());

// Distribuir cargas usando First Fit
for (Integer carga : cargasOrdenadas) {
    boolean asignada = false;
    
    // Buscar primer camión con capacidad suficiente
    for (Truck truck : trucksDisponibles) {
        int disponible = capacidadDisponible.get(truck.getId());
        
        if (disponible >= carga) {
            asignacion.get(truck.getId()).add(carga);
            capacidadDisponible.put(truck.getId(), disponible - carga);
            asignada = true;
            break;  // Greedy: tomar el primero que funcione
        }
    }
}
```

## 🏢 3. Asignación de Cargas desde Centros de Distribución

### Algoritmo Greedy Utilizado
**Estrategia**: Priorizar centros con mayor prioridad (menor número) y mayor demanda

### Cómo Funciona
```
1. Obtener centros de distribución ordenados por prioridad desde Neo4j
2. Obtener camiones disponibles desde Neo4j
3. Calcular cargas basadas en nivel de demanda de cada centro
4. Ordenar por prioridad del centro y peso (Greedy)
5. Asignar cada carga al primer camión con capacidad suficiente
```

### Endpoint REST
```
GET /api/greedy/asignar-cargas-desde-centros
```

### Ejemplo de Uso

**Petición:**
```bash
curl -X GET "http://localhost:8080/api/greedy/asignar-cargas-desde-centros"
```

**Respuesta:**
```json
{
  "asignaciones": {
    "T001": [
      {
        "centroId": "DC001",
        "centroNombre": "Centro Principal Buenos Aires",
        "peso": 9500
      },
      {
        "centroId": "DC002",
        "centroNombre": "Centro Regional Córdoba",
        "peso": 8800
      }
    ],
    "T002": [
      {
        "centroId": "DC003",
        "centroNombre": "Centro Regional Rosario",
        "peso": 8500
      }
    ]
  },
  "totalCamiones": 15,
  "totalCargas": 15,
  "cargasAsignadas": 15,
  "cargasNoAsignadas": [],
  "detalleAsignaciones": [
    {
      "truckId": "T001",
      "licensePlate": "ABC123",
      "capacidadTotal": 15000,
      "asignaciones": [...],
      "numeroAsignaciones": 2,
      "pesoTotal": 18300,
      "capacidadDisponible": 0,
      "porcentajeUtilizacion": 122.0
    }
  ],
  "algoritmo": "Greedy - Asignación de Cargas con Prioridades",
  "estrategia": "Ordena centros por prioridad y demanda",
  "complejidad": "O(n log n + n*m)",
  "fuente": "Neo4j (centros, camiones, rutas)"
}
```

### Código Java - Lógica Principal
```java
// Crear cargas basadas en demanda de centros
List<CargaCentro> cargas = new ArrayList<>();
for (DistributionCenter centro : centrosConCarga) {
    int carga = (centro.getDemandLevel() * 100);
    cargas.add(new CargaCentro(
        centro.getId(), 
        centro.getName(), 
        carga, 
        centro.getPriority()
    ));
}

// Ordenar por prioridad (menor = más importante) y peso
cargas.sort((a, b) -> {
    int priComp = Integer.compare(a.prioridad, b.prioridad);
    if (priComp != 0) return priComp;
    return Integer.compare(b.peso, a.peso);
});

// Asignar usando Greedy
for (CargaCentro carga : cargas) {
    for (Truck truck : trucksDisponibles) {
        int disponible = capacidadDisponible.get(truck.getId());
        if (disponible >= carga.peso) {
            asignaciones.get(truck.getId()).add(
                new AsignacionCarga(carga.centroId, carga.centroNombre, carga.peso)
            );
            capacidadDisponible.put(truck.getId(), disponible - carga.peso);
            break;  // Greedy: primer camión disponible
        }
    }
}
```

## 📊 Comparación de Algoritmos Greedy

| Algoritmo | Estrategia | Complejidad | Datos de Neo4j |
|-----------|-----------|-------------|----------------|
| Distribución de Combustible | Prioriza menor % combustible | O(n log n) | Camiones |
| Distribución de Peso | First Fit Decreasing | O(n log n + n×m) | Camiones |
| Asignación desde Centros | Prioridad + Demanda | O(n log n + n×m) | Centros + Camiones |

## 🎯 Ventajas del Enfoque Greedy

1. **Eficiencia**: Soluciones rápidas en tiempo polinomial
2. **Decisiones Locales Óptimas**: Cada paso toma la mejor decisión inmediata
3. **Simplicidad**: Fácil de implementar y entender
4. **Adaptabilidad**: Puede ajustarse a diferentes criterios de priorización
5. **Integración con Neo4j**: Usa datos en tiempo real de la base de datos

## ⚠️ Limitaciones

- No garantiza la solución óptima global
- Puede dejar capacidad sin utilizar en algunos camiones
- Sensible al orden de procesamiento inicial

## 🔧 Configuración Necesaria

### application.properties
```properties
spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=tu_password
```

### Asegurarse de que Neo4j esté ejecutándose
```bash
# Verificar que Neo4j esté corriendo
http://localhost:7474

# Cargar datos si es necesario
neo4j-cypher-shell < neo4j-cargar-datos-masivo.cypher
```

## 📝 Ejemplo Completo de Uso

### 1. Iniciar aplicación Spring Boot
```bash
mvn spring-boot:run
```

### 2. Probar distribución de combustible
```bash
curl -X POST "http://localhost:8080/api/greedy/distribuir-combustible-optimizado?combustibleDisponible=2000"
```

### 3. Probar distribución de peso
```bash
curl -X POST "http://localhost:8080/api/greedy/distribuir-peso" \
  -H "Content-Type: application/json" \
  -d '[12000, 8500, 6000, 4500, 3000, 2000, 1500]'
```

### 4. Probar asignación desde centros
```bash
curl -X GET "http://localhost:8080/api/greedy/asignar-cargas-desde-centros"
```

## 📚 Referencias

- **Greedy Algorithms**: Cormen et al., "Introduction to Algorithms"
- **First Fit Decreasing**: Johnson, D. S. (1974). "Fast algorithms for bin packing"
- **Spring Data Neo4j**: https://spring.io/projects/spring-data-neo4j

## 💡 Conclusión

Los algoritmos greedy implementados permiten:
✅ Distribución eficiente de combustible priorizando camiones con mayor necesidad
✅ Asignación óptima de cargas usando First Fit Decreasing
✅ Integración completa con Neo4j para datos en tiempo real
✅ Respuestas rápidas con complejidad O(n log n)
✅ API REST fácil de consumir desde cualquier cliente

