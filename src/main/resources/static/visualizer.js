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

    // Visualizar Kruskal en modal completo
    visualizeKruskalInModal(edges, vertices) {
        console.log('visualizeKruskalInModal llamada', { edges, vertices });
        
        const modalBody = document.getElementById('kruskal-modal-body');
        if (!modalBody) {
            console.error('Modal body no encontrado');
            return;
        }
        
        // Guardar datos para visualización
        this.currentGraphEdges = edges;
        
        // Calcular costo total del MST
        let costoTotal = 0;
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        const parent = Array.from({length: vertices}, (_, i) => i);
        const rank = new Array(vertices).fill(0);
        const mst = [];
        
        const find = (x) => {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        };
        
        const union = (x, y) => {
            const rootX = find(x);
            const rootY = find(y);
            if (rootX !== rootY) {
                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }
                return true;
            }
            return false;
        };
        
        for (const edge of sortedEdges) {
            if (find(edge.from) !== find(edge.to)) {
                mst.push(edge);
                costoTotal += edge.weight;
                union(edge.from, edge.to);
                if (mst.length === vertices - 1) break;
            }
        }
        
        const html = `
            <div class="kruskal-modal-container">
                <!-- Explicación del algoritmo -->
                <div class="kruskal-explanation-section">
                    <div class="kruskal-explanation-card">
                        <h3><i class="fas fa-lightbulb"></i> ¿Qué es el Algoritmo de Kruskal?</h3>
                        <p>
                            El algoritmo de <strong>Kruskal</strong> encuentra el <strong>Árbol de Recubrimiento Mínimo (MST)</strong> 
                            de un grafo conectado. Funciona ordenando todas las aristas por peso y seleccionando las de menor peso 
                            que <strong>no formen ciclos</strong> con las ya seleccionadas.
                        </p>
                        <div class="kruskal-algorithm-steps">
                            <div class="algorithm-step-item">
                                <span class="step-number">1</span>
                                <span class="step-text">Ordenar todas las aristas por peso (ascendente)</span>
                            </div>
                            <div class="algorithm-step-item">
                                <span class="step-number">2</span>
                                <span class="step-text">Iterar sobre las aristas ordenadas</span>
                            </div>
                            <div class="algorithm-step-item">
                                <span class="step-number">3</span>
                                <span class="step-text">Agregar arista si no forma ciclo (Union-Find)</span>
                            </div>
                            <div class="algorithm-step-item">
                                <span class="step-number">4</span>
                                <span class="step-text">Repetir hasta tener V-1 aristas (MST completo)</span>
                            </div>
                        </div>
                        <div class="kruskal-complexity">
                            <strong>Complejidad:</strong> O(E log E) donde E es el número de aristas
                        </div>
                    </div>
                </div>
                
                <!-- Estadísticas y resultados -->
                <div class="kruskal-stats-section">
                    <div class="kruskal-stat-card">
                        <div class="stat-icon"><i class="fas fa-link"></i></div>
                        <div class="stat-value">${mst.length}</div>
                        <div class="stat-label">Aristas en MST</div>
                    </div>
                    <div class="kruskal-stat-card highlight">
                        <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                        <div class="stat-value">$${costoTotal.toFixed(2)}</div>
                        <div class="stat-label">Costo Total</div>
                    </div>
                    <div class="kruskal-stat-card">
                        <div class="stat-icon"><i class="fas fa-project-diagram"></i></div>
                        <div class="stat-value">${vertices}</div>
                        <div class="stat-label">Vértices</div>
                    </div>
                    <div class="kruskal-stat-card">
                        <div class="stat-icon"><i class="fas fa-sitemap"></i></div>
                        <div class="stat-value">${edges.length}</div>
                        <div class="stat-label">Aristas Totales</div>
                    </div>
                </div>
                
                <!-- Visualización interactiva -->
                <div class="kruskal-visualization-section">
                    <div class="viz-header">
                        <h4><i class="fas fa-code-branch"></i> Visualización Paso a Paso</h4>
                        <div class="viz-controls">
                            <button class="btn-viz" onclick="visualizer.playKruskalSteps()" id="play-kruskal-modal-btn">
                                <i class="fas fa-play"></i> Iniciar
                            </button>
                            <button class="btn-viz" onclick="visualizer.resetKruskalSteps()">
                                <i class="fas fa-redo"></i> Reiniciar
                            </button>
                            <button class="btn-viz btn-fullscreen" id="btn-fullscreen-kruskal-modal" title="Pantalla completa">
                                <i class="fas fa-expand"></i> Ampliar
                            </button>
                        </div>
                    </div>
                    <div class="graph-steps-container-modal" id="kruskal-modal-steps-container">
                        <div class="graph-steps-sidebar-modal" id="kruskal-modal-steps-list"></div>
                        <div class="graph-steps-visualization-modal" id="kruskal-modal-viz-area">
                            <svg width="700" height="500" class="graph-svg-steps-modal" id="kruskal-modal-svg"></svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modalBody.innerHTML = html;
        
        // Inicializar pasos de Kruskal
        try {
            this.initializeKruskalSteps(edges, vertices);
            
            // Pequeño delay para asegurar que el DOM esté listo
            setTimeout(() => {
                this.renderKruskalStepInModal();
            }, 100);
            
            // Agregar event listeners
            setTimeout(() => {
                const fullscreenBtn = document.getElementById('btn-fullscreen-kruskal-modal');
                if (fullscreenBtn) {
                    fullscreenBtn.addEventListener('click', () => {
                        this.openGraphFullscreen();
                    });
                }
            }, 150);
            
            // Cerrar modal al hacer clic fuera
            const modal = document.getElementById('kruskal-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        cerrarKruskalModal();
                    }
                });
            }
        } catch (error) {
            console.error('Error al inicializar Kruskal en modal:', error);
            modalBody.innerHTML = `<div class="error-message">Error al inicializar visualización: ${error.message}</div>`;
        }
    }
    
    // Renderizar paso actual de Kruskal en modal
    renderKruskalStepInModal() {
        if (!this.kruskalSteps || this.kruskalSteps.length === 0) {
            console.error('No hay pasos de Kruskal para renderizar en modal');
            return;
        }
        
        if (this.currentKruskalStep >= this.kruskalSteps.length) {
            this.isKruskalPlaying = false;
            const btn = document.getElementById('play-kruskal-modal-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Completado';
            return;
        }
        
        const step = this.kruskalSteps[this.currentKruskalStep];
        const stepsList = document.getElementById('kruskal-modal-steps-list');
        const svg = document.getElementById('kruskal-modal-svg');
        
        if (!stepsList) {
            console.error('Elemento kruskal-modal-steps-list no encontrado');
            return;
        }
        if (!svg) {
            console.error('Elemento kruskal-modal-svg no encontrado');
            return;
        }
        
        // Renderizar lista de pasos
        let stepsHtml = '';
        this.kruskalSteps.forEach((s, idx) => {
            const isActive = idx === this.currentKruskalStep;
            const isCompleted = idx < this.currentKruskalStep;
            
            stepsHtml += `
                <div class="graph-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${s.type}" 
                     onclick="visualizer.goToKruskalStep(${idx})" style="cursor: pointer;">
                    <div class="graph-step-number">${s.step}</div>
                    <div class="graph-step-content">
                        <div class="graph-step-title">${s.message}</div>
                        ${isActive ? `<div class="graph-step-details">${s.details}</div>` : ''}
                    </div>
                </div>
            `;
        });
        stepsList.innerHTML = stepsHtml;
        
        // Hacer scroll al paso activo
        const activeStep = stepsList.querySelector('.graph-step-item.active');
        if (activeStep) {
            activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Renderizar grafo con el paso actual
        this.drawGraphWithSteps(step.edges, step.mst, step.edge, step.type, svg, 700, 500);
    }

    // Visualizar Kruskal paso a paso
    visualizeKruskalStepByStep(edges, vertices, elementId) {
        console.log('visualizeKruskalStepByStep llamada', { edges, vertices, elementId });
        const container = document.getElementById(elementId);
        if (!container) {
            console.error('Contenedor no encontrado:', elementId);
            alert('Error: No se encontró el contenedor para la visualización. ID: ' + elementId);
            return;
        }

        container.classList.add('active');
        container.style.display = 'block';
        
        // Guardar datos para visualización
        this.currentGraphEdges = edges;
        this.currentGraphElementId = elementId;
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-code-branch"></i> Algoritmo de Kruskal - Paso a Paso</h4>
                    <div class="viz-controls">
                        <button class="btn-viz" onclick="visualizer.playKruskalSteps()" id="play-kruskal-btn">
                            <i class="fas fa-play"></i> Iniciar
                        </button>
                        <button class="btn-viz" onclick="visualizer.resetKruskalSteps()">
                            <i class="fas fa-redo"></i> Reiniciar
                        </button>
                        <button class="btn-viz btn-fullscreen" id="btn-fullscreen-kruskal-steps" title="Pantalla completa">
                            <i class="fas fa-expand"></i> Ampliar
                        </button>
                    </div>
                </div>
                <div class="viz-explanation">
                    <p><strong>Algoritmo Kruskal:</strong> Encuentra el Árbol de Recubrimiento Mínimo (MST) ordenando las aristas por peso y seleccionando las de menor peso que no formen ciclos. Complejidad: O(E log E)</p>
                </div>
                <div class="graph-steps-container" id="kruskal-steps-container-main">
                    <div class="graph-steps-sidebar" id="kruskal-steps-list"></div>
                    <div class="graph-steps-visualization" id="kruskal-steps-viz-area">
                        <svg width="600" height="400" class="graph-svg-steps" id="kruskal-svg"></svg>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        // Inicializar pasos de Kruskal
        try {
            this.initializeKruskalSteps(edges, vertices);
            
            // Pequeño delay para asegurar que el DOM esté listo
            setTimeout(() => {
                this.renderKruskalStep();
            }, 50);
            
            // Agregar event listener al botón de pantalla completa
            setTimeout(() => {
                const fullscreenBtn = document.getElementById('btn-fullscreen-kruskal-steps');
                if (fullscreenBtn) {
                    fullscreenBtn.addEventListener('click', () => {
                        this.openGraphFullscreen();
                    });
                } else {
                    console.warn('Botón de pantalla completa no encontrado');
                }
            }, 100);
        } catch (error) {
            console.error('Error al inicializar pasos de Kruskal:', error);
            container.innerHTML = `<div class="error-message">Error al inicializar visualización: ${error.message}</div>`;
        }
    }

    // Inicializar pasos de Kruskal
    initializeKruskalSteps(edges, vertices) {
        this.kruskalSteps = [];
        this.currentKruskalStep = 0;
        this.isKruskalPlaying = false;
        
        // Crear copia de las aristas y ordenarlas
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        
        // Union-Find para detectar ciclos
        const parent = Array.from({length: vertices}, (_, i) => i);
        const rank = new Array(vertices).fill(0);
        
        const mst = [];
        let stepNumber = 1;
        
        // Paso inicial: mostrar aristas ordenadas
        this.kruskalSteps.push({
            type: 'init',
            step: 0,
            message: 'Inicialización: Ordenar todas las aristas por peso (ascendente)',
            edges: sortedEdges,
            mst: [],
            parent: [...parent],
            details: `Se ordenaron ${sortedEdges.length} aristas. Arista más pequeña: ${sortedEdges[0].from} → ${sortedEdges[0].to} (peso: ${sortedEdges[0].weight})`
        });
        
        // Función find para Union-Find
        const find = (x) => {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        };
        
        // Función union para Union-Find
        const union = (x, y) => {
            const rootX = find(x);
            const rootY = find(y);
            
            if (rootX !== rootY) {
                if (rank[rootX] < rank[rootY]) {
                    parent[rootX] = rootY;
                } else if (rank[rootX] > rank[rootY]) {
                    parent[rootY] = rootX;
                } else {
                    parent[rootY] = rootX;
                    rank[rootX]++;
                }
                return true;
            }
            return false;
        };
        
        // Procesar cada arista
        for (const edge of sortedEdges) {
            const rootFrom = find(edge.from);
            const rootTo = find(edge.to);
            
            if (rootFrom !== rootTo) {
                // No forma ciclo, agregar al MST
                mst.push(edge);
                union(edge.from, edge.to);
                
                this.kruskalSteps.push({
                    type: 'add',
                    step: stepNumber++,
                    message: `Paso ${stepNumber - 1}: Agregar arista ${edge.from} → ${edge.to}`,
                    edge: edge,
                    edges: sortedEdges,
                    mst: [...mst],
                    parent: [...parent],
                    details: `Arista seleccionada: ${edge.from} → ${edge.to} (peso: ${edge.weight}). No forma ciclo. Componentes unidas: ${rootFrom} y ${rootTo}`
                });
                
                if (mst.length === vertices - 1) {
                    break;
                }
            } else {
                // Forma ciclo, rechazar
                this.kruskalSteps.push({
                    type: 'reject',
                    step: stepNumber++,
                    message: `Paso ${stepNumber - 1}: Rechazar arista ${edge.from} → ${edge.to}`,
                    edge: edge,
                    edges: sortedEdges,
                    mst: [...mst],
                    parent: [...parent],
                    details: `Arista rechazada: ${edge.from} → ${edge.to} (peso: ${edge.weight}). Forma ciclo (ambos vértices están en el mismo componente: ${rootFrom})`
                });
            }
        }
        
        // Paso final
        this.kruskalSteps.push({
            type: 'complete',
            step: stepNumber,
            message: 'MST completado',
            edges: sortedEdges,
            mst: mst,
            parent: [...parent],
            details: `MST completo con ${mst.length} aristas. Costo total: ${mst.reduce((sum, e) => sum + e.weight, 0).toFixed(2)}`
        });
    }

    // Renderizar paso actual de Kruskal
    renderKruskalStep() {
        if (!this.kruskalSteps || this.kruskalSteps.length === 0) {
            console.error('No hay pasos de Kruskal para renderizar');
            return;
        }
        
        if (this.currentKruskalStep >= this.kruskalSteps.length) {
            this.isKruskalPlaying = false;
            const btn = document.getElementById('play-kruskal-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Completado';
            return;
        }
        
        const step = this.kruskalSteps[this.currentKruskalStep];
        const stepsList = document.getElementById('kruskal-steps-list');
        const svg = document.getElementById('kruskal-svg');
        
        if (!stepsList) {
            console.error('Elemento kruskal-steps-list no encontrado');
            return;
        }
        if (!svg) {
            console.error('Elemento kruskal-svg no encontrado');
            return;
        }
        
        // Renderizar lista de pasos
        let stepsHtml = '';
        this.kruskalSteps.forEach((s, idx) => {
            const isActive = idx === this.currentKruskalStep;
            const isCompleted = idx < this.currentKruskalStep;
            
            stepsHtml += `
                <div class="graph-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${s.type}" 
                     onclick="visualizer.goToKruskalStep(${idx})" style="cursor: pointer;">
                    <div class="graph-step-number">${s.step}</div>
                    <div class="graph-step-content">
                        <div class="graph-step-title">${s.message}</div>
                        ${isActive ? `<div class="graph-step-details">${s.details}</div>` : ''}
                    </div>
                </div>
            `;
        });
        stepsList.innerHTML = stepsHtml;
        
        // Hacer scroll al paso activo
        const activeStep = stepsList.querySelector('.graph-step-item.active');
        if (activeStep) {
            activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Renderizar grafo con el paso actual
        this.drawGraphWithSteps(step.edges, step.mst, step.edge, step.type, svg, 600, 400);
    }

    // Dibujar grafo resaltando el paso actual
    drawGraphWithSteps(allEdges, mstEdges, currentEdge, stepType, svg, width = 600, height = 400) {
        svg.innerHTML = '';
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // Obtener todos los nodos
        const nodes = new Set();
        allEdges.forEach(e => {
            nodes.add(e.from);
            nodes.add(e.to);
        });
        const nodeList = Array.from(nodes);
        
        const radius = Math.min(width, height) * 0.25;
        const centerX = width / 2;
        const centerY = height / 2;
        const nodeRadius = Math.max(15, Math.min(width, height) / 30);
        const fontSize = Math.max(12, Math.min(width, height) / 40);
        
        // Posicionar nodos
        const nodePositions = {};
        nodeList.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodeList.length;
            nodePositions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        // Dibujar todas las aristas (grises, no seleccionadas)
        allEdges.forEach(edge => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            const isInMST = mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from));
            const isCurrent = currentEdge && ((edge.from === currentEdge.from && edge.to === currentEdge.to) || (edge.from === currentEdge.to && edge.to === currentEdge.from));
            
            let strokeColor = '#64748b'; // Gris para aristas no seleccionadas
            let strokeWidth = 1.5;
            
            if (isCurrent) {
                strokeColor = stepType === 'add' ? '#10b981' : stepType === 'reject' ? '#ef4444' : '#f59e0b';
                strokeWidth = 3;
            } else if (isInMST) {
                strokeColor = '#2563eb';
                strokeWidth = 2.5;
            }
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', strokeColor);
            line.setAttribute('stroke-width', strokeWidth.toString());
            if (isCurrent) {
                line.setAttribute('stroke-dasharray', '5,5');
            }
            svg.appendChild(line);
            
            // Label del peso
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('fill', isCurrent ? strokeColor : isInMST ? '#2563eb' : '#64748b');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', isCurrent || isInMST ? 'bold' : 'normal');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });
        
        // Dibujar nodos
        nodeList.forEach(node => {
            const pos = nodePositions[node];
            const isConnectedToCurrent = currentEdge && (node === currentEdge.from || node === currentEdge.to);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', nodeRadius.toString());
            circle.setAttribute('fill', isConnectedToCurrent ? '#f59e0b' : '#2563eb');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + fontSize / 3);
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = node;
            svg.appendChild(text);
        });
    }

    // Reproducir pasos de Kruskal
    playKruskalSteps() {
        if (this.currentKruskalStep >= this.kruskalSteps.length) {
            this.resetKruskalSteps();
            return;
        }
        
        this.isKruskalPlaying = !this.isKruskalPlaying;
        const btn = document.getElementById('play-kruskal-btn') || document.getElementById('play-kruskal-modal-btn');
        if (btn) {
            btn.innerHTML = this.isKruskalPlaying ? 
                '<i class="fas fa-pause"></i> Pausar' : 
                '<i class="fas fa-play"></i> Continuar';
        }
        
        if (this.isKruskalPlaying) {
            this.playNextKruskalStep();
        }
    }

    playNextKruskalStep() {
        if (!this.isKruskalPlaying || this.currentKruskalStep >= this.kruskalSteps.length) {
            this.isKruskalPlaying = false;
            const btn = document.getElementById('play-kruskal-btn') || document.getElementById('play-kruskal-modal-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Completado';
            return;
        }
        
        // Renderizar según el contexto (modal o página)
        const modalStepsList = document.getElementById('kruskal-modal-steps-list');
        if (modalStepsList) {
            this.renderKruskalStepInModal();
        } else {
            this.renderKruskalStep();
        }
        
        this.currentKruskalStep++;
        
        if (this.isKruskalPlaying) {
            setTimeout(() => this.playNextKruskalStep(), 1500);
        }
    }

    resetKruskalSteps() {
        this.currentKruskalStep = 0;
        this.isKruskalPlaying = false;
        const btn = document.getElementById('play-kruskal-btn') || document.getElementById('play-kruskal-modal-btn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
        
        // Renderizar según el contexto
        const modalStepsList = document.getElementById('kruskal-modal-steps-list');
        if (modalStepsList) {
            this.renderKruskalStepInModal();
        } else {
            this.renderKruskalStep();
        }
    }

    goToKruskalStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.kruskalSteps.length) {
            this.currentKruskalStep = stepIndex;
            this.isKruskalPlaying = false;
            const btn = document.getElementById('play-kruskal-btn') || document.getElementById('play-kruskal-modal-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Continuar';
            
            // Renderizar según el contexto
            const modalStepsList = document.getElementById('kruskal-modal-steps-list');
            if (modalStepsList) {
                this.renderKruskalStepInModal();
            } else {
                this.renderKruskalStep();
            }
        }
    }

    // Visualizar Dijkstra paso a paso
    visualizeDijkstraStepByStep(edges, vertices, source, elementId) {
        console.log('visualizeDijkstraStepByStep llamada', { edges, vertices, source, elementId });
        const container = document.getElementById(elementId);
        if (!container) {
            console.error('Contenedor no encontrado:', elementId);
            alert('Error: No se encontró el contenedor para la visualización. ID: ' + elementId);
            return;
        }

        container.classList.add('active');
        container.style.display = 'block';
        
        // Guardar datos para visualización
        this.currentGraphEdges = edges;
        this.currentGraphElementId = elementId;
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-route"></i> Algoritmo de Dijkstra - Paso a Paso</h4>
                    <div class="viz-controls">
                        <button class="btn-viz" onclick="visualizer.playDijkstraSteps()" id="play-dijkstra-btn">
                            <i class="fas fa-play"></i> Iniciar
                        </button>
                        <button class="btn-viz" onclick="visualizer.resetDijkstraSteps()">
                            <i class="fas fa-redo"></i> Reiniciar
                        </button>
                        <button class="btn-viz btn-fullscreen" id="btn-fullscreen-dijkstra-steps" title="Pantalla completa">
                            <i class="fas fa-expand"></i> Ampliar
                        </button>
                    </div>
                </div>
                <div class="viz-explanation">
                    <p><strong>Algoritmo Dijkstra:</strong> Encuentra los caminos más cortos desde un vértice origen a todos los demás usando una cola de prioridad. Complejidad: O((V + E) log V)</p>
                </div>
                <div class="graph-steps-container" id="dijkstra-steps-container-main">
                    <div class="graph-steps-sidebar" id="dijkstra-steps-list"></div>
                    <div class="graph-steps-visualization" id="dijkstra-steps-viz-area">
                        <svg width="600" height="400" class="graph-svg-steps" id="dijkstra-svg"></svg>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        // Inicializar pasos de Dijkstra
        try {
            this.initializeDijkstraSteps(edges, vertices, source);
            
            // Pequeño delay para asegurar que el DOM esté listo
            setTimeout(() => {
                this.renderDijkstraStep();
            }, 50);
            
            // Agregar event listener al botón de pantalla completa
            setTimeout(() => {
                const fullscreenBtn = document.getElementById('btn-fullscreen-dijkstra-steps');
                if (fullscreenBtn) {
                    fullscreenBtn.addEventListener('click', () => {
                        this.openGraphFullscreen();
                    });
                } else {
                    console.warn('Botón de pantalla completa no encontrado');
                }
            }, 100);
        } catch (error) {
            console.error('Error al inicializar pasos de Dijkstra:', error);
            container.innerHTML = `<div class="error-message">Error al inicializar visualización: ${error.message}</div>`;
        }
    }

    // Inicializar pasos de Dijkstra
    initializeDijkstraSteps(edges, vertices, source) {
        this.dijkstraSteps = [];
        this.currentDijkstraStep = 0;
        this.isDijkstraPlaying = false;
        
        // Construir lista de adyacencia
        const adjacencyList = {};
        for (let i = 0; i < vertices; i++) {
            adjacencyList[i] = [];
        }
        edges.forEach(edge => {
            adjacencyList[edge.from].push([edge.to, edge.weight]);
        });
        
        // Inicializar distancias
        const distances = new Array(vertices).fill(Number.MAX_SAFE_INTEGER);
        distances[source] = 0;
        
        const visited = new Array(vertices).fill(false);
        const previous = new Array(vertices).fill(-1);
        
        // Cola de prioridad (simulada con array ordenado)
        const pq = [{id: source, distance: 0}];
        
        // Paso inicial
        this.dijkstraSteps.push({
            type: 'init',
            step: 0,
            message: `Inicialización: Origen = vértice ${source}`,
            distances: distances.map(d => d === Number.MAX_SAFE_INTEGER ? Infinity : d),
            visited: [...visited],
            current: source,
            pq: [...pq],
            details: `Distancia a ${source}: 0, todas las demás: ∞. Cola de prioridad inicializada con vértice ${source}.`
        });
        
        let stepNumber = 1;
        
        // Ejecutar Dijkstra
        while (pq.length > 0) {
            // Ordenar cola por distancia
            pq.sort((a, b) => a.distance - b.distance);
            const current = pq.shift();
            const u = current.id;
            
            if (visited[u]) {
                continue;
            }
            
            visited[u] = true;
            
            // Paso: visitar vértice
            this.dijkstraSteps.push({
                type: 'visit',
                step: stepNumber++,
                message: `Paso ${stepNumber - 1}: Visitar vértice ${u}`,
                distances: distances.map(d => d === Number.MAX_SAFE_INTEGER ? Infinity : d),
                visited: [...visited],
                current: u,
                previous: [...previous],
                pq: [...pq],
                details: `Se visita el vértice ${u} con distancia ${distances[u]}. Es el más cercano al origen. Ahora se explorarán sus vecinos.`
            });
            
            // Relajar aristas vecinas
            if (adjacencyList[u]) {
                for (const [v, weight] of adjacencyList[u]) {
                    if (!visited[v]) {
                        const newDistance = distances[u] + weight;
                        
                        if (newDistance < distances[v]) {
                            const oldDistance = distances[v];
                            const distanceFromU = distances[u];
                            
                            // Actualizar primero
                            distances[v] = newDistance;
                            previous[v] = u;
                            
                            // Agregar a la cola
                            pq.push({id: v, distance: newDistance});
                            
                            // Paso después de actualizar (mostrar el resultado)
                            this.dijkstraSteps.push({
                                type: 'relax',
                                step: stepNumber++,
                                message: `Paso ${stepNumber - 1}: Relajar arista ${u} → ${v}`,
                                distances: distances.map(d => d === Number.MAX_SAFE_INTEGER ? Infinity : d),
                                visited: [...visited],
                                current: u,
                                edge: {from: u, to: v, weight: weight},
                                previous: [...previous],
                                pq: [...pq],
                                details: `Distancia a ${v} actualizada: ${oldDistance === Number.MAX_SAFE_INTEGER ? '∞' : oldDistance} → ${newDistance} (${distanceFromU} + ${weight}). Vértice ${v} agregado a la cola de prioridad.`
                            });
                        }
                        // No agregamos paso cuando no mejora para reducir verbosidad
                    }
                }
            }
        }
        
        // Paso final
        this.dijkstraSteps.push({
            type: 'complete',
            step: stepNumber,
            message: 'Dijkstra completado',
            distances: distances.map(d => d === Number.MAX_SAFE_INTEGER ? Infinity : d),
            visited: visited,
            previous: previous,
            current: -1,
            details: `Algoritmo completado. Distancias desde ${source}: ${distances.map((d, i) => `${i}: ${d === Number.MAX_SAFE_INTEGER ? '∞' : d.toFixed(1)}`).join(', ')}`
        });
    }

    // Renderizar paso actual de Dijkstra
    renderDijkstraStep() {
        if (!this.dijkstraSteps || this.dijkstraSteps.length === 0) {
            console.error('No hay pasos de Dijkstra para renderizar');
            return;
        }
        
        if (this.currentDijkstraStep >= this.dijkstraSteps.length) {
            this.isDijkstraPlaying = false;
            const btn = document.getElementById('play-dijkstra-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Completado';
            return;
        }
        
        const step = this.dijkstraSteps[this.currentDijkstraStep];
        const stepsList = document.getElementById('dijkstra-steps-list');
        const svg = document.getElementById('dijkstra-svg');
        
        if (!stepsList) {
            console.error('Elemento dijkstra-steps-list no encontrado');
            return;
        }
        if (!svg) {
            console.error('Elemento dijkstra-svg no encontrado');
            return;
        }
        
        // Renderizar lista de pasos
        let stepsHtml = '';
        this.dijkstraSteps.forEach((s, idx) => {
            const isActive = idx === this.currentDijkstraStep;
            const isCompleted = idx < this.currentDijkstraStep;
            
            stepsHtml += `
                <div class="graph-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${s.type}" 
                     onclick="visualizer.goToDijkstraStep(${idx})" style="cursor: pointer;">
                    <div class="graph-step-number">${s.step}</div>
                    <div class="graph-step-content">
                        <div class="graph-step-title">${s.message}</div>
                        ${isActive ? `<div class="graph-step-details">${s.details}</div>` : ''}
                        ${isActive && s.distances ? `
                            <div class="graph-step-distances">
                                <strong>Distancias:</strong> ${s.distances.map((d, i) => {
                                    const distValue = d === Number.MAX_SAFE_INTEGER || d === Infinity ? '∞' : d.toFixed(1);
                                    const isCurrent = i === s.current;
                                    return `<span class="${isCurrent ? 'current-vertex' : ''}">${i}: ${distValue}</span>`;
                                }).join(', ')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        stepsList.innerHTML = stepsHtml;
        
        // Hacer scroll al paso activo
        const activeStep = stepsList.querySelector('.graph-step-item.active');
        if (activeStep) {
            activeStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Renderizar grafo con el paso actual
        this.drawDijkstraStep(step, svg, 600, 400);
    }

    // Dibujar grafo con estado de Dijkstra
    drawDijkstraStep(step, svg, width = 600, height = 400) {
        if (!step || !this.currentGraphEdges) return;
        
        svg.innerHTML = '';
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // Obtener todos los nodos desde las aristas
        const nodes = new Set();
        this.currentGraphEdges.forEach(e => {
            nodes.add(e.from);
            nodes.add(e.to);
        });
        const nodeList = Array.from(nodes).sort((a, b) => a - b);
        
        const radius = Math.min(width, height) * 0.25;
        const centerX = width / 2;
        const centerY = height / 2;
        const nodeRadius = Math.max(15, Math.min(width, height) / 30);
        const fontSize = Math.max(12, Math.min(width, height) / 40);
        
        // Posicionar nodos
        const nodePositions = {};
        nodeList.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodeList.length;
            nodePositions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });
        
        // Dibujar aristas
        this.currentGraphEdges.forEach(edge => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            const isCurrentEdge = step.edge && step.edge.from === edge.from && step.edge.to === edge.to;
            
            let strokeColor = '#64748b';
            let strokeWidth = 1.5;
            
            if (isCurrentEdge) {
                strokeColor = step.type === 'relax' ? '#10b981' : '#f59e0b';
                strokeWidth = 3;
            }
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', strokeColor);
            line.setAttribute('stroke-width', strokeWidth.toString());
            if (isCurrentEdge) {
                line.setAttribute('stroke-dasharray', '5,5');
            }
            svg.appendChild(line);
            
            // Label del peso
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('fill', isCurrentEdge ? strokeColor : '#64748b');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', isCurrentEdge ? 'bold' : 'normal');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });
        
        // Dibujar nodos
        nodeList.forEach(node => {
            const pos = nodePositions[node];
            const isCurrent = step.current === node;
            const isVisited = step.visited && step.visited[node];
            const distance = step.distances && step.distances[node];
            
            let fillColor = '#2563eb';
            if (isCurrent) {
                fillColor = '#f59e0b';
            } else if (isVisited) {
                fillColor = '#10b981';
            }
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', nodeRadius.toString());
            circle.setAttribute('fill', fillColor);
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            svg.appendChild(circle);
            
            // Etiqueta del nodo
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + fontSize / 3);
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = node;
            svg.appendChild(text);
            
            // Mostrar distancia
            if (distance !== undefined && distance !== null) {
                const distText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                distText.setAttribute('x', pos.x);
                distText.setAttribute('y', pos.y - nodeRadius - 5);
                distText.setAttribute('fill', '#10b981');
                distText.setAttribute('font-size', (fontSize * 0.8).toString());
                distText.setAttribute('font-weight', 'bold');
                distText.setAttribute('text-anchor', 'middle');
                const distValue = distance === Number.MAX_SAFE_INTEGER || distance === Infinity ? '∞' : distance.toFixed(1);
                distText.textContent = distValue;
                svg.appendChild(distText);
            }
        });
    }

    // Reproducir pasos de Dijkstra
    playDijkstraSteps() {
        if (this.currentDijkstraStep >= this.dijkstraSteps.length) {
            this.resetDijkstraSteps();
            return;
        }
        
        this.isDijkstraPlaying = !this.isDijkstraPlaying;
        const btn = document.getElementById('play-dijkstra-btn');
        if (btn) {
            btn.innerHTML = this.isDijkstraPlaying ? 
                '<i class="fas fa-pause"></i> Pausar' : 
                '<i class="fas fa-play"></i> Continuar';
        }
        
        if (this.isDijkstraPlaying) {
            this.playNextDijkstraStep();
        }
    }

    playNextDijkstraStep() {
        if (!this.isDijkstraPlaying || this.currentDijkstraStep >= this.dijkstraSteps.length) {
            this.isDijkstraPlaying = false;
            return;
        }
        
        this.renderDijkstraStep();
        this.currentDijkstraStep++;
        
        if (this.isDijkstraPlaying) {
            setTimeout(() => this.playNextDijkstraStep(), 1500);
        }
    }

    resetDijkstraSteps() {
        this.currentDijkstraStep = 0;
        this.isDijkstraPlaying = false;
        const btn = document.getElementById('play-dijkstra-btn');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
        this.renderDijkstraStep();
    }

    goToDijkstraStep(stepIndex) {
        if (stepIndex >= 0 && stepIndex < this.dijkstraSteps.length) {
            this.currentDijkstraStep = stepIndex;
            this.isDijkstraPlaying = false;
            const btn = document.getElementById('play-dijkstra-btn');
            if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Continuar';
            this.renderDijkstraStep();
        }
    }

    // Visualizar grafo
    visualizeGraph(edges, elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.classList.add('active');
        
        // Guardar edges para poder redibujar en pantalla completa
        this.currentGraphEdges = edges;
        this.currentGraphElementId = elementId;
        
        let html = `
            <div class="visualization-container">
                <div class="viz-header">
                    <h4><i class="fas fa-project-diagram"></i> Visualización del Grafo</h4>
                    <div class="viz-controls">
                        <button class="btn-viz btn-fullscreen" id="btn-fullscreen-graph" onclick="openGraphFullscreen(); return false;" title="Pantalla completa">
                            <i class="fas fa-expand"></i> Ampliar
                        </button>
                    </div>
                </div>
                <div class="graph-visualization" id="graph-viz">
                    <svg width="600" height="400" class="graph-svg" viewBox="0 0 600 400"></svg>
                </div>
            </div>
        `;
        container.innerHTML = html;

        this.drawGraph(edges, document.querySelector('.graph-svg'), 600, 400);
        
        // Agregar event listener al botón después de crear el HTML (doble método para asegurar compatibilidad)
        const fullscreenBtn = document.getElementById('btn-fullscreen-graph');
        if (fullscreenBtn) {
            // Remover el onclick inline y usar event listener
            fullscreenBtn.removeAttribute('onclick');
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.currentGraphEdges && this.currentGraphEdges.length > 0) {
                    this.openGraphFullscreen();
                } else {
                    console.error('No hay grafo para visualizar');
                    alert('Error: No hay grafo para visualizar en pantalla completa');
                }
            });
        } else {
            console.error('Botón de pantalla completa no encontrado');
        }
    }

    drawGraph(edges, svg, width = 600, height = 400) {
        // Limpiar SVG primero
        svg.innerHTML = '';
        
        // Ajustar viewBox para que se escale correctamente
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        
        // Crear nodos únicos
        const nodes = new Set();
        edges.forEach(e => {
            nodes.add(e.from);
            nodes.add(e.to);
        });
        
        const nodeList = Array.from(nodes);
        
        // Calcular dimensiones dinámicas basadas en el tamaño del SVG
        const radius = Math.min(width, height) * 0.25;
        const centerX = width / 2;
        const centerY = height / 2;
        const nodeRadius = Math.max(15, Math.min(width, height) / 30);
        const fontSize = Math.max(12, Math.min(width, height) / 40);
        const strokeWidth = Math.max(1.5, Math.min(width, height) / 300);
        
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
            line.setAttribute('stroke-width', strokeWidth.toString());
            svg.appendChild(line);
            
            // Label del peso
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('fill', '#10b981');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edge.weight;
            svg.appendChild(text);
        });

        // Dibujar nodos
        nodeList.forEach(node => {
            const pos = nodePositions[node];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', nodeRadius.toString());
            circle.setAttribute('fill', '#2563eb');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', strokeWidth.toString());
            svg.appendChild(circle);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y + fontSize / 3);
            text.setAttribute('fill', '#fff');
            text.setAttribute('font-size', fontSize.toString());
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = node;
            svg.appendChild(text);
        });
    }

    // Abrir grafo en pantalla completa
    openGraphFullscreen() {
        if (!this.currentGraphEdges || this.currentGraphEdges.length === 0) {
            alert('No hay grafo para visualizar');
            return;
        }

        // Crear modal de pantalla completa
        const modal = document.createElement('div');
        modal.className = 'graph-fullscreen-modal';
        modal.id = 'graph-fullscreen-modal';
        modal.innerHTML = `
            <div class="graph-fullscreen-content">
                <div class="graph-fullscreen-header">
                    <h3><i class="fas fa-project-diagram"></i> Visualización del Grafo - Pantalla Completa</h3>
                    <div class="graph-fullscreen-controls">
                        <button class="btn-fullscreen-close" id="btn-close-fullscreen" title="Cerrar (ESC)">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                    </div>
                </div>
                <div class="graph-fullscreen-body" id="graph-fullscreen-body">
                    <svg class="graph-fullscreen-svg" id="graph-fullscreen-svg"></svg>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Agregar event listener al botón de cerrar
        const closeBtn = document.getElementById('btn-close-fullscreen');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeGraphFullscreen();
            });
        }
        
        // Función para redibujar el grafo con nuevas dimensiones
        const redrawGraph = () => {
            const body = document.getElementById('graph-fullscreen-body');
            if (!body) return;
            
            const width = body.clientWidth - 64; // Restar padding
            const height = body.clientHeight - 64;
            
            const fullscreenSvg = document.getElementById('graph-fullscreen-svg');
            if (fullscreenSvg && this.currentGraphEdges) {
                this.drawGraph(this.currentGraphEdges, fullscreenSvg, width, height);
            }
        };
        
        // Dibujar grafo inicial después de un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            redrawGraph();
        }, 100);
        
        // Redibujar cuando cambie el tamaño de la ventana
        const resizeHandler = () => {
            redrawGraph();
        };
        window.addEventListener('resize', resizeHandler);
        this.fullscreenResizeHandler = resizeHandler;
        
        // Cerrar con Escape
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeGraphFullscreen();
            }
        };
        document.addEventListener('keydown', closeHandler);
        this.fullscreenCloseHandler = closeHandler;
        
        // Cerrar haciendo clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeGraphFullscreen();
            }
        });
    }

    // Cerrar pantalla completa
    closeGraphFullscreen() {
        const modal = document.getElementById('graph-fullscreen-modal');
        if (modal) {
            modal.remove();
        }
        
        // Limpiar event listeners
        if (this.fullscreenResizeHandler) {
            window.removeEventListener('resize', this.fullscreenResizeHandler);
            this.fullscreenResizeHandler = null;
        }
        
        if (this.fullscreenCloseHandler) {
            document.removeEventListener('keydown', this.fullscreenCloseHandler);
            this.fullscreenCloseHandler = null;
        }
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
// Asegurar que esté disponible globalmente
window.visualizer = visualizer;

