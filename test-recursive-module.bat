@echo off
echo === TransRoute S.A. - Pruebas del Modulo de Recursividad ===
echo.

set BASE_URL=http://localhost:8080/api/recursive-metrics

echo 1. Probando calculo de costo total recursivo...
curl -X POST "%BASE_URL%/costo-total" ^
  -H "Content-Type: application/json" ^
  -d "{\"costs\": [150.5, 200.0, 75.25, 300.0]}"

echo.
echo.
echo 2. Probando calculo de distancia total recursivo...
curl -X POST "%BASE_URL%/distancia-total" ^
  -H "Content-Type: application/json" ^
  -d "{\"distances\": [50.0, 75.5, 30.0, 100.0]}"

echo.
echo.
echo 3. Probando comparacion de rendimiento...
curl -X POST "%BASE_URL%/comparar-rendimiento" ^
  -H "Content-Type: application/json" ^
  -d "{\"costs\": [150.5, 200.0, 75.25, 300.0]}"

echo.
echo.
echo 4. Probando metricas combinadas...
curl -X POST "%BASE_URL%/metricas-combinadas" ^
  -H "Content-Type: application/json" ^
  -d "{\"costs\": [150.5, 200.0, 75.25], \"distances\": [50.0, 75.5, 30.0]}"

echo.
echo.
echo === Pruebas completadas ===
echo Para ver la documentacion completa, visita: http://localhost:8080/swagger-ui.html
pause



