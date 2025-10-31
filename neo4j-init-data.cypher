-- Script de inicialización de datos para TransRoute S.A.
-- Ejecutar en Neo4j Browser o Neo4j Desktop

-- Crear centros de distribución
CREATE (dc1:DistributionCenter {
  id: 'DC001',
  name: 'Centro Principal Buenos Aires',
  city: 'Buenos Aires',
  demandLevel: 95,
  capacity: 1000
});

CREATE (dc2:DistributionCenter {
  id: 'DC002',
  name: 'Centro Regional Córdoba',
  city: 'Córdoba',
  demandLevel: 78,
  capacity: 800
});

CREATE (dc3:DistributionCenter {
  id: 'DC003',
  name: 'Centro Regional Rosario',
  city: 'Rosario',
  demandLevel: 82,
  capacity: 750
});

CREATE (dc4:DistributionCenter {
  id: 'DC004',
  name: 'Centro Regional Mendoza',
  city: 'Mendoza',
  demandLevel: 65,
  capacity: 600
});

CREATE (dc5:DistributionCenter {
  id: 'DC005',
  name: 'Centro Regional Tucumán',
  city: 'Tucumán',
  demandLevel: 70,
  capacity: 550
});

-- Crear rutas entre centros
CREATE (r1:Route {
  id: 'R001',
  distance: 700.0,
  cost: 1500.0,
  duration: 480
});

CREATE (r2:Route {
  id: 'R002',
  distance: 300.0,
  cost: 800.0,
  duration: 240
});

CREATE (r3:Route {
  id: 'R003',
  distance: 1050.0,
  cost: 2200.0,
  duration: 720
});

CREATE (r4:Route {
  id: 'R004',
  distance: 1200.0,
  cost: 2500.0,
  duration: 840
});

CREATE (r5:Route {
  id: 'R005',
  distance: 400.0,
  cost: 900.0,
  duration: 300
});

CREATE (r6:Route {
  id: 'R006',
  distance: 350.0,
  cost: 750.0,
  duration: 270
});

-- Crear camiones
CREATE (t1:Truck {
  id: 'T001',
  licensePlate: 'ABC123',
  capacity: 15000,
  fuelCapacity: 200,
  currentFuel: 200,
  status: 'AVAILABLE'
});

CREATE (t2:Truck {
  id: 'T002',
  licensePlate: 'DEF456',
  capacity: 12000,
  fuelCapacity: 180,
  currentFuel: 150,
  status: 'AVAILABLE'
});

CREATE (t3:Truck {
  id: 'T003',
  licensePlate: 'GHI789',
  capacity: 18000,
  fuelCapacity: 220,
  currentFuel: 220,
  status: 'IN_TRANSIT'
});

-- Establecer relaciones entre centros y rutas
MATCH (dc1:DistributionCenter {id: 'DC001'}), (dc2:DistributionCenter {id: 'DC002'}), (r1:Route {id: 'R001'})
CREATE (dc1)-[:CONNECTED_TO]->(r1)-[:CONNECTED_TO]->(dc2);

MATCH (dc1:DistributionCenter {id: 'DC001'}), (dc3:DistributionCenter {id: 'DC003'}), (r2:Route {id: 'R002'})
CREATE (dc1)-[:CONNECTED_TO]->(r2)-[:CONNECTED_TO]->(dc3);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (dc4:DistributionCenter {id: 'DC004'}), (r3:Route {id: 'R003'})
CREATE (dc2)-[:CONNECTED_TO]->(r3)-[:CONNECTED_TO]->(dc4);

MATCH (dc2:DistributionCenter {id: 'DC002'}), (dc5:DistributionCenter {id: 'DC005'}), (r4:Route {id: 'R004'})
CREATE (dc2)-[:CONNECTED_TO]->(r4)-[:CONNECTED_TO]->(dc5);

MATCH (dc3:DistributionCenter {id: 'DC003'}), (dc4:DistributionCenter {id: 'DC004'}), (r5:Route {id: 'R005'})
CREATE (dc3)-[:CONNECTED_TO]->(r5)-[:CONNECTED_TO]->(dc4);

MATCH (dc4:DistributionCenter {id: 'DC004'}), (dc5:DistributionCenter {id: 'DC005'}), (r6:Route {id: 'R006'})
CREATE (dc4)-[:CONNECTED_TO]->(r6)-[:CONNECTED_TO]->(dc5);

-- Verificar datos creados
MATCH (dc:DistributionCenter)
RETURN dc.id, dc.name, dc.city, dc.demandLevel, dc.capacity
ORDER BY dc.demandLevel DESC;

MATCH (r:Route)
RETURN r.id, r.distance, r.cost, r.duration
ORDER BY r.distance;

MATCH (t:Truck)
RETURN t.id, t.licensePlate, t.capacity, t.fuelCapacity, t.currentFuel, t.status;



