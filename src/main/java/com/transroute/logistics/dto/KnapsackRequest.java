package com.transroute.logistics.dto;

import com.transroute.logistics.service.DynamicProgrammingService;
import java.util.List;

/**
 * DTO para peticiones del problema de la mochila
 */
public class KnapsackRequest {
    private List<DynamicProgrammingService.Proyecto> proyectos;
    private Integer presupuesto;
    private Boolean optimized; // Si usar la versión optimizada en espacio
    
    public KnapsackRequest() {}
    
    public KnapsackRequest(List<DynamicProgrammingService.Proyecto> proyectos, Integer presupuesto) {
        this.proyectos = proyectos;
        this.presupuesto = presupuesto;
        this.optimized = false;
    }
    
    public List<DynamicProgrammingService.Proyecto> getProyectos() {
        return proyectos;
    }
    
    public void setProyectos(List<DynamicProgrammingService.Proyecto> proyectos) {
        this.proyectos = proyectos;
    }
    
    public Integer getPresupuesto() {
        return presupuesto;
    }
    
    public void setPresupuesto(Integer presupuesto) {
        this.presupuesto = presupuesto;
    }
    
    public Boolean getOptimized() {
        return optimized != null && optimized;
    }
    
    public void setOptimized(Boolean optimized) {
        this.optimized = optimized;
    }
}

