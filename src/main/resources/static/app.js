// API Base URL
const API_BASE = window.location.origin + '/api';

// Show/Hide Loading
function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

// Show Result - Formato mejorado e intuitivo
function showResult(elementId, data, isJson = false) {
    const element = document.getElementById(elementId);
    element.classList.add('active');
    
    // Detectar el tipo de resultado según el módulo
    let html = '';
    
    // Módulo 1: Recursividad
    if (elementId.includes('cost-result') || elementId.includes('distance-result')) {
        html = formatRecursiveResult(data, elementId);
    } 
    else if (elementId.includes('combined-result')) {
        html = formatCombinedMetrics(data);
    }
    else if (elementId.includes('compare-result')) {
        html = formatCompareResult(data);
    }
    // Módulo 2: Divide y Vencerás
    else if (elementId.includes('mergesort-result') || elementId.includes('quicksort-result')) {
        html = formatSortResult(data);
    }
    else if (elementId.includes('binary-result')) {
        html = formatBinarySearchResult(data);
    }
    // Módulo 3: Greedy
    else if (elementId.includes('fuel-result')) {
        html = formatFuelDistribution(data);
    }
    else if (elementId.includes('budget-result')) {
        html = formatBudgetDistribution(data);
    }
    // Módulo 4: Grafos
    else if (elementId.includes('kruskal-result')) {
        html = formatMSTResult(data, 'Kruskal');
    }
    else if (elementId.includes('dijkstra-result')) {
        html = formatDijkstraResult(data);
    }
    // Módulo 5: Programación Dinámica
    else if (elementId.includes('knapsack-result') && !elementId.includes('compare')) {
        html = formatKnapsackResult(data);
    }
    else if (elementId.includes('compare-knapsack-result')) {
        html = formatKnapsackComparison(data);
    }
    // Fallback: formato genérico mejorado
    else {
        html = formatGenericResult(data);
    }
    
    element.innerHTML = html;
}

// Formatear resultado de recursividad
function formatRecursiveResult(data, elementId) {
    const isCost = elementId.includes('cost');
    const tipo = isCost ? 'Costo Total' : 'Distancia Total';
    const valor = isCost ? data.costoTotal : data.distanciaTotal;
    const unidad = isCost ? 'unidades monetarias' : 'kilómetros';
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-check-circle"></i> Resultado Calculado</h4>
        </div>
        <div class="result-content">
            <div class="highlight-box">
                <div class="highlight-value">${valor.toFixed(2)}</div>
                <div class="highlight-label">${unidad}</div>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-cog"></i> Método:</span>
                    <span class="detail-value">${data.metodo || 'Recursivo'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad || 'O(n)'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-stopwatch"></i> Tiempo:</span>
                    <span class="detail-value">${(data.tiempoEjecucionNanosegundos / 1000).toFixed(2)} μs</span>
                </div>
                ${data.numeroTramos ? `
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-list"></i> Tramos procesados:</span>
                    <span class="detail-value">${data.numeroTramos}</span>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>Se utilizó un algoritmo <strong>recursivo</strong> que divide el problema en subproblemas más pequeños. 
            La función suma recursivamente cada tramo hasta llegar al caso base (cuando no hay más tramos). 
            La complejidad es <strong>O(n)</strong> donde n es el número de tramos, ya que cada tramo se procesa exactamente una vez.</p>
        </div>
    `;
    return html;
}

// Formatear métricas combinadas
function formatCombinedMetrics(data) {
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-chart-line"></i> Métricas Combinadas de Ruta</h4>
        </div>
        <div class="result-content">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${data.costoTotal.toFixed(2)}</div>
                    <div class="metric-label">Costo Total</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${data.distanciaTotal.toFixed(2)}</div>
                    <div class="metric-label">Distancia Total (km)</div>
                </div>
                <div class="metric-card highlight">
                    <div class="metric-value">${data.costoPorKm.toFixed(2)}</div>
                    <div class="metric-label">Costo por Kilómetro</div>
                </div>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-cog"></i> Método:</span>
                    <span class="detail-value">${data.metodo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>Este cálculo combina costo y distancia para obtener métricas derivadas como el <strong>costo por kilómetro</strong>, 
            que es útil para evaluar la eficiencia de las rutas. Se calcula recursivamente sumando costos y distancias por tramo, 
            y luego dividiendo el costo total entre la distancia total.</p>
        </div>
    `;
    return html;
}

// Formatear comparación de rendimiento
function formatCompareResult(data) {
    const tiempoRec = data.recursivo?.tiempoEjecucion || 0;
    const tiempoIter = data.iterativo?.tiempoEjecucion || 0;
    const diferencia = Math.abs(tiempoRec - tiempoIter);
    const masRapido = tiempoIter < tiempoRec ? 'Iterativo' : 'Recursivo';
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-balance-scale"></i> Comparación de Rendimiento</h4>
        </div>
        <div class="result-content">
            <div class="comparison-grid">
                <div class="comparison-card">
                    <div class="comparison-title">Recursivo</div>
                    <div class="comparison-value">${(tiempoRec / 1000).toFixed(2)} μs</div>
                    <div class="comparison-detail">Complejidad: O(n)</div>
                    <div class="comparison-detail">Memoria: O(n) stack</div>
                </div>
                <div class="comparison-card">
                    <div class="comparison-title">Iterativo</div>
                    <div class="comparison-value">${(tiempoIter / 1000).toFixed(2)} μs</div>
                    <div class="comparison-detail">Complejidad: O(n)</div>
                    <div class="comparison-detail">Memoria: O(1)</div>
                </div>
            </div>
            <div class="result-details">
                <div class="detail-item highlight">
                    <span class="detail-label"><i class="fas fa-trophy"></i> Más rápido:</span>
                    <span class="detail-value">${masRapido}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-hourglass-half"></i> Diferencia:</span>
                    <span class="detail-value">${(diferencia / 1000).toFixed(2)} μs</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>Aunque ambos métodos tienen la misma complejidad temporal <strong>O(n)</strong>, la versión <strong>iterativa</strong> 
            generalmente es más eficiente porque no requiere el overhead de la pila de llamadas recursivas. Además, tiene mejor 
            complejidad espacial <strong>O(1)</strong> vs <strong>O(n)</strong> de la recursión.</p>
        </div>
    `;
    return html;
}

// Formatear resultado de ordenamiento
function formatSortResult(data) {
    const centros = data.centrosOrdenados || [];
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-sort-amount-down"></i> Centros Ordenados</h4>
        </div>
        <div class="result-content">
            <div class="algorithm-info">
                <span class="algorithm-badge">${data.algoritmo}</span>
                <span class="complexity-badge">${data.complejidad}</span>
            </div>
            <div class="centers-list">
                ${centros.map((centro, index) => `
                    <div class="center-item">
                        <div class="center-rank">#${index + 1}</div>
                        <div class="center-info">
                            <div class="center-name">${centro.name || centro.id}</div>
                            <div class="center-details">
                                ${centro.demandLevel !== undefined ? `<span>Demanda: <strong>${centro.demandLevel}</strong></span>` : ''}
                                ${centro.priority !== undefined ? `<span>Prioridad: <strong>${centro.priority}</strong></span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-stopwatch"></i> Tiempo:</span>
                    <span class="detail-value">${(data.tiempoEjecucionNanosegundos / 1000).toFixed(2)} μs</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-list"></i> Centros procesados:</span>
                    <span class="detail-value">${data.numeroCentros || centros.length}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>El algoritmo <strong>${data.algoritmo}</strong> utiliza la estrategia de <strong>Divide y Vencerás</strong>. 
            Divide el array en mitades, ordena cada mitad recursivamente, y luego combina los resultados ordenados. 
            La complejidad es <strong>${data.complejidad}</strong> porque divide el problema log(n) veces y procesa n elementos en cada nivel.</p>
        </div>
    `;
    return html;
}

// Formatear búsqueda binaria
function formatBinarySearchResult(data) {
    const encontrado = data.encontrado;
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-search"></i> Resultado de Búsqueda Binaria</h4>
        </div>
        <div class="result-content">
            ${encontrado ? `
                <div class="search-success">
                    <i class="fas fa-check-circle"></i>
                    <div class="search-message">¡Centro encontrado!</div>
                </div>
                <div class="center-found">
                    <div class="center-name">${data.centro.name || data.centro.id}</div>
                    <div class="center-details">
                        <span>Demanda: <strong>${data.centro.demandLevel}</strong></span>
                        <span>Índice: <strong>${data.indice}</strong></span>
                    </div>
                </div>
            ` : `
                <div class="search-error">
                    <i class="fas fa-times-circle"></i>
                    <div class="search-message">Centro no encontrado</div>
                </div>
            `}
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad || 'O(log n)'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-stopwatch"></i> Tiempo:</span>
                    <span class="detail-value">${(data.tiempoEjecucionNanosegundos / 1000).toFixed(2)} μs</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>La <strong>Búsqueda Binaria</strong> aprovecha que la lista está ordenada. En cada paso, compara el elemento central 
            con el objetivo y elimina la mitad de los elementos restantes. Por eso su complejidad es <strong>O(log n)</strong>, 
            mucho más eficiente que una búsqueda lineal O(n) para listas ordenadas.</p>
        </div>
    `;
    return html;
}

// Formatear distribución de combustible
function formatFuelDistribution(data) {
    const distribucion = data.distribucion || {};
    const items = Object.entries(distribucion).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-gas-pump"></i> Distribución de Combustible</h4>
        </div>
        <div class="result-content">
            <div class="fuel-summary">
                <div class="fuel-stat">
                    <div class="fuel-stat-value">${data.totalDistribuido}</div>
                    <div class="fuel-stat-label">Litros distribuidos</div>
                </div>
                <div class="fuel-stat">
                    <div class="fuel-stat-value">${data.cantidadBidonesUsados}</div>
                    <div class="fuel-stat-label">Bidones utilizados</div>
                </div>
            </div>
            <div class="distribution-breakdown">
                <h5>Desglose de distribución:</h5>
                ${items.map(([size, quantity]) => `
                    <div class="distribution-item">
                        <span class="distribution-size">Bidón de ${size}L</span>
                        <span class="distribution-quantity">× ${quantity}</span>
                        <span class="distribution-total">= ${size * quantity}L</span>
                    </div>
                `).join('')}
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-coins"></i> Algoritmo:</span>
                    <span class="detail-value">${data.algoritmo || 'Greedy'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad || 'O(n)'}</span>
                </div>
                ${data.diferencia !== undefined ? `
                <div class="detail-item ${data.diferencia === 0 ? 'success' : 'warning'}">
                    <span class="detail-label"><i class="fas fa-check"></i> Diferencia:</span>
                    <span class="detail-value">${data.diferencia}L</span>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>El algoritmo <strong>Greedy</strong> (voraz) siempre elige el bidón más grande que no exceda la cantidad restante. 
            Esta estrategia localmente óptima funciona perfectamente para este problema porque los tamaños están bien diseñados. 
            La complejidad es <strong>O(n)</strong> donde n es el número de tamaños disponibles.</p>
        </div>
    `;
    return html;
}

// Formatear distribución de presupuesto
function formatBudgetDistribution(data) {
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-dollar-bill-wave"></i> Distribución de Presupuesto</h4>
        </div>
        <div class="result-content">
            <div class="budget-summary">
                <div class="budget-stat">
                    <div class="budget-stat-value">$${data.presupuestoAsignado.toFixed(2)}</div>
                    <div class="budget-stat-label">Asignado</div>
                </div>
                <div class="budget-stat">
                    <div class="budget-stat-value">$${data.presupuestoRestante.toFixed(2)}</div>
                    <div class="budget-stat-label">Restante</div>
                </div>
            </div>
            <div class="distribution-breakdown">
                <h5>Asignación por proyecto:</h5>
                ${Object.entries(data.distribucion || {}).map(([proyecto, cantidad]) => `
                    <div class="distribution-item">
                        <span class="distribution-size">${proyecto}</span>
                        <span class="distribution-total">$${cantidad.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>Este algoritmo utiliza <strong>Mochila Fraccional Greedy</strong>, ordenando proyectos por ratio beneficio/costo 
            y asignando presupuesto empezando por los más eficientes. Permite asignar fracciones de proyectos cuando el presupuesto 
            no alcanza para completarlos.</p>
        </div>
    `;
    return html;
}

// Formatear MST (Kruskal/Prim)
function formatMSTResult(data, algoritmo) {
    const edges = data.mst || [];
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-network-wired"></i> Árbol de Recubrimiento Mínimo (${algoritmo})</h4>
        </div>
        <div class="result-content">
            <div class="mst-summary">
                <div class="mst-stat">
                    <div class="mst-stat-value">$${data.costoTotal.toFixed(2)}</div>
                    <div class="mst-stat-label">Costo Total</div>
                </div>
                <div class="mst-stat">
                    <div class="mst-stat-value">${data.numeroAristas}</div>
                    <div class="mst-stat-label">Aristas</div>
                </div>
            </div>
            <div class="edges-list">
                <h5>Rutas seleccionadas:</h5>
                ${edges.map((edge, index) => `
                    <div class="edge-item">
                        <span class="edge-number">${index + 1}</span>
                        <span class="edge-connection">${edge.from} → ${edge.to}</span>
                        <span class="edge-weight">Peso: ${edge.weight}</span>
                    </div>
                `).join('')}
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>El algoritmo de <strong>${algoritmo}</strong> encuentra el árbol de recubrimiento mínimo (MST) que conecta todos 
            los centros con el menor costo total posible. ${algoritmo === 'Kruskal' ? 
            'Ordena las aristas por peso y las agrega si no forman ciclos.' : 
            'Comienza desde un vértice y siempre agrega la arista de menor peso que conecte con un vértice no visitado.'}</p>
        </div>
    `;
    return html;
}

// Formatear Dijkstra
function formatDijkstraResult(data) {
    const distances = data.distances || {};
    const entries = Object.entries(distances).filter(([k, v]) => v !== null);
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-route"></i> Caminos Más Cortos (Dijkstra)</h4>
        </div>
        <div class="result-content">
            <div class="dijkstra-source">
                <span>Desde el vértice: <strong>${data.source}</strong></span>
            </div>
            <div class="distances-list">
                <h5>Distancias mínimas:</h5>
                ${entries.map(([vertice, distancia]) => `
                    <div class="distance-item">
                        <span class="distance-target">Vértice ${vertice}</span>
                        <span class="distance-value">${distancia.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>El algoritmo de <strong>Dijkstra</strong> encuentra el camino más corto desde un vértice origen a todos los demás 
            vértices en un grafo con pesos no negativos. Utiliza una cola de prioridad para siempre explorar el vértice más cercano 
            primero. La complejidad es <strong>O((V + E) log V)</strong> donde V son vértices y E aristas.</p>
        </div>
    `;
    return html;
}

// Formatear mochila 0/1
function formatKnapsackResult(data) {
    const proyectos = data.proyectosSeleccionados || [];
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-briefcase"></i> Solución Óptima de Inversiones</h4>
        </div>
        <div class="result-content">
            <div class="knapsack-summary">
                <div class="knapsack-stat highlight">
                    <div class="knapsack-stat-value">$${data.beneficioTotal}</div>
                    <div class="knapsack-stat-label">Beneficio Total Máximo</div>
                </div>
                <div class="knapsack-stat">
                    <div class="knapsack-stat-value">$${data.costoTotal}</div>
                    <div class="knapsack-stat-label">Costo Total</div>
                </div>
                <div class="knapsack-stat">
                    <div class="knapsack-stat-value">$${data.presupuestoRestante}</div>
                    <div class="knapsack-stat-label">Presupuesto Restante</div>
                </div>
            </div>
            <div class="projects-selected">
                <h5>Proyectos seleccionados (${proyectos.length}):</h5>
                ${proyectos.map((proyecto, index) => `
                    <div class="project-item">
                        <span class="project-number">${index + 1}</span>
                        <span class="project-name">${proyecto}</span>
                    </div>
                `).join('')}
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-cog"></i> Algoritmo:</span>
                    <span class="detail-value">${data.algoritmo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-clock"></i> Complejidad:</span>
                    <span class="detail-value complexity-badge">${data.complejidad}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p>La <strong>Programación Dinámica</strong> resuelve el problema de la mochila 0/1 construyendo una tabla donde 
            dp[i][w] representa el máximo beneficio usando los primeros i proyectos con presupuesto w. La solución óptima se 
            encuentra al considerar todas las combinaciones posibles. Complejidad <strong>O(n × P)</strong> garantiza encontrar la 
            solución globalmente óptima.</p>
        </div>
    `;
    return html;
}

// Formatear comparación mochila
function formatKnapsackComparison(data) {
    const dp = data.programacionDinamica || {};
    const greedy = data.greedy || {};
    const diferencia = data.diferenciaBeneficio || 0;
    
    let html = `
        <div class="result-header">
            <h4><i class="fas fa-balance-scale"></i> Comparación: DP vs Greedy</h4>
        </div>
        <div class="result-content">
            <div class="comparison-grid">
                <div class="comparison-card">
                    <div class="comparison-title">Programación Dinámica</div>
                    <div class="comparison-value highlight">$${dp.beneficioTotal || 0}</div>
                    <div class="comparison-detail">Costo: $${dp.costoTotal || 0}</div>
                    <div class="comparison-detail">Proyectos: ${dp.proyectosSeleccionados?.length || 0}</div>
                </div>
                <div class="comparison-card">
                    <div class="comparison-title">Greedy</div>
                    <div class="comparison-value">$${greedy.beneficioTotal || 0}</div>
                    <div class="comparison-detail">Costo: $${greedy.costoTotal || 0}</div>
                    <div class="comparison-detail">Proyectos: ${greedy.proyectosSeleccionados?.length || 0}</div>
                </div>
            </div>
            <div class="result-details highlight">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-trophy"></i> Mejor estrategia:</span>
                    <span class="detail-value">${data.mejorEstrategia}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-chart-line"></i> Diferencia de beneficio:</span>
                    <span class="detail-value">$${diferencia}</span>
                </div>
            </div>
        </div>
        <div class="result-explanation">
            <h5><i class="fas fa-lightbulb"></i> Explicación:</h5>
            <p><strong>Programación Dinámica</strong> siempre encuentra la solución óptima garantizada porque explora todas las 
            combinaciones posibles. <strong>Greedy</strong> es más rápido pero puede fallar al elegir localmente lo mejor sin considerar 
            el impacto global. Esta comparación muestra por qué DP es preferible para problemas donde se requiere la solución óptima.</p>
        </div>
    `;
    return html;
}

// Formato genérico mejorado
function formatGenericResult(data) {
    let html = '<div class="result-header"><h4>Resultado</h4></div><div class="result-content">';
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            html += `<div class="result-item"><strong>${key}:</strong></div>`;
            html += `<div style="margin-left: 1rem;">${formatValue(value)}</div>`;
        } else {
            html += `<div class="result-item"><span class="result-label">${key}:</span> <span class="result-value">${formatValue(value)}</span></div>`;
        }
    }
    html += '</div>';
    return html;
}

function formatValue(value) {
    if (typeof value === 'boolean') {
        return value ? '<span class="success">✓ Sí</span>' : '<span class="error">✗ No</span>';
    }
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '[]';
    }
    if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value, null, 2);
    }
    return value;
}

// Navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and modules
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.module-content').forEach(m => m.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding module
        tab.classList.add('active');
        const moduleName = tab.dataset.module;
        document.getElementById(`module-${moduleName}`).classList.add('active');
    });
});

// ==================== MÓDULO 1: RECURSIVIDAD ====================

async function calcularCostoTotal() {
    showLoading();
    try {
        const costsInput = document.getElementById('costs-input').value;
        const costs = costsInput.split(',').map(c => parseFloat(c.trim())).filter(c => !isNaN(c));
        
        const response = await fetch(`${API_BASE}/recursive-metrics/costo-total`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs })
        });
        
        const data = await response.json();
        showResult('cost-result', data);
    } catch (error) {
        showResult('cost-result', { error: 'Error al calcular: ' + error.message });
    } finally {
        hideLoading();
    }
}

function verVisualizacionRecursion(type) {
    const inputId = type === 'cost' ? 'costs-input' : 'distances-input';
    const vizId = type === 'cost' ? 'cost-viz' : 'distance-viz';
    const input = document.getElementById(inputId).value;
    const values = input.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    
    if (values.length === 0) {
        alert('Por favor ingresa valores primero');
        return;
    }
    
    visualizer.visualizeRecursion(values, vizId);
}

function verVisualizacionGreedy() {
    const amount = parseInt(document.getElementById('fuel-amount').value);
    const sizesInput = document.getElementById('fuel-sizes').value;
    const sizes = sizesInput.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
    
    if (!amount || sizes.length === 0) {
        alert('Por favor completa los campos primero');
        return;
    }
    
    visualizer.visualizeGreedy(amount, sizes, 'fuel-viz');
}

function verVisualizacionGrafo(type) {
    const graphJson = document.getElementById(`${type}-graph`).value;
    try {
        const graph = JSON.parse(graphJson);
        visualizer.visualizeGraph(graph.edges, `${type}-viz`);
    } catch (error) {
        alert('Error al parsear el grafo: ' + error.message);
    }
}

async function verTablaDP() {
    const presupuesto = parseInt(document.getElementById('knapsack-budget').value);
    const proyectos = JSON.parse(document.getElementById('knapsack-projects').value);
    
    const request = {
        proyectos,
        presupuesto
    };
    
    try {
        const response = await fetch(`${API_BASE}/dynamic-programming/mochila/tabla-dp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        visualizer.visualizeDP(data.tablaDP, 'knapsack-viz');
    } catch (error) {
        alert('Error al obtener tabla DP: ' + error.message);
    }
}

async function calcularDistanciaTotal() {
    showLoading();
    try {
        const distancesInput = document.getElementById('distances-input').value;
        const distances = distancesInput.split(',').map(d => parseFloat(d.trim())).filter(d => !isNaN(d));
        
        const response = await fetch(`${API_BASE}/recursive-metrics/distancia-total`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distances })
        });
        
        const data = await response.json();
        showResult('distance-result', data);
    } catch (error) {
        showResult('distance-result', { error: 'Error al calcular: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function calcularMetricasCombinadas() {
    showLoading();
    try {
        const costsInput = document.getElementById('combined-costs').value;
        const distancesInput = document.getElementById('combined-distances').value;
        const costs = costsInput.split(',').map(c => parseFloat(c.trim())).filter(c => !isNaN(c));
        const distances = distancesInput.split(',').map(d => parseFloat(d.trim())).filter(d => !isNaN(d));
        
        const response = await fetch(`${API_BASE}/recursive-metrics/metricas-combinadas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs, distances })
        });
        
        const data = await response.json();
        showResult('combined-result', data);
    } catch (error) {
        showResult('combined-result', { error: 'Error al calcular: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function compararRendimiento() {
    showLoading();
    try {
        const costsInput = document.getElementById('compare-costs').value;
        const costs = costsInput.split(',').map(c => parseFloat(c.trim())).filter(c => !isNaN(c));
        
        const response = await fetch(`${API_BASE}/recursive-metrics/comparar-rendimiento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs })
        });
        
        const data = await response.json();
        showResult('compare-result', data, true);
    } catch (error) {
        showResult('compare-result', { error: 'Error al comparar: ' + error.message });
    } finally {
        hideLoading();
    }
}

// ==================== MÓDULO 2: DIVIDE Y VENCERÁS ====================

async function ordenarMergeSort() {
    showLoading();
    try {
        const idsInput = document.getElementById('mergesort-ids').value;
        const centerIds = idsInput.split(',').map(id => id.trim()).filter(id => id);
        
        const response = await fetch(`${API_BASE}/divide-conquer/ordenar/mergesort`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ centerIds, sortBy: 'demand', algorithm: 'mergesort' })
        });
        
        const data = await response.json();
        showResult('mergesort-result', data, true);
    } catch (error) {
        showResult('mergesort-result', { error: 'Error al ordenar: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function ordenarQuickSort() {
    showLoading();
    try {
        const idsInput = document.getElementById('quicksort-ids').value;
        const centerIds = idsInput.split(',').map(id => id.trim()).filter(id => id);
        
        const response = await fetch(`${API_BASE}/divide-conquer/ordenar/quicksort`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ centerIds, sortBy: 'priority', algorithm: 'quicksort' })
        });
        
        const data = await response.json();
        showResult('quicksort-result', data, true);
    } catch (error) {
        showResult('quicksort-result', { error: 'Error al ordenar: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function buscarBinaria() {
    showLoading();
    try {
        const idsInput = document.getElementById('binary-ids').value;
        const centerIds = idsInput.split(',').map(id => id.trim()).filter(id => id);
        const targetDemand = parseInt(document.getElementById('binary-demand').value);
        
        const response = await fetch(`${API_BASE}/divide-conquer/buscar/binaria-demanda`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ centerIds, searchType: 'demand', targetDemand })
        });
        
        const data = await response.json();
        showResult('binary-result', data, true);
    } catch (error) {
        showResult('binary-result', { error: 'Error al buscar: ' + error.message });
    } finally {
        hideLoading();
    }
}

// ==================== MÓDULO 3: GREEDY ====================

async function distribuirCombustible() {
    showLoading();
    try {
        const requiredAmount = parseInt(document.getElementById('fuel-amount').value);
        const sizesInput = document.getElementById('fuel-sizes').value;
        const availableSizes = sizesInput.split(',').map(s => parseInt(s.trim())).filter(s => !isNaN(s));
        
        const response = await fetch(`${API_BASE}/greedy/distribuir-combustible`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requiredAmount, availableSizes })
        });
        
        const data = await response.json();
        showResult('fuel-result', data, true);
    } catch (error) {
        showResult('fuel-result', { error: 'Error al distribuir: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function distribuirPresupuesto() {
    showLoading();
    try {
        const presupuestoTotal = parseFloat(document.getElementById('budget-total').value);
        const proyectos = JSON.parse(document.getElementById('budget-projects').value);
        
        const response = await fetch(`${API_BASE}/greedy/distribuir-presupuesto?presupuestoTotal=${presupuestoTotal}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proyectos)
        });
        
        const data = await response.json();
        showResult('budget-result', data, true);
    } catch (error) {
        showResult('budget-result', { error: 'Error al distribuir: ' + error.message });
    } finally {
        hideLoading();
    }
}

// ==================== MÓDULO 4: GRAFOS ====================

async function calcularKruskal() {
    showLoading();
    try {
        const graphJson = document.getElementById('kruskal-graph').value;
        const graph = JSON.parse(graphJson);
        
        const request = {
            vertices: graph.vertices,
            edges: graph.edges
        };
        
        const response = await fetch(`${API_BASE}/graphs/kruskal/mst`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        showResult('kruskal-result', data, true);
    } catch (error) {
        showResult('kruskal-result', { error: 'Error al calcular MST: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function calcularDijkstra() {
    showLoading();
    try {
        const vertices = parseInt(document.getElementById('dijkstra-vertices').value);
        const source = parseInt(document.getElementById('dijkstra-source').value);
        const adjacencyList = JSON.parse(document.getElementById('dijkstra-graph').value);
        
        // Convert adjacency list format
        const convertedAdjList = {};
        for (const [key, value] of Object.entries(adjacencyList)) {
            convertedAdjList[parseInt(key)] = value.map(v => [v[0], v[1]]);
        }
        
        const request = {
            vertices,
            source,
            adjacencyList: convertedAdjList
        };
        
        const response = await fetch(`${API_BASE}/graphs/dijkstra/distances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        showResult('dijkstra-result', data, true);
    } catch (error) {
        showResult('dijkstra-result', { error: 'Error al calcular Dijkstra: ' + error.message });
    } finally {
        hideLoading();
    }
}

// ==================== MÓDULO 5: PROGRAMACIÓN DINÁMICA ====================

async function resolverMochila() {
    showLoading();
    try {
        const presupuesto = parseInt(document.getElementById('knapsack-budget').value);
        const proyectos = JSON.parse(document.getElementById('knapsack-projects').value);
        
        const request = {
            proyectos,
            presupuesto,
            optimized: false
        };
        
        const response = await fetch(`${API_BASE}/dynamic-programming/mochila`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        showResult('knapsack-result', data, true);
    } catch (error) {
        showResult('knapsack-result', { error: 'Error al resolver mochila: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function compararMochilaGreedy() {
    showLoading();
    try {
        const presupuesto = parseInt(document.getElementById('compare-knapsack-budget').value);
        const proyectos = JSON.parse(document.getElementById('compare-knapsack-projects').value);
        
        const request = {
            proyectos,
            presupuesto
        };
        
        const response = await fetch(`${API_BASE}/dynamic-programming/mochila/comparar-greedy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        const data = await response.json();
        showResult('compare-knapsack-result', data, true);
    } catch (error) {
        showResult('compare-knapsack-result', { error: 'Error al comparar: ' + error.message });
    } finally {
        hideLoading();
    }
}

