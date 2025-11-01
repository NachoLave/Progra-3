-- ============================================
-- Script de Ingesta Masiva de Datos
-- TransRoute S.A. - Sistema de Logística
-- ============================================
-- Ejecutar en Neo4j Browser
-- Copiar y pegar todo este contenido en la consola
-- ============================================

-- LIMPIAR DATOS EXISTENTES (OPCIONAL - Descomentar si necesitas limpiar)
-- MATCH (n) DETACH DELETE n;

-- ============================================
-- 1. CREAR 15 CENTROS DE DISTRIBUCIÓN
-- ============================================

CREATE (dc1:DistributionCenter {
  id: 'DC001',
  name: 'Centro Principal Buenos Aires',
  city: 'Buenos Aires',
  province: 'Buenos Aires',
  demandLevel: 95,
  capacity: 15000,
  currentLoad: 0,
  operatingCost: 8000.0,
  priority: 1,
  coordinates: '-34.6037,-58.3816',
  status: 'ACTIVE'
});

CREATE (dc2:DistributionCenter {
  id: 'DC002',
  name: 'Centro Regional Córdoba',
  city: 'Córdoba',
  province: 'Córdoba',
  demandLevel: 88,
  capacity: 12000,
  currentLoad: 0,
  operatingCost: 6500.0,
  priority: 1,
  coordinates: '-31.4201,-64.1888',
  status: 'ACTIVE'
});

CREATE (dc3:DistributionCenter {
  id: 'DC003',
  name: 'Centro Regional Rosario',
  city: 'Rosario',
  province: 'Santa Fe',
  demandLevel: 85,
  capacity: 11000,
  currentLoad: 0,
  operatingCost: 6000.0,
  priority: 2,
  coordinates: '-32.9442,-60.6505',
  status: 'ACTIVE'
});

CREATE (dc4:DistributionCenter {
  id: 'DC004',
  name: 'Centro Regional Mendoza',
  city: 'Mendoza',
  province: 'Mendoza',
  demandLevel: 75,
  capacity: 10000,
  currentLoad: 0,
  operatingCost: 5500.0,
  priority: 2,
  coordinates: '-32.8895,-68.8458',
  status: 'ACTIVE'
});

CREATE (dc5:DistributionCenter {
  id: 'DC005',
  name: 'Centro Regional Tucumán',
  city: 'San Miguel de Tucumán',
  province: 'Tucumán',
  demandLevel: 72,
  capacity: 9500,
  currentLoad: 0,
  operatingCost: 5000.0,
  priority: 2,
  coordinates: '-26.8083,-65.2176',
  status: 'ACTIVE'
});

CREATE (dc6:DistributionCenter {
  id: 'DC006',
  name: 'Centro Regional Mar del Plata',
  city: 'Mar del Plata',
  province: 'Buenos Aires',
  demandLevel: 68,
  capacity: 9000,
  currentLoad: 0,
  operatingCost: 4800.0,
  priority: 3,
  coordinates: '-38.0055,-57.5426',
  status: 'ACTIVE'
});

CREATE (dc7:DistributionCenter {
  id: 'DC007',
  name: 'Centro Regional La Plata',
  city: 'La Plata',
  province: 'Buenos Aires',
  demandLevel: 78,
  capacity: 8500,
  currentLoad: 0,
  operatingCost: 5200.0,
  priority: 2,
  coordinates: '-34.9215,-57.9545',
  status: 'ACTIVE'
});

CREATE (dc8:DistributionCenter {
  id: 'DC008',
  name: 'Centro Regional Salta',
  city: 'Salta',
  province: 'Salta',
  demandLevel: 65,
  capacity: 8000,
  currentLoad: 0,
  operatingCost: 4500.0,
  priority: 3,
  coordinates: '-24.7859,-65.4117',
  status: 'ACTIVE'
});

CREATE (dc9:DistributionCenter {
  id: 'DC009',
  name: 'Centro Regional Corrientes',
  city: 'Corrientes',
  province: 'Corrientes',
  demandLevel: 60,
  capacity: 7500,
  currentLoad: 0,
  operatingCost: 4200.0,
  priority: 3,
  coordinates: '-27.4692,-58.8306',
  status: 'ACTIVE'
});

CREATE (dc10:DistributionCenter {
  id: 'DC010',
  name: 'Centro Regional Neuquén',
  city: 'Neuquén',
  province: 'Neuquén',
  demandLevel: 70,
  capacity: 8200,
  currentLoad: 0,
  operatingCost: 4700.0,
  priority: 3,
  coordinates: '-38.9516,-68.0591',
  status: 'ACTIVE'
});

CREATE (dc11:DistributionCenter {
  id: 'DC011',
  name: 'Centro Regional Bahía Blanca',
  city: 'Bahía Blanca',
  province: 'Buenos Aires',
  demandLevel: 62,
  capacity: 7800,
  currentLoad: 0,
  operatingCost: 4400.0,
  priority: 4,
  coordinates: '-38.7183,-62.2663',
  status: 'ACTIVE'
});

CREATE (dc12:DistributionCenter {
  id: 'DC012',
  name: 'Centro Regional San Juan',
  city: 'San Juan',
  province: 'San Juan',
  demandLevel: 58,
  capacity: 7000,
  currentLoad: 0,
  operatingCost: 4000.0,
  priority: 4,
  coordinates: '-31.5375,-68.5364',
  status: 'ACTIVE'
});

CREATE (dc13:DistributionCenter {
  id: 'DC013',
  name: 'Centro Regional Santa Fe',
  city: 'Santa Fe',
  province: 'Santa Fe',
  demandLevel: 66,
  capacity: 7200,
  currentLoad: 0,
  operatingCost: 4100.0,
  priority: 3,
  coordinates: '-31.6333,-60.7',
  status: 'ACTIVE'
});

CREATE (dc14:DistributionCenter {
  id: 'DC014',
  name: 'Centro Regional Resistencia',
  city: 'Resistencia',
  province: 'Chaco',
  demandLevel: 55,
  capacity: 6800,
  currentLoad: 0,
  operatingCost: 3800.0,
  priority: 4,
  coordinates: '-27.4514,-58.9867',
  status: 'ACTIVE'
});

CREATE (dc15:DistributionCenter {
  id: 'DC015',
  name: 'Centro Regional Paraná',
  city: 'Paraná',
  province: 'Entre Ríos',
  demandLevel: 64,
  capacity: 7100,
  currentLoad: 0,
  operatingCost: 3900.0,
  priority: 4,
  coordinates: '-31.7333,-60.5333',
  status: 'ACTIVE'
});

-- ============================================
-- 2. CREAR 20 CAMIONES
-- ============================================

CREATE (t1:Truck {id: 'T001', licensePlate: 'ABC123', capacity: 15000, fuelCapacity: 200, currentFuel: 180, status: 'AVAILABLE'});
CREATE (t2:Truck {id: 'T002', licensePlate: 'DEF456', capacity: 12000, fuelCapacity: 180, currentFuel: 160, status: 'AVAILABLE'});
CREATE (t3:Truck {id: 'T003', licensePlate: 'GHI789', capacity: 18000, fuelCapacity: 220, currentFuel: 220, status: 'IN_TRANSIT'});
CREATE (t4:Truck {id: 'T004', licensePlate: 'JKL012', capacity: 10000, fuelCapacity: 150, currentFuel: 120, status: 'AVAILABLE'});
CREATE (t5:Truck {id: 'T005', licensePlate: 'MNO345', capacity: 20000, fuelCapacity: 250, currentFuel: 200, status: 'MAINTENANCE'});
CREATE (t6:Truck {id: 'T006', licensePlate: 'PQR678', capacity: 14000, fuelCapacity: 190, currentFuel: 175, status: 'AVAILABLE'});
CREATE (t7:Truck {id: 'T007', licensePlate: 'STU901', capacity: 16000, fuelCapacity: 210, currentFuel: 150, status: 'AVAILABLE'});
CREATE (t8:Truck {id: 'T008', licensePlate: 'VWX234', capacity: 13000, fuelCapacity: 170, currentFuel: 140, status: 'AVAILABLE'});
CREATE (t9:Truck {id: 'T009', licensePlate: 'YZA567', capacity: 17000, fuelCapacity: 230, currentFuel: 210, status: 'IN_TRANSIT'});
CREATE (t10:Truck {id: 'T010', licensePlate: 'BCD890', capacity: 19000, fuelCapacity: 240, currentFuel: 190, status: 'AVAILABLE'});
CREATE (t11:Truck {id: 'T011', licensePlate: 'EFG123', capacity: 11000, fuelCapacity: 160, currentFuel: 145, status: 'AVAILABLE'});
CREATE (t12:Truck {id: 'T012', licensePlate: 'HIJ456', capacity: 15000, fuelCapacity: 200, currentFuel: 185, status: 'AVAILABLE'});
CREATE (t13:Truck {id: 'T013', licensePlate: 'KLM789', capacity: 12500, fuelCapacity: 175, currentFuel: 130, status: 'MAINTENANCE'});
CREATE (t14:Truck {id: 'T014', licensePlate: 'NOP012', capacity: 17500, fuelCapacity: 225, currentFuel: 200, status: 'AVAILABLE'});
CREATE (t15:Truck {id: 'T015', licensePlate: 'QRS345', capacity: 14500, fuelCapacity: 185, currentFuel: 165, status: 'AVAILABLE'});
CREATE (t16:Truck {id: 'T016', licensePlate: 'TUV678', capacity: 16500, fuelCapacity: 215, currentFuel: 195, status: 'AVAILABLE'});
CREATE (t17:Truck {id: 'T017', licensePlate: 'WXY901', capacity: 13500, fuelCapacity: 165, currentFuel: 155, status: 'AVAILABLE'});
CREATE (t18:Truck {id: 'T018', licensePlate: 'ZAB234', capacity: 15500, fuelCapacity: 205, currentFuel: 190, status: 'AVAILABLE'});
CREATE (t19:Truck {id: 'T019', licensePlate: 'CDE567', capacity: 18500, fuelCapacity: 235, currentFuel: 220, status: 'AVAILABLE'});
CREATE (t20:Truck {id: 'T020', licensePlate: 'FGH890', capacity: 19500, fuelCapacity: 245, currentFuel: 180, status: 'IN_TRANSIT'});

-- ============================================
-- 3. CREAR 35 RUTAS
-- ============================================

CREATE (r1:Route {id: 'R001', name: 'Ruta BA-Córdoba', distance: 700.0, cost: 1500.0, duration: 480, fuelConsumption: 0.12, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 150.0, maintenanceCost: 0.5, maxWeight: 25000, status: 'ACTIVE'});
CREATE (r2:Route {id: 'R002', name: 'Ruta BA-Rosario', distance: 300.0, cost: 800.0, duration: 240, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 80.0, maintenanceCost: 0.4, maxWeight: 20000, status: 'ACTIVE'});
CREATE (r3:Route {id: 'R003', name: 'Ruta BA-Mar del Plata', distance: 400.0, cost: 900.0, duration: 300, fuelConsumption: 0.10, roadType: 'HIGHWAY', trafficLevel: 4, tollCost: 60.0, maintenanceCost: 0.35, maxWeight: 18000, status: 'ACTIVE'});
CREATE (r4:Route {id: 'R004', name: 'Ruta BA-La Plata', distance: 60.0, cost: 250.0, duration: 60, fuelConsumption: 0.08, roadType: 'CITY', trafficLevel: 4, tollCost: 20.0, maintenanceCost: 0.3, maxWeight: 15000, status: 'ACTIVE'});
CREATE (r5:Route {id: 'R005', name: 'Ruta BA-Tucumán', distance: 1300.0, cost: 2800.0, duration: 780, fuelConsumption: 0.15, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 250.0, maintenanceCost: 0.7, maxWeight: 28000, status: 'ACTIVE'});
CREATE (r6:Route {id: 'R006', name: 'Ruta BA-Mendoza', distance: 1050.0, cost: 2200.0, duration: 720, fuelConsumption: 0.14, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 200.0, maintenanceCost: 0.65, maxWeight: 27000, status: 'ACTIVE'});
CREATE (r7:Route {id: 'R007', name: 'Ruta BA-Bahía Blanca', distance: 650.0, cost: 1400.0, duration: 450, fuelConsumption: 0.12, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 120.0, maintenanceCost: 0.5, maxWeight: 24000, status: 'ACTIVE'});
CREATE (r8:Route {id: 'R008', name: 'Ruta Córdoba-Mendoza', distance: 650.0, cost: 1400.0, duration: 420, fuelConsumption: 0.13, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 120.0, maintenanceCost: 0.5, maxWeight: 24000, status: 'ACTIVE'});
CREATE (r9:Route {id: 'R009', name: 'Ruta Córdoba-Rosario', distance: 400.0, cost: 850.0, duration: 280, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 70.0, maintenanceCost: 0.4, maxWeight: 20000, status: 'ACTIVE'});
CREATE (r10:Route {id: 'R010', name: 'Ruta Córdoba-Tucumán', distance: 550.0, cost: 1200.0, duration: 360, fuelConsumption: 0.12, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 100.0, maintenanceCost: 0.45, maxWeight: 22000, status: 'ACTIVE'});
CREATE (r11:Route {id: 'R011', name: 'Ruta Córdoba-Salta', distance: 750.0, cost: 1600.0, duration: 480, fuelConsumption: 0.13, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 140.0, maintenanceCost: 0.55, maxWeight: 25000, status: 'ACTIVE'});
CREATE (r12:Route {id: 'R012', name: 'Ruta Rosario-Santa Fe', distance: 150.0, cost: 400.0, duration: 120, fuelConsumption: 0.09, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 30.0, maintenanceCost: 0.35, maxWeight: 17000, status: 'ACTIVE'});
CREATE (r13:Route {id: 'R013', name: 'Ruta Rosario-Paraná', distance: 180.0, cost: 450.0, duration: 140, fuelConsumption: 0.09, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 35.0, maintenanceCost: 0.35, maxWeight: 18000, status: 'ACTIVE'});
CREATE (r14:Route {id: 'R014', name: 'Ruta Rosario-Tucumán', distance: 800.0, cost: 1700.0, duration: 520, fuelConsumption: 0.13, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 150.0, maintenanceCost: 0.6, maxWeight: 26000, status: 'ACTIVE'});
CREATE (r15:Route {id: 'R015', name: 'Ruta Mendoza-San Juan', distance: 170.0, cost: 420.0, duration: 130, fuelConsumption: 0.10, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 25.0, maintenanceCost: 0.35, maxWeight: 19000, status: 'ACTIVE'});
CREATE (r16:Route {id: 'R016', name: 'Ruta Mendoza-Tucumán', distance: 950.0, cost: 2100.0, duration: 600, fuelConsumption: 0.14, roadType: 'RURAL', trafficLevel: 1, tollCost: 180.0, maintenanceCost: 0.6, maxWeight: 26000, status: 'ACTIVE'});
CREATE (r17:Route {id: 'R017', name: 'Ruta Tucumán-Salta', distance: 140.0, cost: 350.0, duration: 110, fuelConsumption: 0.09, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 20.0, maintenanceCost: 0.3, maxWeight: 16000, status: 'ACTIVE'});
CREATE (r18:Route {id: 'R018', name: 'Ruta Tucumán-Corrientes', distance: 850.0, cost: 1800.0, duration: 550, fuelConsumption: 0.13, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 160.0, maintenanceCost: 0.58, maxWeight: 25500, status: 'ACTIVE'});
CREATE (r19:Route {id: 'R019', name: 'Ruta Mar del Plata-Bahía Blanca', distance: 220.0, cost: 550.0, duration: 170, fuelConsumption: 0.10, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 40.0, maintenanceCost: 0.4, maxWeight: 19000, status: 'ACTIVE'});
CREATE (r20:Route {id: 'R020', name: 'Ruta La Plata-Mar del Plata', distance: 380.0, cost: 850.0, duration: 270, fuelConsumption: 0.10, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 55.0, maintenanceCost: 0.35, maxWeight: 19000, status: 'ACTIVE'});
CREATE (r21:Route {id: 'R021', name: 'Ruta Corrientes-Resistencia', distance: 45.0, cost: 120.0, duration: 40, fuelConsumption: 0.08, roadType: 'CITY', trafficLevel: 4, tollCost: 10.0, maintenanceCost: 0.25, maxWeight: 14000, status: 'ACTIVE'});
CREATE (r22:Route {id: 'R022', name: 'Ruta Corrientes-Paraná', distance: 280.0, cost: 650.0, duration: 200, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 45.0, maintenanceCost: 0.38, maxWeight: 20000, status: 'ACTIVE'});
CREATE (r23:Route {id: 'R023', name: 'Ruta Santa Fe-Paraná', distance: 30.0, cost: 100.0, duration: 30, fuelConsumption: 0.08, roadType: 'CITY', trafficLevel: 4, tollCost: 5.0, maintenanceCost: 0.25, maxWeight: 13000, status: 'ACTIVE'});
CREATE (r24:Route {id: 'R024', name: 'Ruta Neuquén-Bahía Blanca', distance: 550.0, cost: 1200.0, duration: 380, fuelConsumption: 0.12, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 100.0, maintenanceCost: 0.48, maxWeight: 23000, status: 'ACTIVE'});
CREATE (r25:Route {id: 'R025', name: 'Ruta Neuquén-Mendoza', distance: 520.0, cost: 1100.0, duration: 360, fuelConsumption: 0.12, roadType: 'RURAL', trafficLevel: 1, tollCost: 90.0, maintenanceCost: 0.45, maxWeight: 22000, status: 'ACTIVE'});
CREATE (r26:Route {id: 'R026', name: 'Ruta BA-Paraná', distance: 420.0, cost: 950.0, duration: 300, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 65.0, maintenanceCost: 0.4, maxWeight: 20000, status: 'ACTIVE'});
CREATE (r27:Route {id: 'R027', name: 'Ruta BA-Santa Fe', distance: 470.0, cost: 1000.0, duration: 320, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 70.0, maintenanceCost: 0.42, maxWeight: 21000, status: 'ACTIVE'});
CREATE (r28:Route {id: 'R028', name: 'Ruta Córdoba-Paraná', distance: 380.0, cost: 850.0, duration: 270, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 55.0, maintenanceCost: 0.4, maxWeight: 20000, status: 'ACTIVE'});
CREATE (r29:Route {id: 'R029', name: 'Ruta Rosario-Bahía Blanca', distance: 480.0, cost: 1050.0, duration: 340, fuelConsumption: 0.12, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 75.0, maintenanceCost: 0.43, maxWeight: 21000, status: 'ACTIVE'});
CREATE (r30:Route {id: 'R030', name: 'Ruta BA-Salta', distance: 1450.0, cost: 3100.0, duration: 900, fuelConsumption: 0.16, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 280.0, maintenanceCost: 0.75, maxWeight: 30000, status: 'ACTIVE'});
CREATE (r31:Route {id: 'R031', name: 'Ruta BA-Neuquén', distance: 1200.0, cost: 2600.0, duration: 750, fuelConsumption: 0.15, roadType: 'HIGHWAY', trafficLevel: 2, tollCost: 230.0, maintenanceCost: 0.7, maxWeight: 29000, status: 'ACTIVE'});
CREATE (r32:Route {id: 'R032', name: 'Ruta Córdoba-Neuquén', distance: 850.0, cost: 1800.0, duration: 540, fuelConsumption: 0.13, roadType: 'RURAL', trafficLevel: 1, tollCost: 160.0, maintenanceCost: 0.58, maxWeight: 25500, status: 'ACTIVE'});
CREATE (r33:Route {id: 'R033', name: 'Ruta Mendoza-Neuquén', distance: 520.0, cost: 1100.0, duration: 360, fuelConsumption: 0.12, roadType: 'RURAL', trafficLevel: 1, tollCost: 90.0, maintenanceCost: 0.45, maxWeight: 22000, status: 'ACTIVE'});
CREATE (r34:Route {id: 'R034', name: 'Ruta Salta-Jujuy', distance: 80.0, cost: 200.0, duration: 70, fuelConsumption: 0.09, roadType: 'RURAL', trafficLevel: 1, tollCost: 10.0, maintenanceCost: 0.3, maxWeight: 16000, status: 'ACTIVE'});
CREATE (r35:Route {id: 'R035', name: 'Ruta Paraná-Resistencia', distance: 350.0, cost: 800.0, duration: 250, fuelConsumption: 0.11, roadType: 'HIGHWAY', trafficLevel: 3, tollCost: 50.0, maintenanceCost: 0.4, maxWeight: 20000, status: 'ACTIVE'});

-- ============================================
-- 4. ESTABLECER RELACIONES: CENTROS -> RUTAS
-- ============================================

-- Rutas desde Buenos Aires
MATCH (dc1:DistributionCenter {id: 'DC001'}), (r1:Route {id: 'R001'}), (dc2:DistributionCenter {id: 'DC002'})
CREATE (dc1)-[:CONNECTED_TO]->(r1)-[:CONNECTED_TO]->(dc2);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r2:Route {id: 'R002'}), (dc3:DistributionCenter {id: 'DC003'})
CREATE (dc1)-[:CONNECTED_TO]->(r2)-[:CONNECTED_TO]->(dc3);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r3:Route {id: 'R003'}), (dc6:DistributionCenter {id: 'DC006'})
CREATE (dc1)-[:CONNECTED_TO]->(r3)-[:CONNECTED_TO]->(dc6);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r4:Route {id: 'R004'}), (dc7:DistributionCenter {id: 'DC007'})
CREATE (dc1)-[:CONNECTED_TO]->(r4)-[:CONNECTED_TO]->(dc7);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r5:Route {id: 'R005'}), (dc5:DistributionCenter {id: 'DC005'})
CREATE (dc1)-[:CONNECTED_TO]->(r5)-[:CONNECTED_TO]->(dc5);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r6:Route {id: 'R006'}), (dc4:DistributionCenter {id: 'DC004'})
CREATE (dc1)-[:CONNECTED_TO]->(r6)-[:CONNECTED_TO]->(dc4);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r7:Route {id: 'R007'}), (dc11:DistributionCenter {id: 'DC011'})
CREATE (dc1)-[:CONNECTED_TO]->(r7)-[:CONNECTED_TO]->(dc11);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r26:Route {id: 'R026'}), (dc15:DistributionCenter {id: 'DC015'})
CREATE (dc1)-[:CONNECTED_TO]->(r26)-[:CONNECTED_TO]->(dc15);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r27:Route {id: 'R027'}), (dc13:DistributionCenter {id: 'DC013'})
CREATE (dc1)-[:CONNECTED_TO]->(r27)-[:CONNECTED_TO]->(dc13);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r30:Route {id: 'R030'}), (dc8:DistributionCenter {id: 'DC008'})
CREATE (dc1)-[:CONNECTED_TO]->(r30)-[:CONNECTED_TO]->(dc8);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (r31:Route {id: 'R031'}), (dc10:DistributionCenter {id: 'DC010'})
CREATE (dc1)-[:CONNECTED_TO]->(r31)-[:CONNECTED_TO]->(dc10);

-- Rutas desde Córdoba
MATCH (dc2:DistributionCenter {id: 'DC002'}), (r8:Route {id: 'R008'}), (dc4:DistributionCenter {id: 'DC004'})
CREATE (dc2)-[:CONNECTED_TO]->(r8)-[:CONNECTED_TO]->(dc4);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (r9:Route {id: 'R009'}), (dc3:DistributionCenter {id: 'DC003'})
CREATE (dc2)-[:CONNECTED_TO]->(r9)-[:CONNECTED_TO]->(dc3);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (r10:Route {id: 'R010'}), (dc5:DistributionCenter {id: 'DC005'})
CREATE (dc2)-[:CONNECTED_TO]->(r10)-[:CONNECTED_TO]->(dc5);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (r11:Route {id: 'R011'}), (dc8:DistributionCenter {id: 'DC008'})
CREATE (dc2)-[:CONNECTED_TO]->(r11)-[:CONNECTED_TO]->(dc8);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (r28:Route {id: 'R028'}), (dc15:DistributionCenter {id: 'DC015'})
CREATE (dc2)-[:CONNECTED_TO]->(r28)-[:CONNECTED_TO]->(dc15);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (r32:Route {id: 'R032'}), (dc10:DistributionCenter {id: 'DC010'})
CREATE (dc2)-[:CONNECTED_TO]->(r32)-[:CONNECTED_TO]->(dc10);

-- Rutas desde Rosario
MATCH (dc3:DistributionCenter {id: 'DC003'}), (r12:Route {id: 'R012'}), (dc13:DistributionCenter {id: 'DC013'})
CREATE (dc3)-[:CONNECTED_TO]->(r12)-[:CONNECTED_TO]->(dc13);

MATCH (dc3:DistributionCenter {id: 'DC003'}), (r13:Route {id: 'R013'}), (dc15:DistributionCenter {id: 'DC015'})
CREATE (dc3)-[:CONNECTED_TO]->(r13)-[:CONNECTED_TO]->(dc15);

MATCH (dc3:DistributionCenter {id: 'DC003'}), (r14:Route {id: 'R014'}), (dc5:DistributionCenter {id: 'DC005'})
CREATE (dc3)-[:CONNECTED_TO]->(r14)-[:CONNECTED_TO]->(dc5);

MATCH (dc3:DistributionCenter {id: 'DC003'}), (r29:Route {id: 'R029'}), (dc11:DistributionCenter {id: 'DC011'})
CREATE (dc3)-[:CONNECTED_TO]->(r29)-[:CONNECTED_TO]->(dc11);

-- Rutas desde Mendoza
MATCH (dc4:DistributionCenter {id: 'DC004'}), (r15:Route {id: 'R015'}), (dc12:DistributionCenter {id: 'DC012'})
CREATE (dc4)-[:CONNECTED_TO]->(r15)-[:CONNECTED_TO]->(dc12);

MATCH (dc4:DistributionCenter {id: 'DC004'}), (r16:Route {id: 'R016'}), (dc5:DistributionCenter {id: 'DC005'})
CREATE (dc4)-[:CONNECTED_TO]->(r16)-[:CONNECTED_TO]->(dc5);

MATCH (dc4:DistributionCenter {id: 'DC004'}), (r33:Route {id: 'R033'}), (dc10:DistributionCenter {id: 'DC010'})
CREATE (dc4)-[:CONNECTED_TO]->(r33)-[:CONNECTED_TO]->(dc10);

-- Rutas desde Tucumán
MATCH (dc5:DistributionCenter {id: 'DC005'}), (r17:Route {id: 'R017'}), (dc8:DistributionCenter {id: 'DC008'})
CREATE (dc5)-[:CONNECTED_TO]->(r17)-[:CONNECTED_TO]->(dc8);

MATCH (dc5:DistributionCenter {id: 'DC005'}), (r18:Route {id: 'R018'}), (dc9:DistributionCenter {id: 'DC009'})
CREATE (dc5)-[:CONNECTED_TO]->(r18)-[:CONNECTED_TO]->(dc9);

-- Rutas regionales
MATCH (dc6:DistributionCenter {id: 'DC006'}), (r19:Route {id: 'R019'}), (dc11:DistributionCenter {id: 'DC011'})
CREATE (dc6)-[:CONNECTED_TO]->(r19)-[:CONNECTED_TO]->(dc11);

MATCH (dc7:DistributionCenter {id: 'DC007'}), (r20:Route {id: 'R020'}), (dc6:DistributionCenter {id: 'DC006'})
CREATE (dc7)-[:CONNECTED_TO]->(r20)-[:CONNECTED_TO]->(dc6);

MATCH (dc9:DistributionCenter {id: 'DC009'}), (r21:Route {id: 'R021'}), (dc14:DistributionCenter {id: 'DC014'})
CREATE (dc9)-[:CONNECTED_TO]->(r21)-[:CONNECTED_TO]->(dc14);

MATCH (dc9:DistributionCenter {id: 'DC009'}), (r22:Route {id: 'R022'}), (dc15:DistributionCenter {id: 'DC015'})
CREATE (dc9)-[:CONNECTED_TO]->(r22)-[:CONNECTED_TO]->(dc15);

MATCH (dc13:DistributionCenter {id: 'DC013'}), (r23:Route {id: 'R023'}), (dc15:DistributionCenter {id: 'DC015'})
CREATE (dc13)-[:CONNECTED_TO]->(r23)-[:CONNECTED_TO]->(dc15);

MATCH (dc10:DistributionCenter {id: 'DC010'}), (r24:Route {id: 'R024'}), (dc11:DistributionCenter {id: 'DC011'})
CREATE (dc10)-[:CONNECTED_TO]->(r24)-[:CONNECTED_TO]->(dc11);

MATCH (dc8:DistributionCenter {id: 'DC008'}), (r34:Route {id: 'R034'})
CREATE (dc8)-[:CONNECTED_TO]->(r34);

MATCH (dc15:DistributionCenter {id: 'DC015'}), (r35:Route {id: 'R035'}), (dc14:DistributionCenter {id: 'DC014'})
CREATE (dc15)-[:CONNECTED_TO]->(r35)-[:CONNECTED_TO]->(dc14);

-- ============================================
-- 5. ASOCIAR CAMIONES A CENTROS
-- ============================================

-- Buenos Aires (3 camiones)
MATCH (dc1:DistributionCenter {id: 'DC001'}), (t1:Truck {id: 'T001'}), (t3:Truck {id: 'T003'}), (t6:Truck {id: 'T006'})
CREATE (dc1)-[:HAS_TRUCK]->(t1), (dc1)-[:HAS_TRUCK]->(t3), (dc1)-[:HAS_TRUCK]->(t6);

-- Córdoba (2 camiones)
MATCH (dc2:DistributionCenter {id: 'DC002'}), (t2:Truck {id: 'T002'}), (t7:Truck {id: 'T007'})
CREATE (dc2)-[:HAS_TRUCK]->(t2), (dc2)-[:HAS_TRUCK]->(t7);

-- Rosario (1 camión)
MATCH (dc3:DistributionCenter {id: 'DC003'}), (t4:Truck {id: 'T004'})
CREATE (dc3)-[:HAS_TRUCK]->(t4);

-- Mendoza (1 camión)
MATCH (dc4:DistributionCenter {id: 'DC004'}), (t5:Truck {id: 'T005'})
CREATE (dc4)-[:HAS_TRUCK]->(t5);

MATCH (dc5:DistributionCenter {id: 'DC005'}), (t8:Truck {id: 'T008'})
CREATE (dc5)-[:HAS_TRUCK]->(t8);

MATCH (dc6:DistributionCenter {id: 'DC006'}), (t9:Truck {id: 'T009'})
CREATE (dc6)-[:HAS_TRUCK]->(t9);

MATCH (dc7:DistributionCenter {id: 'DC007'}), (t10:Truck {id: 'T010'})
CREATE (dc7)-[:HAS_TRUCK]->(t10);

-- Salta (1 camión)
MATCH (dc8:DistributionCenter {id: 'DC008'}), (t11:Truck {id: 'T011'})
CREATE (dc8)-[:HAS_TRUCK]->(t11);

MATCH (dc9:DistributionCenter {id: 'DC009'}), (t12:Truck {id: 'T012'})
CREATE (dc9)-[:HAS_TRUCK]->(t12);

MATCH (dc10:DistributionCenter {id: 'DC010'}), (t13:Truck {id: 'T013'})
CREATE (dc10)-[:HAS_TRUCK]->(t13);


MATCH (dc11:DistributionCenter {id: 'DC011'}), (t14:Truck {id: 'T014'})
CREATE (dc11)-[:HAS_TRUCK]->(t14);

MATCH (dc12:DistributionCenter {id: 'DC012'}), (t15:Truck {id: 'T015'})
CREATE (dc12)-[:HAS_TRUCK]->(t15);

MATCH (dc13:DistributionCenter {id: 'DC013'}), (t16:Truck {id: 'T016'})
CREATE (dc13)-[:HAS_TRUCK]->(t16);

MATCH (dc14:DistributionCenter {id: 'DC014'}), (t17:Truck {id: 'T017'})
CREATE (dc14)-[:HAS_TRUCK]->(t17);

MATCH (dc15:DistributionCenter {id: 'DC015'}), (t18:Truck {id: 'T018'})
CREATE (dc15)-[:HAS_TRUCK]->(t18);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (t19:Truck {id: 'T019'})
CREATE (dc1)-[:HAS_TRUCK]->(t19);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (t20:Truck {id: 'T020'})
CREATE (dc2)-[:HAS_TRUCK]->(t20);

-- ============================================
-- 6. VERIFICAR DATOS CARGADOS
-- ============================================

-- Contar nodos
MATCH (dc:DistributionCenter) RETURN count(dc) as centros;
MATCH (r:Route) RETURN count(r) as rutas;
MATCH (t:Truck) RETURN count(t) as camiones;

MATCH (dc:DistributionCenter) 
RETURN dc.id, dc.name, dc.city, dc.demandLevel, dc.capacity 
ORDER BY dc.demandLevel DESC 
LIMIT 10;

