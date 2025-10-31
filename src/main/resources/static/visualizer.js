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
        
        let html = `
            <div class="greedy-initial">
                <div class="greedy-target">
                    <strong>Objetivo:</strong> ${required} litros
                </div>
                <div class="greedy-sizes">
                    <strong>Bidones disponibles:</strong> ${sizes.join('L, ')}L
                </div>
            </div>
            <div class="greedy-steps">
        `;

        sizes.forEach((size, index) => {
            if (remaining <= 0) return;
            
            const quantity = Math.floor(remaining / size);
            if (quantity > 0) {
                used[size] = quantity;
                remaining = remaining % size;
                
                html += `
                    <div class="greedy-step">
                        <div class="step-number">Paso ${index + 1}</div>
                        <div class="step-action">
                            <i class="fas fa-check-circle"></i>
                            Elegir bidón de <strong>${size}L</strong>
                        </div>
                        <div class="step-calculation">
                            ${remaining + size * quantity}L - ${quantity} × ${size}L = ${remaining}L restantes
                        </div>
                        <div class="step-result">
                            Usar: ${quantity} bidón${quantity > 1 ? 'es' : ''} de ${size}L
                        </div>
                    </div>
                `;
            }
        });

        html += `
            </div>
            <div class="greedy-final">
                <div class="final-summary">
                    <strong>Resultado:</strong> ${Object.entries(used).map(([s, q]) => `${q}×${s}L`).join(' + ')} = ${required - remaining}L
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
}

// Instancia global del visualizador
const visualizer = new AlgorithmVisualizer();

