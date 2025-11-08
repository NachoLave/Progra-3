// Visualizador paso a paso de algoritmos
class AlgorithmVisualizer {
    constructor() {
        this.currentStep = 0;
        this.steps = [];
        this.isPlaying = false;
        this.speed = 800; // ms por paso
    }

    // Visualizar recursividad paso a paso
    visualizeRecursion(costs, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-code"></i> Visualización Paso a Paso - Recursión</h4>
                    <div class="viz-controls">
                        <button class="btn-viz" onclick="visualizer.playPause()" id="play-pause-btn">
                            <i class="fas fa-play"></i> Iniciar
                        </button>
                        <button class="btn-viz" onclick="visualizer.reset()">
                            <i class="fas fa-redo"></i> Reiniciar
                        </button>
                        <input type="range" min="200" max="2000" value="800" onchange="visualizer.setSpeed(this.value)" class="speed-slider">
                        <span class="speed-label">Velocidad</span>
                    </div>
                </div>
                <div class="viz-explanation">
                    <p><strong>Proceso:</strong> La función recursiva suma cada elemento llamándose a sí misma hasta llegar al caso base.</p>
                </div>
                <div class="recursion-visualization" id="recursion-viz">
                    <div class="recursion-stack"></div>
                    <div class="recursion-result"></div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        // Generar pasos
        this.steps = [];
        this.generateRecursionSteps(costs, 0, 0, '');
        
        // Mostrar inicial
        this.currentStep = 0;
        this.renderRecursionStep();
    }

    generateRecursionSteps(costs, index, currentSum, callStack) {
        if (index >= costs.length) {
            // Caso base
            this.steps.push({
                type: 'base',
                index,
                cost: 0,
                sum: currentSum,
                callStack: callStack,
                message: `Caso base alcanzado: index == ${costs.length}, retornando 0`
            });
            return currentSum;
        }

        const cost = costs[index];
        const newSum = currentSum + cost;
        const newCallStack = callStack + ` → calcularCostoTotal(${index})`;

        // Paso: llamada recursiva
        this.steps.push({
            type: 'call',
            index,
            cost,
            sum: currentSum,
            callStack: newCallStack,
            message: `Llamada recursiva: suma tramo[${index}] = ${cost}`
        });

        // Recursión
        const result = this.generateRecursionSteps(costs, index + 1, newSum, newCallStack);

        // Paso: retorno
        this.steps.push({
            type: 'return',
            index,
            cost,
            sum: result,
            callStack: callStack,
            message: `Retornando: ${result} (${currentSum} + resultado del siguiente)`
        });

        return result;
    }

    renderRecursionStep() {
        if (this.currentStep >= this.steps.length) {
            this.isPlaying = false;
            document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-play"></i> Reiniciar';
            return;
        }

        const step = this.steps[this.currentStep];
        const vizContainer = document.querySelector('.recursion-visualization');
        
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
                        <span class="detail-value highlight">${step.cost}</span>
                    </div>
                    ` : ''}
                    <div class="detail-box">
                        <span class="detail-label">Suma acumulada:</span>
                        <span class="detail-value highlight">${step.sum}</span>
                    </div>
                    <div class="call-stack">
                        <div class="stack-label">Pila de llamadas:</div>
                        <div class="stack-items">${step.callStack || 'inicio'}</div>
                    </div>
                </div>
            </div>
        `;
        
        vizContainer.innerHTML = html;
    }

    playPause() {
        if (this.currentStep >= this.steps.length) {
            this.reset();
            return;
        }
        
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('play-pause-btn');
        btn.innerHTML = this.isPlaying ? 
            '<i class="fas fa-pause"></i> Pausar' : 
            '<i class="fas fa-play"></i> Continuar';
        
        if (this.isPlaying) {
            this.playNext();
        }
    }

    playNext() {
        if (!this.isPlaying || this.currentStep >= this.steps.length) {
            this.isPlaying = false;
            return;
        }
        
        this.renderRecursionStep();
        this.currentStep++;
        
        if (this.isPlaying) {
            setTimeout(() => this.playNext(), this.speed);
        }
    }

    reset() {
        this.currentStep = 0;
        this.isPlaying = false;
        document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-play"></i> Iniciar';
        this.renderRecursionStep();
    }

    setSpeed(value) {
        this.speed = parseInt(value);
    }

    // Visualizar ordenamiento (MergeSort/QuickSort)
    visualizeSorting(array, algorithm, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-sort"></i> Visualización: ${algorithm}</h4>
                    <div class="viz-controls">
                        <button class="btn-viz" onclick="visualizer.playSorting()">
                            <i class="fas fa-play"></i> Animar
                        </button>
                    </div>
                </div>
                <div class="sorting-visualization" id="sorting-viz">
                    <div class="array-container"></div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        this.renderArray(array, document.querySelector('.array-container'));
    }

    renderArray(array, container) {
        let html = '<div class="array-visual">';
        array.forEach((item, index) => {
            html += `
                <div class="array-item" style="height: ${(item.demandLevel || item.priority || 0) * 3}px">
                    <div class="item-value">${item.demandLevel || item.priority || 'N/A'}</div>
                    <div class="item-label">${item.name || item.id}</div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    playSorting() {
        // Implementar animación de ordenamiento
        console.log('Animando ordenamiento...');
    }

    // Visualizar Greedy - distribución de combustible
    visualizeGreedy(required, sizes, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-coins"></i> Visualización: Algoritmo Greedy</h4>
                </div>
                <div class="greedy-visualization" id="greedy-viz">
                    <div class="greedy-process"></div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        this.animateGreedy(required, sizes, document.querySelector('.greedy-process'));
    }

    animateGreedy(required, sizes, container) {
        let remaining = required;
        let used = {};
        sizes.sort((a, b) => b - a); // Ordenar descendente
        
        // Calcular qué bidones se van a usar
        let usageOrder = [];
        let tempRemaining = required;
        sizes.forEach((size, index) => {
            const quantity = Math.floor(tempRemaining / size);
            if (quantity > 0) {
                used[size] = quantity;
                tempRemaining = tempRemaining % size;
                usageOrder.push({ size, quantity, order: usageOrder.length + 1 });
            }
        });
        
        // Crear visualización de camiones/bidones
        let trucksHtml = `
            <div class="trucks-visualization">
                <div class="trucks-header">
                    <h4><i class="fas fa-gas-pump"></i> Bidones Disponibles</h4>
                    <div class="target-amount">Objetivo: <strong>${required}L</strong></div>
                </div>
                <div class="trucks-container">
        `;
        
        // Mostrar todos los bidones disponibles
        sizes.forEach((size, index) => {
            const isUsed = used[size] !== undefined;
            const quantity = used[size] || 0;
            const orderInfo = usageOrder.find(u => u.size === size);
            const order = orderInfo ? orderInfo.order : 0;
            
            trucksHtml += `
                <div class="truck-item ${isUsed ? 'truck-used' : 'truck-unused'}" style="animation-delay: ${index * 0.15}s" data-order="${order}">
                    <div class="truck-icon">
                        <i class="fas fa-gas-pump"></i>
                    </div>
                    <div class="truck-capacity">
                        <div class="capacity-label">Capacidad</div>
                        <div class="capacity-value">${size}L</div>
                    </div>
                    ${isUsed ? `
                        <div class="truck-selection-badge">
                            <i class="fas fa-check-circle"></i> Seleccionado
                        </div>
                        <div class="truck-usage">
                            <div class="usage-bar">
                                <div class="usage-fill" style="width: 100%; animation-delay: ${(order - 1) * 0.5}s"></div>
                            </div>
                            <div class="usage-text">Usado: ${quantity} × ${size}L = ${quantity * size}L</div>
                        </div>
                        <div class="truck-order-badge">Paso ${order}</div>
                    ` : `
                        <div class="truck-not-used">
                            <i class="fas fa-times-circle"></i> No usado
                        </div>
                    `}
                </div>
            `;
        });
        
        trucksHtml += `
                </div>
            </div>
        `;
        
        // Ahora el resumen paso a paso
        let html = trucksHtml + `
            <div class="greedy-initial" style="margin-top: 2rem;">
                <div class="greedy-target">
                    <strong>Algoritmo Greedy:</strong> Seleccionar siempre el bidón más grande disponible
                </div>
                <div class="greedy-sizes">
                    <strong>Bidones disponibles (ordenados):</strong> ${sizes.join('L, ')}L
                </div>
            </div>
            <div class="greedy-steps">
        `;

        let stepNum = 1;
        sizes.forEach((size, index) => {
            if (remaining <= 0) return;
            
            const quantity = Math.floor(remaining / size);
            if (quantity > 0) {
                const previousRemaining = remaining + size * quantity;
                remaining = remaining % size;
                
                html += `
                    <div class="greedy-step" style="animation-delay: ${stepNum * 0.2}s">
                        <div class="step-number">Paso ${stepNum}</div>
                        <div class="step-action">
                            <i class="fas fa-check-circle"></i>
                            Elegir bidón de <strong>${size}L</strong>
                        </div>
                        <div class="step-calculation">
                            ${previousRemaining}L ÷ ${size}L = ${quantity} bidón${quantity > 1 ? 'es' : ''} (resto: ${remaining}L)
                        </div>
                        <div class="step-result">
                            ✓ Usar: ${quantity} bidón${quantity > 1 ? 'es' : ''} de ${size}L = ${quantity * size}L
                        </div>
                    </div>
                `;
                stepNum++;
            }
        });

        html += `
            </div>
            <div class="greedy-final">
                <div class="final-summary">
                    <i class="fas fa-check-circle"></i> <strong>Distribución Completada:</strong> ${Object.entries(used).map(([s, q]) => `${q}×${s}L`).join(' + ')} = ${required}L
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    // Visualizar grafo
    visualizeGraph(edges, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-project-diagram"></i> Visualización del Grafo</h4>
                </div>
                <div class="graph-visualization" id="graph-viz">
                    <svg width="600" height="400" class="graph-svg"></svg>
                </div>
            </div>
        `;
        container.innerHTML = html;

        this.drawGraph(edges, document.querySelector('.graph-svg'));
    }

    drawGraph(edges, svg) {
        // Crear nodos únicos
        const nodes = new Set();
        edges.forEach(e => {
            nodes.add(e.from);
            nodes.add(e.to);
        });
        
        const nodeList = Array.from(nodes);
        const radius = 150;
        const centerX = 300;
        const centerY = 200;
        
        // Posicionar nodos en círculo
        const nodePositions = {};
        nodeList.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodeList.length;
            nodePositions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });

        // Dibujar aristas
        edges.forEach((edge, index) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', '#2563eb');
            line.setAttribute('stroke-width', '2');
            svg.appendChild(line);
            
            // Label del peso
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('fill', '#10b981');
            text.setAttribute('font-size', '12');
            text.setAttribute('font-weight', 'bold');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });

        // Dibujar nodos
        nodeList.forEach(node => {
            const pos = nodePositions[node];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', '20');
            circle.setAttribute('fill', '#2563eb');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + 5);
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = node;
            svg.appendChild(text);
        });
    }

    // Visualizar Programación Dinámica - tabla DP
    visualizeDP(table, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-table"></i> Tabla de Programación Dinámica</h4>
                </div>
                <div class="dp-visualization" id="dp-viz">
                    <div class="dp-table-container"></div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        this.renderDPTable(table, document.querySelector('.dp-table-container'));
    }

    renderDPTable(table, container) {
        let html = '<table class="dp-table"><thead><tr><th>Proyecto\\Presupuesto</th>';
        
        // Headers (presupuestos)
        for (let w = 0; w < table[0].length; w++) {
            html += `<th>${w}</th>`;
        }
        html += '</tr></thead><tbody>';
        
        // Filas (proyectos)
        table.forEach((row, i) => {
            html += `<tr><th>Proyecto ${i}</th>`;
            row.forEach(cell => {
                html += `<td class="dp-cell">${cell}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    }

    // Animar distribución de presupuesto en proyectos
    animateBudgetProjects(container, data) {
        if (!container) return;

        const { presupuestoTotal, proyectos, distribucion } = data;
        
        // Calcular ratios y ordenar proyectos
        const projectsWithRatio = proyectos.map(p => ({
            ...p,
            ratio: (p.beneficio / p.costo).toFixed(2),
            assigned: distribucion[p.nombre] || 0,
            percentage: distribucion[p.nombre] ? ((distribucion[p.nombre] / p.costo) * 100).toFixed(0) : 0
        }));
        
        // Ordenar por ratio descendente (como Greedy)
        projectsWithRatio.sort((a, b) => b.ratio - a.ratio);
        
        // Determinar orden de selección
        let order = 0;
        projectsWithRatio.forEach(p => {
            if (p.assigned > 0) {
                order++;
                p.order = order;
            }
        });

        let html = `
            <div class="projects-visualization">
                <div class="projects-header">
                    <h4><i class="fas fa-wallet"></i> Distribución de Presupuesto por Proyectos</h4>
                    <div class="budget-total">
                        Presupuesto Total: <strong>$${presupuestoTotal.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="projects-container">
        `;

        projectsWithRatio.forEach((project, index) => {
            const isFunded = project.assigned > 0;
            const isPartial = project.percentage > 0 && project.percentage < 100;
            const isFull = project.percentage >= 100;
            
            let fundingClass = '';
            let fundingLabel = '';
            
            if (isFull) {
                fundingClass = 'project-funded';
                fundingLabel = '✅ Financiado Completo';
            } else if (isPartial) {
                fundingClass = 'project-partial';
                fundingLabel = '⚠️ Financiado Parcial';
            } else {
                fundingClass = 'project-not-funded';
                fundingLabel = '❌ Sin Financiamiento';
            }

            html += `
                <div class="project-item ${fundingClass}" style="animation-delay: ${index * 0.15}s">
                    <div class="project-header">
                        <div class="project-name">
                            <i class="fas fa-folder-open"></i>
                            ${project.nombre}
                        </div>
                        ${isFunded ? `<div class="project-order-badge">${project.order}</div>` : ''}
                    </div>
                    
                    <div class="project-stats">
                        <div class="project-stat">
                            <div class="project-stat-label">Costo</div>
                            <div class="project-stat-value">$${project.costo}</div>
                        </div>
                        <div class="project-stat">
                            <div class="project-stat-label">Beneficio</div>
                            <div class="project-stat-value highlight">$${project.beneficio}</div>
                        </div>
                    </div>
                    
                    <div class="project-ratio-badge">
                        <i class="fas fa-chart-line"></i>
                        Ratio: ${project.ratio}
                    </div>
                    
                    ${isFunded ? `
                        <div class="project-progress">
                            <div class="project-progress-label">
                                <span>Financiamiento</span>
                                <span class="project-progress-percentage ${isFull ? 'full' : 'partial'}">
                                    ${project.percentage}%
                                </span>
                            </div>
                            <div class="project-progress-bar">
                                <div class="project-progress-fill ${isPartial ? 'partial' : ''}" 
                                     style="animation-delay: ${project.order * 0.3}s" 
                                     data-width="${project.percentage}"
                                     data-percentage="${project.percentage}%">
                                </div>
                            </div>
                        </div>
                        
                        <div class="project-funding-info ${isPartial ? 'partial' : ''}">
                            <div>${fundingLabel}</div>
                            <div>Asignado: <span class="project-funding-amount ${isPartial ? 'partial' : ''}">$${project.assigned.toFixed(2)}</span></div>
                        </div>
                    ` : `
                        <div class="project-not-funded-label">
                            ${fundingLabel}
                        </div>
                    `}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Animar las barras de progreso después de que se rendericen
        setTimeout(() => {
            document.querySelectorAll('.project-progress-fill').forEach(fill => {
                const width = fill.getAttribute('data-width');
                const percentage = fill.getAttribute('data-percentage');
                fill.style.width = width + '%';
                // Mostrar porcentaje dentro de la barra si hay espacio (>15%)
                if (parseInt(width) > 15) {
                    fill.textContent = percentage;
                }
            });
        }, 100);
    }
}

// Instancia global del visualizador
const visualizer = new AlgorithmVisualizer();



