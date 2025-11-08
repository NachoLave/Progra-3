# 🔧 Solución de Problemas - "No hay camiones disponibles"

## ❓ Problema
Al abrir el módulo Greedy aparece el mensaje: **"No hay camiones disponibles"**

## ✅ Pasos para Resolver

### 1. Verificar que Spring Boot esté ejecutándose

```bash
# Iniciar la aplicación
mvn spring-boot:run

# O si ya está compilado
java -jar target/logistics-system-0.0.1-SNAPSHOT.jar
```

**Señal de éxito:** Deberías ver en la consola algo como:
```
Started LogisticsSystemApplication in X seconds
```

### 2. Probar el Endpoint Directamente

Ejecuta el script de prueba:

```bash
# Windows
test-camiones-endpoint.bat

# Linux/Mac
curl -X GET "http://localhost:8080/api/greedy/camiones"
```

**Deberías ver un JSON como:**
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
    ...
  ],
  "totalCamiones": 20,
  "fuente": "Neo4j"
}
```

### 3. Verificar Conexión a Neo4j

Abre la consola de Neo4j Browser y ejecuta:

```cypher
MATCH (t:Truck) RETURN t LIMIT 5
```

**Resultado esperado:** Deberías ver 5 camiones.

Si no ves camiones, necesitas cargarlos:

```bash
# En Neo4j Browser, ejecuta el archivo completo:
neo4j-cargar-datos-masivo.cypher
```

O desde línea de comandos:
```bash
cat neo4j-cargar-datos-masivo.cypher | cypher-shell -u neo4j -p tu_password
```

### 4. Verificar application.properties

Revisa que el archivo `src/main/resources/application.properties` tenga la configuración correcta:

```properties
spring.neo4j.uri=neo4j+s://tu-url.databases.neo4j.io
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=tu_password
spring.data.neo4j.database=neo4j
```

### 5. Reiniciar Todo

```bash
# 1. Detener Spring Boot (Ctrl+C)
# 2. Limpiar y recompilar
mvn clean compile

# 3. Iniciar nuevamente
mvn spring-boot:run

# 4. Refrescar el navegador (F5)
# 5. Abrir consola del navegador (F12) y ver si hay errores
```

### 6. Revisar la Consola del Navegador

Abre las herramientas de desarrollador (F12) y ve a la pestaña **Console**. 

Busca mensajes como:
- `Cargando camiones desde: http://localhost:8080/api/greedy/camiones`
- `Datos recibidos:` (debería mostrar el JSON)
- `Total camiones cargados: 20`

**Si ves errores:**
- `Failed to fetch`: Spring Boot no está ejecutándose
- `404 Not Found`: El endpoint no existe (verifica la ruta)
- `500 Internal Server Error`: Problema con Neo4j

### 7. Usar el Botón de Recargar

En la interfaz, ahora hay un botón **"🔄 Recargar"** junto a los filtros. Haz clic en él para recargar manualmente los camiones.

## 🐛 Errores Comunes

### Error: "Connection refused"
**Causa:** Spring Boot no está ejecutándose  
**Solución:** Inicia Spring Boot con `mvn spring-boot:run`

### Error: "No se encontraron camiones en Neo4j"
**Causa:** La base de datos está vacía  
**Solución:** Carga los datos con `neo4j-cargar-datos-masivo.cypher`

### Error: "Failed to fetch"
**Causa:** Spring Boot en diferente puerto o CORS bloqueado  
**Solución:** Verifica que `server.port=8080` en application.properties

### Error: "Cannot connect to Neo4j"
**Causa:** Credenciales incorrectas o Neo4j no accesible  
**Solución:** Verifica la URL y contraseña en application.properties

## 📊 Verificación Paso a Paso

```bash
# Paso 1: ¿Spring Boot corriendo?
curl http://localhost:8080/actuator/health
# Respuesta esperada: {"status":"UP"}

# Paso 2: ¿Endpoint de camiones funciona?
curl http://localhost:8080/api/greedy/camiones
# Respuesta esperada: JSON con array de camiones

# Paso 3: ¿Neo4j tiene datos?
# En Neo4j Browser:
MATCH (t:Truck) RETURN count(t)
# Respuesta esperada: 20
```

## 🚀 Solución Rápida (Todo en Uno)

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd "C:\Users\nacho\Desktop\Progra3-Viernes-Noche\2 parcial entrega"

# 2. Detén Spring Boot si está corriendo (Ctrl+C)

# 3. Reinicia
mvn clean spring-boot:run

# 4. Abre en el navegador
# http://localhost:8080/index.html

# 5. Ve al módulo "Greedy"

# 6. Haz clic en "🔄 Recargar"

# 7. Abre consola del navegador (F12) para ver logs
```

## 📝 Notas Importantes

- **Los camiones se cargan automáticamente** cuando abres el módulo Greedy
- **Hay un botón "Recargar"** para forzar la recarga si algo falla
- **Los logs en consola** (F12) te dirán exactamente qué está pasando
- **El mensaje de error ahora es más descriptivo** y te dice qué verificar

## 💡 Consejos

1. **Siempre abre la consola del navegador (F12)** antes de probar
2. **Verifica la pestaña Network** para ver las peticiones HTTP
3. **Revisa los logs de Spring Boot** en la terminal donde lo ejecutaste
4. **Si cambias algo en Java**, reinicia Spring Boot
5. **Si cambias algo en HTML/JS**, solo refresca el navegador (F5)

## 📞 Si Aún No Funciona

Envíame:
1. Los logs de Spring Boot (últimas 50 líneas)
2. Los errores de la consola del navegador (F12 > Console)
3. El resultado de: `curl http://localhost:8080/api/greedy/camiones`

---

**¡Con estos cambios debería funcionar!** 🎉

