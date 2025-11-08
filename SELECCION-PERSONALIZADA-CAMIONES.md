# 🚛 Selección Personalizada de Camiones - Distribución de Combustible

## 📋 Descripción

Esta funcionalidad permite **seleccionar manualmente** los camiones que deseas utilizar y **especificar** la cantidad de combustible disponible para distribuir. El algoritmo Greedy optimiza la distribución priorizando los camiones con menor porcentaje de combustible.

## 🎯 Características Principales

✅ **Visualización de Todos los Camiones**: Ve todos los camiones disponibles en Neo4j con su estado actual  
✅ **Selección Manual**: Elige exactamente qué camiones quieres abastecer  
✅ **Filtros Inteligentes**: Filtra por estado, disponibilidad o nivel de combustible  
✅ **Especificar Combustible**: Define cuánto combustible tienes disponible  
✅ **Algoritmo Greedy Optimizado**: Distribuye priorizando los más necesitados  
✅ **Resultados en Tiempo Real**: Visualiza la distribución con gráficos y estadísticas  

## 🖥️ Interfaz Web Interactiva

### Acceso
```
http://localhost:8080/seleccionar-camiones.html
```

### Funcionalidades de la Interfaz

#### 1. **Panel de Control**
- Input para especificar combustible disponible
- Botón para actualizar la lista de camiones desde Neo4j
- Resumen en tiempo real de la selección

#### 2. **Filtros Rápidos**
- **Todos**: Muestra todos los camiones
- **Disponibles**: Solo camiones con estado AVAILABLE
- **En Tránsito**: Solo camiones IN_TRANSIT
- **Bajo Combustible**: Camiones con menos del 30% de combustible

#### 3. **Selección de Camiones**
- Haz clic en cualquier tarjeta de camión para seleccionarlo
- Marca/desmarca el checkbox
- Usa "Seleccionar Todos" para elegir todos los camiones visibles
- Usa "Limpiar Selección" para deseleccionar todos

#### 4. **Información de Cada Camión**
- **ID del Camión**: Identificador único (ej: T001)
- **Placa**: Matrícula del vehículo
- **Combustible Actual**: Nivel actual vs capacidad total
- **Capacidad de Carga**: En toneladas
- **Necesidad**: Combustible necesario para llenar
- **Barra de Progreso**: Visualización del porcentaje actual
- **Estado**: Disponible, En Tránsito o Mantenimiento

#### 5. **Resumen de Selección**
Cuando seleccionas camiones, aparece un panel con:
- **Número de camiones seleccionados**
- **Combustible total necesario** para llenarlos
- **Combustible disponible** que ingresaste

#### 6. **Distribución y Resultados**
Al hacer clic en "Distribuir Combustible":
- Muestra cuánto combustible se asignó a cada camión
- Nivel inicial vs nivel final
- Porcentaje final de llenado
- Estadísticas generales de la distribución

## 🔌 API REST

### 1. Obtener Todos los Camiones

**Endpoint:**
```
GET /api/greedy/camiones
```

**Respuesta:**
```json
{
  "camiones": [
    {
      "id": "T001",
      "licensePlate": "ABC123",
      "capacity": 15000,
      "fuelCapacity": 200,
      "currentFuel": 180,
      "status": "AVAILABLE",
      "fuelPercentage": 90.0,
      "fuelNeeded": 20
    },
    {
      "id": "T004",
      "licensePlate": "JKL012",
      "capacity": 10000,
      "fuelCapacity": 150,
      "currentFuel": 120,
      "status": "AVAILABLE",
      "fuelPercentage": 80.0,
      "fuelNeeded": 30
    }
  ],
  "totalCamiones": 20,
  "fuente": "Neo4j"
}
```

### 2. Distribución Personalizada

**Endpoint:**
```
POST /api/greedy/distribuir-combustible-personalizado
```

**Request Body:**
```json
{
  "truckIds": ["T001", "T004", "T007", "T010"],
  "combustibleDisponible": 800
}
```

**Respuesta:**
```json
{
  "asignacion": {
    "T007": 60,
    "T004": 30,
    "T010": 50,
    "T001": 20
  },
  "totalCamionesSeleccionados": 4,
  "camionesConNecesidad": 4,
  "camionesLlenos": 4,
  "combustibleDisponible": 800,
  "combustibleAsignado": 160,
  "combustibleRestante": 640,
  "camionesDetalle": [
    {
      "truckId": "T007",
      "licensePlate": "STU901",
      "capacidadTotal": 210,
      "combustibleActual": 150,
      "necesidad": 60,
      "combustibleAsignado": 60,
      "combustibleFinal": 210,
      "porcentajeFinal": 100.0
    },
    ...
  ],
  "algoritmo": "Greedy - Distribución Personalizada",
  "estrategia": "Prioriza camiones seleccionados con menor porcentaje de combustible",
  "complejidad": "O(n log n)",
  "tiempoEjecucionNanosegundos": 2847563,
  "fuente": "Neo4j (camiones seleccionados)"
}
```

## 💻 Ejemplos de Uso

### Ejemplo 1: Usando curl

```bash
# 1. Obtener lista de camiones
curl -X GET "http://localhost:8080/api/greedy/camiones"

# 2. Distribuir combustible a camiones específicos
curl -X POST "http://localhost:8080/api/greedy/distribuir-combustible-personalizado" \
  -H "Content-Type: application/json" \
  -d '{
    "truckIds": ["T001", "T004", "T007"],
    "combustibleDisponible": 500
  }'
```

### Ejemplo 2: Usando JavaScript (Frontend)

```javascript
// Obtener todos los camiones
async function obtenerCamiones() {
  const response = await fetch('http://localhost:8080/api/greedy/camiones');
  const data = await response.json();
  return data.camiones;
}

// Distribuir combustible a camiones seleccionados
async function distribuirCombustible(camionesIds, combustible) {
  const response = await fetch(
    'http://localhost:8080/api/greedy/distribuir-combustible-personalizado',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        truckIds: camionesIds,
        combustibleDisponible: combustible
      })
    }
  );
  return await response.json();
}

// Uso
const camiones = await obtenerCamiones();
const resultado = await distribuirCombustible(['T001', 'T004'], 300);
console.log(resultado);
```

### Ejemplo 3: Usando Python

```python
import requests
import json

BASE_URL = "http://localhost:8080/api/greedy"

# Obtener camiones
response = requests.get(f"{BASE_URL}/camiones")
camiones = response.json()
print(f"Total camiones: {camiones['totalCamiones']}")

# Seleccionar camiones con bajo combustible
camiones_bajo_combustible = [
    c['id'] for c in camiones['camiones'] 
    if c['fuelPercentage'] < 50
]

# Distribuir combustible
payload = {
    "truckIds": camiones_bajo_combustible,
    "combustibleDisponible": 1000
}

response = requests.post(
    f"{BASE_URL}/distribuir-combustible-personalizado",
    headers={"Content-Type": "application/json"},
    data=json.dumps(payload)
)

resultado = response.json()
print(f"Combustible asignado: {resultado['combustibleAsignado']}L")
print(f"Combustible restante: {resultado['combustibleRestante']}L")
```

## 🎨 Código de Colores en la Interfaz

### Nivel de Combustible
- 🔴 **Rojo** (0-30%): Bajo combustible - URGENTE
- 🟡 **Amarillo** (30-60%): Nivel medio - ATENCIÓN
- 🔵 **Azul** (60-90%): Nivel bueno - OK
- 🟢 **Verde** (90-100%): Lleno - ÓPTIMO

### Estado del Camión
- ✅ **Verde**: Disponible (AVAILABLE)
- 🔵 **Azul**: En Tránsito (IN_TRANSIT)
- 🔴 **Rojo**: Mantenimiento (MAINTENANCE)

## 🧮 Algoritmo Greedy

### Estrategia
El algoritmo prioriza los camiones con **menor porcentaje de combustible** actual:

```java
// Ordenar por porcentaje de combustible (menor primero)
camionesConNecesidad.sort((a, b) -> {
    double porcentajeA = (double) a.truck.getCurrentFuel() / a.truck.getFuelCapacity();
    double porcentajeB = (double) b.truck.getCurrentFuel() / b.truck.getFuelCapacity();
    return Double.compare(porcentajeA, porcentajeB);
});

// Asignar combustible empezando por los más necesitados
for (CamionConNecesidad cn : camionesConNecesidad) {
    int cantidadAsignada = Math.min(cn.necesidad, combustibleRestante);
    asignacion.put(cn.truck.getId(), cantidadAsignada);
    combustibleRestante -= cantidadAsignada;
}
```

### Complejidad
- **Ordenamiento**: O(n log n) donde n = número de camiones seleccionados
- **Asignación**: O(n) 
- **Total**: O(n log n)

## 📊 Casos de Uso

### Caso 1: Abastecer Solo Camiones con Urgencia
```
1. Filtrar por "Bajo Combustible"
2. Seleccionar todos los mostrados
3. Especificar combustible disponible
4. Distribuir
```

### Caso 2: Abastecer Flota Disponible
```
1. Filtrar por "Disponibles"
2. Seleccionar todos
3. Especificar combustible
4. Distribuir
```

### Caso 3: Selección Manual Específica
```
1. Ver todos los camiones
2. Hacer clic en los que necesitas
3. Ajustar cantidad de combustible
4. Distribuir
```

## 🔧 Configuración

### Requisitos Previos
1. **Neo4j** ejecutándose en `localhost:7687`
2. **Spring Boot** ejecutándose en `localhost:8080`
3. **Datos cargados** en Neo4j usando `neo4j-cargar-datos-masivo.cypher`

### Iniciar la Aplicación

```bash
# 1. Iniciar Neo4j
# (asegúrate de que esté corriendo)

# 2. Cargar datos (si no lo has hecho)
cat neo4j-cargar-datos-masivo.cypher | neo4j-cypher-shell

# 3. Iniciar Spring Boot
mvn spring-boot:run

# 4. Abrir navegador
# http://localhost:8080/seleccionar-camiones.html
```

## 🧪 Probar con Scripts

### Windows
```bash
test-greedy-neo4j.bat
```

### Linux/Mac
```bash
chmod +x test-greedy-neo4j.sh
./test-greedy-neo4j.sh
```

## 📈 Ventajas de la Selección Personalizada

1. **Control Total**: Decides exactamente qué camiones abastecer
2. **Flexibilidad**: Puedes ajustar según tus necesidades operativas
3. **Optimización**: El algoritmo greedy distribuye de forma óptima
4. **Visualización Clara**: Ves el impacto de la distribución en tiempo real
5. **Conexión con Neo4j**: Usa datos reales de tu base de datos

## 🚀 Próximas Mejoras

- [ ] Guardar selecciones favoritas
- [ ] Exportar resultados a PDF/Excel
- [ ] Historial de distribuciones
- [ ] Predicción de necesidades futuras
- [ ] Notificaciones para camiones críticos

## 💡 Consejos

- **Prioriza Urgencias**: Usa el filtro "Bajo Combustible" para atender emergencias
- **Planifica**: Revisa el resumen antes de distribuir
- **Monitorea**: Verifica el combustible restante después de la distribución
- **Actualiza**: Refresca la lista de camiones regularmente

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que Neo4j esté ejecutándose
2. Asegúrate de que Spring Boot esté activo
3. Revisa la consola del navegador (F12) para errores
4. Verifica que los datos estén cargados en Neo4j

---

**¡Disfruta de la gestión eficiente de tu flota!** 🚛💨

