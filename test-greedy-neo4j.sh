#!/bin/bash
# Script para probar los algoritmos Greedy conectados a Neo4j
# Asegúrate de que la aplicación Spring Boot esté ejecutándose

echo "========================================"
echo "Probando Algoritmos Greedy con Neo4j"
echo "========================================"
echo ""

BASE_URL="http://localhost:8080/api/greedy"

echo "1. Probando Distribución de Combustible Optimizado..."
echo "--------------------------------------------------"
curl -X POST "${BASE_URL}/distribuir-combustible-optimizado?combustibleDisponible=2000" \
  -H "Content-Type: application/json" | jq '.'
echo ""
echo ""
sleep 2

echo "2. Probando Distribución de Peso (First Fit Decreasing)..."
echo "--------------------------------------------------"
curl -X POST "${BASE_URL}/distribuir-peso" \
  -H "Content-Type: application/json" \
  -d '[12000, 8500, 6000, 4500, 3000, 2000, 1500, 10000, 5500, 3500]' | jq '.'
echo ""
echo ""
sleep 2

echo "3. Probando Asignación de Cargas desde Centros..."
echo "--------------------------------------------------"
curl -X GET "${BASE_URL}/asignar-cargas-desde-centros" | jq '.'
echo ""
echo ""
sleep 2

echo "4. Probando Distribución de Combustible (Original)..."
echo "--------------------------------------------------"
curl -X POST "${BASE_URL}/distribuir-combustible" \
  -H "Content-Type: application/json" \
  -d '{"requiredAmount": 500}' | jq '.'
echo ""
echo ""
sleep 2

echo "5. Obteniendo lista de todos los camiones..."
echo "--------------------------------------------------"
curl -X GET "${BASE_URL}/camiones" | jq '.'
echo ""
echo ""
sleep 2

echo "6. Probando Distribución Personalizada (camiones seleccionados)..."
echo "--------------------------------------------------"
curl -X POST "${BASE_URL}/distribuir-combustible-personalizado" \
  -H "Content-Type: application/json" \
  -d '{"truckIds": ["T001", "T004", "T007", "T010"], "combustibleDisponible": 800}' | jq '.'
echo ""
echo ""

echo "========================================"
echo "Pruebas Completadas"
echo "========================================"
echo ""
echo "Para probar la interfaz visual, abre:"
echo "http://localhost:8080/seleccionar-camiones.html"
echo ""

