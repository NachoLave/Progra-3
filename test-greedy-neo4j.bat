@echo off
REM Script para probar los algoritmos Greedy conectados a Neo4j
REM Asegúrate de que la aplicación Spring Boot esté ejecutándose

echo ========================================
echo Probando Algoritmos Greedy con Neo4j
echo ========================================
echo.

SET BASE_URL=http://localhost:8080/api/greedy

echo 1. Probando Distribucion de Combustible Optimizado...
echo --------------------------------------------------
curl -X POST "%BASE_URL%/distribuir-combustible-optimizado?combustibleDisponible=2000" -H "Content-Type: application/json"
echo.
echo.
timeout /t 2 /nobreak >nul

echo 2. Probando Distribucion de Peso (First Fit Decreasing)...
echo --------------------------------------------------
curl -X POST "%BASE_URL%/distribuir-peso" -H "Content-Type: application/json" -d "[12000, 8500, 6000, 4500, 3000, 2000, 1500, 10000, 5500, 3500]"
echo.
echo.
timeout /t 2 /nobreak >nul

echo 3. Probando Asignacion de Cargas desde Centros...
echo --------------------------------------------------
curl -X GET "%BASE_URL%/asignar-cargas-desde-centros"
echo.
echo.
timeout /t 2 /nobreak >nul

echo 4. Probando Distribucion de Combustible (Original)...
echo --------------------------------------------------
curl -X POST "%BASE_URL%/distribuir-combustible" -H "Content-Type: application/json" -d "{\"requiredAmount\": 500}"
echo.
echo.
timeout /t 2 /nobreak >nul

echo 5. Obteniendo lista de todos los camiones...
echo --------------------------------------------------
curl -X GET "%BASE_URL%/camiones"
echo.
echo.
timeout /t 2 /nobreak >nul

echo 6. Probando Distribucion Personalizada (camiones seleccionados)...
echo --------------------------------------------------
curl -X POST "%BASE_URL%/distribuir-combustible-personalizado" -H "Content-Type: application/json" -d "{\"truckIds\": [\"T001\", \"T004\", \"T007\", \"T010\"], \"combustibleDisponible\": 800}"
echo.
echo.

echo ========================================
echo Pruebas Completadas
echo ========================================
echo.
echo Para probar la interfaz visual, abre:
echo http://localhost:8080/seleccionar-camiones.html
echo.
pause

