# Instrucciones para Cargar Datos en Neo4j

## 📋 Requisitos Previos

1. **Aplicación Spring Boot ejecutándose** en `http://localhost:8080`
2. **Neo4j Aura conectado** y configurado correctamente

## 🚀 Métodos para Cargar Datos

### Método 1: Usando curl (Recomendado)

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/data-init/load -Method POST -ContentType "application/json"
```

**Windows (CMD):**
```cmd
curl -X POST http://localhost:8080/api/data-init/load -H "Content-Type: application/json"
```

**Linux/Mac:**
```bash
curl -X POST http://localhost:8080/api/data-init/load \
  -H "Content-Type: application/json"
```

### Método 2: Usando los Scripts Incluidos

**Windows:**
```cmd
cargar-datos.bat
```

**Linux/Mac:**
```bash
chmod +x cargar-datos.sh
./cargar-datos.sh
```

### Método 3: Usando Postman o Thunder Client

1. Método: `POST`
2. URL: `http://localhost:8080/api/data-init/load`
3. Headers: `Content-Type: application/json`
4. Body: (vacío o `{}`)

### Método 4: Desde el Navegador (Swagger)

1. Abrir: `http://localhost:8080/swagger-ui.html`
2. Buscar el endpoint: `POST /api/data-init/load`
3. Hacer clic en "Try it out"
4. Hacer clic en "Execute"

## 📊 Datos que se Cargarán

- **15 Centros de Distribución** en diferentes ciudades argentinas
- **35 Rutas** conectando los centros
- **20 Camiones** con diferentes capacidades y estados
- **Relaciones** entre centros y camiones

## ✅ Verificar Carga

Después de cargar, verifica con:

```bash
curl http://localhost:8080/api/neo4j/test
```

O en el navegador:
```
http://localhost:8080/api/neo4j/test
```

Deberías ver algo como:
```json
{
  "connected": true,
  "message": "Conexión exitosa con Neo4j Aura",
  "counts": {
    "centros": 15,
    "rutas": 35,
    "camiones": 20
  }
}
```

## 🗑️ Limpiar Datos

Si quieres limpiar todos los datos:

```bash
curl -X DELETE http://localhost:8080/api/data-init/clear
```

## 📝 Notas

- La carga es **idempotente**: ejecutarla varias veces limpia y vuelve a cargar
- Los datos se guardan en **Neo4j Aura Cloud**
- Todos los módulos ahora usarán estos datos automáticamente



