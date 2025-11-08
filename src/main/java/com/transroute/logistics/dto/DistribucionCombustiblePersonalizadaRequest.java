package com.transroute.logistics.dto;

import java.util.List;

/**
 * DTO para distribución de combustible personalizada
 * Permite seleccionar camiones específicos y cantidad de combustible
 */
public class DistribucionCombustiblePersonalizadaRequest {
    
    private List<String> truckIds; // IDs de los camiones seleccionados
    private Integer combustibleDisponible; // Combustible total disponible
    
    public DistribucionCombustiblePersonalizadaRequest() {}
    
    public DistribucionCombustiblePersonalizadaRequest(List<String> truckIds, Integer combustibleDisponible) {
        this.truckIds = truckIds;
        this.combustibleDisponible = combustibleDisponible;
    }
    
    public List<String> getTruckIds() {
        return truckIds;
    }
    
    public void setTruckIds(List<String> truckIds) {
        this.truckIds = truckIds;
    }
    
    public Integer getCombustibleDisponible() {
        return combustibleDisponible;
    }
    
    public void setCombustibleDisponible(Integer combustibleDisponible) {
        this.combustibleDisponible = combustibleDisponible;
    }
}

