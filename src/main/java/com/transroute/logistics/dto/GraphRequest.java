package com.transroute.logistics.dto;

import java.util.List;
import java.util.Map;

/**
 * DTO para peticiones de algoritmos de grafos
 */
public class GraphRequest {
    private Integer vertices;
    private List<EdgeDto> edges;
    private Map<Integer, List<int[]>> adjacencyList;
    private Integer source;
    private Integer destination;
    
    public GraphRequest() {}
    
    public Integer getVertices() {
        return vertices;
    }
    
    public void setVertices(Integer vertices) {
        this.vertices = vertices;
    }
    
    public List<EdgeDto> getEdges() {
        return edges;
    }
    
    public void setEdges(List<EdgeDto> edges) {
        this.edges = edges;
    }
    
    public Map<Integer, List<int[]>> getAdjacencyList() {
        return adjacencyList;
    }
    
    public void setAdjacencyList(Map<Integer, List<int[]>> adjacencyList) {
        this.adjacencyList = adjacencyList;
    }
    
    public Integer getSource() {
        return source;
    }
    
    public void setSource(Integer source) {
        this.source = source;
    }
    
    public Integer getDestination() {
        return destination;
    }
    
    public void setDestination(Integer destination) {
        this.destination = destination;
    }
    
    /**
     * DTO interno para representar una arista
     */
    public static class EdgeDto {
        private int from;
        private int to;
        private double weight;
        
        public EdgeDto() {}
        
        public EdgeDto(int from, int to, double weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }
        
        public int getFrom() {
            return from;
        }
        
        public void setFrom(int from) {
            this.from = from;
        }
        
        public int getTo() {
            return to;
        }
        
        public void setTo(int to) {
            this.to = to;
        }
        
        public double getWeight() {
            return weight;
        }
        
        public void setWeight(double weight) {
            this.weight = weight;
        }
    }
}



