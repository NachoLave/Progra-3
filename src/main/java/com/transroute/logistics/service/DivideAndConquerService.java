package com.transroute.logistics.service;

import com.transroute.logistics.model.DistributionCenter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio para algoritmos de Divide y Vencerás
 * Módulo 2: Ordenamiento y búsqueda en grandes volúmenes de datos
 * 
 * Este servicio implementa:
 * - MergeSort para ordenar centros según nivel de demanda
 * - QuickSort como alternativa de ordenamiento
 * - Búsqueda Binaria para localizar centros específicos
 * 
 * Complejidades:
 * - Ordenamiento → O(n log n)
 * - Búsqueda → O(log n)
 */
@Service
public class DivideAndConquerService {

    /**
     * Ordena centros de distribución por nivel de demanda usando MergeSort
     * Complejidad: O(n log n)
     * 
     * @param centers Lista de centros a ordenar
     * @return Lista ordenada por demanda (mayor a menor)
     */
    public List<DistributionCenter> ordenarPorDemandaMergeSort(List<DistributionCenter> centers) {
        if (centers == null || centers.size() <= 1) {
            return new ArrayList<>(centers);
        }
        
        DistributionCenter[] array = centers.toArray(new DistributionCenter[0]);
        mergeSort(array, 0, array.length - 1);
        
        List<DistributionCenter> resultado = new ArrayList<>();
        for (DistributionCenter center : array) {
            resultado.add(center);
        }
        return resultado;
    }
    
    /**
     * Implementación recursiva de MergeSort
     * Divide el array en dos mitades, ordena cada mitad y las combina
     */
    private void mergeSort(DistributionCenter[] arr, int left, int right) {
        if (left < right) {
            int middle = left + (right - left) / 2;
            
            // Dividir: ordenar ambas mitades
            mergeSort(arr, left, middle);
            mergeSort(arr, middle + 1, right);
            
            // Vencer: combinar las mitades ordenadas
            merge(arr, left, middle, right);
        }
    }
    
    /**
     * Combina dos subarrays ordenados
     */
    private void merge(DistributionCenter[] arr, int left, int middle, int right) {
        int n1 = middle - left + 1;
        int n2 = right - middle;
        
        // Arrays temporales
        DistributionCenter[] leftArray = new DistributionCenter[n1];
        DistributionCenter[] rightArray = new DistributionCenter[n2];
        
        // Copiar datos a arrays temporales
        System.arraycopy(arr, left, leftArray, 0, n1);
        System.arraycopy(arr, middle + 1, rightArray, 0, n2);
        
        // Combinar arrays temporales
        int i = 0, j = 0;
        int k = left;
        
        while (i < n1 && j < n2) {
            // Ordenar por demanda descendente (mayor demanda primero)
            if (leftArray[i].getDemandLevel() >= rightArray[j].getDemandLevel()) {
                arr[k] = leftArray[i];
                i++;
            } else {
                arr[k] = rightArray[j];
                j++;
            }
            k++;
        }
        
        // Copiar elementos restantes
        while (i < n1) {
            arr[k] = leftArray[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = rightArray[j];
            j++;
            k++;
        }
    }
    
    /**
     * Ordena centros de distribución por prioridad usando QuickSort
     * Complejidad: O(n log n) en promedio, O(n²) en peor caso
     * 
     * @param centers Lista de centros a ordenar
     * @return Lista ordenada por prioridad (1 = más alta)
     */
    public List<DistributionCenter> ordenarPorPrioridadQuickSort(List<DistributionCenter> centers) {
        if (centers == null || centers.size() <= 1) {
            return new ArrayList<>(centers);
        }
        
        DistributionCenter[] array = centers.toArray(new DistributionCenter[0]);
        quickSort(array, 0, array.length - 1);
        
        List<DistributionCenter> resultado = new ArrayList<>();
        for (DistributionCenter center : array) {
            resultado.add(center);
        }
        return resultado;
    }
    
    /**
     * Implementación recursiva de QuickSort
     */
    private void quickSort(DistributionCenter[] arr, int low, int high) {
        if (low < high) {
            // Particionar el array y obtener el índice del pivote
            int pi = partition(arr, low, high);
            
            // Ordenar recursivamente los elementos antes y después del pivote
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    /**
     * Particiona el array y retorna el índice del pivote
     */
    private int partition(DistributionCenter[] arr, int low, int high) {
        // Usar el último elemento como pivote
        DistributionCenter pivot = arr[high];
        int i = (low - 1); // Índice del elemento más pequeño
        
        for (int j = low; j < high; j++) {
            // Ordenar por prioridad ascendente (1 = más alta prioridad)
            if (arr[j].getPriority() <= pivot.getPriority()) {
                i++;
                swap(arr, i, j);
            }
        }
        
        swap(arr, i + 1, high);
        return i + 1;
    }
    
    private void swap(DistributionCenter[] arr, int i, int j) {
        DistributionCenter temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    /**
     * Busca un centro de distribución por nivel de demanda usando Búsqueda Binaria
     * REQUIERE: La lista debe estar ordenada previamente por demanda
     * Complejidad: O(log n)
     * 
     * @param centers Lista ordenada de centros
     * @param targetDemand Nivel de demanda buscado
     * @return Índice del centro encontrado, o -1 si no se encuentra
     */
    public int buscarPorDemandaBinaria(List<DistributionCenter> centers, int targetDemand) {
        if (centers == null || centers.isEmpty()) {
            return -1;
        }
        
        DistributionCenter[] array = centers.toArray(new DistributionCenter[0]);
        return binarySearchDemand(array, 0, array.length - 1, targetDemand);
    }
    
    /**
     * Implementación recursiva de Búsqueda Binaria por demanda
     */
    private int binarySearchDemand(DistributionCenter[] arr, int left, int right, int target) {
        if (right >= left) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid].getDemandLevel() == target) {
                return mid;
            }
            
            // Como está ordenado descendentemente, invertimos la lógica
            if (arr[mid].getDemandLevel() < target) {
                return binarySearchDemand(arr, left, mid - 1, target);
            }
            
            return binarySearchDemand(arr, mid + 1, right, target);
        }
        
        return -1;
    }
    
    /**
     * Busca un centro de distribución por ID usando Búsqueda Binaria
     * REQUIERE: La lista debe estar ordenada por ID
     * Complejidad: O(log n)
     * 
     * @param centers Lista ordenada de centros
     * @param targetId ID del centro buscado
     * @return Índice del centro encontrado, o -1 si no se encuentra
     */
    public int buscarPorIdBinaria(List<DistributionCenter> centers, String targetId) {
        if (centers == null || centers.isEmpty()) {
            return -1;
        }
        
        DistributionCenter[] array = centers.toArray(new DistributionCenter[0]);
        return binarySearchId(array, 0, array.length - 1, targetId);
    }
    
    /**
     * Implementación recursiva de Búsqueda Binaria por ID
     */
    private int binarySearchId(DistributionCenter[] arr, int left, int right, String target) {
        if (right >= left) {
            int mid = left + (right - left) / 2;
            
            int comparison = arr[mid].getId().compareTo(target);
            if (comparison == 0) {
                return mid;
            }
            
            if (comparison > 0) {
                return binarySearchId(arr, left, mid - 1, target);
            }
            
            return binarySearchId(arr, mid + 1, right, target);
        }
        
        return -1;
    }
    
    /**
     * Busca todos los centros con demanda en un rango específico
     * Complejidad: O(log n) para encontrar el rango + O(k) donde k es el número de resultados
     * 
     * @param centers Lista ordenada por demanda
     * @param minDemand Demanda mínima
     * @param maxDemand Demanda máxima
     * @return Lista de centros en el rango
     */
    public List<DistributionCenter> buscarPorRangoDemanda(
            List<DistributionCenter> centers, int minDemand, int maxDemand) {
        
        List<DistributionCenter> resultado = new ArrayList<>();
        
        if (centers == null || centers.isEmpty()) {
            return resultado;
        }
        
        DistributionCenter[] array = centers.toArray(new DistributionCenter[0]);
        
        // Buscar el rango usando búsqueda binaria
        int startIndex = findFirstIndexInRange(array, minDemand, maxDemand, true);
        int endIndex = findFirstIndexInRange(array, minDemand, maxDemand, false);
        
        if (startIndex != -1 && endIndex != -1) {
            for (int i = startIndex; i <= endIndex; i++) {
                int demand = array[i].getDemandLevel();
                if (demand >= minDemand && demand <= maxDemand) {
                    resultado.add(array[i]);
                }
            }
        }
        
        return resultado;
    }
    
    private int findFirstIndexInRange(DistributionCenter[] arr, int min, int max, boolean findStart) {
        int left = 0, right = arr.length - 1;
        int result = -1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int demand = arr[mid].getDemandLevel();
            
            if (demand >= min && demand <= max) {
                result = mid;
                if (findStart) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else if (demand > max) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return result;
    }
}

