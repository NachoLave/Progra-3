package com.transroute.logistics.repository;

import com.transroute.logistics.model.Truck;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TruckRepository extends Neo4jRepository<Truck, String> {
    
    @Query("MATCH (t:Truck) WHERE t.status = $status RETURN t")
    List<Truck> findByStatus(String status);
    
    @Query("MATCH (t:Truck) WHERE t.status = 'AVAILABLE' RETURN t ORDER BY t.capacity DESC")
    List<Truck> findAvailableOrderedByCapacity();
    
    /**
     * Obtiene camiones con estados específicos (AVAILABLE o IN_TRANSIT)
     * Optimizado: filtra directamente en Neo4j en lugar de traer todos y filtrar en memoria
     */
    @Query("MATCH (t:Truck) WHERE t.status IN ['AVAILABLE', 'IN_TRANSIT'] RETURN t")
    List<Truck> findActiveTrucks();
    
    /**
     * Obtiene múltiples camiones por sus IDs en una sola consulta
     * Evita el problema N+1 de hacer múltiples findById() en un loop
     */
    @Query("MATCH (t:Truck) WHERE t.id IN $ids RETURN t")
    List<Truck> findAllByIds(List<String> ids);
}

