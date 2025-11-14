# 📋 Instrucciones para Cargar Datos en Neo4j Browser

## 🚀 Pasos Rápidos

### 1. Abrir Neo4j Browser
- Abre tu instancia "Programacion 3" en Neo4j Browser
- Asegúrate de estar conectado (verás el círculo verde)

### 2. Copiar el Script
- Abre el archivo: `neo4j-cargar-datos-masivo.cypher`
- **Copia TODO el contenido** (Ctrl+A, Ctrl+C)

### 3. Pegar en Neo4j Browser
- En la consola de Neo4j (donde dice `$` o `neo4j$`)
- Pega todo el script (Ctrl+V)
- Presiona **Enter** o haz clic en el botón de **Play** ▶️

### 4. Esperar la Ejecución
- El script se ejecutará completamente
- Verás mensajes de confirmación como:
  - `Added X labels, created X nodes, set X properties, created X relationships`
  - Al final, verás los conteos de centros, rutas y camiones

### 5. Verificar (Opcional)
Al final del script hay queries de verificación que mostrarán:
- Cantidad de centros, rutas y camiones
- Lista de los primeros 10 centros ordenados por demanda

## 📊 Datos que se Cargarán

✅ **15 Centros de Distribución**
- Buenos Aires, Córdoba, Rosario, Mendoza, Tucumán, Mar del Plata, La Plata, Salta, Corrientes, Neuquén, Bahía Blanca, San Juan, Santa Fe, Resistencia, Paraná

✅ **35 Rutas**
- Con distancias, costos, duraciones, peajes, tráfico, etc.

✅ **20 Camiones**
- Con diferentes capacidades y estados

✅ **Relaciones Completas**
- Centros ↔ Rutas (CONNECTED_TO)
- Centros ↔ Camiones (HAS_TRUCK)

## 🔍 Verificar después de Cargar

Ejecuta estas queries en Neo4j Browser:

```cypher
// Contar todo
MATCH (dc:DistributionCenter) RETURN count(dc) as centros;
MATCH (r:Route) RETURN count(r) as rutas;
MATCH (t:Truck) RETURN count(t) as camiones;
```

O para ver un resumen completo:

```cypher
MATCH (dc:DistributionCenter)-[:HAS_TRUCK]->(t:Truck)
RETURN dc.name, count(t) as camiones_asignados
ORDER BY camiones_asignados DESC;
```

## 🗑️ Limpiar Datos (Si es Necesario)

Si quieres limpiar todo antes de cargar:

```cypher
MATCH (n) DETACH DELETE n;
```

**⚠️ ADVERTENCIA:** Esto elimina TODOS los nodos y relaciones de la base de datos.

## 💡 Notas

- El script está diseñado para ejecutarse **completo de una vez**
- Si hay algún error, verifica la conexión a Neo4j
- Los datos se guardan inmediatamente en Neo4j Aura
- Después de cargar, todos los módulos de la aplicación usarán estos datos automáticamente







