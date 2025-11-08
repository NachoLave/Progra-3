@echo off
echo ========================================
echo Probando Endpoint de Camiones
echo ========================================
echo.

echo Obteniendo lista de camiones desde Neo4j...
echo.
curl -X GET "http://localhost:8080/api/greedy/camiones" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Prueba Completada
echo ========================================
echo.
echo Si ves un JSON con camiones, el endpoint funciona correctamente.
echo Si ves un error, verifica que Spring Boot este ejecutandose.
echo.
pause

