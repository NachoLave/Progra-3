package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para peticiones de distribución de combustible
 */
public class FuelDistributionRequest {
    private Integer requiredAmount;
    private List<Integer> availableSizes;
    
    public FuelDistributionRequest() {}
    
    public FuelDistributionRequest(Integer requiredAmount, List<Integer> availableSizes) {
        this.requiredAmount = requiredAmount;
        this.availableSizes = availableSizes;
    }
    
    public Integer getRequiredAmount() {
        return requiredAmount;
    }
    
    public void setRequiredAmount(Integer requiredAmount) {
        this.requiredAmount = requiredAmount;
    }
    
    public List<Integer> getAvailableSizes() {
        return availableSizes;
    }
    
    public void setAvailableSizes(List<Integer> availableSizes) {
        this.availableSizes = availableSizes;
    }
}



