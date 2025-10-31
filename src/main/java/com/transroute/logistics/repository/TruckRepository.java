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
}

