@echo off
echo ========================================
echo Cargando datos en Neo4j...
echo ========================================
echo.

curl -X POST http://localhost:8080/api/data-init/load ^
  -H "Content-Type: application/json" ^
  -w "\n\nStatus: %%{http_code}\n"

echo.
echo ========================================
echo Datos cargados. Verificar con:
echo GET http://localhost:8080/api/neo4j/test
echo ========================================
pause

