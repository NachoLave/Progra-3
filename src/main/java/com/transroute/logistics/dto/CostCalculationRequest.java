package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para las peticiones de cálculo de costos
 */
public class CostCalculationRequest {
    private List<Double> costs;
    
    // Constructors
    public CostCalculationRequest() {}
    
    public CostCalculationRequest(List<Double> costs) {
        this.costs = costs;
    }
    
    // Getters and Setters
    public List<Double> getCosts() {
        return costs;
    }
    
    public void setCosts(List<Double> costs) {
        this.costs = costs;
    }
}



