# Módulo de Recursividad con Datos de Neo4j

## 📋 Descripción General

El módulo de **Complejidad y Recursividad** ahora está completamente integrado con Neo4j, permitiendo seleccionar rutas reales de la base de datos en lugar de ingresar valores manualmente.

## ✨ Características Principales

### 1. **Selección de Rutas desde Neo4j**
- Las rutas se cargan automáticamente desde la base de datos
- Interfaz visual para seleccionar múltiples rutas
- Cada ruta muestra: nombre, costo y distancia
- Botón de recarga para actualizar los datos

### 2. **Datos Utilizados de las Rutas**
Cada ruta contiene la siguiente información que se utiliza en los cálculos:

```javascript
{
  id: "R010",
  name: "Ruta Córdoba-Tucumán",
  cost: 1200.0,
  distance: 550.0,
  duration: 360,
  fuelConsumption: 0.12,
  maintenanceCost: 0.45,
  maxWeight: 22000,
  roadType: "CARRETERA",
  status: "ACTIVO",
  tollCost: 100.0,
  trafficLevel: 2
}
```

### 3. **Funciones Disponibles**

#### 🔹 Calcular Costo Total
- **Propósito**: Suma recursiva de costos de rutas seleccionadas
- **Datos Usados**: `cost` (costo de cada ruta)
- **Complejidad**: O(n)
- **Resultado**: Costo total, cantidad de rutas y detalle de cada ruta

```javascript
// Ejemplo de entrada
Rutas seleccionadas: 
  - R010: $1200
  - R015: $850
  - R020: $1500

// Resultado
Total Costo: $3550
Rutas Usadas: 3
Detalle: R010: $1200, R015: $850, R020: $1500
```

#### 🔹 Calcular Distancia Total
- **Propósito**: Suma recursiva de distancias de rutas seleccionadas
- **Datos Usados**: `distance` (distancia en km de cada ruta)
- **Complejidad**: O(n)
- **Resultado**: Distancia total, cantidad de rutas y detalle de cada ruta

```javascript
// Ejemplo de entrada
Rutas seleccionadas:
  - R010: 550km
  - R015: 320km
  - R020: 680km

// Resultado
Total Distancia: 1550km
Rutas Usadas: 3
Detalle: R010: 550km, R015: 320km, R020: 680km
```

#### 🔹 Métricas Combinadas
- **Propósito**: Calcula tanto costos como distancias simultáneamente
- **Datos Usados**: `cost` y `distance` de cada ruta
- **Complejidad**: O(n)
- **Resultado**: Totales de costo y distancia, con detalles completos

```javascript
// Ejemplo de entrada
Rutas seleccionadas:
  - R010: $1200 / 550km
  - R015: $850 / 320km
  - R020: $1500 / 680km

// Resultado
Total Costo: $3550
Total Distancia: 1550km
Rutas Usadas: 3
Detalle: R010: $1200 / 550km, R015: $850 / 320km, R020: $1500 / 680km
```

#### 🔹 Comparar Rendimiento
- **Propósito**: Compara el rendimiento recursivo vs iterativo
- **Datos Usados**: `cost` de cada ruta
- **Complejidad**: O(n) para ambos enfoques
- **Resultado**: Tiempos de ejecución y comparación de rendimiento

```javascript
// Ejemplo de entrada
Rutas seleccionadas: [R010, R015, R020, R025]

// Resultado
Tiempo Recursivo: 0.245ms
Tiempo Iterativo: 0.189ms
Diferencia: 0.056ms
Resultado: Iterativo es más rápido
```

## 🎨 Interfaz de Usuario

### Características Visuales

1. **Contenedor de Rutas**
   - Fondo azul claro con bordes redondeados
   - Scroll automático si hay muchas rutas
   - Loading spinner mientras carga datos

2. **Items Seleccionables**
   - Color gris para rutas no seleccionadas
   - Color azul y borde destacado para rutas seleccionadas
   - Checkmark (✓) para rutas seleccionadas
   - Hover effect con animación suave

3. **Botón de Recarga**
   - Color verde
   - Ícono de actualización
   - Recarga datos desde Neo4j

### Flujo de Uso

```
1. Abrir el Módulo de Recursividad
   ↓
2. Se cargan automáticamente las rutas de Neo4j
   ↓
3. Hacer clic en las rutas que deseas usar
   ↓
4. Hacer clic en el botón "Calcular" o "Comparar"
   ↓
5. Ver los resultados con detalles de las rutas usadas
```

## 🔧 Implementación Técnica

### JavaScript - Funciones Principales

#### Cargar Rutas de Neo4j
```javascript
async function cargarRutasRecursividad() {
    // Carga rutas desde el endpoint /api/neo4j/data
    // Muestra las rutas en 4 contenedores diferentes
    // Maneja estados de loading y errores
}
```

#### Obtener Rutas Seleccionadas
```javascript
function obtenerRutasSeleccionadas(containerId) {
    // Busca todos los items con clase 'selected'
    // Retorna array con {id, cost, distance}
}
```

#### Funciones de Cálculo
```javascript
async function calcularCostoTotal() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('cost-routes-container');
    const costs = rutasSeleccionadas.map(r => r.cost);
    // Envía al backend y muestra resultados
}

async function calcularDistanciaTotal() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('distance-routes-container');
    const distances = rutasSeleccionadas.map(r => r.distance);
    // Envía al backend y muestra resultados
}

async function calcularMetricasCombinadas() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('combined-routes-container');
    const costs = rutasSeleccionadas.map(r => r.cost);
    const distances = rutasSeleccionadas.map(r => r.distance);
    // Envía al backend y muestra resultados
}

async function compararRendimiento() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('compare-routes-container');
    const costs = rutasSeleccionadas.map(r => r.cost);
    // Envía al backend y muestra resultados
}
```

### HTML - Estructura

```html
<div class="card">
    <h3>Calcular Costo Total</h3>
    <div class="form-group">
        <label>Selecciona las Rutas:</label>
        <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem;">
            <!-- Header con botón de recarga -->
            <div style="display: flex; justify-content: space-between;">
                <p>Selecciona rutas para calcular el costo total</p>
                <button onclick="cargarRutasRecursividad()">Recargar</button>
            </div>
            
            <!-- Loading spinner -->
            <div class="loading-spinner" id="cost-routes-loading">
                Cargando rutas...
            </div>
            
            <!-- Contenedor de rutas -->
            <div id="cost-routes-container" class="selectable-items-container">
                <!-- Las rutas se cargan dinámicamente aquí -->
            </div>
        </div>
    </div>
    <button onclick="calcularCostoTotal()">Calcular</button>
    <div id="cost-result" class="result-box"></div>
</div>
```

### CSS - Estilos Principales

```css
.selectable-items-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
    background: var(--bg-secondary);
    border-radius: 8px;
}

.selectable-item {
    padding: 0.875rem 1rem;
    background: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.selectable-item.selected {
    background: rgba(37, 99, 235, 0.15);
    border-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: 500;
}

.selectable-item.selected::before {
    content: '✓';
    margin-right: 0.5rem;
}
```

## 🚀 Ventajas de la Integración con Neo4j

### 1. **Datos Reales**
- Ya no es necesario ingresar valores manualmente
- Se utilizan datos de producción directamente
- Consistencia con el resto de módulos

### 2. **Menos Errores**
- No hay riesgo de tipear mal los valores
- Validación automática de datos
- Formato consistente

### 3. **Experiencia de Usuario Mejorada**
- Interfaz visual e intuitiva
- Selección múltiple fácil
- Feedback visual claro

### 4. **Escalabilidad**
- Funciona con cualquier cantidad de rutas
- Se adapta automáticamente a cambios en la BD
- Fácil de extender con más funcionalidades

## 📊 Ejemplo Completo de Uso

### Escenario: Calcular el costo total de 3 rutas específicas

1. **Abrir el módulo de Recursividad**
   - Las rutas se cargan automáticamente

2. **Seleccionar rutas**
   - Clic en "Ruta Córdoba-Tucumán - Costo: $1200 - Distancia: 550km"
   - Clic en "Ruta Buenos Aires-Rosario - Costo: $850 - Distancia: 320km"
   - Clic en "Ruta Mendoza-San Juan - Costo: $680 - Distancia: 210km"

3. **Calcular**
   - Clic en el botón "Calcular"

4. **Ver Resultado**
```json
{
  "resultado": 2730,
  "unidad": "pesos",
  "tiempo_ejecucion": "0.234 ms",
  "complejidad": "O(n)",
  "rutasUsadas": 3,
  "rutasDetalle": "R010: $1200, R015: $850, R020: $680"
}
```

## 🔍 Solución de Problemas

### ❌ "No hay rutas disponibles"
**Causa**: No se pudo conectar con Neo4j o no hay rutas en la BD  
**Solución**: 
1. Verificar que Spring Boot esté ejecutándose
2. Verificar que Neo4j tenga datos cargados
3. Hacer clic en el botón "Recargar"

### ❌ "Por favor selecciona al menos una ruta"
**Causa**: No seleccionaste ninguna ruta antes de calcular  
**Solución**: Hacer clic en las rutas que deseas usar

### ❌ Error HTTP 404
**Causa**: El backend no está disponible  
**Solución**: 
```bash
cd "ruta-del-proyecto"
mvn spring-boot:run
```

### ❌ Las rutas no se muestran actualizadas
**Causa**: Caché del navegador  
**Solución**: Hacer clic en el botón "Recargar" en cada tarjeta

## 📝 Notas Técnicas

- Los algoritmos recursivos se ejecutan en el **backend** (Spring Boot)
- La carga de rutas usa el endpoint existente: `/api/neo4j/data`
- Los resultados incluyen información adicional sobre las rutas usadas
- La selección de rutas es independiente entre las 4 funciones
- No hay límite de rutas que se pueden seleccionar
- La interfaz maneja correctamente estados de carga y error

## 🎯 Próximas Mejoras Posibles

1. **Filtros de Rutas**
   - Por ciudad de origen/destino
   - Por rango de costo
   - Por rango de distancia

2. **Búsqueda de Rutas**
   - Campo de búsqueda por nombre o ID
   - Búsqueda por características

3. **Ordenamiento**
   - Por costo (ascendente/descendente)
   - Por distancia (ascendente/descendente)
   - Por nombre

4. **Visualización Mejorada**
   - Gráficos de los resultados
   - Comparación visual de rutas
   - Mapa de las rutas seleccionadas

5. **Exportación**
   - Exportar resultados a PDF
   - Exportar a Excel
   - Guardar configuraciones

---

**Última actualización**: Noviembre 2025  
**Versión**: 2.0 - Integración completa con Neo4j

