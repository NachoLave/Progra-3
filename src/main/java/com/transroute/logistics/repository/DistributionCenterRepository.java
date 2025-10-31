package com.transroute.logistics.repository;

import com.transroute.logistics.model.DistributionCenter;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionCenterRepository extends Neo4jRepository<DistributionCenter, String> {
    
    @Query("MATCH (dc:DistributionCenter) WHERE dc.demandLevel >= $minDemand AND dc.demandLevel <= $maxDemand RETURN dc ORDER BY dc.demandLevel DESC")
    List<DistributionCenter> findByDemandLevelRange(int minDemand, int maxDemand);
    
    @Query("MATCH (dc:DistributionCenter) RETURN dc ORDER BY dc.demandLevel DESC")
    List<DistributionCenter> findAllOrderedByDemand();
    
    @Query("MATCH (dc:DistributionCenter) RETURN dc ORDER BY dc.priority ASC")
    List<DistributionCenter> findAllOrderedByPriority();
    
    @Query("MATCH (dc:DistributionCenter) WHERE dc.status = $status RETURN dc")
    List<DistributionCenter> findByStatus(String status);
}

