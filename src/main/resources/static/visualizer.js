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

        this.drawGraph(edges, document.querySelector('.graph-svg'), null);
    }

    drawGraph(edges, svg, indexToCenter = null) {
        // Limpiar SVG
        svg.innerHTML = '';
        
        // Obtener dimensiones del SVG - usar todo el espacio disponible pero sin salirse
        const container = svg.parentElement;
        // Obtener dimensiones reales del contenedor, restando el padding
        const containerRect = container ? container.getBoundingClientRect() : null;
        const containerPadding = 40; // Padding del contenedor
        const headerHeight = 35; // Altura del header con el mensaje
        const containerWidth = containerRect ? (containerRect.width - (containerPadding * 2)) : 800;
        const containerHeight = containerRect ? (containerRect.height - containerPadding - headerHeight) : 800;
        
        // Asegurar que no exceda los límites
        const svgWidth = Math.max(800, containerWidth > 0 ? containerWidth : 1200);
        const svgHeight = Math.max(700, containerHeight > 0 ? containerHeight : 800);
        
        // Actualizar atributos del SVG para usar todo el espacio pero mantener dentro del contenedor
        svg.setAttribute('width', svgWidth);
        svg.setAttribute('height', svgHeight);
        svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Crear un grupo para el pan (traslación)
        let panGroup = svg.querySelector('g.pan-group');
        if (!panGroup) {
            panGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            panGroup.setAttribute('class', 'pan-group');
            panGroup.setAttribute('transform', 'translate(0, 0)');
            svg.appendChild(panGroup);
        } else {
            panGroup.innerHTML = ''; // Limpiar contenido anterior
        }
        
        // Variables para pan (arrastrar el fondo)
        let isPanning = false;
        let panStartX = 0;
        let panStartY = 0;
        let panCurrentX = 0;
        let panCurrentY = 0;
        
        // Variable compartida para rastrear si algún nodo está siendo arrastrado
        let anyNodeDragging = false;
        
        // Crear nodos únicos
        const nodes = new Set();
        edges.forEach(e => {
            nodes.add(e.from);
            nodes.add(e.to);
        });
        
        const nodeList = Array.from(nodes);
        const nodeCount = nodeList.length;
        
        // Calcular radio del círculo - usar TODO el espacio disponible
        const padding = 150; // Espacio mínimo desde los bordes
        const availableWidth = svgWidth - (padding * 2);
        const availableHeight = svgHeight - (padding * 2);
        // Usar el máximo espacio posible para el radio
        const baseRadius = Math.min(availableWidth, availableHeight) * 0.45;
        // Aumentar el radio significativamente si hay muchos nodos
        const radius = baseRadius * (1 + Math.max(0, (nodeCount - 5) * 0.12));
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        
        // Límites para los nodos (para que no se salgan del área visible)
        const nodeMinX = padding;
        const nodeMaxX = svgWidth - padding;
        const nodeMinY = padding;
        const nodeMaxY = svgHeight - padding;
        
        // Almacenar posiciones para poder actualizarlas al arrastrar
        const nodePositions = {};
        const nodeInfo = {};
        const nodeElements = {};
        const edgeElements = [];
        
        // Función helper para obtener el nombre completo y corto del nodo
        const getNodeInfo = (nodeIndex) => {
            if (indexToCenter && indexToCenter[nodeIndex]) {
                const centerName = indexToCenter[nodeIndex].name;
                // Extraer solo la parte importante del nombre (después de "Centro")
                const parts = centerName.split(' ');
                let shortName = centerName;
                if (parts.length > 2) {
                    // Si tiene más de 2 palabras, tomar solo las últimas 2
                    shortName = parts.slice(-2).join(' ');
                }
                // Si aún es muy largo, truncar inteligentemente
                if (shortName.length > 20) {
                    shortName = shortName.substring(0, 17) + '...';
                }
                return {
                    full: centerName,
                    short: shortName,
                    id: indexToCenter[nodeIndex].id || `DC${nodeIndex}`
                };
            }
            return {
                full: `Centro ${nodeIndex}`,
                short: `C${nodeIndex}`,
                id: `DC${nodeIndex}`
            };
        };
        
        // Posicionar nodos en círculo con mejor espaciado
        nodeList.forEach((node, i) => {
            const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2; // Empezar desde arriba
            nodePositions[node] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
            nodeInfo[node] = getNodeInfo(node);
        });
        
        // Función para actualizar las aristas cuando se mueve un nodo
        const updateEdges = () => {
            edgeElements.forEach(edgeData => {
                const from = nodePositions[edgeData.from];
                const to = nodePositions[edgeData.to];
                edgeData.line.setAttribute('x1', from.x);
                edgeData.line.setAttribute('y1', from.y);
                edgeData.line.setAttribute('x2', to.x);
                edgeData.line.setAttribute('y2', to.y);
                
                // Actualizar posición del label
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const labelX = from.x + (dx * 0.35);
                const labelY = from.y + (dy * 0.35);
                
                edgeData.bgRect.setAttribute('x', labelX - 28);
                edgeData.bgRect.setAttribute('y', labelY - 10);
                edgeData.text.setAttribute('x', labelX);
                edgeData.text.setAttribute('y', labelY + 3);
            });
        };
        
        // Dibujar aristas primero (para que queden detrás de los nodos)
        edges.forEach((edge, index) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            
            // Línea de la arista
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x);
            line.setAttribute('y1', from.y);
            line.setAttribute('x2', to.x);
            line.setAttribute('y2', to.y);
            line.setAttribute('stroke', '#60a5fa');
            line.setAttribute('stroke-width', '3');
            line.setAttribute('opacity', '0.8');
            line.setAttribute('pointer-events', 'none'); // No interferir con el pan
            panGroup.appendChild(line);
            
            // Fondo para el label del peso (para mejor legibilidad)
            // Colocar el label más cerca de uno de los nodos para evitar el centro
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            // Colocar el label a 1/3 del camino desde el nodo origen
            const labelX = from.x + (dx * 0.35);
            const labelY = from.y + (dy * 0.35);
            
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('x', labelX - 28);
            bgRect.setAttribute('y', labelY - 10);
            bgRect.setAttribute('width', '56');
            bgRect.setAttribute('height', '18');
            bgRect.setAttribute('fill', '#1e293b');
            bgRect.setAttribute('rx', '4');
            bgRect.setAttribute('stroke', '#10b981');
            bgRect.setAttribute('stroke-width', '1.5');
            bgRect.setAttribute('opacity', '0.95');
            bgRect.setAttribute('pointer-events', 'none'); // No interferir con el pan
            panGroup.appendChild(bgRect);
            
            // Label del peso
            const weightText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            weightText.setAttribute('x', labelX);
            weightText.setAttribute('y', labelY + 3);
            weightText.setAttribute('fill', '#10b981');
            weightText.setAttribute('font-size', '10');
            weightText.setAttribute('font-weight', 'bold');
            weightText.setAttribute('text-anchor', 'middle');
            weightText.setAttribute('pointer-events', 'none'); // No interferir con el pan
            weightText.textContent = `$${edge.weight}`;
            panGroup.appendChild(weightText);
            
            // Guardar referencia para actualizar al mover nodos
            edgeElements.push({
                from: edge.from,
                to: edge.to,
                line: line,
                bgRect: bgRect,
                text: weightText
            });
        });

        // Dibujar nodos con mejor diseño y hacerlos arrastrables
        nodeList.forEach(node => {
            const pos = nodePositions[node];
            const info = nodeInfo[node];
            
            // Círculo del nodo (más grande para que se vean mejor los nombres)
            const nodeRadius = nodeCount > 12 ? 50 : 60;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', nodeRadius);
            circle.setAttribute('fill', '#1e40af');
            circle.setAttribute('stroke', '#60a5fa');
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('class', 'graph-node');
            circle.setAttribute('data-node-id', info.id);
            circle.setAttribute('data-node-name', info.full);
            circle.style.cursor = 'move';
            panGroup.appendChild(circle);
            
            // Guardar referencia al círculo
            nodeElements[node] = { circle: circle, texts: [] };
            
            // Hacer el nodo arrastrable con límites
            let isDragging = false;
            let currentX, currentY;
            
            const startDrag = (e) => {
                e.stopPropagation(); // Evitar que active el pan
                isDragging = true;
                anyNodeDragging = true; // Marcar que un nodo está siendo arrastrado
                const point = svg.createSVGPoint();
                point.x = e.clientX || e.touches[0].clientX;
                point.y = e.clientY || e.touches[0].clientY;
                const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
                // Ajustar por el pan actual
                const panTransform = panGroup.getAttribute('transform');
                const panMatch = panTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                const panX = panMatch ? parseFloat(panMatch[1]) : 0;
                const panY = panMatch ? parseFloat(panMatch[2]) : 0;
                currentX = svgPoint.x - panX - nodePositions[node].x;
                currentY = svgPoint.y - panY - nodePositions[node].y;
            };
            
            const drag = (e) => {
                if (!isDragging) return;
                e.stopPropagation(); // Evitar que active el pan
                const point = svg.createSVGPoint();
                point.x = e.clientX || (e.touches && e.touches[0].clientX);
                point.y = e.clientY || (e.touches && e.touches[0].clientY);
                const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
                
                // Ajustar por el pan actual
                const panTransform = panGroup.getAttribute('transform');
                const panMatch = panTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                const panX = panMatch ? parseFloat(panMatch[1]) : 0;
                const panY = panMatch ? parseFloat(panMatch[2]) : 0;
                
                let newX = svgPoint.x - panX - currentX;
                let newY = svgPoint.y - panY - currentY;
                
                // Aplicar límites para que el nodo no se salga del área visible
                const nodeRadius = nodeCount > 12 ? 50 : 60;
                newX = Math.max(nodeMinX + nodeRadius, Math.min(nodeMaxX - nodeRadius, newX));
                newY = Math.max(nodeMinY + nodeRadius, Math.min(nodeMaxY - nodeRadius, newY));
                
                nodePositions[node].x = newX;
                nodePositions[node].y = newY;
                
                // Actualizar posición del círculo
                circle.setAttribute('cx', nodePositions[node].x);
                circle.setAttribute('cy', nodePositions[node].y);
                
                // Actualizar posición de los textos
                nodeElements[node].texts.forEach((text, i) => {
                    const lineHeight = 14;
                    const startY = nodePositions[node].y - ((nodeElements[node].texts.length - 1) * lineHeight / 2);
                    text.setAttribute('x', nodePositions[node].x);
                    text.setAttribute('y', startY + (i * lineHeight));
                });
                
                // Actualizar aristas
                updateEdges();
            };
            
            const endDrag = (e) => {
                if (isDragging) {
                    e.stopPropagation(); // Evitar que active el pan
                }
                isDragging = false;
                anyNodeDragging = false; // Marcar que ningún nodo está siendo arrastrado
            };
            
            circle.addEventListener('mousedown', startDrag);
            circle.addEventListener('touchstart', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchend', endDrag);
            
            // Texto del nombre (dividir en líneas si es necesario)
            const nameParts = info.short.split(' ');
            const maxCharsPerLine = 16; // Más caracteres por línea para nombres más largos
            const lines = [];
            let currentLine = '';
            
            nameParts.forEach(part => {
                if ((currentLine + ' ' + part).length <= maxCharsPerLine) {
                    currentLine = currentLine ? currentLine + ' ' + part : part;
                } else {
                    if (currentLine) lines.push(currentLine);
                    currentLine = part;
                }
            });
            if (currentLine) lines.push(currentLine);
            
            // Si solo hay una línea pero es muy larga, dividirla
            if (lines.length === 1 && lines[0].length > maxCharsPerLine) {
                const originalLine = lines[0];
                const mid = Math.floor(originalLine.length / 2);
                const spaceIndex = originalLine.lastIndexOf(' ', mid);
                if (spaceIndex > 0) {
                    lines[0] = originalLine.substring(0, spaceIndex);
                    lines[1] = originalLine.substring(spaceIndex + 1);
                } else {
                    lines[0] = originalLine.substring(0, mid);
                    lines[1] = originalLine.substring(mid);
                }
            }
            
            const lineHeight = 14; // Más espacio entre líneas
            const startY = pos.y - ((lines.length - 1) * lineHeight / 2);
            
            lines.forEach((line, i) => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', pos.x);
                text.setAttribute('y', startY + (i * lineHeight));
                text.setAttribute('fill', '#ffffff');
                text.setAttribute('font-size', nodeCount > 12 ? '12' : '13'); // Fuente más grande
                text.setAttribute('font-weight', '600');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('pointer-events', 'none'); // No interferir con el arrastre
                text.textContent = line;
                panGroup.appendChild(text);
                nodeElements[node].texts.push(text);
            });
            
            // Tooltip (título) para mostrar nombre completo al hacer hover
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `${info.full} (${info.id})`;
            circle.appendChild(title);
        });
        
        // Implementar pan (arrastrar el fondo) para navegar el grafo
        const startPan = (e) => {
            // Solo activar pan si no se está arrastrando un nodo
            if (anyNodeDragging) return;
            isPanning = true;
            panStartX = e.clientX || (e.touches && e.touches[0].clientX);
            panStartY = e.clientY || (e.touches && e.touches[0].clientY);
            const panTransform = panGroup.getAttribute('transform');
            const panMatch = panTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            if (panMatch) {
                panCurrentX = parseFloat(panMatch[1]);
                panCurrentY = parseFloat(panMatch[2]);
            }
            svg.style.cursor = 'grabbing';
        };
        
        const doPan = (e) => {
            if (!isPanning) return;
            const currentX = e.clientX || (e.touches && e.touches[0].clientX);
            const currentY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const dx = currentX - panStartX;
            const dy = currentY - panStartY;
            
            const newPanX = panCurrentX + dx;
            const newPanY = panCurrentY + dy;
            
            panGroup.setAttribute('transform', `translate(${newPanX}, ${newPanY})`);
        };
        
        const endPan = () => {
            isPanning = false;
            svg.style.cursor = 'grab';
        };
        
        // Agregar listeners para pan en el SVG (fondo)
        svg.style.cursor = 'grab';
        svg.addEventListener('mousedown', startPan);
        svg.addEventListener('touchstart', startPan);
        document.addEventListener('mousemove', doPan);
        document.addEventListener('touchmove', doPan);
        document.addEventListener('mouseup', endPan);
        document.addEventListener('touchend', endPan);
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



