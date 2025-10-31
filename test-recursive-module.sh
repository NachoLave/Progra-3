#!/bin/bash

# Script de prueba para TransRoute S.A. - Módulo de Recursividad
# Ejecutar después de iniciar la aplicación Spring Boot

echo "=== TransRoute S.A. - Pruebas del Módulo de Recursividad ==="
echo ""

BASE_URL="http://localhost:8080/api/recursive-metrics"

echo "1. Probando cálculo de costo total recursivo..."
curl -X POST "$BASE_URL/costo-total" \
  -H "Content-Type: application/json" \
  -d '{"costs": [150.5, 200.0, 75.25, 300.0]}' \
  | jq '.'

echo ""
echo "2. Probando cálculo de distancia total recursivo..."
curl -X POST "$BASE_URL/distancia-total" \
  -H "Content-Type: application/json" \
  -d '{"distances": [50.0, 75.5, 30.0, 100.0]}' \
  | jq '.'

echo ""
echo "3. Probando comparación de rendimiento..."
curl -X POST "$BASE_URL/comparar-rendimiento" \
  -H "Content-Type: application/json" \
  -d '{"costs": [150.5, 200.0, 75.25, 300.0]}' \
  | jq '.'

echo ""
echo "4. Probando métricas combinadas..."
curl -X POST "$BASE_URL/metricas-combinadas" \
  -H "Content-Type: application/json" \
  -d '{"costs": [150.5, 200.0, 75.25], "distances": [50.0, 75.5, 30.0]}' \
  | jq '.'

echo ""
echo "=== Pruebas completadas ==="
echo "Para ver la documentación completa, visita: http://localhost:8080/swagger-ui.html"



