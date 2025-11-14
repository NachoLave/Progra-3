-- Script de optimización de índices para mejorar rendimiento de consultas
-- Ejecutar en Neo4j Browser o Neo4j Desktop
-- 
-- IMPORTANTE: Los índices mejoran significativamente el rendimiento de las consultas
-- especialmente cuando se filtran por status, id, o se ordenan por propiedades

-- ==========================================
-- ÍNDICES PARA TRUCKS (Camiones)
-- ==========================================

-- Índice en status de Truck (usado frecuentemente en WHERE clauses)
CREATE INDEX truck_status_index IF NOT EXISTS
FOR (t:Truck) ON (t.status);

-- Índice en id de Truck (ya debería existir, pero lo verificamos)
CREATE INDEX truck_id_index IF NOT EXISTS
FOR (t:Truck) ON (t.id);

-- Índice compuesto para consultas que filtran por status y ordenan por capacity
CREATE INDEX truck_status_capacity_index IF NOT EXISTS
FOR (t:Truck) ON (t.status, t.capacity);

-- ==========================================
-- ÍNDICES PARA DISTRIBUTION CENTERS
-- ==========================================

-- Índice en status de DistributionCenter
CREATE INDEX dc_status_index IF NOT EXISTS
FOR (dc:DistributionCenter) ON (dc.status);

-- Índice en priority de DistributionCenter (usado para ordenar)
CREATE INDEX dc_priority_index IF NOT EXISTS
FOR (dc:DistributionCenter) ON (dc.priority);

-- Índice en demandLevel de DistributionCenter (usado para ordenar y filtrar)
CREATE INDEX dc_demand_level_index IF NOT EXISTS
FOR (dc:DistributionCenter) ON (dc.demandLevel);

-- Índice en id de DistributionCenter
CREATE INDEX dc_id_index IF NOT EXISTS
FOR (dc:DistributionCenter) ON (dc.id);

-- ==========================================
-- ÍNDICES PARA ROUTES
-- ==========================================

-- Índice en id de Route
CREATE INDEX route_id_index IF NOT EXISTS
FOR (r:Route) ON (r.id);

-- Índice en cost de Route (usado para ordenar)
CREATE INDEX route_cost_index IF NOT EXISTS
FOR (r:Route) ON (r.cost);

-- Índice en distance de Route (usado para ordenar)
CREATE INDEX route_distance_index IF NOT EXISTS
FOR (r:Route) ON (r.distance);

-- ==========================================
-- VERIFICAR ÍNDICES CREADOS
-- ==========================================

-- Ver todos los índices creados
SHOW INDEXES;

-- Ver estadísticas de uso de índices (si está disponible en tu versión de Neo4j)
-- CALL db.indexes();

