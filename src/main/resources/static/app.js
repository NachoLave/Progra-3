// API Base URL
const API_BASE = window.location.origin + '/api';

// ==================== FUNCIÓN PARA FORMATEAR TIEMPO ====================
/**
 * Formatea el tiempo de ejecución en segundos
 * @param {number} nanoseconds - Tiempo en nanosegundos
 * @returns {string} Tiempo formateado en segundos
 */
function formatExecutionTime(nanoseconds) {
    // Convertir nanosegundos a segundos
    const seconds = nanoseconds / 1000000000;
    return `${seconds.toFixed(6)} s`;
}

// Show/Hide Loading
function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

// Show Result - Modal con información paso a paso
function showResult(elementId, data, isJson = false) {
    // Detectar el tipo de resultado según el módulo
    let modalContent = '';
    let modalTitle = 'Resultado Calculado';
    
    // Módulo 1: Recursividad
    if (elementId.includes('cost-result') || elementId.includes('distance-result')) {
        modalContent = formatRecursiveResultModal(data, elementId);
        modalTitle = elementId.includes('cost') ? 'Cálculo de Costo Total' : 'Cálculo de Distancia Total';
    }
    else if (elementId.includes('combined-result')) {
        modalContent = formatCombinedMetricsModal(data);
        modalTitle = 'Métricas Combinadas';
    }
    else if (elementId.includes('compare-result')) {
        modalContent = formatCompareResultModal(data);
        modalTitle = 'Comparación de Métodos';
    }
    // Módulo 2: Divide y Vencerás
    else if (elementId.includes('mergesort-result') || elementId.includes('quicksort-result') || elementId.includes('sort-result')) {
        modalContent = formatSortResultModal(data);
        modalTitle = 'Resultado de Ordenamiento';
    }
    else if (elementId.includes('binary-result')) {
        modalContent = formatBinarySearchResultModal(data);
        modalTitle = 'Búsqueda Binaria';
    }
    // Módulo 3: Greedy
    else if (elementId.includes('fuel-result')) {
        modalContent = formatFuelDistributionModal(data);
        modalTitle = 'Distribución de Combustible';
    }
    else if (elementId.includes('budget-result')) {
        modalContent = formatBudgetDistributionModal(data);
        modalTitle = 'Distribución de Presupuesto';
    }
    // Módulo 4: Grafos
    else if (elementId.includes('kruskal-result') || elementId.includes('prim-result')) {
        const algoritmo = elementId.includes('prim') ? 'Prim' : 'Kruskal';
        modalContent = formatMSTResultModal(data, algoritmo);
        modalTitle = 'Árbol de Recubrimiento Mínimo';
    }
    else if (elementId.includes('dijkstra-result')) {
        modalContent = formatDijkstraResultModal(data);
        modalTitle = 'Caminos Más Cortos - Dijkstra';
         
         // Inicializar visualización después de que el modal se muestre
         setTimeout(() => {
             const vizContainer = document.querySelector('.modal-visualization-container[data-viz-data]');
             if (vizContainer) {
                 const vizData = JSON.parse(vizContainer.getAttribute('data-viz-data'));
                 const svg = vizContainer.querySelector('.graph-svg');
                 if (svg && vizData.edges && vizData.edges.length > 0) {
                     visualizer.drawGraph(vizData.edges, svg, vizData.indexToCenter);
                 }
             }
         }, 100);
    }
    // Módulo 5: Programación Dinámica
    else if (elementId.includes('knapsack-result') && !elementId.includes('compare')) {
        modalContent = formatKnapsackResultModal(data);
        modalTitle = 'Problema de la Mochila 0/1';
    }
    else if (elementId.includes('compare-knapsack-result')) {
        modalContent = formatKnapsackComparisonModal(data);
        modalTitle = 'Comparación DP vs Greedy';
    }
    // Fallback: formato genérico
    else {
        modalContent = formatGenericResultModal(data);
    }
    
    // Mostrar modal
    mostrarModal(modalTitle, modalContent);
}

// Funciones para abrir y cerrar modal
function mostrarModal(titulo, contenido) {
    document.getElementById('modal-title').innerHTML = `<i class="fas fa-check-circle"></i> ${titulo}`;
    document.getElementById('modal-body').innerHTML = contenido;
    document.getElementById('result-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Iniciar visualizaciones automáticamente
    setTimeout(() => {
        iniciarVisualizaciones();
    }, 300);
}

// Función para iniciar visualizaciones paso a paso automáticamente
function iniciarVisualizaciones() {
    // Buscar contenedores de visualización
    const vizContainers = document.querySelectorAll('.modal-visualization-container[data-viz-data]');
    
    vizContainers.forEach(container => {
        const vizData = JSON.parse(container.getAttribute('data-viz-data'));
        const vizType = container.getAttribute('data-viz-type');
        const vizId = container.id;
        
        if (vizType === 'budget-projects') {
            // Visualización de presupuesto con proyectos
            iniciarVisualizacionBudget(container, vizData);
        } else if (vizId.includes('recursion-viz')) {
            // Visualización de recursión
            iniciarVisualizacionRecursion(container, vizData);
        } else if (vizId.includes('greedy-viz')) {
            // Visualización Greedy
            iniciarVisualizacionGreedy(container, vizData);
        } else if (vizId.includes('graph-viz') || vizId.includes('dijkstra-viz')) {
            // Visualización de grafo
            iniciarVisualizacionGrafo(container, vizData);
        } else if (vizId.includes('dp-viz')) {
            // Visualización DP
            iniciarVisualizacionDP(container, vizData);
        }
    });
}

// Función para iniciar visualización de recursión
function iniciarVisualizacionRecursion(container, data) {
    const visualizer = new AlgorithmVisualizer();
    visualizer.speed = 600;
    const costs = data.costs;
    
    visualizer.steps = [];
    visualizer.generateRecursionSteps(costs, 0, 0, '');
    visualizer.currentStep = 0;
    visualizer.isPlaying = true;
    
    visualizer.renderRecursionStep = function() {
        if (this.currentStep >= this.steps.length) {
            this.isPlaying = false;
            return;
        }
        
        const step = this.steps[this.currentStep];
        const vizContainer = container.querySelector('.recursion-visualization');
        if (!vizContainer) return;
        
        let html = `
            <div class="step-indicator">
                Paso ${this.currentStep + 1} de ${this.steps.length}
            </div>
            <div class="step-content">
                <div class="step-message ${step.type}">
                    <i class="fas ${step.type === 'base' ? 'fa-flag-checkered' : step.type === 'call' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    ${step.message}
                </div>
                <div class="step-details">
                    <div class="detail-box">
                        <span class="detail-label">Índice actual:</span>
                        <span class="detail-value">${step.index}</span>
                    </div>
                    ${step.cost !== undefined ? `
                    <div class="detail-box">
                        <span class="detail-label">Costo del tramo:</span>
                        <span class="detail-value highlight">${step.cost.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    <div class="detail-box">
                        <span class="detail-label">Suma acumulada:</span>
                        <span class="detail-value highlight">${step.sum.toFixed(2)}</span>
                    </div>
                    <div class="call-stack">
                        <div class="stack-label">Pila de llamadas:</div>
                        <div class="stack-items">${step.callStack || 'inicio'}</div>
                    </div>
                </div>
            </div>
        `;
        vizContainer.innerHTML = html;
        
        if (this.isPlaying && this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            setTimeout(() => this.renderRecursionStep(), this.speed);
        }
    };
    
    visualizer.renderRecursionStep();
}

// Función para iniciar visualización Greedy
function iniciarVisualizacionGreedy(container, data) {
    console.log('🚀 Iniciando visualización Greedy', data);
    const required = data.requiredAmount;
    const sizes = data.availableSizes || [];
    const distribucion = data.distribucion || {};
    
    console.log('📊 Required:', required, 'Sizes:', sizes);
    
    const visualizer = new AlgorithmVisualizer();
    
    // Usar el nuevo animateGreedy que incluye la visualización de camiones
            const vizContainer = container.querySelector('.greedy-visualization');
    console.log('📦 VizContainer encontrado:', vizContainer);
    
    if (vizContainer) {
        console.log('✅ Llamando a animateGreedy...');
        visualizer.animateGreedy(required, sizes, vizContainer);
        } else {
        console.error('❌ No se encontró el contenedor .greedy-visualization');
    }
}

// Función para iniciar visualización de presupuesto
function iniciarVisualizacionBudget(container, data) {
    console.log('💰 Iniciando visualización de Presupuesto', data);
    
    const visualizer = new AlgorithmVisualizer();
    visualizer.animateBudgetProjects(container, data);
}

function iniciarVisualizacionGrafo(container, data) {
    const edges = data.edges || [];
    const algoritmo = data.algoritmo || 'Kruskal';
    const indexToCenter = data.indexToCenter || null;
    const svg = container.querySelector('.graph-svg');
    if (!svg) return;
    
    const visualizer = new AlgorithmVisualizer();
    
    // Dibujar el grafo inicial
    visualizer.drawGraph(edges, svg, indexToCenter);
    
    // Si hay pasos, animarlos uno por uno
    if (edges.length > 0 && algoritmo === 'Kruskal') {
        let stepIndex = 0;
        const speed = 1000;
        
        // Limpiar SVG primero
        svg.innerHTML = '';
        
        function renderNextStep() {
            if (stepIndex >= edges.length) {
                // Mostrar grafo completo al final
                visualizer.drawGraph(edges, svg, indexToCenter);
                return;
            }
            
            // Mostrar aristas hasta el paso actual
            const edgesToShow = edges.slice(0, stepIndex + 1);
            svg.innerHTML = '';
            visualizer.drawGraph(edgesToShow, svg, indexToCenter);
            
            stepIndex++;
            setTimeout(() => renderNextStep(), speed);
        }
        
        renderNextStep();
    } else {
        // Mostrar grafo completo de una vez
        visualizer.drawGraph(edges, svg, indexToCenter);
    }
}

function iniciarVisualizacionDP(container, data) {
    const table = data.tabla || [];
    const presupuesto = data.presupuesto || 0;
    const tableContainer = container.querySelector('.dp-table-container');
    if (!tableContainer || !table || table.length === 0) return;
    
    const visualizer = new AlgorithmVisualizer();
    visualizer.speed = 500;
    
    // Mostrar tabla completa directamente (es más útil verla toda)
    visualizer.renderDPTable(table, tableContainer);
    
    // Opcional: animar fila por fila si la tabla es pequeña
    if (table.length <= 10 && presupuesto <= 20) {
        let rowIndex = 0;
        const maxRows = table.length;
        
        function renderNextRow() {
            if (rowIndex >= maxRows) {
                return; // Ya terminamos
            }
            
            // Renderizar hasta la fila actual
            const partialTable = table.slice(0, rowIndex + 1);
            tableContainer.innerHTML = '';
            visualizer.renderDPTable(partialTable, tableContainer);
            
            // Agregar indicador de fila actual
            const currentTable = tableContainer.querySelector('.dp-table');
            if (currentTable && rowIndex < maxRows - 1) {
                const rows = currentTable.querySelectorAll('tbody tr');
                if (rows[rowIndex]) {
                    rows[rowIndex].style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
                    rows[rowIndex].style.transition = 'background-color 0.3s';
                }
            }
            
            rowIndex++;
            if (rowIndex < maxRows) {
                setTimeout(() => renderNextRow(), visualizer.speed);
            }
        }
        
        // Iniciar animación después de un pequeño delay
        setTimeout(() => {
            tableContainer.innerHTML = '';
            renderNextRow();
        }, 500);
    }
}

function cerrarModal() {
    document.getElementById('result-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('result-modal');
    if (event.target === modal) {
        cerrarModal();
    }
}

// Formatear resultado de recursividad para modal - Paso a paso
function formatRecursiveResultModal(data, elementId) {
    const isCost = elementId.includes('cost');
    const tipo = isCost ? 'Costo Total' : 'Distancia Total';
    const valor = isCost ? data.costoTotal : data.distanciaTotal;
    const unidad = isCost ? 'unidades monetarias' : 'kilómetros';
    
    // Usar datos reales si están disponibles, sino simular
    let valoresIndividuales;
    if (isCost && data.costosIndividuales) {
        valoresIndividuales = data.costosIndividuales;
    } else if (!isCost && data.distanciasIndividuales) {
        valoresIndividuales = data.distanciasIndividuales;
    } else {
        // Fallback: simular dividiendo el total entre tramos
    const tramos = data.numeroTramos || 5;
    const valorPorTramo = valor / tramos;
        valoresIndividuales = [];
    for (let i = 0; i < tramos; i++) {
            valoresIndividuales.push(valorPorTramo);
        }
    }
    
    const tramos = valoresIndividuales.length;
    
    // ID único para esta visualización
    const vizId = `recursion-viz-${Date.now()}`;
    
    let stepsHtml = '';
    let acumulado = 0;
    
    for (let i = 0; i < tramos; i++) {
        const valorTramo = valoresIndividuales[i];
        acumulado += valorTramo;
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${i + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${i + 1}: Procesar tramo ${i + 1}</div>
                    <div class="modal-step-description">
                        El algoritmo recursivo suma el ${tipo.toLowerCase()} del tramo actual: <strong>${valorTramo.toFixed(2)} ${unidad}</strong>
                    </div>
                    <div class="modal-step-result">
                        ${tipo} acumulado: ${acumulado.toFixed(2)} ${unidad}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Guardar datos para la visualización en un atributo
    const vizData = JSON.stringify({ costs: valoresIndividuales, tipo, valor });
    
    return `
        <!-- Visualización Paso a Paso (Full Width, Arriba) -->
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="recursion-visualization" style="min-height: 300px;"></div>
        </div>
        
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">${valor.toFixed(2)}</div>
                    <div class="modal-highlight-label">${unidad}</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-cog"></i></div>
                        <div class="modal-stat-label">Método</div>
                        <div class="modal-stat-value">${data.metodo || 'Recursivo'}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad || 'O(n)'}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-stopwatch"></i></div>
                        <div class="modal-stat-label">Tiempo</div>
                        <div class="modal-stat-value">${formatExecutionTime(data.tiempoEjecucionNanosegundos)}</div>
                    </div>
                    ${data.numeroTramos ? `
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-list"></i></div>
                        <div class="modal-stat-label">Tramos</div>
                        <div class="modal-stat-value">${data.numeroTramos}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Proceso Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
                </div>
                <div class="modal-explanation-text">
                    <p><strong>Estrategia:</strong> Algoritmo <strong>Recursivo</strong> - divide el problema en subproblemas más pequeños.</p>
                    
                    <p><strong>Con tus datos:</strong></p>
                    <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>📥 Recibiste ${tramos} tramos con ${isCost ? 'costos' : 'distancias'}: [${valoresIndividuales.map(v => v.toFixed(2)).join(', ')}]</li>
                        <li>🔄 La función se llama a sí misma para cada tramo</li>
                        <li>➕ En cada paso, suma el valor del tramo actual al acumulado</li>
                        <li>🛑 Caso base: cuando no hay más tramos, retorna 0</li>
                        <li>✅ Resultado final: <strong>${valor.toFixed(2)} ${unidad}</strong></li>
                    </ol>
                    
                    <p><strong>Ejemplo de las llamadas recursivas con tus valores:</strong></p>
                    <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.85rem;">
calcular${isCost ? 'Costo' : 'Distancia'}([${valoresIndividuales.map(v => v.toFixed(2)).join(', ')}])
  = ${valoresIndividuales[0].toFixed(2)} + calcular${isCost ? 'Costo' : 'Distancia'}([${valoresIndividuales.slice(1).map(v => v.toFixed(2)).join(', ')}])
${valoresIndividuales.length > 1 ? `  = ${valoresIndividuales[0].toFixed(2)} + ${valoresIndividuales[1].toFixed(2)} + calcular${isCost ? 'Costo' : 'Distancia'}([${valoresIndividuales.slice(2).map(v => v.toFixed(2)).join(', ')}])` : ''}
  ...
  = ${valoresIndividuales.map(v => v.toFixed(2)).join(' + ')}
  = <strong>${valor.toFixed(2)} ${unidad}</strong></pre>
                    
                    <p><strong>Complejidad:</strong> <code>O(n)</code> donde n = ${tramos} tramos. Cada tramo se procesa exactamente una vez.</p>
                </div>
            </div>
        </div>
    `;
}

// Formatear métricas combinadas para modal
function formatCombinedMetricsModal(data) {
    // Usar datos reales si están disponibles, sino simular
    let costosIndividuales, distanciasIndividuales;
    
    if (data.costosIndividuales && data.distanciasIndividuales) {
        costosIndividuales = data.costosIndividuales;
        distanciasIndividuales = data.distanciasIndividuales;
    } else {
        // Fallback: simular dividiendo el total entre tramos
        const tramos = 5;
        const costoPorTramo = data.costoTotal / tramos;
        const distanciaPorTramo = data.distanciaTotal / tramos;
        costosIndividuales = Array(tramos).fill(costoPorTramo);
        distanciasIndividuales = Array(tramos).fill(distanciaPorTramo);
    }
    
    const tramos = costosIndividuales.length;
    let stepsHtml = '';
    let costoAcum = 0;
    let distanciaAcum = 0;
    
    for (let i = 0; i < tramos; i++) {
        costoAcum += costosIndividuales[i];
        distanciaAcum += distanciasIndividuales[i];
        const costoPorKmActual = costoAcum / distanciaAcum;
        
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${i + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${i + 1}: Calcular tramo ${i + 1}</div>
                    <div class="modal-step-description">
                        Costo tramo: <strong>${costosIndividuales[i].toFixed(2)}</strong> | Distancia tramo: <strong>${distanciasIndividuales[i].toFixed(2)} km</strong>
                    </div>
                    <div class="modal-step-result">
                        Costo acum: ${costoAcum.toFixed(2)} | Distancia acum: ${distanciaAcum.toFixed(2)} km | Ratio: ${costoPorKmActual.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">${data.costoPorKm.toFixed(2)}</div>
                    <div class="modal-highlight-label">Costo por Kilómetro</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-dollar-sign"></i></div>
                        <div class="modal-stat-label">Costo Total</div>
                        <div class="modal-stat-value">${data.costoTotal.toFixed(2)}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-route"></i></div>
                        <div class="modal-stat-label">Distancia Total</div>
                        <div class="modal-stat-value">${data.distanciaTotal.toFixed(2)} km</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Cálculo Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo se Calcula?
                </div>
                <div class="modal-explanation-text">
                    <p><strong>Estrategia:</strong> Combina dos cálculos <strong>recursivos</strong> para obtener métricas de eficiencia.</p>
                    
                    <p><strong>Con tus datos:</strong></p>
                    <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>💰 Costos por tramo: [${costosIndividuales.map(c => c.toFixed(2)).join(', ')}]</li>
                        <li>📏 Distancias por tramo: [${distanciasIndividuales.map(d => d.toFixed(2)).join(', ')}] km</li>
                        <li>🔄 Se calcularon ambas métricas recursivamente en ${tramos} pasos</li>
                        <li>💰 Costo total: <strong>${data.costoTotal.toFixed(2)} unidades</strong></li>
                        <li>📏 Distancia total: <strong>${data.distanciaTotal.toFixed(2)} km</strong></li>
                        <li>➗ Se dividió costo entre distancia</li>
                        <li>✅ Resultado: <strong>${data.costoPorKm.toFixed(2)} unidades por km</strong></li>
                    </ol>
                    
                    <p><strong>Fórmula aplicada:</strong></p>
                    <pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; font-size: 0.9rem;">
Costo Total = ${costosIndividuales.map(c => c.toFixed(2)).join(' + ')} = ${data.costoTotal.toFixed(2)}
Distancia Total = ${distanciasIndividuales.map(d => d.toFixed(2)).join(' + ')} = ${data.distanciaTotal.toFixed(2)} km

Costo por Km = ${data.costoTotal.toFixed(2)} ÷ ${data.distanciaTotal.toFixed(2)} = <strong>${data.costoPorKm.toFixed(2)} unidades/km</strong></pre>
                    
                    <p><strong>¿Qué significa?</strong> Por cada kilómetro recorrido, gastas aproximadamente ${data.costoPorKm.toFixed(2)} unidades. ${data.costoPorKm < 10 ? '¡Ruta muy eficiente! 🎉' : data.costoPorKm < 20 ? 'Eficiencia moderada ✓' : 'Considera optimizar la ruta 💡'}</p>
                    
                    <p><strong>Complejidad:</strong> <code>O(n)</code> para calcular ambas métricas, donde n = ${tramos} tramos.</p>
                </div>
            </div>
        </div>
    `;
}

// Formatear comparación de rendimiento para modal
function formatCompareResultModal(data) {
    const tiempoRec = data.recursivo?.tiempoEjecucion || 0;
    const tiempoIter = data.iterativo?.tiempoEjecucion || 0;
    const diferencia = Math.abs(tiempoRec - tiempoIter);
    const masRapido = tiempoIter < tiempoRec ? 'Iterativo' : 'Recursivo';
    
    return `
        <div class="modal-result-section">
            <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="modal-stat-card">
                    <div class="modal-stat-icon"><i class="fas fa-recycle"></i></div>
                    <div class="modal-stat-label">Recursivo</div>
                    <div class="modal-stat-value">${formatExecutionTime(tiempoRec)}</div>
                    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                        Memoria: O(n) stack
                    </div>
                </div>
                <div class="modal-stat-card">
                    <div class="modal-stat-icon"><i class="fas fa-sync"></i></div>
                    <div class="modal-stat-label">Iterativo</div>
                    <div class="modal-stat-value">${formatExecutionTime(tiempoIter)}</div>
                    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                        Memoria: O(1)
                    </div>
                </div>
            </div>
            <div class="modal-stat-card" style="border-color: var(--primary-color); background: rgba(37, 99, 235, 0.15); margin-top: 2rem;">
                <div class="modal-stat-icon"><i class="fas fa-trophy"></i></div>
                <div class="modal-stat-label">Más Rápido</div>
                <div class="modal-stat-value">${masRapido}</div>
                <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                    Diferencia: ${formatExecutionTime(diferencia)}
                </div>
            </div>
        </div>
        
        <!-- Explicación a lo largo completo -->
        <div class="modal-explanation">
            <div class="modal-explanation-title">
                <i class="fas fa-lightbulb"></i> ¿Por Qué ${masRapido} es Más Rápido?
            </div>
            <div class="modal-explanation-text">
                <p><strong>Comparación de Enfoques:</strong></p>
                
                <p><strong>Con tus datos:</strong></p>
                <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <li>🔄 <strong>Recursivo:</strong> ${formatExecutionTime(tiempoRec)}
                        <ul style="margin-left: 1.5rem; margin-top: 0.3rem;">
                            <li>Se llama a sí mismo múltiples veces</li>
                            <li>Usa pila de llamadas: O(n) memoria</li>
                            <li>Overhead de crear/destruir marcos de función</li>
                        </ul>
                    </li>
                    <li>🔁 <strong>Iterativo:</strong> ${formatExecutionTime(tiempoIter)}
                        <ul style="margin-left: 1.5rem; margin-top: 0.3rem;">
                            <li>Usa un bucle simple</li>
                            <li>Solo variables locales: O(1) memoria</li>
                            <li>Sin overhead de llamadas</li>
                        </ul>
                    </li>
                    <li>⚡ <strong>Diferencia:</strong> ${formatExecutionTime(diferencia)} ${masRapido === 'Iterativo' ? '- Iterativo es más rápido' : '- Recursivo es más rápido (¡inusual!)'}</li>
                </ol>
                
                <p><strong>Complejidad Temporal:</strong> Ambos son <code>O(n)</code> - misma velocidad teórica</p>
                <p><strong>Complejidad Espacial:</strong> Recursivo O(n) vs Iterativo O(1) - Iterativo usa menos memoria</p>
                
                <p><strong>Conclusión:</strong> ${masRapido === 'Iterativo' ? 
                    '¡El iterativo ganó! Es la mejor opción para este problema en términos de tiempo y memoria.' : 
                    'Sorpresa: ¡El recursivo fue más rápido! Esto puede pasar en datasets pequeños o con optimizaciones del compilador.'}</p>
            </div>
        </div>
    `;
}

// Versiones antiguas (mantener por compatibilidad pero no se usan)
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
                    <span class="detail-value">${formatExecutionTime(data.tiempoEjecucionNanosegundos)}</span>
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
                    <span class="detail-value">${formatExecutionTime(data.tiempoEjecucionNanosegundos)}</span>
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
                        <span class="edge-connection">${edge.fromName || edge.from} → ${edge.toName || edge.to}</span>
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
            <h5><i class="fas fa-lightbulb"></i> ¿Qué hace este algoritmo?</h5>
            <p><strong>${algoritmo === 'Kruskal' ? 'Kruskal' : 'Prim'}</strong> resuelve un problema muy común en logística: <strong>¿cómo conectar todos los puntos gastando lo menos posible?</strong></p>
            <p>${algoritmo === 'Kruskal' ? 
            '<strong>Paso a paso:</strong><br>1️⃣ Ordena todas las rutas de menor a mayor costo<br>2️⃣ Empieza a agregar rutas una por una, siempre eligiendo la más barata<br>3️⃣ Solo agrega una ruta si no crea un ciclo (no vuelve a un punto ya conectado)<br>4️⃣ Para cuando todos los puntos están conectados<br><br><strong>Ejemplo práctico:</strong> Si tienes 4 ciudades y varias carreteras posibles, este algoritmo te dice cuáles construir para que todas estén conectadas y gastes menos dinero.' : 
            '<strong>Paso a paso:</strong><br>1️⃣ Empieza desde cualquier punto<br>2️⃣ Mira todas las rutas disponibles desde ese punto<br>3️⃣ Elige la ruta más barata que conecte con un punto nuevo<br>4️⃣ Repite hasta conectar todos los puntos<br><br><strong>Ejemplo práctico:</strong> Como construir una red de carreteras empezando desde una ciudad y expandiéndote siempre por el camino más económico.'}</p>
            <p><strong>Resultado:</strong> Obtienes la red de conexiones más barata posible que une todos los puntos sin crear rutas innecesarias.</p>
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
            <h5><i class="fas fa-lightbulb"></i> ¿Qué hace este algoritmo?</h5>
            <p><strong>Dijkstra</strong> resuelve un problema que todos usamos a diario: <strong>¿cuál es el camino más corto desde donde estoy hasta cualquier otro lugar?</strong></p>
            <p><strong>Paso a paso:</strong><br>
            1️⃣ Empieza desde el punto de origen (distancia = 0)<br>
            2️⃣ Explora todos los lugares a los que puedes llegar directamente desde el origen<br>
            3️⃣ Para cada lugar nuevo, calcula la distancia total desde el origen<br>
            4️⃣ Siempre elige explorar primero el lugar más cercano que aún no hayas visitado<br>
            5️⃣ Repite hasta haber encontrado el camino más corto a todos los lugares<br><br>
            <strong>Ejemplo práctico:</strong> Es como usar Google Maps. Le dices "quiero ir desde mi casa" y te muestra la distancia más corta a cada lugar posible. Si hay varios caminos, siempre elige el más rápido.</p>
            <p><strong>Resultado:</strong> Obtienes la distancia más corta desde tu punto de partida hasta cada uno de los demás puntos, y sabes exactamente cuál es el mejor camino para llegar a cada destino.</p>
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

// Funciones Modal faltantes - convertir formato antiguo a modal
function formatSortResultModal(data) {
    const centros = data.centrosOrdenados || [];
    const idsEspecificados = data.idsEspecificados;
    const filtroAplicado = idsEspecificados && idsEspecificados !== "Todos";
    
    let stepsHtml = '';
    centros.forEach((centro, index) => {
        const badgeClass = index < 3 ? 'badge-success' : (index < 7 ? 'badge-warning' : 'badge-info');
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${index + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">
                        <span class="badge ${badgeClass}">${centro.id}</span> ${centro.name}
                    </div>
                    <div class="modal-step-description">
                        ${centro.demandLevel !== undefined ? `<i class="fas fa-chart-line"></i> Demanda: <strong>${centro.demandLevel}</strong>` : ''}
                        ${centro.priority !== undefined ? `<i class="fas fa-flag"></i> Prioridad: <strong>${centro.priority}</strong>` : ''}
                        ${centro.city ? `<i class="fas fa-map-marker-alt"></i> ${centro.city}` : ''}
                    </div>
                    <div class="modal-step-result">
                        <i class="fas fa-sort-amount-down"></i> Ordenado por ${data.algoritmo === 'MergeSort' ? 'demanda' : 'prioridad'}
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">${centros.length}</div>
                    <div class="modal-highlight-label">Centros Ordenados</div>
                </div>
                
                ${filtroAplicado ? `
                <div class="modal-info-box" style="background: rgba(37, 99, 235, 0.1); border-left: 4px solid var(--primary-color); padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-filter" style="color: var(--primary-color);"></i>
                        <strong>IDs Filtrados:</strong>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                        ${Array.isArray(idsEspecificados) ? idsEspecificados.join(', ') : idsEspecificados}
                    </div>
                </div>
                ` : `
                <div class="modal-info-box" style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--success-color); padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-globe" style="color: var(--success-color);"></i>
                        <strong>Mostrando todos los centros disponibles</strong>
                    </div>
                </div>
                `}
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-sort"></i></div>
                        <div class="modal-stat-label">Algoritmo</div>
                        <div class="modal-stat-value">${data.algoritmo}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad || 'O(n log n)'}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-stopwatch"></i></div>
                        <div class="modal-stat-label">Tiempo</div>
                        <div class="modal-stat-value">${formatExecutionTime(data.tiempoEjecucionNanosegundos)}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Ordenamiento Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
                </div>
                <div class="modal-explanation-text">
                    <p><strong>Estrategia:</strong> ${data.algoritmo} utiliza <strong>Divide y Vencerás</strong>.</p>
                    
                    <p><strong>Con tus datos:</strong></p>
                    <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>📥 Recibimos <strong>${centros.length} centros</strong> ${filtroAplicado ? `(filtrados por IDs: ${Array.isArray(idsEspecificados) ? idsEspecificados.join(', ') : idsEspecificados})` : '(todos los disponibles)'}</li>
                        <li>🔀 Se dividen en subarrays más pequeños recursivamente</li>
                        <li>📊 Se ordenan por <strong>${data.algoritmo === 'MergeSort' ? 'demanda' : 'prioridad'}</strong> (${data.algoritmo === 'MergeSort' ? 'mayor a menor' : 'menor a mayor'})</li>
                        <li>🔗 Se combinan los resultados ordenados</li>
                        <li>✅ Resultado: ${centros.length > 0 ? `<strong>${centros[0].name}</strong> (${data.algoritmo === 'MergeSort' ? `Demanda: ${centros[0].demandLevel}` : `Prioridad: ${centros[0].priority}`}) quedó en 1° lugar` : ''}</li>
                    </ol>
                    
                    <p><strong>Complejidad:</strong> <code>${data.complejidad}</code> porque divide el problema log(n) veces y procesa n elementos en cada nivel.</p>
                </div>
            </div>
        </div>
    `;
}

function formatBinarySearchResultModal(data) {
    const encontrado = data.encontrado;
    const idsEspecificados = data.idsEspecificados;
    const filtroAplicado = idsEspecificados && idsEspecificados !== "Todos";
    const centrosOrdenados = data.centrosOrdenados || [];
    
    let centrosHtml = '';
    if (centrosOrdenados.length > 0) {
        centrosOrdenados.forEach((centro, index) => {
            const isFound = encontrado && index === data.indice;
            centrosHtml += `
                <div class="modal-step" style="${isFound ? 'border: 2px solid var(--success-color); background: rgba(34, 197, 94, 0.1);' : ''}">
                    <div class="modal-step-number">${index + 1}</div>
                    <div class="modal-step-content">
                        <div class="modal-step-title">
                            ${isFound ? '<i class="fas fa-star" style="color: var(--success-color);"></i> ' : ''}
                            <span class="badge ${isFound ? 'badge-success' : 'badge-info'}">${centro.id}</span> ${centro.name}
                        </div>
                        <div class="modal-step-description">
                            <i class="fas fa-chart-line"></i> Demanda: <strong>${centro.demandLevel}</strong>
                            ${centro.city ? `<i class="fas fa-map-marker-alt"></i> ${centro.city}` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    return `
        <div class="modal-result-section">
            <!-- Columna Izquierda -->
            <div class="modal-left-column">
            ${encontrado ? `
                <div class="modal-highlight-box" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                    <div class="modal-highlight-value"><i class="fas fa-check-circle"></i></div>
                    <div class="modal-highlight-label">¡Centro Encontrado!</div>
                </div>
                <div class="modal-stat-card" style="border-color: #10b981;">
                    <div class="modal-stat-icon"><i class="fas fa-building"></i></div>
                    <div class="modal-stat-label">Centro</div>
                    <div class="modal-stat-value">${data.centro.name || data.centro.id}</div>
                    <div style="margin-top: 1rem; color: var(--text-secondary);">
                            ID: ${data.centro.id} | Demanda: ${data.centro.demandLevel} | Índice: ${data.indice}
                    </div>
                </div>
            ` : `
                <div class="modal-highlight-box" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                    <div class="modal-highlight-value"><i class="fas fa-times-circle"></i></div>
                    <div class="modal-highlight-label">Centro No Encontrado</div>
                </div>
                    <div class="modal-info-box" style="background: rgba(239, 68, 68, 0.1); border-left: 4px solid var(--danger-color); padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-info-circle" style="color: var(--danger-color);"></i>
                            <strong>No se encontró ningún centro con demanda = ${data.demandaBuscada}</strong>
                        </div>
                </div>
            `}
                
                ${filtroAplicado ? `
                <div class="modal-info-box" style="background: rgba(37, 99, 235, 0.1); border-left: 4px solid var(--primary-color); padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-filter" style="color: var(--primary-color);"></i>
                        <strong>Búsqueda en IDs Específicos:</strong>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                        ${Array.isArray(idsEspecificados) ? idsEspecificados.join(', ') : idsEspecificados}
                    </div>
                </div>
                ` : `
                <div class="modal-info-box" style="background: rgba(34, 197, 94, 0.1); border-left: 4px solid var(--success-color); padding: 1rem; margin: 1rem 0; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-globe" style="color: var(--success-color);"></i>
                        <strong>Búsqueda en todos los centros disponibles</strong>
                    </div>
                </div>
                `}
                
            <div class="modal-stats-grid">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-search"></i></div>
                        <div class="modal-stat-label">Demanda Buscada</div>
                        <div class="modal-stat-value">${data.demandaBuscada}</div>
                    </div>
                <div class="modal-stat-card">
                    <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="modal-stat-label">Complejidad</div>
                    <div class="modal-stat-value">${data.complejidad || 'O(log n)'}</div>
                </div>
                <div class="modal-stat-card">
                    <div class="modal-stat-icon"><i class="fas fa-stopwatch"></i></div>
                    <div class="modal-stat-label">Tiempo</div>
                        <div class="modal-stat-value">${formatExecutionTime(data.tiempoEjecucionNanosegundos)}</div>
                </div>
            </div>
            </div>
            
            <!-- Columna Derecha: Lista de Centros Ordenados -->
            ${centrosOrdenados.length > 0 ? `
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-list"></i> Centros Ordenados por Demanda
                    </div>
                    ${centrosHtml}
                </div>
            </div>
            ` : ''}
        </div>
        
        <!-- Explicación a lo largo completo -->
        <div class="modal-explanation">
            <div class="modal-explanation-title">
                <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
            </div>
            <div class="modal-explanation-text">
                <p><strong>Estrategia:</strong> Búsqueda Binaria aprovecha que la lista está <strong>ordenada</strong>.</p>
                
                <p><strong>Con tus datos:</strong></p>
                <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                    <li>📥 Buscamos un centro con demanda = <strong>${data.demandaBuscada}</strong></li>
                    <li>📊 Tenemos <strong>${centrosOrdenados.length} centros</strong> ordenados ${filtroAplicado ? `(filtrados: ${Array.isArray(idsEspecificados) ? idsEspecificados.join(', ') : idsEspecificados})` : '(todos)'}</li>
                    <li>🎯 Miramos el centro del medio y comparamos su demanda</li>
                    <li>✂️ Si es mayor, descartamos la mitad derecha. Si es menor, descartamos la izquierda</li>
                    <li>🔄 Repetimos hasta encontrar el centro o agotar opciones</li>
                    ${encontrado ? 
                        `<li>✅ <strong>¡Encontrado!</strong> ${data.centro.name} tiene demanda ${data.centro.demandLevel} (posición ${data.indice + 1})</li>` : 
                        `<li>❌ <strong>No encontrado</strong> - Ningún centro tiene demanda = ${data.demandaBuscada}</li>`
                    }
                </ol>
                
                <p><strong>Complejidad:</strong> <code>O(log n)</code> - En lugar de revisar ${centrosOrdenados.length} centros uno por uno (O(n)), solo necesitamos revisar log₂(${centrosOrdenados.length}) ≈ ${Math.ceil(Math.log2(centrosOrdenados.length || 1))} pasos. ¡Mucho más rápido!</p>
            </div>
        </div>
    `;
}

function formatFuelDistributionModal(data) {
    const distribucion = data.distribucion || {};
    const items = Object.entries(distribucion).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    
    // Preparar datos para visualización - USAR TODOS LOS TAMAÑOS DISPONIBLES
    const requiredAmount = data.cantidadRequerida || data.totalDistribuido;
    // Obtener TODOS los tamaños disponibles de la respuesta del backend
    const availableSizes = data.tamanosDisponibles || items.map(([size]) => parseInt(size));
    
    const vizId = `greedy-viz-${Date.now()}`;
    const vizData = JSON.stringify({ requiredAmount, availableSizes, distribucion: Object.fromEntries(items) });
    
    let stepsHtml = '';
    let totalAcumulado = 0;
    let pasoNum = 1;
    
    items.forEach(([size, quantity]) => {
        const cantidadTamaño = size * quantity;
        totalAcumulado += cantidadTamaño;
        for (let i = 0; i < quantity; i++) {
            stepsHtml += `
                <div class="modal-step">
                    <div class="modal-step-number">${pasoNum}</div>
                    <div class="modal-step-content">
                        <div class="modal-step-title">Paso ${pasoNum}: Usar bidón de ${size}L</div>
                        <div class="modal-step-description">
                            El algoritmo greedy selecciona el bidón más grande disponible.
                        </div>
                        <div class="modal-step-result">
                            Total acumulado: ${totalAcumulado - (quantity - i - 1) * size}L
                        </div>
                    </div>
                </div>
            `;
            pasoNum++;
        }
    });
    
    return `
        <!-- Visualización Paso a Paso (Full Width, Arriba) -->
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="greedy-visualization" style="min-height: 300px;"></div>
        </div>
        
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">${data.totalDistribuido}L</div>
                    <div class="modal-highlight-label">Litros Distribuidos</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-box"></i></div>
                        <div class="modal-stat-label">Bidones Usados</div>
                        <div class="modal-stat-value">${data.cantidadBidonesUsados}</div>
                    </div>
                    ${data.diferencia !== undefined ? `
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-check"></i></div>
                        <div class="modal-stat-label">Diferencia</div>
                        <div class="modal-stat-value">${data.diferencia}L</div>
                    </div>
                    ` : ''}
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad || 'O(n)'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Distribución Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
                </div>
                <div class="modal-explanation-text">
                    El algoritmo <strong>Greedy</strong> (voraz) siempre elige el bidón más grande que no exceda la cantidad restante. 
                    Esta estrategia localmente óptima funciona perfectamente para este problema porque los tamaños están bien diseñados. 
                    La complejidad es <strong>O(n)</strong> donde n es el número de tamaños disponibles.
                </div>
            </div>
        </div>
    `;
}

function formatBudgetDistributionModal(data) {
    const distribucion = Object.entries(data.distribucion || {});
    let stepsHtml = '';
    let presupuestoAcum = 0;
    
    distribucion.forEach(([proyecto, cantidad], index) => {
        presupuestoAcum += cantidad;
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${index + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${index + 1}: Asignar a ${proyecto}</div>
                    <div class="modal-step-description">
                        Greedy asigna presupuesto según el ratio beneficio/costo del proyecto.
                    </div>
                    <div class="modal-step-result">
                        Asignado: $${cantidad.toFixed(2)} | Total asignado: $${presupuestoAcum.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <div class="modal-result-section">
            <!-- Visualización de Proyectos -->
            <div class="modal-visualization-container" 
                 data-viz-type="budget-projects"
                 data-viz-data='${JSON.stringify({
                     presupuestoTotal: data.presupuestoTotal || data.presupuestoAsignado + data.presupuestoRestante,
                     proyectos: data.proyectos || [],
                     distribucion: data.distribucion || {}
                 })}'>
            </div>
            
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">$${data.presupuestoAsignado.toFixed(2)}</div>
                    <div class="modal-highlight-label">Presupuesto Asignado</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-wallet"></i></div>
                        <div class="modal-stat-label">Presupuesto Restante</div>
                        <div class="modal-stat-value">$${data.presupuestoRestante.toFixed(2)}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-folder-open"></i></div>
                        <div class="modal-stat-label">Proyectos</div>
                        <div class="modal-stat-value">${distribucion.length}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Asignación Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
                </div>
                <div class="modal-explanation-text">
                    Este algoritmo utiliza <strong>Mochila Fraccional Greedy</strong>, ordenando proyectos por ratio beneficio/costo 
                    y asignando presupuesto empezando por los más eficientes. Permite asignar fracciones de proyectos cuando el presupuesto 
                    no alcanza para completarlos.
                </div>
            </div>
        </div>
    `;
}

function formatMSTResultModal(data, algoritmo) {
    const edges = data.mst || [];
    
    // Preparar datos para visualización de grafo
    const vizId = `graph-viz-${Date.now()}`;
    const vizData = JSON.stringify({ edges, algoritmo, indexToCenter: data.indexToCenter || null });
    
    let stepsHtml = '';
    let costoAcumulado = 0;
    
    edges.forEach((edge, index) => {
        costoAcumulado += edge.weight;
        const fromName = edge.fromName || `Centro ${edge.from}`;
        const toName = edge.toName || `Centro ${edge.to}`;
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${index + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${index + 1}: Agregar ruta ${fromName} → ${toName}</div>
                    <div class="modal-step-description">
                        ${algoritmo === 'Kruskal' ? 
                            'Se agrega la arista si no forma ciclo con las ya seleccionadas.' : 
                            'Se selecciona la arista de menor peso conectada a un vértice no visitado.'}
                    </div>
                    <div class="modal-step-result">
                        Peso: ${edge.weight} | Costo acumulado: $${costoAcumulado.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <!-- Visualización Paso a Paso (Full Width, Arriba) -->
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="graph-visualization" style="width: 100%; min-height: 900px; max-height: 900px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px; padding: 40px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
                <div style="margin-bottom: 15px; color: #94a3b8; font-size: 13px; text-align: center; flex-shrink: 0;">
                    <i class="fas fa-hand-pointer"></i> Arrastra los nodos para moverlos | Arrastra el fondo para navegar el grafo
                </div>
                <svg width="100%" height="100%" class="graph-svg" style="background: transparent; overflow: hidden; flex: 1; min-height: 0; max-height: 100%; box-sizing: border-box;"></svg>
            </div>
        </div>
        
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">$${data.costoTotal.toFixed(2)}</div>
                    <div class="modal-highlight-label">Costo Total MST</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-link"></i></div>
                        <div class="modal-stat-label">Aristas</div>
                        <div class="modal-stat-value">${data.numeroAristas}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Construcción Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona con tus Datos Reales?
                </div>
                <div class="modal-explanation-text">
                    <p><strong>Problema que resuelve:</strong> Imagina que tienes varias ciudades (o centros de distribución) y varias rutas posibles entre ellas, cada una con un costo diferente. Quieres conectar todas las ciudades gastando lo menos posible, sin crear rutas innecesarias.</p>
                    
                    ${data.fuente === 'neo4j-selected' ? 
                    '<p style="background: rgba(59, 130, 246, 0.1); padding: 0.75rem; border-left: 3px solid #3b82f6; margin-bottom: 1rem;"><i class="fas fa-database"></i> <strong>Datos utilizados:</strong> Se están usando centros y rutas seleccionados de tu base de datos Neo4j.<br>' + 
                    (data.centrosSeleccionados ? `<strong>Centros seleccionados:</strong> ${data.centrosSeleccionados}<br>` : '') +
                    (data.rutasSeleccionadas ? `<strong>Rutas seleccionadas:</strong> ${data.rutasSeleccionadas}</p>` : '</p>') :
                    data.fuente === 'neo4j' ? 
                    '<p style="background: rgba(59, 130, 246, 0.1); padding: 0.75rem; border-left: 3px solid #3b82f6; margin-bottom: 1rem;"><i class="fas fa-database"></i> <strong>Datos utilizados:</strong> Se están usando datos reales de tu base de datos Neo4j (centros de distribución y rutas almacenados).</p>' : 
                    '<p style="background: rgba(34, 197, 94, 0.1); padding: 0.75rem; border-left: 3px solid #22c55e; margin-bottom: 1rem;"><i class="fas fa-keyboard"></i> <strong>Datos utilizados:</strong> Se están usando los datos que ingresaste manualmente.</p>'}
                    
                    <p><strong>Con tus datos:</strong></p>
                    <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>📊 <strong>Rutas seleccionadas (solución óptima):</strong> El algoritmo encontró ${edges.length} rutas que conectan todas las ciudades con el menor costo:
                            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                                ${edges.map((e, i) => `<li>Ruta ${e.from} → ${e.to}: $${e.weight.toFixed(2)}</li>`).join('')}
                            </ul>
                        </li>
                        <li>🔄 <strong>Proceso del algoritmo ${algoritmo}:</strong>
                            ${algoritmo === 'Kruskal' ? 
                            `<ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                                <li>1️⃣ Ordena todas las rutas de menor a mayor costo</li>
                                <li>2️⃣ Empieza con la ruta más barata: ${edges[0] ? `Ruta ${edges[0].from} → ${edges[0].to} ($${edges[0].weight.toFixed(2)})` : 'N/A'}</li>
                                <li>3️⃣ Agrega la siguiente ruta más barata, pero solo si no crea un ciclo (no vuelve a una ciudad ya conectada)</li>
                                <li>4️⃣ Repite hasta que todas las ciudades estén conectadas</li>
                            </ul>` :
                            `<ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                                <li>1️⃣ Empieza desde una ciudad (por ejemplo, ciudad 0)</li>
                                <li>2️⃣ Mira todas las rutas disponibles desde esa ciudad</li>
                                <li>3️⃣ Elige la ruta más barata que conecte con una ciudad nueva</li>
                                <li>4️⃣ Repite desde las ciudades ya conectadas hasta conectar todas</li>
                            </ul>`}
                        </li>
                        <li>✅ <strong>Resultado final:</strong> Se seleccionaron ${data.numeroAristas} rutas que conectan todas las ciudades con un costo total de <strong>$${data.costoTotal.toFixed(2)}</strong></li>
                        <li>💰 <strong>Ahorro:</strong> Si hubieras conectado todas las ciudades de forma directa (sin optimizar), habrías gastado mucho más. Este algoritmo te garantiza el menor costo posible.</li>
                    </ol>
                    
                    <p><strong>Ejemplo práctico:</strong> Si las ciudades son centros de distribución y las rutas son carreteras que puedes construir, este algoritmo te dice exactamente qué carreteras construir para que todos los centros estén conectados y gastes menos dinero en construcción.</p>
                    
                    <p><strong>¿Por qué funciona?</strong> El algoritmo siempre elige la opción más barata disponible en cada paso, y evita crear ciclos (rutas que vuelven a ciudades ya conectadas), lo que garantiza que encuentres la solución óptima.</p>
                </div>
            </div>
        </div>
    `;
}

function formatDijkstraResultModal(data) {
    console.log('DEBUG formatDijkstraResultModal: data recibido:', data);
    const distances = data.distances || {};
    const entries = Object.entries(distances).filter(([k, v]) => v !== null && v !== undefined).sort((a, b) => a[1] - b[1]);
    console.log('DEBUG formatDijkstraResultModal: entries:', entries.length, entries);
    
    // Obtener información de centros
    const indexToCenter = data.indexToCenter || {};
    const centers = data.centers || [];
    const edges = data.edges || [];
    
    // Crear mapa de índice a nombre de centro
    const indexToCenterName = {};
    
    // Si indexToCenter es un objeto con strings como keys, usarlo directamente
    if (indexToCenter && Object.keys(indexToCenter).length > 0) {
        Object.entries(indexToCenter).forEach(([index, centerInfo]) => {
            const numIndex = parseInt(index);
            if (typeof centerInfo === 'object' && centerInfo !== null) {
                // Si ya tiene la estructura {id, name}
                indexToCenterName[numIndex] = centerInfo;
                indexToCenterName[index] = centerInfo; // También con string key para compatibilidad
            } else if (typeof centerInfo === 'string') {
                // Si es solo un ID, buscar el centro
                const center = centers.find(c => c.id === centerInfo);
                if (center) {
                    const centerObj = {
                        id: center.id,
                        name: center.name || center.id
                    };
                    indexToCenterName[numIndex] = centerObj;
                    indexToCenterName[index] = centerObj; // También con string key
                }
            }
        });
    } else if (centers.length > 0) {
        // Si no hay indexToCenter, crear uno basado en el orden de centers
        centers.forEach((center, index) => {
            const centerObj = {
                id: center.id,
                name: center.name || center.id
            };
            indexToCenterName[index] = centerObj;
            indexToCenterName[String(index)] = centerObj; // También con string key
        });
    }
    
    // Obtener nombre del centro origen
    const sourceIndex = data.source !== undefined && data.source !== null ? parseInt(data.source) : 0;
    
    // Intentar obtener el nombre del centro origen de varias formas
    let sourceCenterName = `Centro ${sourceIndex}`;
    let sourceCenterId = '';
    
    // Intentar con número primero, luego con string
    const sourceCenterInfo = indexToCenterName[sourceIndex] || indexToCenterName[String(sourceIndex)];
    if (sourceCenterInfo?.name) {
        sourceCenterName = sourceCenterInfo.name;
        sourceCenterId = sourceCenterInfo.id;
    } else if (data.sourceCenterName) {
        sourceCenterName = data.sourceCenterName;
        sourceCenterId = data.sourceCenterId || '';
    } else if (centers.length > sourceIndex) {
        // Si hay centros y el índice es válido, usar ese centro
        sourceCenterName = centers[sourceIndex].name || centers[sourceIndex].id;
        sourceCenterId = centers[sourceIndex].id;
    }
    
    console.log('DEBUG formatDijkstraResultModal: sourceIndex:', sourceIndex);
    console.log('DEBUG formatDijkstraResultModal: sourceCenterName:', sourceCenterName);
    console.log('DEBUG formatDijkstraResultModal: indexToCenterName:', indexToCenterName);
    console.log('DEBUG formatDijkstraResultModal: entries.length:', entries.length);
    console.log('DEBUG formatDijkstraResultModal: data.complejidad:', data.complejidad);
    
    // Preparar datos para visualización de grafo
    const vizId = `dijkstra-viz-${Date.now()}`;
    const vizData = JSON.stringify({ edges, indexToCenter: indexToCenterName, distances, source: sourceIndex });
    
    let stepsHtml = '';
    entries.forEach(([vertice, distancia], index) => {
        const verticeNum = parseInt(vertice);
        const centerInfo = indexToCenterName[verticeNum] || indexToCenterName[vertice] || null;
        const centerName = centerInfo?.name || `Centro ${vertice}`;
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${index + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${index + 1}: ${centerName}</div>
                    <div class="modal-step-description">
                        Dijkstra calcula la distancia mínima desde ${sourceCenterName} hasta ${centerName}.
                    </div>
                    <div class="modal-step-result">
                        Distancia mínima: $${distancia.toFixed(2)}
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <!-- Visualización Paso a Paso (Full Width, Arriba) -->
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="graph-visualization" style="width: 100%; min-height: 900px; max-height: 900px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px; padding: 40px; overflow: hidden; display: flex; flex-direction: column; box-sizing: border-box;">
                <div style="margin-bottom: 15px; color: #94a3b8; font-size: 13px; text-align: center; flex-shrink: 0;">
                    <i class="fas fa-hand-pointer"></i> Arrastra los nodos para moverlos | Arrastra el fondo para navegar el grafo
                </div>
                <svg width="100%" height="100%" class="graph-svg" style="background: transparent; overflow: hidden; flex: 1; min-height: 0; max-height: 100%; box-sizing: border-box;"></svg>
            </div>
        </div>
        
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">${sourceCenterName}</div>
                    <div class="modal-highlight-label">Centro de Origen</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-map-marked-alt"></i></div>
                        <div class="modal-stat-label">Centros Alcanzados</div>
                        <div class="modal-stat-value">${entries.length}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad || 'O((V + E) log V)'}</div>
                    </div>
                </div>
                
                <div class="modal-list" style="margin-top: 0;">
                    <div class="modal-list-title">Distancias Mínimas:</div>
                    ${entries.slice(0, 5).map(([vertice, distancia]) => {
                        const verticeNum = parseInt(vertice);
                        const centerInfo = indexToCenterName[verticeNum] || indexToCenterName[vertice] || null;
                        const centerName = centerInfo?.name || `Centro ${vertice}`;
                        return `
                        <div class="modal-list-item">
                            <div class="modal-list-item-number">${vertice}</div>
                            <div class="modal-list-item-content">
                                ${centerName}: $${distancia.toFixed(2)}
                            </div>
                        </div>
                    `;
                    }).join('')}
                    ${entries.length > 5 ? `<div style="color: var(--text-secondary); margin-top: 1rem;">... y ${entries.length - 5} más</div>` : ''}
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Exploración Paso a Paso
                    </div>
                    ${stepsHtml}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona con tus Datos Reales?
                </div>
                <div class="modal-explanation-text">
                    <p><strong>Problema que resuelve:</strong> Imagina que estás en ${sourceCenterName} y quieres saber cuál es la distancia más corta para llegar a cada uno de los otros centros. Es como usar Google Maps: le dices "quiero ir desde aquí" y te muestra el camino más rápido a cada destino.</p>
                    
                    ${data.fuente === 'neo4j-selected' || data.fuente === 'neo4j' ? 
                    '<p style="background: rgba(59, 130, 246, 0.1); padding: 0.75rem; border-left: 3px solid #3b82f6; margin-bottom: 1rem;"><i class="fas fa-database"></i> <strong>Datos utilizados:</strong> Se están usando datos reales de tu base de datos Neo4j (centros de distribución y rutas seleccionados).</p>' : 
                    '<p style="background: rgba(34, 197, 94, 0.1); padding: 0.75rem; border-left: 3px solid #22c55e; margin-bottom: 1rem;"><i class="fas fa-keyboard"></i> <strong>Datos utilizados:</strong> Se están usando los datos que ingresaste manualmente.</p>'}
                    
                    <p><strong>Con tus datos:</strong></p>
                    <ol style="margin-left: 1.5rem; margin-top: 0.5rem;">
                        <li>📍 <strong>Punto de partida:</strong> ${sourceCenterName} (distancia = 0, porque ya estás ahí)</li>
                        <li>🔄 <strong>Proceso del algoritmo:</strong>
                            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                                <li>1️⃣ Empieza desde ${sourceCenterName}</li>
                                <li>2️⃣ Explora todos los centros a los que puedes llegar directamente desde ${sourceCenterName}</li>
                                <li>3️⃣ Para cada centro nuevo, calcula la distancia total desde ${sourceCenterName}</li>
                                <li>4️⃣ Siempre elige explorar primero el centro más cercano que aún no hayas visitado</li>
                                <li>5️⃣ Repite hasta haber encontrado el camino más corto a todos los centros</li>
                            </ul>
                        </li>
                        <li>📊 <strong>Resultados obtenidos:</strong>
                            <ul style="margin-top: 0.5rem; margin-left: 1.5rem;">
                                ${entries.slice(0, 5).map(([v, d]) => {
                                    const vNum = parseInt(v);
                                    const centerInfo = indexToCenterName[vNum] || indexToCenterName[v] || null;
                                    const centerName = centerInfo?.name || `Centro ${v}`;
                                    return `<li>Desde ${sourceCenterName} hasta ${centerName}: <strong>$${d.toFixed(2)}</strong>${vNum == sourceIndex ? ' (estás aquí)' : ''}</li>`;
                                }).join('')}
                                ${entries.length > 5 ? `<li>... y ${entries.length - 5} centros más</li>` : ''}
                            </ul>
                        </li>
                    </ol>
                    
                    <p><strong>Ejemplo práctico:</strong> Es como usar Google Maps. Le dices "quiero ir desde mi casa" y te muestra la distancia más corta a cada lugar posible. Si hay varios caminos, siempre elige el más rápido.</p>
                    
                    <p><strong>Uso en logística:</strong> Esto es perfecto para planificar rutas de entrega, calcular tiempos de viaje, o decidir qué centro usar como base para distribuir mercancía a otros centros.</p>
                </div>
            </div>
        </div>
    `;
}

function formatKnapsackResultModal(data) {
    const proyectos = data.proyectosSeleccionados || [];
    
    // Preparar datos para visualización de tabla DP
    const tablaDP = data.tablaDP || null;
    const vizId = `dp-viz-${Date.now()}`;
    const vizData = JSON.stringify({ 
        tabla: tablaDP, 
        presupuesto: data.presupuestoInicial || 0,
        proyectos: proyectos.length 
    });
    
    let stepsHtml = '';
    let costoAcumulado = 0;
    let beneficioAcumulado = 0;
    
    proyectos.forEach((proyecto, index) => {
        // Simular costo y beneficio del proyecto (en un caso real vendría en los datos)
        costoAcumulado += 100; // Valor simulado
        beneficioAcumulado += 150; // Valor simulado
        
        stepsHtml += `
            <div class="modal-step">
                <div class="modal-step-number">${index + 1}</div>
                <div class="modal-step-content">
                    <div class="modal-step-title">Paso ${index + 1}: Seleccionar ${proyecto}</div>
                    <div class="modal-step-description">
                        DP evalúa si incluir este proyecto maximiza el beneficio total.
                    </div>
                    <div class="modal-step-result">
                        Beneficio acumulado: $${beneficioAcumulado} | Costo: $${costoAcumulado}
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <!-- Visualización Paso a Paso (Full Width, Arriba) -->
        ${tablaDP ? `
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="dp-visualization" style="min-height: 400px;">
                <div class="dp-table-container"></div>
            </div>
        </div>
        ` : ''}
        
        <div class="modal-result-section">
            <!-- Columna Izquierda: Resultado Principal -->
            <div class="modal-left-column">
                <div class="modal-highlight-box">
                    <div class="modal-highlight-value">$${data.beneficioTotal}</div>
                    <div class="modal-highlight-label">Beneficio Total Máximo</div>
                </div>
                
                <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-dollar-sign"></i></div>
                        <div class="modal-stat-label">Costo Total</div>
                        <div class="modal-stat-value">$${data.costoTotal}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-wallet"></i></div>
                        <div class="modal-stat-label">Restante</div>
                        <div class="modal-stat-value">$${data.presupuestoRestante}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-list"></i></div>
                        <div class="modal-stat-label">Proyectos</div>
                        <div class="modal-stat-value">${proyectos.length}</div>
                    </div>
                    <div class="modal-stat-card">
                        <div class="modal-stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="modal-stat-label">Complejidad</div>
                        <div class="modal-stat-value">${data.complejidad}</div>
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Paso a Paso -->
            <div class="modal-right-column">
                <div class="modal-steps-section">
                    <div class="modal-steps-title">
                        <i class="fas fa-steps"></i> Selección Paso a Paso
                    </div>
                    ${stepsHtml || '<div style="color: var(--text-secondary); text-align: center; padding: 2rem;">Los proyectos seleccionados se muestran en la lista de la izquierda</div>'}
                </div>
            </div>
            
            <!-- Explicación a lo largo completo -->
            <div class="modal-explanation">
                <div class="modal-explanation-title">
                    <i class="fas fa-lightbulb"></i> ¿Cómo Funciona?
                </div>
                <div class="modal-explanation-text">
                    La <strong>Programación Dinámica</strong> resuelve el problema de la mochila 0/1 construyendo una tabla donde 
                    dp[i][w] representa el máximo beneficio usando los primeros i proyectos con presupuesto w. La solución óptima se 
                    encuentra al considerar todas las combinaciones posibles. Complejidad <strong>O(n × P)</strong> garantiza encontrar la 
                    solución globalmente óptima.
                </div>
            </div>
        </div>
    `;
}

function formatKnapsackComparisonModal(data) {
    const dp = data.programacionDinamica || {};
    const greedy = data.greedy || {};
    const diferencia = data.diferenciaBeneficio || 0;
    const mejor = diferencia > 0 ? 'DP' : diferencia < 0 ? 'Greedy' : 'Empate';
    
    // Preparar datos para visualización comparativa
    const beneficioDP = dp.beneficioTotal || 0;
    const beneficioGreedy = greedy.beneficioTotal || 0;
    const maxBeneficio = Math.max(beneficioDP, beneficioGreedy, 1);
    const porcentajeDP = (beneficioDP / maxBeneficio) * 100;
    const porcentajeGreedy = (beneficioGreedy / maxBeneficio) * 100;
    
    const proyectosDP = dp.proyectosSeleccionados || [];
    const proyectosGreedy = greedy.proyectosSeleccionados || [];
    
    const vizId = `comparison-viz-${Date.now()}`;
    const vizData = JSON.stringify({ 
        beneficioDP, 
        beneficioGreedy, 
        porcentajeDP, 
        porcentajeGreedy,
        proyectosDP,
        proyectosGreedy,
        diferencia
    });
    
    return `
        <div class="modal-result-section">
            <div class="modal-stats-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div class="modal-stat-card" style="border-color: var(--primary-color); background: rgba(37, 99, 235, 0.15);">
                    <div class="modal-stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="modal-stat-label">Programación Dinámica</div>
                    <div class="modal-stat-value">$${beneficioDP}</div>
                    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                        Costo: $${dp.costoTotal || 0}<br>
                        Proyectos: ${proyectosDP.length}
                    </div>
                </div>
                <div class="modal-stat-card">
                    <div class="modal-stat-icon"><i class="fas fa-fire"></i></div>
                    <div class="modal-stat-label">Greedy</div>
                    <div class="modal-stat-value">$${beneficioGreedy}</div>
                    <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                        Costo: $${greedy.costoTotal || 0}<br>
                        Proyectos: ${proyectosGreedy.length}
                    </div>
                </div>
            </div>
            <div class="modal-stat-card" style="margin-top: 2rem; border-color: ${mejor === 'DP' ? 'var(--success-color)' : mejor === 'Greedy' ? 'var(--warning-color)' : 'var(--text-secondary)'}; background: ${mejor === 'DP' ? 'rgba(16, 185, 129, 0.15)' : mejor === 'Greedy' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(107, 114, 128, 0.15)'};">
                <div class="modal-stat-icon"><i class="fas fa-trophy"></i></div>
                <div class="modal-stat-label">Mejor Estrategia</div>
                <div class="modal-stat-value">${data.mejorEstrategia || mejor === 'DP' ? 'Programación Dinámica' : mejor === 'Greedy' ? 'Greedy' : 'Empate'}</div>
                <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                    Diferencia: $${Math.abs(diferencia)}
                </div>
            </div>
        </div>
        
        <!-- Visualización Comparativa (Full Width, Arriba de la Explicación) -->
        <div class="modal-visualization-container" id="${vizId}" data-viz-data='${vizData}'>
            <div class="comparison-visualization">
                <!-- Gráfico de barras comparativo -->
                <div class="comparison-chart">
                    <div class="chart-title">Comparación de Beneficios</div>
                    <div class="bars-container">
                        <div class="bar-group">
                            <div class="bar-label">DP</div>
                            <div class="bar-wrapper">
                                <div class="bar bar-dp" style="width: ${porcentajeDP}%;">
                                    <span class="bar-value">$${beneficioDP}</span>
                                </div>
                            </div>
                            <div class="bar-percentage">${porcentajeDP.toFixed(1)}%</div>
                        </div>
                        <div class="bar-group">
                            <div class="bar-label">Greedy</div>
                            <div class="bar-wrapper">
                                <div class="bar bar-greedy" style="width: ${porcentajeGreedy}%;">
                                    <span class="bar-value">$${beneficioGreedy}</span>
                                </div>
                            </div>
                            <div class="bar-percentage">${porcentajeGreedy.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
                
                <!-- Proyectos seleccionados por cada algoritmo -->
                <div class="projects-comparison">
                    <div class="projects-side">
                        <div class="projects-header dp-header">
                            <i class="fas fa-chart-line"></i> Proyectos Seleccionados por DP
                        </div>
                        <div class="projects-list">
                            ${proyectosDP.length > 0 ? proyectosDP.map(p => `
                                <div class="project-chip chip-dp">
                                    <i class="fas fa-check-circle"></i> ${p}
                                </div>
                            `).join('') : '<div class="no-projects">Ninguno</div>'}
                        </div>
                    </div>
                    <div class="vs-divider">
                        <div class="vs-circle">VS</div>
                    </div>
                    <div class="projects-side">
                        <div class="projects-header greedy-header">
                            <i class="fas fa-fire"></i> Proyectos Seleccionados por Greedy
                        </div>
                        <div class="projects-list">
                            ${proyectosGreedy.length > 0 ? proyectosGreedy.map(p => `
                                <div class="project-chip chip-greedy">
                                    <i class="fas fa-check-circle"></i> ${p}
                                </div>
                            `).join('') : '<div class="no-projects">Ninguno</div>'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Explicación a lo largo completo -->
        <div class="modal-explanation">
            <div class="modal-explanation-title">
                <i class="fas fa-lightbulb"></i> ¿Por Qué?
            </div>
            <div class="modal-explanation-text">
                <strong>Programación Dinámica</strong> siempre encuentra la solución óptima garantizada porque explora todas las 
                combinaciones posibles. <strong>Greedy</strong> es más rápido pero puede fallar al elegir localmente lo mejor sin considerar 
                el impacto global. Esta comparación muestra por qué DP es preferible para problemas donde se requiere la solución óptima.
            </div>
        </div>
    `;
}

function formatGenericResultModal(data) {
    let html = '<div class="modal-result-section">';
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            html += `<div class="modal-list-item"><div class="modal-list-item-content"><strong>${key}:</strong> ${formatValue(value)}</div></div>`;
        } else {
            html += `<div class="modal-list-item"><div class="modal-list-item-content"><strong>${key}:</strong> ${formatValue(value)}</div></div>`;
        }
    }
    html += '</div>';
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
        
         // Si es el módulo de grafos, cargar datos de Neo4j automáticamente
         if (moduleName === 'graphs') {
             cargarDatosNeo4jKruskal();
             cargarDatosNeo4jDijkstra();
         }
    });
});

// ==================== MÓDULO 1: RECURSIVIDAD ====================

let rutasRecursividadData = [];

// Cargar rutas al inicializar
document.addEventListener('DOMContentLoaded', function() {
    const recursiveTab = document.querySelector('[data-module="recursive"]');
    if (recursiveTab) {
        recursiveTab.addEventListener('click', function() {
            setTimeout(cargarRutasRecursividad, 200);
        });
    }
    
    // Si ya estamos en el módulo recursive al cargar
    setTimeout(function() {
        const moduleRecursive = document.getElementById('module-recursive');
        if (moduleRecursive && moduleRecursive.classList.contains('active')) {
            cargarRutasRecursividad();
        }
    }, 500);
});

async function cargarRutasRecursividad() {
    const containers = [
        'cost-routes-container',
        'distance-routes-container',
        'combined-routes-container',
        'compare-routes-container'
    ];
    
    const loadings = [
        'cost-routes-loading',
        'distance-routes-loading',
        'combined-routes-loading',
        'compare-routes-loading'
    ];
    
    // Mostrar loading
    loadings.forEach(id => {
        const loading = document.getElementById(id);
        if (loading) {
            loading.style.display = 'block';
            loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando rutas desde Neo4j...';
        }
    });
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) container.style.display = 'none';
    });
    
    try {
        const response = await fetch(`${API_BASE}/neo4j/data`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const rutas = Array.isArray(data.rutas) ? data.rutas : [];
        
        if (rutas.length === 0) {
            loadings.forEach(id => {
                const loading = document.getElementById(id);
                if (loading) {
                    loading.innerHTML = `
                        <div style="color: var(--warning-color); padding: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i> No se encontraron rutas en Neo4j.
                        </div>
                    `;
                }
            });
            return;
        }
        
        rutasRecursividadData = rutas;
        
        // Mostrar rutas en todos los contenedores
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            rutas.forEach(ruta => {
                const item = document.createElement('div');
                item.className = 'selectable-item';
                item.dataset.id = ruta.id || '';
                item.dataset.cost = ruta.cost || 0;
                item.dataset.distance = ruta.distance || 0;
                item.textContent = `${ruta.name || ruta.id} - Costo: $${ruta.cost} - Distancia: ${ruta.distance}km`;
                item.onclick = () => item.classList.toggle('selected');
                container.appendChild(item);
            });
            
            container.style.display = 'flex';
        });
        
        // Ocultar loading
        loadings.forEach(id => {
            const loading = document.getElementById(id);
            if (loading) loading.style.display = 'none';
        });
        
    } catch (error) {
        loadings.forEach(id => {
            const loading = document.getElementById(id);
            if (loading) {
                loading.innerHTML = `
                    <div style="color: var(--danger-color); padding: 1rem;">
                        <i class="fas fa-times-circle"></i> Error: ${error.message}
                    </div>
                `;
            }
        });
    }
}

function obtenerRutasSeleccionadas(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];
    
    const selectedItems = container.querySelectorAll('.selectable-item.selected');
    return Array.from(selectedItems).map(item => ({
        id: item.dataset.id,
        cost: parseFloat(item.dataset.cost),
        distance: parseFloat(item.dataset.distance)
    }));
}

async function calcularCostoTotal() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('cost-routes-container');
    
    if (rutasSeleccionadas.length === 0) {
        showResult('cost-result', { error: '⚠️ Por favor selecciona al menos una ruta' });
        return;
    }
    
    const costs = rutasSeleccionadas.map(r => r.cost);
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recursive-metrics/costo-total`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs })
        });
        
        const data = await response.json();
        data.rutasUsadas = rutasSeleccionadas.length;
        data.rutasDetalle = rutasSeleccionadas.map(r => `${r.id}: $${r.cost}`).join(', ');
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
    if (type === 'kruskal') {
        if (kruskalEdges.length === 0) {
            alert('Agrega rutas primero');
            return;
        }
        visualizer.visualizeGraph(kruskalEdges, 'kruskal-viz');
    } else if (type === 'dijkstra') {
        verVisualizacionGrafoDijkstra();
    }
}

async function verTablaDP() {
    const presupuesto = parseInt(document.getElementById('knapsack-budget').value);
    
    if (proyectosMochila.length === 0) {
        alert('Agrega proyectos primero');
        return;
    }
    
    const request = {
        proyectos: proyectosMochila,
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
    const rutasSeleccionadas = obtenerRutasSeleccionadas('distance-routes-container');
    
    if (rutasSeleccionadas.length === 0) {
        showResult('distance-result', { error: '⚠️ Por favor selecciona al menos una ruta' });
        return;
    }
    
    const distances = rutasSeleccionadas.map(r => r.distance);
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recursive-metrics/distancia-total`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distances })
        });
        
        const data = await response.json();
        data.rutasUsadas = rutasSeleccionadas.length;
        data.rutasDetalle = rutasSeleccionadas.map(r => `${r.id}: ${r.distance}km`).join(', ');
        showResult('distance-result', data);
    } catch (error) {
        showResult('distance-result', { error: 'Error al calcular: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function calcularMetricasCombinadas() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('combined-routes-container');
    
    if (rutasSeleccionadas.length === 0) {
        showResult('combined-result', { error: '⚠️ Por favor selecciona al menos una ruta' });
        return;
    }
    
    const costs = rutasSeleccionadas.map(r => r.cost);
    const distances = rutasSeleccionadas.map(r => r.distance);
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recursive-metrics/metricas-combinadas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs, distances })
        });
        
        const data = await response.json();
        data.rutasUsadas = rutasSeleccionadas.length;
        data.rutasDetalle = rutasSeleccionadas.map(r => `${r.id}: $${r.cost} / ${r.distance}km`).join(', ');
        showResult('combined-result', data);
    } catch (error) {
        showResult('combined-result', { error: 'Error al calcular: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function compararRendimiento() {
    const rutasSeleccionadas = obtenerRutasSeleccionadas('compare-routes-container');
    
    if (rutasSeleccionadas.length === 0) {
        showResult('compare-result', { error: '⚠️ Por favor selecciona al menos una ruta' });
        return;
    }
    
    const costs = rutasSeleccionadas.map(r => r.cost);
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/recursive-metrics/comparar-rendimiento`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ costs })
        });
        
        const data = await response.json();
        data.rutasUsadas = rutasSeleccionadas.length;
        data.rutasDetalle = rutasSeleccionadas.map(r => `${r.id}: $${r.cost}`).join(', ');
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

// ==================== SELECCIÓN PERSONALIZADA DE CAMIONES ====================
let todosLosCamionesGreedy = [];
let camionesSeleccionadosGreedy = new Set();
let filtroActualGreedy = 'todos';

// Cargar camiones cuando se activa el módulo Greedy
document.addEventListener('DOMContentLoaded', function() {
    // Cargar camiones cuando se hace clic en el tab de Greedy
    const greedyTab = document.querySelector('[data-module="greedy"]');
    if (greedyTab) {
        greedyTab.addEventListener('click', function() {
            setTimeout(cargarCamionesGreedy, 200);
        });
    }
    
    // Si ya estamos en el módulo Greedy al cargar la página, cargar camiones
    setTimeout(function() {
        const moduleGreedy = document.getElementById('module-greedy');
        if (moduleGreedy && moduleGreedy.classList.contains('active')) {
            cargarCamionesGreedy();
        }
    }, 500);
});

async function cargarCamionesGreedy() {
    const container = document.getElementById('fuel-trucks-container');
    const loading = document.getElementById('fuel-trucks-loading');
    
    if (!container || !loading) {
        console.log('No se encontraron los elementos del contenedor');
        return;
    }
    
    loading.style.display = 'block';
    container.style.display = 'none';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando camiones desde Neo4j...';
    
    try {
        // Usar el endpoint existente que ya funciona (igual que grafos)
        console.log('Cargando datos desde:', `${API_BASE}/neo4j/data`);
        const response = await fetch(`${API_BASE}/neo4j/data`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        // Extraer camiones del objeto de respuesta
        const camiones = Array.isArray(data.camiones) ? data.camiones : [];
        console.log('Total camiones cargados:', camiones.length);
        
        if (camiones.length === 0) {
            loading.innerHTML = `
                <div style="color: var(--warning-color); padding: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i> No se encontraron camiones en Neo4j.<br>
                    <small>Verifica que los datos estén cargados en la base de datos.</small><br>
                    <small style="margin-top: 0.5rem; display: block;">Ejecuta: neo4j-cargar-datos-masivo.cypher</small>
                </div>
            `;
            return;
        }
        
        // Calcular información adicional para cada camión
        todosLosCamionesGreedy = camiones.map(camion => {
            const fuelPercentage = camion.fuelCapacity > 0 
                ? (camion.currentFuel / camion.fuelCapacity) * 100 
                : 0;
            const fuelNeeded = camion.fuelCapacity - camion.currentFuel;
            
            return {
                ...camion,
                fuelPercentage: fuelPercentage,
                fuelNeeded: fuelNeeded > 0 ? fuelNeeded : 0
            };
        });
        
        console.log('Camiones procesados:', todosLosCamionesGreedy);
        
        actualizarContadoresGreedy();
        mostrarCamionesGreedy(todosLosCamionesGreedy);
        
        loading.style.display = 'none';
        container.style.display = 'grid';
    } catch (error) {
        console.error('Error al cargar camiones:', error);
        loading.innerHTML = `
            <div style="color: var(--danger-color); padding: 1rem;">
                <i class="fas fa-times-circle"></i> <strong>Error al cargar camiones</strong><br>
                <small>${error.message}</small><br>
                <small style="margin-top: 0.5rem; display: block;">
                    Verifica que Spring Boot esté ejecutándose y que Neo4j esté conectado.
                </small>
            </div>
        `;
    }
}

function mostrarCamionesGreedy(camiones) {
    const container = document.getElementById('fuel-trucks-container');
    if (!container) return;
    
    if (!camiones || camiones.length === 0) {
        container.innerHTML = '<div class="loading-placeholder">No hay camiones disponibles</div>';
        return;
    }
    
    container.innerHTML = camiones.map(camion => {
        const selected = camionesSeleccionadosGreedy.has(camion.id);
        const porcentaje = camion.fuelPercentage || 0;
        const fuelClass = getFuelClassGreedy(porcentaje);
        const statusClass = getStatusClassGreedy(camion.status);
        
        return `
            <div class="selectable-truck-card ${selected ? 'selected' : ''}" 
                 id="truck-card-greedy-${camion.id}"
                 onclick="toggleSelectionGreedy('${camion.id}')">
                <input type="checkbox" 
                       class="truck-checkbox-small" 
                       id="check-greedy-${camion.id}"
                       ${selected ? 'checked' : ''}
                       onclick="event.stopPropagation(); toggleSelectionGreedy('${camion.id}')">
                
                <div class="truck-card-header">
                    <div class="truck-id-small">${camion.id}</div>
                    <div class="truck-plate-small">${camion.licensePlate}</div>
                </div>
                
                <div class="truck-info-row">
                    <span>💧 Combustible:</span>
                    <strong>${camion.currentFuel}L / ${camion.fuelCapacity}L</strong>
                </div>
                
                <div class="truck-info-row">
                    <span>🔧 Necesita:</span>
                    <strong style="color: var(--danger-color);">${camion.fuelNeeded || 0}L</strong>
                </div>
                
                <div class="truck-fuel-bar">
                    <div class="truck-fuel-fill ${fuelClass}" style="width: ${porcentaje}%">
                        ${porcentaje.toFixed(0)}%
                    </div>
                </div>
                
                <div class="truck-badge badge-${statusClass}">
                    ${getStatusTextGreedy(camion.status)}
                </div>
            </div>
        `;
    }).join('');
}

function toggleSelectionGreedy(truckId) {
    if (camionesSeleccionadosGreedy.has(truckId)) {
        camionesSeleccionadosGreedy.delete(truckId);
    } else {
        camionesSeleccionadosGreedy.add(truckId);
    }
    actualizarInterfazGreedy();
}

function seleccionarTodosCamionesGreedy() {
    const camionesVisibles = filtrarCamionesPorFiltroGreedy(todosLosCamionesGreedy, filtroActualGreedy);
    camionesVisibles.forEach(c => camionesSeleccionadosGreedy.add(c.id));
    actualizarInterfazGreedy();
}

function limpiarSeleccionCamionesGreedy() {
    camionesSeleccionadosGreedy.clear();
    actualizarInterfazGreedy();
}

function actualizarInterfazGreedy() {
    // Actualizar tarjetas
    todosLosCamionesGreedy.forEach(camion => {
        const card = document.getElementById(`truck-card-greedy-${camion.id}`);
        const check = document.getElementById(`check-greedy-${camion.id}`);
        
        if (card && check) {
            if (camionesSeleccionadosGreedy.has(camion.id)) {
                card.classList.add('selected');
                check.checked = true;
            } else {
                card.classList.remove('selected');
                check.checked = false;
            }
        }
    });
    
    actualizarResumenGreedy();
}

function actualizarResumenGreedy() {
    const summary = document.getElementById('fuel-selection-summary');
    const btnDistribuir = document.getElementById('btn-fuel-distribuir');
    const count = camionesSeleccionadosGreedy.size;
    
    if (!summary || !btnDistribuir) return;
    
    if (count === 0) {
        summary.style.display = 'none';
        btnDistribuir.disabled = true;
        return;
    }
    
    summary.style.display = 'flex';
    btnDistribuir.disabled = false;
    
    let combustibleNecesario = 0;
    camionesSeleccionadosGreedy.forEach(id => {
        const camion = todosLosCamionesGreedy.find(c => c.id === id);
        if (camion) {
            combustibleNecesario += camion.fuelNeeded || 0;
        }
    });
    
    document.getElementById('fuel-selected-count').textContent = count;
    document.getElementById('fuel-needed-total').textContent = combustibleNecesario;
}

function actualizarContadoresGreedy() {
    const available = todosLosCamionesGreedy.filter(c => c.status === 'AVAILABLE').length;
    const bajoCombustible = todosLosCamionesGreedy.filter(c => (c.fuelPercentage || 0) < 30).length;
    
    document.getElementById('greedy-count-todos').textContent = todosLosCamionesGreedy.length;
    document.getElementById('greedy-count-available').textContent = available;
    document.getElementById('greedy-count-bajo').textContent = bajoCombustible;
}

function filtrarCamionesGreedy(filtro) {
    filtroActualGreedy = filtro;
    
    // Actualizar botones activos
    document.querySelectorAll('.btn-filter-small').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const camionesFiltrados = filtrarCamionesPorFiltroGreedy(todosLosCamionesGreedy, filtro);
    mostrarCamionesGreedy(camionesFiltrados);
}

function filtrarCamionesPorFiltroGreedy(camiones, filtro) {
    switch(filtro) {
        case 'available':
            return camiones.filter(c => c.status === 'AVAILABLE');
        case 'bajo':
            return camiones.filter(c => (c.fuelPercentage || 0) < 30);
        default:
            return camiones;
    }
}

async function distribuirCombustiblePersonalizado() {
    if (camionesSeleccionadosGreedy.size === 0) {
        showResult('fuel-result', { error: '⚠️ Por favor selecciona al menos un camión' });
        return;
    }
    
    const combustible = parseInt(document.getElementById('fuel-amount').value);
    if (!combustible || combustible <= 0) {
        showResult('fuel-result', { error: '⚠️ Por favor ingresa una cantidad válida de combustible' });
        return;
    }
    
    showLoading();
    try {
        // Calcular distribución usando algoritmo Greedy localmente
        const camionesSeleccionados = [];
        camionesSeleccionadosGreedy.forEach(id => {
            const camion = todosLosCamionesGreedy.find(c => c.id === id);
            if (camion) {
                camionesSeleccionados.push({
                    ...camion,
                    necesidad: camion.fuelNeeded || 0
                });
            }
        });
        
        // Ordenar por menor porcentaje de combustible (Greedy)
        camionesSeleccionados.sort((a, b) => {
            const porcentajeA = (a.currentFuel / a.fuelCapacity) * 100;
            const porcentajeB = (b.currentFuel / b.fuelCapacity) * 100;
            return porcentajeA - porcentajeB;
        });
        
        // Distribuir combustible
        let combustibleRestante = combustible;
        let totalAsignado = 0;
        let camionesLlenos = 0;
        const asignacion = {};
        const camionesDetalle = [];
        
        camionesSeleccionados.forEach(camion => {
            let cantidadAsignada = 0;
            
            if (combustibleRestante > 0 && camion.necesidad > 0) {
                cantidadAsignada = Math.min(camion.necesidad, combustibleRestante);
                combustibleRestante -= cantidadAsignada;
                totalAsignado += cantidadAsignada;
                
                if (cantidadAsignada === camion.necesidad) {
                    camionesLlenos++;
                }
            } else if (camion.necesidad === 0) {
                camionesLlenos++;
            }
            
            asignacion[camion.id] = cantidadAsignada;
            
            const combustibleFinal = camion.currentFuel + cantidadAsignada;
            const porcentajeFinal = (combustibleFinal / camion.fuelCapacity) * 100;
            
            camionesDetalle.push({
                truckId: camion.id,
                licensePlate: camion.licensePlate,
                capacidadTotal: camion.fuelCapacity,
                combustibleActual: camion.currentFuel,
                necesidad: camion.necesidad,
                combustibleAsignado: cantidadAsignada,
                combustibleFinal: combustibleFinal,
                porcentajeFinal: porcentajeFinal
            });
        });
        
        const data = {
            asignacion: asignacion,
            totalCamionesSeleccionados: camionesSeleccionados.length,
            camionesLlenos: camionesLlenos,
            combustibleDisponible: combustible,
            combustibleAsignado: totalAsignado,
            combustibleRestante: combustibleRestante,
            camionesDetalle: camionesDetalle,
            algoritmo: 'Greedy - Distribución Personalizada',
            estrategia: 'Prioriza camiones seleccionados con menor porcentaje de combustible'
        };
        
        showResultFuelPersonalizado(data);
    } catch (error) {
        showResult('fuel-result', { error: 'Error: ' + error.message });
    } finally {
        hideLoading();
    }
}

function showResultFuelPersonalizado(data) {
    // Layout principal: Grid de 2 columnas
    let html = '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">';
    
    // ===== COLUMNA IZQUIERDA: CAMIONES =====
    html += '<div>';
    html += '<h3 style="margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">';
    html += '<i class="fas fa-truck"></i> Camiones Seleccionados';
    html += '</h3>';
    html += '<div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 400px; overflow-y: auto; padding-right: 0.5rem;">';
    
    data.camionesDetalle.forEach(camion => {
        const porcentaje = camion.porcentajeFinal.toFixed(1);
        const fuelClass = getFuelClassGreedy(porcentaje);
        const porcentajeInicial = ((camion.combustibleActual / camion.capacidadTotal) * 100).toFixed(1);
        
        html += `
            <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; border: 2px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">${camion.truckId}</div>
                    <div style="background: var(--primary-color); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">${camion.licensePlate}</div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin: 0.25rem 0;">
                    <span style="color: var(--text-secondary);">Antes:</span>
                    <strong>${camion.combustibleActual}L (${porcentajeInicial}%)</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin: 0.25rem 0;">
                    <span style="color: var(--text-secondary);">Ahora:</span>
                    <strong style="color: var(--success-color);">${camion.combustibleFinal}L (${porcentaje}%)</strong>
                </div>
                <div style="height: 18px; background: var(--dark-bg); border-radius: 9px; overflow: hidden; margin-top: 0.5rem;">
                    <div class="truck-fuel-fill ${fuelClass}" style="width: ${porcentaje}%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700;">
                        ${porcentaje}%
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += '</div>'; // Fin columna izquierda
    
    // ===== COLUMNA DERECHA: ASIGNACIÓN PASO A PASO =====
    html += '<div>';
    html += '<h3 style="margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">';
    html += '<i class="fas fa-list-ol"></i> Asignación Paso a Paso';
    html += '</h3>';
    html += '<div style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem;">';
    
    // Generar pasos basados en el orden de asignación
    let pasoNum = 1;
    let combustibleRestante = data.combustibleDisponible;
    
    data.camionesDetalle.forEach(camion => {
        if (camion.combustibleAsignado > 0) {
            html += `
                <div style="background: var(--card-bg); padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem; border-left: 4px solid var(--primary-color);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <div style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem;">
                            ${pasoNum}
                        </div>
                        <div style="font-weight: 600; color: var(--text-primary);">Asignar a ${camion.truckId}</div>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-left: 2.5rem;">
                        Greedy asigna combustible al camión con menor nivel.
                    </div>
                    <div style="background: var(--dark-bg); padding: 0.75rem; border-radius: 6px; margin-top: 0.5rem; margin-left: 2.5rem; font-size: 0.85rem;">
                        <div style="color: var(--primary-color); margin-bottom: 0.25rem;">
                            <strong>Asignado:</strong> ${camion.combustibleAsignado}L | 
                            <strong>Total asignado:</strong> ${data.combustibleDisponible - combustibleRestante + camion.combustibleAsignado}L
                        </div>
                    </div>
                </div>
            `;
            combustibleRestante -= camion.combustibleAsignado;
            pasoNum++;
        }
    });
    
    html += '</div>';
    html += '</div>'; // Fin columna derecha
    
    html += '</div>'; // Fin grid principal
    
    // ===== ESTADÍSTICAS DE COMBUSTIBLE =====
    html += '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem;">';
    
    html += `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">
                <i class="fas fa-oil-can"></i> Combustible Disponible
            </div>
            <div style="font-size: 2.5rem; font-weight: 700;">
                ${data.combustibleDisponible}L
            </div>
        </div>
    `;
    
    html += `
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1.5rem; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">
                <i class="fas fa-check-circle"></i> Combustible Asignado
            </div>
            <div style="font-size: 2.5rem; font-weight: 700;">
                ${data.combustibleAsignado}L
            </div>
        </div>
    `;
    
    html += `
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 10px; text-align: center; color: white;">
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">
                <i class="fas fa-battery-half"></i> Combustible Restante
            </div>
            <div style="font-size: 2.5rem; font-weight: 700;">
                ${data.combustibleRestante}L
            </div>
        </div>
    `;
    
    html += '</div>';
    
    // ===== ¿CÓMO FUNCIONA EL ALGORITMO? =====
    html += '<div style="margin-top: 2rem; background: rgba(102, 126, 234, 0.1); padding: 1.5rem; border-radius: 10px; border-left: 4px solid var(--primary-color);">';
    html += '<h3 style="margin-bottom: 1rem; color: var(--primary-color); display: flex; align-items: center; gap: 0.5rem;">';
    html += '<i class="fas fa-brain"></i> ¿Cómo Funciona el Algoritmo?';
    html += '</h3>';
    html += '<div style="color: var(--text-primary); line-height: 1.8; font-size: 0.95rem;">';
    html += '<p style="margin-bottom: 0.75rem;"><strong>Algoritmo Greedy</strong> - Estrategia de decisiones locales óptimas para distribución de recursos.</p>';
    html += '<p style="margin-bottom: 0.5rem;"><strong>Objetivo:</strong> Distribuir combustible priorizando los camiones con menor nivel de combustible actual.</p>';
    html += '</div>';
    html += '</div>';
    
    // ===== PASO A PASO DETALLADO =====
    html += '<div style="margin-top: 1.5rem; background: var(--card-bg); padding: 1.5rem; border-radius: 10px;">';
    html += '<h3 style="margin-bottom: 1rem; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">';
    html += '<i class="fas fa-clipboard-list"></i> Paso a Paso Detallado del Algoritmo';
    html += '</h3>';
    html += '<div style="display: flex; flex-direction: column; gap: 1rem;">';
    
    // Paso 1
    html += `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="background: var(--primary-color); color: white; min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                1
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Obtener camiones seleccionados</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Se obtienen los ${data.totalCamionesSeleccionados} camiones que seleccionaste de la base de datos Neo4j con su información de combustible actual.</div>
            </div>
        </div>
    `;
    
    // Paso 2
    html += `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="background: var(--primary-color); color: white; min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                2
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Calcular necesidad de combustible</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Para cada camión se calcula: <code style="background: var(--dark-bg); padding: 2px 6px; border-radius: 3px;">necesidad = capacidad - combustibleActual</code></div>
            </div>
        </div>
    `;
    
    // Paso 3
    html += `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="background: var(--primary-color); color: white; min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                3
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Ordenar por prioridad (Greedy)</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Se ordenan los camiones de <strong>menor a mayor porcentaje</strong> de combustible. Los más vacíos tienen mayor prioridad.</div>
            </div>
        </div>
    `;
    
    // Paso 4
    html += `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="background: var(--primary-color); color: white; min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                4
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Asignar combustible secuencialmente</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Para cada camión (en orden de prioridad), asignar: <code style="background: var(--dark-bg); padding: 2px 6px; border-radius: 3px;">min(necesidad, combustibleRestante)</code></div>
            </div>
        </div>
    `;
    
    // Paso 5
    html += `
        <div style="display: flex; gap: 1rem; align-items: start;">
            <div style="background: var(--success-color); color: white; min-width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem;">
                ✓
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--success-color); margin-bottom: 0.25rem;">Resultado Final</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">Se distribuyeron <strong>${data.combustibleAsignado}L</strong> entre ${data.totalCamionesSeleccionados} camiones, dejando <strong>${data.camionesLlenos} camiones llenos</strong> al 100%.</div>
            </div>
        </div>
    `;
    
    html += '</div>'; // Fin pasos detallados
    html += '</div>'; // Fin sección paso a paso
    
    // Complejidad
    html += '<div style="margin-top: 1rem; padding: 1rem; background: var(--dark-bg); border-radius: 8px; text-align: center; color: var(--text-secondary); font-size: 0.9rem;">';
    html += '<i class="fas fa-clock"></i> <strong>Complejidad:</strong> O(n log n) donde n = número de camiones seleccionados';
    html += '</div>';
    
    // Mostrar en el modal
    mostrarModal('🚛 Distribución de Combustible - Algoritmo Greedy', html);
}

function getFuelClassGreedy(percentage) {
    if (percentage >= 90) return 'fuel-full';
    if (percentage >= 60) return 'fuel-high';
    if (percentage >= 30) return 'fuel-medium';
    return 'fuel-low';
}

function getStatusClassGreedy(status) {
    switch(status) {
        case 'AVAILABLE': return 'available';
        case 'IN_TRANSIT': return 'transit';
        case 'MAINTENANCE': return 'maintenance';
        default: return 'available';
    }
}

function getStatusTextGreedy(status) {
    switch(status) {
        case 'AVAILABLE': return '✅ Disponible';
        case 'IN_TRANSIT': return '🚚 En Tránsito';
        case 'MAINTENANCE': return '🔧 Mantenimiento';
        default: return status;
    }
}

async function distribuirPresupuesto() {
    // Validar que haya proyectos agregados
        if (proyectosBudget.length === 0) {
        showResult('budget-result', { 
            error: '⚠️ Por favor agrega al menos un proyecto antes de distribuir el presupuesto' 
        });
        return;
    }
    
    const presupuestoTotal = parseFloat(document.getElementById('budget-total').value);
    
    // Validar presupuesto
    if (!presupuestoTotal || presupuestoTotal <= 0) {
        showResult('budget-result', { 
            error: '⚠️ Por favor ingresa un presupuesto válido mayor a 0' 
        });
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/greedy/distribuir-presupuesto?presupuestoTotal=${presupuestoTotal}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proyectosBudget)
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

// Almacenar rutas agregadas
let kruskalEdges = [];
let dijkstraEdges = {};

// Agregar ruta para Kruskal
function agregarRutaKruskal() {
    const from = parseInt(document.getElementById('edge-from').value);
    const to = parseInt(document.getElementById('edge-to').value);
    const weight = parseFloat(document.getElementById('edge-weight').value);
    
    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const ruta = { from, to, weight };
    kruskalEdges.push(ruta);
    
    actualizarListaRutasKruskal();
    
    // Limpiar inputs
    document.getElementById('edge-from').value = '';
    document.getElementById('edge-to').value = '';
    document.getElementById('edge-weight').value = '';
}

function actualizarListaRutasKruskal() {
    const container = document.getElementById('rutas-agregadas');
    if (kruskalEdges.length === 0) {
        container.innerHTML = '<div class="no-rutas">No hay rutas agregadas</div>';
        return;
    }
    
    let html = '<div class="rutas-header">Rutas agregadas:</div>';
    kruskalEdges.forEach((ruta, index) => {
        html += `
            <div class="ruta-item">
                <span class="ruta-info">${ruta.from} → ${ruta.to} (Peso: ${ruta.weight})</span>
                <button class="btn-remove" onclick="eliminarRutaKruskal(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function eliminarRutaKruskal(index) {
    kruskalEdges.splice(index, 1);
    actualizarListaRutasKruskal();
}

// Agregar ruta para Dijkstra
function agregarRutaDijkstra() {
    const from = parseInt(document.getElementById('dijkstra-from').value);
    const to = parseInt(document.getElementById('dijkstra-to').value);
    const weight = parseFloat(document.getElementById('dijkstra-weight').value);
    
    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    if (!dijkstraEdges[from]) {
        dijkstraEdges[from] = [];
    }
    
    dijkstraEdges[from].push([to, weight]);
    
    actualizarListaRutasDijkstra();
    
    // Limpiar inputs
    document.getElementById('dijkstra-from').value = '';
    document.getElementById('dijkstra-to').value = '';
    document.getElementById('dijkstra-weight').value = '';
}

function actualizarListaRutasDijkstra() {
    const container = document.getElementById('dijkstra-rutas-agregadas');
    const totalRutas = Object.values(dijkstraEdges).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalRutas === 0) {
        container.innerHTML = '<div class="no-rutas">No hay conexiones agregadas</div>';
        return;
    }
    
    let html = '<div class="rutas-header">Conexiones agregadas:</div>';
    Object.keys(dijkstraEdges).forEach(from => {
        dijkstraEdges[from].forEach(([to, weight], idx) => {
            const fullIndex = Object.keys(dijkstraEdges).indexOf(from) * 1000 + idx;
            html += `
                <div class="ruta-item">
                    <span class="ruta-info">${from} → ${to} (Distancia: ${weight})</span>
                    <button class="btn-remove" onclick="eliminarRutaDijkstra(${from}, ${idx})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        });
    });
    container.innerHTML = html;
}

function eliminarRutaDijkstra(from, idx) {
    if (dijkstraEdges[from]) {
        dijkstraEdges[from].splice(idx, 1);
        if (dijkstraEdges[from].length === 0) {
            delete dijkstraEdges[from];
        }
    }
    actualizarListaRutasDijkstra();
}

// Almacenar datos cargados
let kruskalCentersData = [];
let kruskalRoutesData = [];
let dijkstraCentersData = [];
let dijkstraRoutesData = [];

// Cargar datos de Neo4j para Kruskal usando el endpoint existente
async function cargarDatosNeo4jKruskal() {
    const centersLoading = document.getElementById('kruskal-centers-loading');
    const routesLoading = document.getElementById('kruskal-routes-loading');
    const centersContainer = document.getElementById('kruskal-centers-container');
    const routesContainer = document.getElementById('kruskal-routes-container');
    
    // Mostrar spinners
    centersLoading.style.display = 'flex';
    routesLoading.style.display = 'flex';
    centersContainer.innerHTML = '<div class="loading-placeholder">Cargando centros...</div>';
    routesContainer.innerHTML = '<div class="loading-placeholder">Cargando rutas...</div>';
    
    try {
        // Usar el endpoint existente que ya funciona
        const response = await fetch(`${API_BASE}/neo4j/data`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en respuesta de Neo4j:', errorText);
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        // Verificar si hay error en la respuesta
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Extraer centros y rutas del objeto de respuesta
        const centers = Array.isArray(data.centros) ? data.centros : [];
        const routes = Array.isArray(data.rutas) ? data.rutas : [];
        
        console.log('DEBUG: Centros cargados:', centers.length);
        console.log('DEBUG: Rutas cargadas:', routes.length);
        console.log('DEBUG: Primera ruta ejemplo:', routes[0]);
        if (routes.length > 0) {
            console.log('DEBUG: Primera ruta fromCenter:', routes[0].fromCenter, 'toCenter:', routes[0].toCenter);
        }
        
        // Guardar datos para uso posterior
        kruskalCentersData = centers;
        kruskalRoutesData = routes;
        
        // Crear cards seleccionables para centros
        centersContainer.innerHTML = '';
        if (centers.length === 0) {
            centersContainer.innerHTML = '<div class="loading-placeholder">No hay centros disponibles</div>';
        } else {
            centers.forEach(center => {
                const item = document.createElement('div');
                item.className = 'selectable-item';
                item.dataset.id = center.id || '';
                item.textContent = center.name || 'Sin nombre';
                item.onclick = () => toggleSelection(item, 'center');
                centersContainer.appendChild(item);
            });
        }
        
        // Crear cards seleccionables para rutas
        routesContainer.innerHTML = '';
        if (routes.length === 0) {
            routesContainer.innerHTML = '<div class="loading-placeholder">No hay rutas disponibles</div>';
        } else {
            routes.forEach(route => {
                const item = document.createElement('div');
                item.className = 'selectable-item';
                item.dataset.id = route.id || '';
                item.textContent = route.name || route.id || 'Sin nombre';
                item.onclick = () => toggleSelection(item, 'route');
                routesContainer.appendChild(item);
            });
        }
        
        // Seleccionar todos por defecto
        centersContainer.querySelectorAll('.selectable-item').forEach(item => {
            item.classList.add('selected');
        });
        routesContainer.querySelectorAll('.selectable-item').forEach(item => {
            item.classList.add('selected');
        });
        
    } catch (error) {
        console.error('Error cargando datos de Neo4j:', error);
        console.error('Detalles del error:', error.stack);
        alert('Error al cargar datos de Neo4j: ' + error.message);
        centersContainer.innerHTML = '<div class="loading-placeholder">Error al cargar centros</div>';
        routesContainer.innerHTML = '<div class="loading-placeholder">Error al cargar rutas</div>';
    } finally {
        // Ocultar spinners
        centersLoading.style.display = 'none';
        routesLoading.style.display = 'none';
    }
}

// Toggle selección de items
function toggleSelection(item, type) {
    item.classList.toggle('selected');
}

// Obtener IDs seleccionados
function getSelectedCenters() {
    const container = document.getElementById('kruskal-centers-container');
    return Array.from(container.querySelectorAll('.selectable-item.selected'))
        .map(item => item.dataset.id)
        .filter(id => id);
}

function getSelectedRoutes() {
    const container = document.getElementById('kruskal-routes-container');
    return Array.from(container.querySelectorAll('.selectable-item.selected'))
        .map(item => item.dataset.id)
        .filter(id => id);
}

async function calcularKruskal() {
    showLoading();
    try {
        // Obtener selecciones de los items seleccionables
        const selectedCenterIds = getSelectedCenters();
        const selectedRouteIds = getSelectedRoutes();
        
        if (selectedCenterIds.length === 0) {
            alert('Por favor selecciona al menos un centro de distribución');
            hideLoading();
            return;
        }
        
        if (selectedRouteIds.length === 0) {
            alert('Por favor selecciona al menos una ruta');
            hideLoading();
            return;
        }
        
        // Usar los datos ya cargados
        if (kruskalCentersData.length === 0 || kruskalRoutesData.length === 0) {
            // Si no hay datos cargados, cargarlos ahora
            await cargarDatosNeo4jKruskal();
        }
        
        // Filtrar centros y rutas seleccionados
        const selectedCenters = kruskalCentersData.filter(c => selectedCenterIds.includes(c.id));
        const selectedRoutes = kruskalRoutesData.filter(r => selectedRouteIds.includes(r.id));
        
        // Crear mapa de ID de centro a índice
        const centerToIndex = new Map();
        // Crear mapa inverso de índice a información del centro
        const indexToCenter = new Map();
        selectedCenters.forEach((center, index) => {
            centerToIndex.set(center.id, index);
            indexToCenter.set(index, {
                id: center.id,
                name: center.name || center.id
            });
        });
        
        // Construir aristas del grafo
        const edges = [];
        const selectedCenterIdSet = new Set(selectedCenterIds);
        
        selectedRoutes.forEach(route => {
            const fromId = route.fromCenter || route.fromCenterId;
            const toId = route.toCenter || route.toCenterId;
            
            // Solo agregar si ambos centros están seleccionados
            if (fromId && toId && selectedCenterIdSet.has(fromId) && selectedCenterIdSet.has(toId)) {
                if (centerToIndex.has(fromId) && centerToIndex.has(toId)) {
                    const fromIndex = centerToIndex.get(fromId);
                    const toIndex = centerToIndex.get(toId);
                    const weight = route.cost || route.distance || 0;
                    
                    // Evitar aristas duplicadas (grafo no dirigido)
                    const edgeExists = edges.some(e => 
                        (e.from === fromIndex && e.to === toIndex) || 
                        (e.from === toIndex && e.to === fromIndex)
                    );
                    
                    if (!edgeExists && fromIndex !== toIndex) {
                        edges.push({
                            from: fromIndex,
                            to: toIndex,
                            weight: weight
                        });
                    }
                }
            }
        });
        
        console.log('DEBUG: Centros seleccionados IDs:', selectedCenterIds);
        console.log('DEBUG: Rutas procesadas:', selectedRoutes.length);
        console.log('DEBUG: Primera ruta seleccionada:', selectedRoutes[0]);
        if (selectedRoutes.length > 0) {
            console.log('DEBUG: Primera ruta fromCenter:', selectedRoutes[0].fromCenter, 'toCenter:', selectedRoutes[0].toCenter);
        }
        const rutasValidas = selectedRoutes.filter(r => {
            const fromId = r.fromCenter || r.fromCenterId;
            const toId = r.toCenter || r.toCenterId;
            return fromId && toId && selectedCenterIdSet.has(fromId) && selectedCenterIdSet.has(toId);
        });
        console.log('DEBUG: Rutas con fromCenter/toCenter válidos:', rutasValidas.length);
        if (rutasValidas.length > 0) {
            console.log('DEBUG: Ejemplo de ruta válida:', rutasValidas[0]);
        }
        
        if (edges.length === 0) {
            alert('No hay rutas que conecten los centros seleccionados. Por favor selecciona rutas que conecten los centros elegidos.\n\nCentros seleccionados: ' + selectedCenters.length + '\nRutas seleccionadas: ' + selectedRoutes.length);
            hideLoading();
            return;
        }
        
        console.log('Centros seleccionados:', selectedCenters.length);
        console.log('Rutas seleccionadas:', selectedRoutes.length);
        console.log('Aristas construidas:', edges.length);
        console.log('Request:', { vertices: selectedCenters.length, edges: edges });
        
        // Construir request para el endpoint existente
        const request = {
            vertices: selectedCenters.length,
            edges: edges
        };
        
        const response = await fetch(`${API_BASE}/graphs/kruskal/mst`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en respuesta del servidor:', errorText);
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        
        // Verificar si hay error en la respuesta
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Agregar información sobre la fuente
        data.fuente = 'neo4j-selected';
        data.centrosSeleccionados = selectedCenters.length;
        data.rutasSeleccionadas = selectedRoutes.length;
        
        // Agregar mapeo de índices a centros para mostrar nombres reales
        data.indexToCenter = Object.fromEntries(indexToCenter);
        
        // Convertir índices a nombres de centros en las aristas del MST
        if (data.mst && Array.isArray(data.mst)) {
            data.mst = data.mst.map(edge => ({
                ...edge,
                fromName: indexToCenter.get(edge.from)?.name || `Centro ${edge.from}`,
                toName: indexToCenter.get(edge.to)?.name || `Centro ${edge.to}`,
                fromId: indexToCenter.get(edge.from)?.id || `DC${edge.from}`,
                toId: indexToCenter.get(edge.to)?.id || `DC${edge.to}`
            }));
        }
        
        // Mostrar resultado en el contenedor
        const resultContainer = document.getElementById('kruskal-result');
        if (resultContainer) {
            resultContainer.innerHTML = formatMSTResult(data, 'Kruskal');
        }
        
        // También mostrar en modal
        showResult('kruskal-result', data, true);
    } catch (error) {
        console.error('Error completo:', error);
        const errorMessage = error.message || 'Error desconocido al calcular MST';
        alert('Error: ' + errorMessage);
        
        const resultContainer = document.getElementById('kruskal-result');
        if (resultContainer) {
            resultContainer.innerHTML = `<div class="error-box">Error: ${errorMessage}</div>`;
        }
    } finally {
        hideLoading();
    }
}

// Cargar datos de Neo4j para Dijkstra
async function cargarDatosNeo4jDijkstra() {
    const centersLoading = document.getElementById('dijkstra-centers-loading');
    const routesLoading = document.getElementById('dijkstra-routes-loading');
    const centersContainer = document.getElementById('dijkstra-centers-container');
    const routesContainer = document.getElementById('dijkstra-routes-container');
    const sourceSelect = document.getElementById('dijkstra-source-select');
    
    if (!centersContainer || !routesContainer) return;
    
    // Mostrar spinners
    if (centersLoading) centersLoading.style.display = 'flex';
    if (routesLoading) routesLoading.style.display = 'flex';
    centersContainer.innerHTML = '<div class="loading-placeholder">Cargando centros...</div>';
    routesContainer.innerHTML = '<div class="loading-placeholder">Cargando rutas...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/neo4j/data`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error en respuesta de Neo4j:', errorText);
            throw new Error(`Error HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        const centers = Array.isArray(data.centros) ? data.centros : [];
        const routes = Array.isArray(data.rutas) ? data.rutas : [];
        
        console.log('DEBUG Dijkstra: Centros cargados:', centers.length);
        console.log('DEBUG Dijkstra: Rutas cargadas:', routes.length);
        
        // Guardar datos
        dijkstraCentersData = centers;
        dijkstraRoutesData = routes;
        
        // Crear cards seleccionables para centros
        centersContainer.innerHTML = '';
        if (centers.length === 0) {
            centersContainer.innerHTML = '<div class="loading-placeholder">No hay centros disponibles</div>';
        } else {
            centers.forEach(center => {
                const item = document.createElement('div');
                item.className = 'selectable-item selected';
                item.dataset.id = center.id || '';
                item.textContent = center.name || center.id || 'Sin nombre';
                item.onclick = () => toggleSelectionDijkstra(item, 'center');
                centersContainer.appendChild(item);
            });
        }
        
        // Crear cards seleccionables para rutas
        routesContainer.innerHTML = '';
        if (routes.length === 0) {
            routesContainer.innerHTML = '<div class="loading-placeholder">No hay rutas disponibles</div>';
        } else {
            routes.forEach(route => {
                const item = document.createElement('div');
                item.className = 'selectable-item selected';
                item.dataset.id = route.id || '';
                item.textContent = route.name || route.id || 'Sin nombre';
                item.onclick = () => toggleSelectionDijkstra(item, 'route');
                routesContainer.appendChild(item);
            });
        }
        
        // Actualizar select de origen
        if (sourceSelect) {
            sourceSelect.innerHTML = '<option value="">Selecciona un centro de origen</option>';
            centers.forEach(center => {
                const option = document.createElement('option');
                option.value = center.id || '';
                option.textContent = center.name || center.id || 'Sin nombre';
                sourceSelect.appendChild(option);
            });
            // Seleccionar el primer centro por defecto
            if (centers.length > 0) {
                sourceSelect.value = centers[0].id || '';
            }
        }
        
        // Ocultar spinners
        if (centersLoading) centersLoading.style.display = 'none';
        if (routesLoading) routesLoading.style.display = 'none';
        
    } catch (error) {
        console.error('Error al cargar datos de Neo4j para Dijkstra:', error);
        centersContainer.innerHTML = `<div class="error-message">Error al cargar datos: ${error.message}</div>`;
        routesContainer.innerHTML = `<div class="error-message">Error al cargar datos: ${error.message}</div>`;
        if (centersLoading) centersLoading.style.display = 'none';
        if (routesLoading) routesLoading.style.display = 'none';
    }
}

// Toggle selección para Dijkstra
function toggleSelectionDijkstra(item, type) {
    item.classList.toggle('selected');
    
    // Actualizar select de origen si es necesario
    if (type === 'center') {
        const sourceSelect = document.getElementById('dijkstra-source-select');
        if (sourceSelect) {
            const centerId = item.dataset.id;
            const option = sourceSelect.querySelector(`option[value="${centerId}"]`);
            if (option) {
                if (item.classList.contains('selected')) {
                    option.disabled = false;
                } else {
                    option.disabled = true;
                    // Si el origen seleccionado fue deseleccionado, limpiar selección
                    if (sourceSelect.value === centerId) {
                        sourceSelect.value = '';
                    }
                }
            }
        }
    }
}

// Obtener centros seleccionados para Dijkstra
function getSelectedDijkstraCenters() {
    const container = document.getElementById('dijkstra-centers-container');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.selectable-item.selected'))
        .map(item => item.dataset.id)
        .filter(id => id);
}

// Obtener rutas seleccionadas para Dijkstra
function getSelectedDijkstraRoutes() {
    const container = document.getElementById('dijkstra-routes-container');
    if (!container) return [];
    return Array.from(container.querySelectorAll('.selectable-item.selected'))
        .map(item => item.dataset.id)
        .filter(id => id);
}

async function calcularDijkstra() {
    showLoading();
    try {
        // Obtener selecciones
        const selectedCenterIds = getSelectedDijkstraCenters();
        const selectedRouteIds = getSelectedDijkstraRoutes();
        const sourceCenterId = document.getElementById('dijkstra-source-select')?.value || '';
        
        if (selectedCenterIds.length === 0) {
            alert('Por favor, selecciona al menos un centro');
            hideLoading();
            return;
        }
        
        if (!sourceCenterId) {
            alert('Por favor, selecciona un centro de origen');
            hideLoading();
            return;
        }
        
        if (!selectedCenterIds.includes(sourceCenterId)) {
            alert('El centro de origen debe estar seleccionado en la lista de centros');
            hideLoading();
            return;
        }
        
        // Si no hay datos cargados, cargarlos primero
        if (dijkstraCentersData.length === 0 || dijkstraRoutesData.length === 0) {
            await cargarDatosNeo4jDijkstra();
        }
        
        // Filtrar rutas que conecten los centros seleccionados
        const validRoutes = dijkstraRoutesData.filter(route => {
            const fromCenter = route.fromCenter;
            const toCenter = route.toCenter;
            return fromCenter && toCenter && 
                   fromCenter !== 'N/A' && toCenter !== 'N/A' &&
                   selectedCenterIds.includes(fromCenter) && 
                   selectedCenterIds.includes(toCenter) &&
                   selectedRouteIds.includes(route.id);
        });
        
        console.log('DEBUG Dijkstra: Centros seleccionados:', selectedCenterIds.length);
        console.log('DEBUG Dijkstra: Rutas válidas:', validRoutes.length);
        
        if (validRoutes.length === 0) {
            alert('No hay rutas que conecten los centros seleccionados. Por favor, selecciona más rutas o centros.');
            hideLoading();
            return;
        }
        
        // Construir lista de adyacencia
        const selectedCenters = dijkstraCentersData.filter(c => selectedCenterIds.includes(c.id));
        const selectedRoutes = dijkstraRoutesData.filter(r => selectedRouteIds.includes(r.id));
        
        // Crear mapa de ID de centro a índice
        const centerToIndex = new Map();
        const indexToCenter = new Map();
        selectedCenters.forEach((center, index) => {
            centerToIndex.set(center.id, index);
            indexToCenter.set(index, {
                id: center.id,
                name: center.name || center.id
            });
        });
        
        // Construir lista de adyacencia
        const adjacencyList = {};
        const selectedCenterIdSet = new Set(selectedCenterIds);
        
        selectedRoutes.forEach(route => {
            const fromId = route.fromCenter || route.fromCenterId;
            const toId = route.toCenter || route.toCenterId;
            
            if (fromId && toId && selectedCenterIdSet.has(fromId) && selectedCenterIdSet.has(toId)) {
                if (centerToIndex.has(fromId) && centerToIndex.has(toId)) {
                    const fromIndex = centerToIndex.get(fromId);
                    const toIndex = centerToIndex.get(toId);
                    const weight = route.cost || route.distance || 0;
                    
                    if (!adjacencyList[fromIndex]) {
                        adjacencyList[fromIndex] = [];
                    }
                    adjacencyList[fromIndex].push([toIndex, weight]);
                }
            }
        });
        
        // Obtener índice del centro origen
        const source = centerToIndex.get(sourceCenterId);
        if (source === undefined) {
            alert('El centro de origen no está en la lista de centros seleccionados');
            hideLoading();
            return;
        }
        
        // Llamar al endpoint con selección
        const response = await fetch(`${API_BASE}/graphs/dijkstra/distances/selected`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                selectedCenters: selectedCenterIds,
                selectedRoutes: selectedRouteIds,
                sourceCenterId: sourceCenterId
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('DEBUG Dijkstra: Respuesta del servidor:', data);
        console.log('DEBUG Dijkstra: source recibido:', data.source);
        console.log('DEBUG Dijkstra: selectedCenters:', selectedCenters.length);
        console.log('DEBUG Dijkstra: indexToCenter Map:', Array.from(indexToCenter.entries()));
        
        // Agregar información de centros para la visualización
        data.centers = selectedCenters;
        data.routes = selectedRoutes;
        data.indexToCenter = Object.fromEntries(indexToCenter);
        data.sourceCenterId = sourceCenterId;
        
        // Agregar nombre del centro origen para mostrar en el modal
        const sourceCenter = selectedCenters.find(c => c.id === sourceCenterId);
        if (sourceCenter) {
            data.sourceCenterName = sourceCenter.name || sourceCenter.id;
        }
        
        // Asegurar que source sea un número
        if (data.source !== undefined && data.source !== null) {
            data.source = parseInt(data.source);
        } else {
            data.source = source;
        }
        
        console.log('DEBUG Dijkstra: data después de procesar:', {
            source: data.source,
            sourceCenterName: data.sourceCenterName,
            indexToCenter: data.indexToCenter,
            centers: data.centers.length
        });
        
        // Construir aristas para visualización
        const edges = [];
        selectedRoutes.forEach(route => {
            const fromId = route.fromCenter || route.fromCenterId;
            const toId = route.toCenter || route.toCenterId;
            if (fromId && toId && centerToIndex.has(fromId) && centerToIndex.has(toId)) {
                const fromIndex = centerToIndex.get(fromId);
                const toIndex = centerToIndex.get(toId);
                const weight = route.cost || route.distance || 0;
                edges.push({ from: fromIndex, to: toIndex, weight: weight });
            }
        });
        data.edges = edges;
        
        showResult('dijkstra-result', data, true);
    } catch (error) {
        console.error('Error al calcular Dijkstra:', error);
        hideLoading();
        // Mostrar error directamente sin abrir el modal
        const resultDiv = document.getElementById('dijkstra-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="error-message" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 8px; color: #ef4444;">
                    <i class="fas fa-exclamation-circle"></i> 
                    <strong>Error:</strong> ${error.message}
                    <br><br>
                    <small>Por favor, asegúrate de que el servidor esté corriendo y reiniciado con los últimos cambios.</small>
                </div>
            `;
        }
    }
}

function verVisualizacionGrafoDijkstra() {
    const vertices = parseInt(document.getElementById('dijkstra-vertices').value) || 5;
    const edges = [];
    
    for (const [from, connections] of Object.entries(dijkstraEdges)) {
        connections.forEach(([to, weight]) => {
            edges.push({ from: parseInt(from), to, weight });
        });
    }
    
    if (edges.length > 0) {
        visualizer.visualizeGraph(edges, 'dijkstra-viz');
    }
}

// ==================== MÓDULO 5: PROGRAMACIÓN DINÁMICA ====================

// Almacenar proyectos
let proyectosMochila = [];
let proyectosBudget = [];

// Agregar proyecto para mochila
function agregarProyectoMochila() {
    const nombre = document.getElementById('knapsack-project-name').value.trim();
    const costo = parseInt(document.getElementById('knapsack-project-costo').value);
    const beneficio = parseInt(document.getElementById('knapsack-project-beneficio').value);
    
    if (!nombre || isNaN(costo) || isNaN(beneficio)) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const proyecto = { nombre, costo, beneficio };
    proyectosMochila.push(proyecto);
    
    actualizarListaProyectosMochila();
    
    // Limpiar inputs
    document.getElementById('knapsack-project-name').value = '';
    document.getElementById('knapsack-project-costo').value = '';
    document.getElementById('knapsack-project-beneficio').value = '';
}

function actualizarListaProyectosMochila() {
    const container = document.getElementById('knapsack-proyectos-agregados');
    if (proyectosMochila.length === 0) {
        container.innerHTML = '<div class="no-rutas">No hay proyectos agregados</div>';
        return;
    }
    
    let html = '<div class="rutas-header">Proyectos agregados:</div>';
    proyectosMochila.forEach((proyecto, index) => {
        const ratio = (proyecto.beneficio / proyecto.costo).toFixed(2);
        html += `
            <div class="ruta-item">
                <div class="proyecto-info">
                    <div class="proyecto-nombre"><strong>${proyecto.nombre}</strong></div>
                    <div class="proyecto-detalles">
                        Costo: $${proyecto.costo} | Beneficio: $${proyecto.beneficio} | Ratio: ${ratio}
                    </div>
                </div>
                <button class="btn-remove" onclick="eliminarProyectoMochila(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function eliminarProyectoMochila(index) {
    proyectosMochila.splice(index, 1);
    actualizarListaProyectosMochila();
}

// Agregar proyecto para budget (Greedy)
function agregarProyecto() {
    const nombre = document.getElementById('project-name').value.trim();
    const costo = parseFloat(document.getElementById('project-costo').value);
    const beneficio = parseFloat(document.getElementById('project-beneficio').value);
    
    if (!nombre || isNaN(costo) || isNaN(beneficio)) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const proyecto = { nombre, costo, beneficio };
    proyectosBudget.push(proyecto);
    
    actualizarListaProyectos();
    
    // Limpiar inputs
    document.getElementById('project-name').value = '';
    document.getElementById('project-costo').value = '';
    document.getElementById('project-beneficio').value = '';
}

function actualizarListaProyectos() {
    const container = document.getElementById('proyectos-agregados');
    if (proyectosBudget.length === 0) {
        container.innerHTML = '<div class="no-rutas">No hay proyectos agregados</div>';
        return;
    }
    
    let html = '<div class="rutas-header">Proyectos agregados:</div>';
    proyectosBudget.forEach((proyecto, index) => {
        const ratio = (proyecto.beneficio / proyecto.costo).toFixed(2);
        html += `
            <div class="ruta-item">
                <div class="proyecto-info">
                    <div class="proyecto-nombre"><strong>${proyecto.nombre}</strong></div>
                    <div class="proyecto-detalles">
                        Costo: $${proyecto.costo} | Beneficio: $${proyecto.beneficio} | Ratio: ${ratio}
                    </div>
                </div>
                <button class="btn-remove" onclick="eliminarProyecto(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function eliminarProyecto(index) {
    proyectosBudget.splice(index, 1);
    actualizarListaProyectos();
}

async function resolverMochila() {
    // Validar que se hayan agregado proyectos
    if (proyectosMochila.length === 0) {
        showResult('knapsack-result', { 
            error: '⚠️ Por favor agrega al menos un proyecto antes de resolver el problema de la mochila'
        });
        return;
    }
    
    const presupuesto = parseInt(document.getElementById('knapsack-budget').value);
    
    if (isNaN(presupuesto) || presupuesto <= 0) {
        showResult('knapsack-result', { 
            error: '⚠️ Por favor ingresa un presupuesto válido'
        });
        return;
    }
    
    showLoading();
    try {
        const request = {
            proyectos: proyectosMochila,
            presupuesto,
            optimized: false
        };
        
        // Obtener solución y tabla DP en paralelo
        const [solutionResponse, tableResponse] = await Promise.all([
            fetch(`${API_BASE}/dynamic-programming/mochila`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            }),
            fetch(`${API_BASE}/dynamic-programming/mochila/tabla-dp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            }).catch(() => null) // Si falla, continuar sin tabla
        ]);
        
        const data = await solutionResponse.json();
        
        // Agregar tabla DP si está disponible
        if (tableResponse && tableResponse.ok) {
            const tableData = await tableResponse.json();
            data.tablaDP = tableData.tablaDP;
        }
        
        showResult('knapsack-result', data, true);
    } catch (error) {
        showResult('knapsack-result', { error: 'Error al resolver mochila: ' + error.message });
    } finally {
        hideLoading();
    }
}

async function compararMochilaGreedy() {
    // Validar que se hayan agregado proyectos
    if (proyectosMochila.length === 0) {
        showResult('compare-knapsack-result', { 
            error: '⚠️ Por favor agrega al menos un proyecto antes de comparar algoritmos'
        });
        return;
    }
    
    const presupuesto = parseInt(document.getElementById('compare-knapsack-budget').value);
    
    if (isNaN(presupuesto) || presupuesto <= 0) {
        showResult('compare-knapsack-result', { 
            error: '⚠️ Por favor ingresa un presupuesto válido'
        });
        return;
    }
    
    showLoading();
    try {
        const request = {
            proyectos: proyectosMochila,
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

// ============================================
// Panel Lateral Neo4j - Cargar y Mostrar Datos
// ============================================

async function loadNeo4jData() {
    const contentDiv = document.getElementById('neo4j-content');
    if (!contentDiv) return;
    
    try {
        const response = await fetch(`${API_BASE}/neo4j/data`);
        
        if (!response.ok) {
            // Si el endpoint no existe (404), mostrar mensaje más claro
            if (response.status === 404) {
                contentDiv.innerHTML = `
                    <div class="sidebar-empty">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p style="margin-bottom: 0.5rem;"><strong>Endpoint no encontrado</strong></p>
                        <p style="font-size: 0.85rem;">El endpoint /api/neo4j/data no está disponible.</p>
                        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Por favor, reinicia la aplicación Spring Boot.</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Status: ${response.status}</p>
                    </div>
                `;
                return;
            }
            
            const errorText = await response.text();
            contentDiv.innerHTML = `
                <div class="sidebar-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error HTTP ${response.status}: ${errorText || response.statusText}</p>
                </div>
            `;
            return;
        }
        
        const data = await response.json();
        
        if (data.error) {
            let errorMessage = data.error;
            let helpText = '';
            
            // Si el backend envió sugerencias, usarlas
            if (data.suggestions && Array.isArray(data.suggestions)) {
                helpText = `
                    <div style="font-size: 0.85rem; margin-top: 0.5rem; padding: 0.75rem; background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--warning-color); border-radius: 4px;">
                        <p style="margin-bottom: 0.5rem;"><strong>Sugerencias:</strong></p>
                        <ul style="margin-left: 1.25rem; margin-top: 0.25rem; line-height: 1.6;">
                            ${data.suggestions.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                `;
            } else if (errorMessage.includes('No routing server available') || errorMessage.includes('Could not perform discovery')) {
                // Mensaje genérico si no hay sugerencias específicas
                helpText = `
                    <div style="font-size: 0.85rem; margin-top: 0.5rem; padding: 0.75rem; background: rgba(245, 158, 11, 0.1); border-left: 3px solid var(--warning-color); border-radius: 4px;">
                        <p style="margin-bottom: 0.5rem;"><strong>Problema de conexión con Neo4j Aura</strong></p>
                        <p style="margin-bottom: 0.25rem;">Posibles soluciones:</p>
                        <ul style="margin-left: 1.25rem; margin-top: 0.25rem; line-height: 1.6;">
                            <li>Verifica que la instancia esté en estado "Running" (no pausada)</li>
                            <li>Espera 1-2 minutos después de reactivar la instancia</li>
                            <li>Reinicia la aplicación Spring Boot</li>
                            <li>Verifica la URI en application.properties: <code style="background: var(--dark-bg); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.8rem;">neo4j+s://9b399f10.databases.neo4j.io</code></li>
                        </ul>
                    </div>
                `;
            } else if (errorMessage.includes('No hay datos')) {
                helpText = '<p style="font-size: 0.85rem; margin-top: 0.5rem;">Usa el endpoint /api/data-init/load para cargar datos de prueba.</p>';
            }
            
            contentDiv.innerHTML = `
                <div class="sidebar-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p style="margin-bottom: 0.5rem;"><strong>Error al obtener datos</strong></p>
                    <p style="font-size: 0.85rem;">${errorMessage}</p>
                    ${data.errorDetails ? `<p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">Tipo: ${data.errorDetails}</p>` : ''}
                    ${helpText}
                </div>
            `;
            return;
        }
        
        // Si hay un mensaje informativo (como que no hay datos)
        if (data.message) {
            const hasData = (data.summary?.totalCentros || 0) > 0 || 
                           (data.summary?.totalRutas || 0) > 0 || 
                           (data.summary?.totalCamiones || 0) > 0;
            
            if (!hasData) {
                contentDiv.innerHTML = `
                    <div class="sidebar-empty">
                        <i class="fas fa-info-circle"></i>
                        <p style="margin-bottom: 0.5rem;"><strong>No hay datos</strong></p>
                        <p style="font-size: 0.85rem;">${data.message}</p>
                        <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
                            Carga datos usando: <code style="background: var(--dark-bg); padding: 0.25rem 0.5rem; border-radius: 4px;">POST /api/data-init/load</code>
                        </p>
                    </div>
                `;
                return;
            }
        }
        
        renderNeo4jData(data);
    } catch (error) {
        contentDiv.innerHTML = `
            <div class="sidebar-empty">
                <i class="fas fa-exclamation-triangle"></i>
                <p style="margin-bottom: 0.5rem;"><strong>Error de conexión</strong></p>
                <p style="font-size: 0.85rem;">${error.message}</p>
                <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">Verifica que la aplicación Spring Boot esté ejecutándose en el puerto 8080</p>
            </div>
        `;
        console.error('Error cargando datos Neo4j:', error);
    }
}

function renderNeo4jData(data) {
    const contentDiv = document.getElementById('neo4j-content');
    if (!contentDiv) return;
    
    const summary = data.summary || {};
    const centros = data.centros || [];
    const rutas = data.rutas || [];
    const camiones = data.camiones || [];
    
    let html = '';
    
    // Resumen
    html += `
        <div class="sidebar-section">
            <div class="sidebar-summary">
                <div class="sidebar-summary-card">
                    <div class="sidebar-summary-value">${summary.totalCentros || 0}</div>
                    <div class="sidebar-summary-label">Centros</div>
                </div>
                <div class="sidebar-summary-card">
                    <div class="sidebar-summary-value">${summary.totalRutas || 0}</div>
                    <div class="sidebar-summary-label">Rutas</div>
                </div>
                <div class="sidebar-summary-card">
                    <div class="sidebar-summary-value">${summary.totalCamiones || 0}</div>
                    <div class="sidebar-summary-label">Camiones</div>
                </div>
            </div>
        </div>
    `;
    
    // Centros de Distribución
    html += `
        <div class="sidebar-section">
            <div class="sidebar-section-title">
                <i class="fas fa-warehouse"></i> Centros de Distribución
            </div>
            <div class="sidebar-list">
    `;
    
    if (centros.length === 0) {
        html += '<div class="sidebar-empty">No hay centros cargados</div>';
    } else {
        centros.slice(0, 10).forEach(centro => {
            html += `
                <div class="sidebar-item">
                    <div class="sidebar-item-title">${centro.name || centro.id}</div>
                    <div class="sidebar-item-detail">
                        <span>Ciudad:</span>
                        <strong>${centro.city || 'N/A'}</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Demanda:</span>
                        <strong>${centro.demandLevel || 0}</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Capacidad:</span>
                        <strong>${centro.capacity || 0}</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Prioridad:</span>
                        <strong>${centro.priority || 0}</strong>
                    </div>
                </div>
            `;
        });
        if (centros.length > 10) {
            html += `<div class="sidebar-item" style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">+ ${centros.length - 10} más</div>`;
        }
    }
    
    html += `</div></div>`;
    
    // Rutas
    html += `
        <div class="sidebar-section">
            <div class="sidebar-section-title">
                <i class="fas fa-route"></i> Rutas
            </div>
            <div class="sidebar-list">
    `;
    
    if (rutas.length === 0) {
        html += '<div class="sidebar-empty">No hay rutas cargadas</div>';
    } else {
        rutas.slice(0, 8).forEach(ruta => {
            html += `
                <div class="sidebar-item">
                    <div class="sidebar-item-title">${ruta.name || ruta.id}</div>
                    <div class="sidebar-item-detail">
                        <span>Desde:</span>
                        <strong>${ruta.fromCenter || 'N/A'}</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Hasta:</span>
                        <strong>${ruta.toCenter || 'N/A'}</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Distancia:</span>
                        <strong>${(ruta.distance || 0).toFixed(1)} km</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Costo:</span>
                        <strong>$${ruta.cost || 0}</strong>
                    </div>
                </div>
            `;
        });
        if (rutas.length > 8) {
            html += `<div class="sidebar-item" style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">+ ${rutas.length - 8} más</div>`;
        }
    }
    
    html += `</div></div>`;
    
    // Camiones
    html += `
        <div class="sidebar-section">
            <div class="sidebar-section-title">
                <i class="fas fa-truck"></i> Camiones
            </div>
            <div class="sidebar-list">
    `;
    
    if (camiones.length === 0) {
        html += '<div class="sidebar-empty">No hay camiones cargados</div>';
    } else {
        camiones.slice(0, 8).forEach(camion => {
            const fuelPercentage = camion.fuelCapacity > 0 ? 
                ((camion.currentFuel / camion.fuelCapacity) * 100).toFixed(0) : 0;
            html += `
                <div class="sidebar-item">
                    <div class="sidebar-item-title">${camion.licensePlate || camion.id}</div>
                    <div class="sidebar-item-detail">
                        <span>Capacidad:</span>
                        <strong>${camion.capacity || 0} kg</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Combustible:</span>
                        <strong>${camion.currentFuel || 0}/${camion.fuelCapacity || 0}L (${fuelPercentage}%)</strong>
                    </div>
                    <div class="sidebar-item-detail">
                        <span>Estado:</span>
                        <strong style="color: ${camion.status === 'AVAILABLE' ? 'var(--success-color)' : camion.status === 'IN_TRANSIT' ? 'var(--warning-color)' : 'var(--text-secondary)'};">${camion.status || 'N/A'}</strong>
                    </div>
                </div>
            `;
        });
        if (camiones.length > 8) {
            html += `<div class="sidebar-item" style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">+ ${camiones.length - 8} más</div>`;
        }
    }
    
    html += `</div></div>`;
    
    contentDiv.innerHTML = html;
}

function toggleSidebar() {
    const sidebar = document.getElementById('neo4j-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Cargar datos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadNeo4jData();
    // Recargar cada 30 segundos para mantener datos actualizados
    setInterval(loadNeo4jData, 30000);
});

