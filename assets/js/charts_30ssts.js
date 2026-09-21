// Extensão do objeto LIACharts para o módulo 30sSTS
window.LIACharts = window.LIACharts || {};

Object.assign(window.LIACharts, {

    init30sSTS() {
        // Destruir instâncias anteriores se existirem (prevenção de memory leak)
        const chartIds = [
            'stsDynamicsChart', 'stsSegmentationChart', 'stsHistoryChart'
        ];
        
        chartIds.forEach(id => {
            if (this.instances && this.instances[id]) {
                this.instances[id].destroy();
            }
        });

        if (!this.instances) this.instances = {};

        // Gerar Dados Simulados
        const data = this.generate30sSTSData();
        // Guardar dados para reutilização entre abas
        this.signalData = data;

        // Popular UI
        this.populateIndicators(data);

        // Renderizar Gráficos da aba Resumo
        this.renderDynamicsChart(data);
        this.renderSegmentationChart(data);
        this.renderHistoryChart();
    },

    initSignalsTab() {
        console.log('[LIA][Signals] initSignalsTab executado');
        
        // If data not yet generated, generate it now (fallback for race conditions)
        if (!this.signalData) {
            console.log('[LIA][Signals] this.signalData não existe. Gerando dados de fallback...');
            if (!this.instances) this.instances = {};
            this.signalData = this.generate30sSTSData();
        } else {
            console.log('[LIA][Signals] signalData disponível (reaproveitando).');
        }
        
        requestAnimationFrame(() => {
            console.log('[LIA][Signals] setup UI');
            this._setupSignalsUI(this.signalData);
        });
    },

    initIndicadoresTab() {
        console.log('[LIA][Indicadores] initIndicadoresTab executado');
        
        if (!this.signalData) {
            console.log('[LIA][Indicadores] Gerando dados de fallback...');
            if (!this.instances) this.instances = {};
            this.signalData = this.generate30sSTSData();
        }
        
        requestAnimationFrame(() => {
            this._setupIndicadoresUI(this.signalData);
        });
    },

    initComparacaoTab() {
        console.log('[LIA][Comparacao] initComparacaoTab executado');
        if (!this.signalData) {
            console.log('[LIA][Comparacao] Gerando dados de fallback...');
            if (!this.instances) this.instances = {};
            this.signalData = this.generate30sSTSData();
        }
        requestAnimationFrame(() => {
            this._setupComparacaoUI(this.signalData);
        });
    },


    generate30sSTSData() {
        const trunkAngleData = [];
        const segments = [];
        const cycles = [];
        const events = [];
        
        const numReps = 12; // 12 ciclos em 30s
        const totalDurationTarget = 30; // 30 seconds
        const hz = 50; // 50 samples per second
        
        let currentTime = 0;
        
        const rand = (min, max) => Math.random() * (max - min) + min;
        
        for (let i = 1; i <= numReps; i++) {
            // Ciclos mais curtos para caberem 12 em 30s (média ~2.5s por ciclo)
            // Ligeira perda de velocidade no fim
            const fatigue = i > 8 ? rand(1.1, 1.3) : 1.0; 
            const tSentado = rand(0.3, 0.6) * fatigue;
            const tLevantando = rand(0.5, 0.8) * fatigue;
            const tEmPe = rand(0.4, 0.7) * fatigue;
            const tSentando = rand(0.5, 0.8) * fatigue;
            
            const cycleStart = currentTime;
            let cycleMaxAngle = -999;
            let cycleMinAngle = 999;
            
            const addPoint = (t, y) => {
                trunkAngleData.push({ x: currentTime + t, y: y });
                if(y > cycleMaxAngle) cycleMaxAngle = y;
                if(y < cycleMinAngle) cycleMinAngle = y;
            };

            // 1. Sentado (~10°)
            segments.push({ cycle: i, phase: 'SENTADO', start: currentTime, end: currentTime + tSentado, duration: tSentado, features: { amplitude: rand(2, 5), maxVelocity: rand(5, 10), maxAccel: rand(0.2, 0.5) } });
            for(let t = 0; t < tSentado; t += 1/hz) {
                addPoint(t, rand(8, 12));
            }
            currentTime += tSentado;
            events.push({ type: 'INICIO_LEVANTAR', time: currentTime, label: 'Início do levantar' });
            
            // 2. Levantando (10° -> ~45° -> 0°)
            segments.push({ cycle: i, phase: 'LEVANTANDO', start: currentTime, end: currentTime + tLevantando, duration: tLevantando, features: { amplitude: rand(35, 45), maxVelocity: rand(70, 90), maxAccel: rand(2.0, 3.5) } });
            // Amplitude varia levemente entre os ciclos (diminui um pouco no fim)
            const peakLev = rand(38, 48) - (fatigue > 1 ? rand(2,5) : 0);
            for(let t = 0; t < tLevantando; t += 1/hz) {
                const progress = t / tLevantando;
                let y = 10;
                if (progress < 0.5) {
                    const p = progress * 2;
                    y = 10 + (peakLev - 10) * Math.sin(p * Math.PI / 2);
                } else {
                    const p = (progress - 0.5) * 2;
                    y = peakLev - peakLev * Math.sin(p * Math.PI / 2);
                }
                addPoint(t, y + rand(-1.5, 1.5));
            }
            currentTime += tLevantando;
            events.push({ type: 'POSICAO_EM_PE', time: currentTime, label: 'Posição em pé' });
            
            // 3. Em Pé (~0°)
            segments.push({ cycle: i, phase: 'EM_PE', start: currentTime, end: currentTime + tEmPe, duration: tEmPe, features: { amplitude: rand(1, 3), maxVelocity: rand(5, 10), maxAccel: rand(0.1, 0.4) } });
            for(let t = 0; t < tEmPe; t += 1/hz) {
                addPoint(t, rand(-2, 2));
            }
            currentTime += tEmPe;
            events.push({ type: 'INICIO_SENTAR', time: currentTime, label: 'Início do sentar' });
            
            // 4. Sentando (0° -> ~45° -> 10°)
            segments.push({ cycle: i, phase: 'SENTANDO', start: currentTime, end: currentTime + tSentando, duration: tSentando, features: { amplitude: rand(35, 45), maxVelocity: rand(60, 80), maxAccel: rand(1.5, 3.0) } });
            const peakSen = rand(38, 48) - (fatigue > 1 ? rand(2,5) : 0);
            for(let t = 0; t < tSentando; t += 1/hz) {
                const progress = t / tSentando;
                let y = 0;
                if (progress < 0.5) {
                    const p = progress * 2;
                    y = peakSen * Math.sin(p * Math.PI / 2);
                } else {
                    const p = (progress - 0.5) * 2;
                    y = peakSen - (peakSen - 10) * Math.sin(p * Math.PI / 2);
                }
                addPoint(t, y + rand(-1.5, 1.5));
            }
            currentTime += tSentando;
            events.push({ type: 'RETORNO_SENTADO', time: currentTime, label: 'Retorno ao sentado' });
            
            const cycleEnd = currentTime;
            cycles.push({
                id: i,
                start: cycleStart,
                end: cycleEnd,
                duration: cycleEnd - cycleStart,
                maxAngle: cycleMaxAngle,
                minAngle: cycleMinAngle,
                amplitude: cycleMaxAngle - cycleMinAngle,
                phases: {
                    sentado: tSentado,
                    levantando: tLevantando,
                    em_pe: tEmPe,
                    sentando: tSentando
                }
            });
        }
        
        // Ajustar escala para 30s
        const scale = totalDurationTarget / currentTime;
        trunkAngleData.forEach(d => d.x *= scale);
        segments.forEach(s => {
            s.start *= scale;
            s.end *= scale;
            s.duration *= scale;
        });
        cycles.forEach(c => {
            c.start *= scale;
            c.end *= scale;
            c.duration *= scale;
            c.phases.sentado *= scale;
            c.phases.levantando *= scale;
            c.phases.em_pe *= scale;
            c.phases.sentando *= scale;
        });
        events.forEach(e => {
            e.time *= scale;
        });
        
        return {
            numReps: 12, // do contexto
            totalTime: 28.4,
            avgAmp: 44.5,
            variability: 0.42,
            trunkAngleData,
            segments,
            cycles,
            events
        };
    },

    populateIndicators(data) {
        const repsEl = document.getElementById('ind-reps');
        const timeEl = document.getElementById('ind-time');
        const ampEl = document.getElementById('ind-amp');
        const varEl = document.getElementById('ind-var');
        
        if (timeEl) timeEl.innerText = data.totalTime.toFixed(1);
        if (ampEl) ampEl.innerText = data.avgAmp.toFixed(1);
        if (varEl) varEl.innerText = data.variability.toFixed(2).replace('.', ',');
        
        // Exibir valores coerentes com a realidade do teste com base no JSON (12 ciclos, não 15 fixado)
        if (repsEl) repsEl.innerText = data.numReps; 
        
        // Classificação visual
        const classEl = document.getElementById('ind-classificacao');
        if (classEl) {
            classEl.innerHTML = '<span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Ótima</span>';
        }
    },

    renderDynamicsChart(data) {
        const ctx = document.getElementById('stsDynamicsChart');
        if (!ctx) return;

        // Limpar instâncias antigas
        if (this.instances.stsDynamicsChart) {
            this.instances.stsDynamicsChart.destroy();
        }
        
        const phaseNames = {
            'SENTADO': 'Sentado',
            'LEVANTANDO': 'Levantando',
            'EM_PE': 'Em Pé',
            'SENTANDO': 'Sentando'
        };

        const downsampled = data.trunkAngleData.filter((_, i) => i % 2 === 0);
        const primaryColor = '#142B5B'; 
        const totalDuration = 30;

        // Custom plugin para a linha contínua do gráfico
        this.instances.stsDynamicsChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Ângulo do Tronco (°)',
                    data: downsampled.map(d => ({ x: d.x, y: d.y })),
                    borderColor: primaryColor,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => `Ângulo: ${context.parsed.y.toFixed(1)}°`,
                            title: (tooltipItems) => {
                                const time = tooltipItems[0].parsed.x;
                                const cycle = data.cycles.find(c => time >= c.start && time <= c.end);
                                const phase = data.segments.find(s => time >= s.start && time <= s.end);
                                
                                let title = `Tempo: ${time.toFixed(1)}s`;
                                if (cycle) title += ` | Ciclo ${cycle.id}`;
                                if (phase) title += ` | ${phaseNames[phase.phase] || phase.phase}`;
                                return title;
                            }
                        }
                    }
                },
                scales: {
                    x: { 
                        type: 'linear',
                        min: 0,
                        max: 30,
                        ticks: {
                            callback: function(val) { return val % 5 === 0 ? val : ''; }
                        },
                        grid: { drawBorder: false, color: '#f3f4f6' }
                    },
                    y: { 
                        display: true,
                        min: -10,
                        max: 60,
                        grid: { color: '#f3f4f6' },
                        border: { display: false }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Popular os overlays interativos
        const cycleOverlay = document.getElementById('stsDynamicsCycleOverlay');
        const eventOverlay = document.getElementById('stsDynamicsEventOverlay');
        const hoverOverlay = document.getElementById('stsDynamicsHoverOverlay');
        const panelContent = document.getElementById('stsDynamicsPanelContent');
        const refLinesOverlay = document.getElementById('stsDynamicsRefLines');
        
        if (!cycleOverlay) return;

        cycleOverlay.innerHTML = '';
        eventOverlay.innerHTML = '';
        hoverOverlay.innerHTML = '';
        refLinesOverlay.innerHTML = '';

        let activeCycles = new Set();

        const renderPanel = () => {
            if (activeCycles.size === 1) {
                const cId = Array.from(activeCycles)[0];
                const cycle = data.cycles.find(c => c.id === cId);
                panelContent.innerHTML = `
                    <div class="flex flex-col gap-3">
                        <h4 class="text-xs font-bold text-primary mb-2 border-b border-gray-200 pb-2">Ciclo ${cycle.id}</h4>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Duração</span>
                            <strong class="text-sm text-gray-800">${cycle.duration.toFixed(2)} s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Amplitude</span>
                            <strong class="text-sm text-gray-800">${cycle.amplitude.toFixed(1)}°</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Mínimo</span>
                            <strong class="text-sm text-gray-800">${cycle.minAngle.toFixed(1)}°</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Máximo</span>
                            <strong class="text-sm text-gray-800">${cycle.maxAngle.toFixed(1)}°</strong>
                        </div>
                    </div>
                `;
            } else if (activeCycles.size > 1) {
                const cycles = Array.from(activeCycles).sort((a,b) => a-b).map(id => data.cycles.find(c => c.id === id));
                let rows = '';
                cycles.forEach(c => {
                    rows += `
                        <tr class="border-b border-gray-100">
                            <td class="py-2 text-primary font-bold">C${c.id}</td>
                            <td class="py-2 text-gray-700 text-right">${c.duration.toFixed(2)}s</td>
                            <td class="py-2 text-gray-700 text-right">${c.amplitude.toFixed(1)}°</td>
                        </tr>
                    `;
                });
                
                panelContent.innerHTML = `
                    <div class="flex flex-col gap-2">
                        <h4 class="text-xs font-bold text-primary mb-2 border-b border-gray-200 pb-2">Comparação de Ciclos</h4>
                        <table class="w-full text-xs text-left">
                            <thead>
                                <tr class="text-gray-400 uppercase text-[9px] tracking-wider border-b border-gray-100">
                                    <th class="pb-2">Ciclo</th>
                                    <th class="pb-2 text-right">Duração</th>
                                    <th class="pb-2 text-right">Amplitude</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                `;
            } else {
                panelContent.innerHTML = `
                    <div class="flex items-center justify-center h-full text-gray-400 text-xs italic text-center px-4">
                        Clique nos ciclos (C1, C2...) ou selecione áreas no gráfico para comparar.
                    </div>
                `;
            }
        };

        const updateHighlight = () => {
            cycleElements.forEach(c => {
                if (activeCycles.size === 0 || activeCycles.has(c.id)) {
                    c.el.classList.remove('opacity-30', 'bg-gray-100', 'text-gray-500');
                    if (activeCycles.has(c.id)) {
                        c.el.classList.add('bg-primary', 'text-white', 'border-primary');
                    } else {
                        c.el.classList.add('bg-gray-100', 'text-gray-500');
                        c.el.classList.remove('bg-primary', 'text-white', 'border-primary');
                    }
                } else {
                    c.el.classList.add('opacity-30', 'bg-gray-100', 'text-gray-500');
                    c.el.classList.remove('bg-primary', 'text-white', 'border-primary');
                }
            });
            renderPanel();
        };

        const cycleElements = [];

        data.cycles.forEach((cycle) => {
            const widthPct = (cycle.duration / totalDuration) * 100;
            const leftPct = (cycle.start / totalDuration) * 100;

            const cycleEl = document.createElement('div');
            cycleEl.className = 'absolute h-full rounded bg-gray-100 border border-gray-200 text-[9px] font-bold text-gray-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:text-primary';
            cycleEl.style.width = `calc(${widthPct}% - 2px)`;
            cycleEl.style.left = `${leftPct}%`;
            cycleEl.innerText = `C${cycle.id}`;
            
            cycleEl.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    if (activeCycles.has(cycle.id)) activeCycles.delete(cycle.id);
                    else activeCycles.add(cycle.id);
                } else {
                    if (activeCycles.has(cycle.id) && activeCycles.size === 1) {
                        activeCycles.clear();
                    } else {
                        activeCycles.clear();
                        activeCycles.add(cycle.id);
                    }
                }
                updateHighlight();
            });

            cycleOverlay.appendChild(cycleEl);
            cycleElements.push({ id: cycle.id, el: cycleEl });
            
            // Hover Overlay for clicking the chart to select cycle
            const hoverEl = document.createElement('div');
            hoverEl.className = 'absolute h-full border-r border-transparent cursor-pointer transition-colors hover:bg-primary/5';
            hoverEl.style.width = `${widthPct}%`;
            hoverEl.style.left = `${leftPct}%`;
            
            hoverEl.addEventListener('click', (e) => {
                cycleEl.click();
            });
            
            hoverOverlay.appendChild(hoverEl);
        });

        // Atualizar estatísticas do cabeçalho
        const globalMax = Math.max(...data.cycles.map(c => c.maxAngle));
        const avgAmp = data.cycles.reduce((acc, c) => acc + c.amplitude, 0) / data.cycles.length;
        const avgDur = data.cycles.reduce((acc, c) => acc + c.duration, 0) / data.cycles.length;
        
        // Calculo simples de variabilidade (DP/Média)
        const durSqDiffs = data.cycles.map(c => Math.pow(c.duration - avgDur, 2));
        const durVariance = durSqDiffs.reduce((acc, val) => acc + val, 0) / data.cycles.length;
        const durStdDev = Math.sqrt(durVariance);
        const variability = (durStdDev / avgDur) * 100;
        
        document.getElementById('dynAvgAmp').innerText = `${avgAmp.toFixed(1)}°`;
        document.getElementById('dynMaxAmp').innerText = `${globalMax.toFixed(1)}°`;
        document.getElementById('dynAvgDur').innerText = `${avgDur.toFixed(2)} s`;
        document.getElementById('dynVar').innerText = `${variability.toFixed(1)}%`;

        // Linhas de Referência (Mínimo e Máximo observados no teste)
        const yRange = 70; // 60 - (-10)
        const getMaxPct = (angle) => (1 - ((angle + 10) / yRange)) * 100;

        const maxGlobal = Math.max(...data.trunkAngleData.map(d => d.y));
        const minGlobal = Math.min(...data.trunkAngleData.map(d => d.y));

        const maxLine = document.createElement('div');
        maxLine.className = 'absolute w-full border-t border-dashed border-gray-300 pointer-events-none opacity-50';
        maxLine.style.top = `${getMaxPct(maxGlobal)}%`;
        
        const minLine = document.createElement('div');
        minLine.className = 'absolute w-full border-t border-dashed border-gray-300 pointer-events-none opacity-50';
        minLine.style.top = `${getMaxPct(minGlobal)}%`;

        refLinesOverlay.appendChild(maxLine);
        refLinesOverlay.appendChild(minLine);
        
        // Listeners das views Início/Meio/Fim
        const viewBtns = document.querySelectorAll('.dyn-view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                viewBtns.forEach(b => {
                    b.classList.remove('text-primary', 'bg-white', 'shadow-sm');
                    b.classList.add('text-gray-500');
                });
                e.target.classList.add('text-primary', 'bg-white', 'shadow-sm');
                e.target.classList.remove('text-gray-500');
                
                const view = e.target.getAttribute('data-view');
                if (view === 'all') {
                    activeCycles.clear();
                    updateHighlight();
                } else if (view === 'start') {
                    activeCycles = new Set([1, 2, 3, 4]);
                    updateHighlight();
                } else if (view === 'mid') {
                    activeCycles = new Set([5, 6, 7, 8]);
                    updateHighlight();
                } else if (view === 'end') {
                    activeCycles = new Set([9, 10, 11, 12]);
                    updateHighlight();
                }
            });
        });
        
        // 4. MINI-MAPA E NAVEGAÇÃO
        const minimapCtx = document.getElementById('stsMinimapChart');
        const minimapWindow = document.getElementById('stsMinimapWindow');
        const scrollContainer = document.getElementById('stsDynamicsScrollArea');
        const chartWrapper = document.getElementById('stsDynamicsWrapper');

        if (minimapCtx && minimapWindow && scrollContainer && chartWrapper) {
            // Desenhar o minimapa simplificado
            if (this.instances.stsMinimapChart) {
                this.instances.stsMinimapChart.destroy();
            }
            
            const downsampled = data.trunkAngleData.filter((_, i) => i % 2 === 0);
            
            this.instances.stsMinimapChart = new Chart(minimapCtx, {
                type: 'line',
                data: {
                    datasets: [{
                        data: downsampled.map(d => ({ x: d.x, y: d.y })),
                        borderColor: '#9ca3af',
                        borderWidth: 1.5,
                        pointRadius: 0,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: {
                        x: { type: 'linear', min: 0, max: 30, display: false },
                        y: { min: -10, max: 60, display: false }
                    },
                    layout: { padding: 0 }
                }
            });

            // Sincronizar Janela do Minimapa com o Scroll
            const updateMinimapWindow = () => {
                const scrollLeft = scrollContainer.scrollLeft;
                const scrollWidth = scrollContainer.scrollWidth;
                const clientWidth = scrollContainer.clientWidth;
                
                const widthPct = (clientWidth / scrollWidth) * 100;
                const leftPct = (scrollLeft / scrollWidth) * 100;
                
                minimapWindow.style.width = `${widthPct}%`;
                minimapWindow.style.left = `${leftPct}%`;
            };

            scrollContainer.addEventListener('scroll', updateMinimapWindow);
            // Chama inicialmente para ajustar
            setTimeout(updateMinimapWindow, 100);

            // Drag no Mini-mapa
            let isDragging = false;
            
            const onDrag = (e) => {
                if (!isDragging) return;
                const rect = minimapCtx.getBoundingClientRect();
                let x = e.clientX - rect.left;
                // Centralizar a janela no cursor
                const windowWidth = minimapWindow.clientWidth;
                x = x - (windowWidth / 2);
                
                const pct = Math.max(0, Math.min(x / rect.width, 1 - (windowWidth / rect.width)));
                scrollContainer.scrollLeft = pct * scrollContainer.scrollWidth;
            };

            minimapWindow.addEventListener('mousedown', (e) => {
                isDragging = true;
                document.body.style.userSelect = 'none';
                minimapWindow.classList.add('bg-primary/30');
            });

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.userSelect = '';
                    minimapWindow.classList.remove('bg-primary/30');
                }
            });
            
            // Clique direto no mini-mapa
            minimapCtx.parentElement.addEventListener('mousedown', (e) => {
                if(e.target === minimapWindow) return; // Se clicou na janela, o drag assume
                const rect = minimapCtx.getBoundingClientRect();
                let x = e.clientX - rect.left;
                const windowWidth = minimapWindow.clientWidth;
                x = x - (windowWidth / 2);
                
                const pct = Math.max(0, Math.min(x / rect.width, 1 - (windowWidth / rect.width)));
                scrollContainer.scrollLeft = Math.round(pct * scrollContainer.scrollWidth);
                updateMinimapWindow();
                
                // Transforma em drag para fluidez
                isDragging = true;
                minimapWindow.classList.add('bg-primary/30');
            });
        }
        
        // Exibir o painel vazio inicialmente
        renderPanel();
    },
    renderSegmentationChart(data) {
        const ctx = document.getElementById('stsSegmentationChart');
        if (!ctx) return;

        if (this.instances.stsSegmentationChart) {
            this.instances.stsSegmentationChart.destroy();
        }

        const downsampled = data.trunkAngleData.filter((_, i) => i % 2 === 0);

        // Sincronizar os overlays com a área útil do gráfico
        const syncOverlayPlugin = {
            id: 'syncOverlays',
            afterLayout: (chart) => {
                const elementsToSync = [
                    'stsSegmentationBackgrounds', 
                    'stsEventOverlay', 
                    'stsPhaseHoverOverlay'
                ];
                
                if (chart.chartArea) {
                    elementsToSync.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) {
                            el.style.left = `${chart.chartArea.left}px`;
                            el.style.width = `${chart.chartArea.right - chart.chartArea.left}px`;
                        }
                    });
                    
                    const cycleOverlay = document.getElementById('stsCycleOverlay');
                    if (cycleOverlay) {
                        cycleOverlay.style.left = `${chart.chartArea.left}px`;
                        cycleOverlay.style.width = `${chart.chartArea.right - chart.chartArea.left}px`;
                    }
                }
            }
        };

        // Cor principal LIA (azul escuro/primary)
        const primaryColor = '#142B5B'; 

        // Definir a largura virtual com base na quantidade de fases para garantir espaçamento
        // Garantir pelo menos 64px por fase
        const wrapper = document.getElementById('stsSegmentationWrapper');
        const scrollArea = document.getElementById('stsSegmentationScrollArea');
        const numPhases = data.segments.length;
        const requiredWidth = Math.max(scrollArea.clientWidth || 800, numPhases * 64);
        if (wrapper) {
            wrapper.style.width = `${requiredWidth}px`;
            wrapper.style.minWidth = `${requiredWidth}px`;
        } 

        // Chart.js para desenhar a linha do sinal
        this.instances.stsSegmentationChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Ângulo do tronco',
                    data: downsampled.map(d => ({ x: d.x, y: d.y })),
                    borderColor: 'transparent',
                    borderWidth: 0,
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    x: { 
                        type: 'linear',
                        min: 0,
                        max: 30,
                        ticks: {
                            callback: function(val) {
                                return val % 5 === 0 ? val : '';
                            }
                        },
                        grid: { drawBorder: false, color: '#f3f4f6' }
                    },
                    y: { 
                        display: true,
                        min: -10, 
                        max: 60,
                        grid: { color: '#f3f4f6' },
                        border: { display: false }
                    }
                }
            },
            plugins: [syncOverlayPlugin]
        });

        const bgOverlay = document.getElementById('stsSegmentationBackgrounds');
        const cycleOverlay = document.getElementById('stsCycleOverlay');
        const eventOverlay = document.getElementById('stsEventOverlay');
        const hoverOverlay = document.getElementById('stsPhaseHoverOverlay');
        const panelContent = document.getElementById('stsFeaturePanelContent');
        const panelTitle = document.getElementById('stsFeaturePanelTitle');
        const panelSubtitle = document.getElementById('stsFeaturePanelSubtitle');
        const featurePanel = document.getElementById('stsFeaturePanel');
        
        if (!bgOverlay || !cycleOverlay || !eventOverlay || !hoverOverlay) return;
        
        bgOverlay.innerHTML = '';
        cycleOverlay.innerHTML = '';
        eventOverlay.innerHTML = '';
        hoverOverlay.innerHTML = '';
        if(featurePanel) featurePanel.classList.remove('hidden');
        
        const phaseColors = {
            'SENTADO': 'bg-blue-400',
            'LEVANTANDO': 'bg-teal-400',
            'EM_PE': 'bg-green-400',
            'SENTANDO': 'bg-rose-400'
        };

        const phaseNames = {
            'SENTADO': 'Sentado',
            'LEVANTANDO': 'Levantando',
            'EM_PE': 'Em pé',
            'SENTANDO': 'Sentando'
        };
        
        const totalDuration = 30;

        let activeCycleId = null;

        const renderPanelContent = (cycleId, phaseSeg = null) => {
            const cycle = data.cycles.find(c => c.id === cycleId);
            if (!cycle) return;
            
            panelTitle.innerText = phaseSeg ? `${phaseNames[phaseSeg.phase]} — Ciclo ${cycle.id}` : `Ciclo ${cycle.id}`;
            panelSubtitle.innerText = phaseSeg ? `Início: ${phaseSeg.start.toFixed(1)} s | Fim: ${phaseSeg.end.toFixed(1)} s` : `Duração total: ${cycle.duration.toFixed(1)} s`;

            if (phaseSeg) {
                panelContent.innerHTML = `
                    <div class="flex flex-col gap-3">
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Duração</span>
                            <strong class="text-sm text-gray-800">${phaseSeg.duration.toFixed(2)} s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Amplitude angular</span>
                            <strong class="text-sm text-gray-800">${phaseSeg.features.amplitude.toFixed(1)}°</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Velocidade angular máx.</span>
                            <strong class="text-sm text-gray-800">${phaseSeg.features.maxVelocity.toFixed(1)}°/s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <span class="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Aceleração máxima</span>
                            <strong class="text-sm text-gray-800">${phaseSeg.features.maxAccel.toFixed(1)} m/s²</strong>
                        </div>
                    </div>
                `;
            } else {
                panelContent.innerHTML = `
                    <div class="flex flex-col gap-3">
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-xs text-gray-500 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-400"></span> Sentado</span>
                            <strong class="text-sm text-gray-800">${cycle.phases.sentado.toFixed(2)} s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-xs text-gray-500 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-teal-400"></span> Levantando</span>
                            <strong class="text-sm text-gray-800">${cycle.phases.levantando.toFixed(2)} s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-xs text-gray-500 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-400"></span> Em pé</span>
                            <strong class="text-sm text-gray-800">${cycle.phases.em_pe.toFixed(2)} s</strong>
                        </div>
                        <div class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center">
                            <span class="text-xs text-gray-500 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-400"></span> Sentando</span>
                            <strong class="text-sm text-gray-800">${cycle.phases.sentando.toFixed(2)} s</strong>
                        </div>
                    </div>
                `;
            }
        };

        const generateHollowIcon = (head, bodyPath, armPath, colorClass) => `
<svg viewBox="0 0 24 24" width="46" height="46" class="${colorClass} drop-shadow-sm">
  <path d="${bodyPath}" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${bodyPath}" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  
  <path d="${armPath}" stroke="currentColor" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  <path d="${armPath}" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  
  <circle cx="${head.cx}" cy="${head.cy}" r="${head.r}" fill="white" stroke="currentColor" stroke-width="1.5" />
</svg>
`;

        const stickmanIcons = {
            'SENTADO': generateHollowIcon({cx: 12, cy: 4.5, r: 2.5}, "M 11 7.5 Q 8.5 11 9.5 14 L 16 14 L 16 21.5 L 18.5 21.5", "M 11 8.5 Q 11 12.5 15 12.5", "text-blue-700"),
            'LEVANTANDO': generateHollowIcon({cx: 13, cy: 4.5, r: 2.5}, "M 12 7.5 Q 9 10 8.5 13 L 13.5 17 L 12.5 21.5 L 15.5 21.5", "M 12 8.5 Q 9.5 11 7.5 13", "text-teal-700"),
            'EM_PE': generateHollowIcon({cx: 12, cy: 4.5, r: 2.5}, "M 11 7.5 Q 10 11 11 14 L 11 21.5 L 13.5 21.5", "M 11 8.5 L 10 14", "text-green-700"),
            'SENTANDO': generateHollowIcon({cx: 13, cy: 4.5, r: 2.5}, "M 12 7.5 Q 9 10 8.5 13 L 13.5 17 L 12.5 21.5 L 15.5 21.5", "M 12 8.5 Q 9.5 11 7.5 13", "text-rose-700")
        };

        const cycleElements = [];

        // 1. ZONA DE BACKGROUNDS E HOVERS (FASES)
        data.segments.forEach((seg) => {
            const widthPct = (seg.duration / totalDuration) * 100;
            const leftPct = (seg.start / totalDuration) * 100;
            
            // Fundo visual passivo (atrás do chart)
            const bgEl = document.createElement('div');
            bgEl.className = `absolute h-full ${phaseColors[seg.phase]} opacity-10`;
            bgEl.style.width = `${widthPct}%`;
            bgEl.style.left = `${leftPct}%`;
            bgOverlay.appendChild(bgEl);

            // Camada interativa invisível (na frente do chart)
            const hoverEl = document.createElement('div');
            hoverEl.className = `absolute h-full border-r border-white/30 cursor-pointer transition-all duration-200`;
            hoverEl.style.width = `${widthPct}%`;
            hoverEl.style.left = `${leftPct}%`;
            
            // Tooltip no hover
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg opacity-0 pointer-events-none transition-opacity z-50 shadow-lg whitespace-nowrap hidden';
            tooltip.innerHTML = `
                <strong class="text-xs text-white block mb-1">${phaseNames[seg.phase]}</strong>
                <div class="text-gray-300">Duração: ${seg.duration.toFixed(2)}s</div>
            `;
            hoverEl.appendChild(tooltip);

            hoverEl.addEventListener('mouseenter', () => {
                bgEl.classList.replace('opacity-10', 'opacity-30');
                tooltip.classList.remove('hidden');
                setTimeout(() => tooltip.classList.replace('opacity-0', 'opacity-100'), 10);
                renderPanelContent(seg.cycle, seg);
            });

            hoverEl.addEventListener('mouseleave', () => {
                bgEl.classList.replace('opacity-30', 'opacity-10');
                tooltip.classList.replace('opacity-100', 'opacity-0');
                setTimeout(() => tooltip.classList.add('hidden'), 200);
                if(activeCycleId) {
                    renderPanelContent(activeCycleId);
                } else {
                    panelTitle.innerText = "Selecione um ciclo";
                    panelSubtitle.innerText = "Clique no gráfico para detalhes.";
                    panelContent.innerHTML = `<div class="flex items-center justify-center h-full text-gray-400 text-xs italic text-center px-4">Passe o mouse sobre as fases ou clique nos ciclos para explorar as características do movimento.</div>`;
                }
            });

            hoverOverlay.appendChild(hoverEl);
        });

        // 2. ZONA DE CICLOS (TOPO)
        data.cycles.forEach((cycle) => {
            const widthPct = (cycle.duration / totalDuration) * 100;
            const leftPct = (cycle.start / totalDuration) * 100;

            const cycleEl = document.createElement('div');
            cycleEl.className = `absolute h-6 top-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:text-primary overflow-hidden`;
            cycleEl.style.width = `calc(${widthPct}% - 2px)`;
            cycleEl.style.left = `${leftPct}%`;
            cycleEl.innerText = `Ciclo ${cycle.id}`;
            cycleElements.push({ id: cycle.id, el: cycleEl });

            cycleEl.addEventListener('click', () => {
                activeCycleId = cycle.id;
                cycleElements.forEach(c => {
                    if(c.id === cycle.id) {
                        c.el.classList.add('bg-primary', 'text-white', 'border-primary');
                        c.el.classList.remove('bg-gray-100', 'text-gray-500', 'border-gray-200', 'hover:bg-gray-200', 'opacity-50');
                    } else {
                        c.el.classList.remove('bg-primary', 'text-white', 'border-primary');
                        c.el.classList.add('bg-gray-100', 'text-gray-500', 'border-gray-200', 'hover:bg-gray-200');
                        c.el.classList.add('opacity-50');
                    }
                });
                renderPanelContent(cycle.id);
            });

            cycleOverlay.appendChild(cycleEl);
        });

        // 3. EVENTOS / ÍCONES (MARCADORES NO GRÁFICO)
        data.segments.forEach((seg) => {
            if (seg.duration >= 0.1) {
                const midTime = seg.start + (seg.duration / 2);
                const pct = (midTime / totalDuration) * 100;
                
                const iconWrapper = document.createElement('div');
                iconWrapper.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-all duration-300 group z-50';
                
                iconWrapper.style.left = `${pct}%`;
                iconWrapper.style.top = '50%';
                
                // SVG + Tooltip nativo via HTML e hover do Tailwind (group-hover)
                iconWrapper.innerHTML = `
                    ${stickmanIcons[seg.phase]}
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-lg whitespace-nowrap hidden group-hover:block">
                        <strong class="text-xs text-white block mb-1">Ciclo ${seg.cycle} · ${phaseNames[seg.phase]}</strong>
                        <div class="text-gray-300">Início: ${seg.start.toFixed(1)} s</div>
                        <div class="text-gray-300">Fim: ${seg.end.toFixed(1)} s</div>
                        <div class="text-gray-300 font-bold mt-1 pt-1 border-t border-gray-700">Duração: ${seg.duration.toFixed(2)} s</div>
                    </div>
                `;
                
                eventOverlay.appendChild(iconWrapper);
            }
        });

    },

    renderHistoryChart() {
        const ctx = document.getElementById('stsHistoryChart');
        if (!ctx) return;

        this.instances.stsHistoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['12/08', '20/08', '26/08', '02/09', '09/09'],
                datasets: [
                    {
                        label: 'Repetições',
                        // O último valor (15) corresponde à avaliação Atual, e os demais às anteriores
                        data: [10, 14, 11, 13, 15],
                        // O último item recebe a cor primária (Atual), os demais a cor secundária (Anterior)
                        backgroundColor: ['#00B3B0', '#00B3B0', '#00B3B0', '#00B3B0', '#142B5B'],
                        borderRadius: 4,
                        barPercentage: 0.6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `Repetições: ${ctx.parsed.y}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        min: 0,
                        max: 20,
                        ticks: { stepSize: 5, font: { size: 10 } }
                    }
                }
            }
        });
    },

    // =========================================================
    // UTILITY FUNCTIONS
    // =========================================================

    _getAmplitude(arr) { return Math.max(...arr) - Math.min(...arr); },
    _getRMS(arr) { return Math.sqrt(arr.reduce((s, v) => s + v * v, 0) / arr.length); },
    _getMean(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; },
    _getStd(arr) { const m = this._getMean(arr); return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length); },
    _getVariability(arr) { const m = this._getMean(arr); return m === 0 ? 0 : (this._getStd(arr) / Math.abs(m)) * 100; },
    _getPeakValue(arr) { return Math.max(...arr.map(Math.abs)); },
    _getMedian(arr) { const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; },
    _getSkewness(arr) { const m = this._getMean(arr); const s = this._getStd(arr); return arr.reduce((acc, v) => acc + ((v - m) / s) ** 3, 0) / arr.length; },
    _getKurtosis(arr) { const m = this._getMean(arr); const s = this._getStd(arr); return arr.reduce((acc, v) => acc + ((v - m) / s) ** 4, 0) / arr.length - 3; },
    _getStatistics(arr) {
        const mean = this._getMean(arr);
        const std = this._getStd(arr);
        return {
            mean, std,
            median: this._getMedian(arr),
            variance: std * std,
            min: Math.min(...arr),
            max: Math.max(...arr),
            amplitude: this._getAmplitude(arr),
            rms: this._getRMS(arr),
            skewness: this._getSkewness(arr),
            kurtosis: this._getKurtosis(arr),
        };
    },
    _fmt(v, dec = 1) {
        if (v == null || isNaN(v) || !isFinite(v)) return '--';
        return Number(v).toFixed(dec).replace('.', ',');
    },
    _fmtUnit(v, unit, dec = 1) { return `${this._fmt(v, dec)} ${unit}`; },

    // =========================================================
    // INERTIAL DATA GENERATION (Accel + Gyro synchronized)
    // =========================================================

    _generateInertialData(trunkAngleData) {
        const hz = 50;
        const dt = 1 / hz;
        const n = trunkAngleData.length;

        // Derive angular velocity (gyro pitch) from angle
        const pitchVel = [];
        for (let i = 0; i < n; i++) {
            const prev = trunkAngleData[Math.max(0, i - 1)].y;
            const curr = trunkAngleData[i].y;
            pitchVel.push((curr - prev) / dt);
        }

        // Accel Y proportional to angle (vertical component) + noise
        const accelY = trunkAngleData.map(d => {
            const g = 9.81;
            const rad = (d.y * Math.PI) / 180;
            return g * Math.cos(rad) + (Math.random() - 0.5) * 0.3;
        });
        const accelX = trunkAngleData.map((_, i) => (Math.random() - 0.5) * 0.8 + Math.sin(i * 0.05) * 0.4);
        const accelZ = trunkAngleData.map((_, i) => (Math.random() - 0.5) * 0.6 + Math.cos(i * 0.08) * 0.3);
        const accelMag = accelX.map((_, i) => Math.sqrt(accelX[i] ** 2 + accelY[i] ** 2 + accelZ[i] ** 2));

        // Gyro based on pitch velocity + roll/yaw noise
        const gyroX = pitchVel.map(v => v + (Math.random() - 0.5) * 5);
        const gyroY = pitchVel.map((v, i) => (Math.random() - 0.5) * 15 + Math.sin(i * 0.07) * 3);
        const gyroZ = pitchVel.map((_, i) => (Math.random() - 0.5) * 10 + Math.cos(i * 0.09) * 2);
        const gyroMag = gyroX.map((_, i) => Math.sqrt(gyroX[i] ** 2 + gyroY[i] ** 2 + gyroZ[i] ** 2));

        const times = trunkAngleData.map(d => d.x);

        return { times, accelX, accelY, accelZ, accelMag, gyroX, gyroY, gyroZ, gyroMag };
    },

    // =========================================================
    // SIGNALS TAB MAIN SETUP
    // =========================================================

    _setupSignalsUI(data) {
        const mc = document.querySelector('#main-content');
        if (!mc) {
            console.error('[ LIA:SINAIS ] Container principal #main-content não encontrado.');
            return;
        }

        // Extend data with inertial signals if they don't exist yet
        if (!data.inertial) {
            console.log('[ LIA:SINAIS ] dados inerciais gerados');
            data.inertial = this._generateInertialData(data.trunkAngleData);
        }

        // Ensure the container exists
        const container = mc.querySelector('#sts-tab-content-sinais');
        if (!container) {
            console.error('[ LIA:SINAIS ] Container #sts-tab-content-sinais não encontrado.');
            return;
        }

        this._signalState = {
            signal: 'angle',
            axes: new Set(['angle']),
            selectedCycle: null,
            data,
        };

        try {
            this._populateTemporalFeatures(data);
            this._populateCycleTable(data);
            this._populatePeriodTable(data);
            this._setupSignalControls();
            this._renderMainSignalChart();
            this._setupTechDetails(data);
            this._setupCollapsible();
            if (window.lucide) lucide.createIcons();
        } catch(e) {
            const errDiv = container.querySelector('#sig-error-msg');
            if (errDiv) { errDiv.textContent = 'Erro JS: ' + e.message; errDiv.style.display = 'block'; }
            throw e;
        }
    },

    _buildSignalsHTML() {
        return `
        <div id="sig-error-msg" style="display:none;" class="bg-red-50 border border-red-200 text-red-700 text-xs font-mono p-4 rounded-xl mb-4"></div>

        <div class="bg-white border border-gray-200 rounded-2xl p-4 mb-5 flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1 mr-2">
                <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">⊙ Sinal</span>
            </div>
            <div id="sig-signal-selector" class="flex rounded-lg border border-gray-200 overflow-hidden">
                <button data-signal="angle" class="sig-signal-btn px-4 py-2 text-xs font-bold border-r border-gray-200 transition-colors" style="background:#142B5B;color:#fff">Ângulo do tronco</button>
                <button data-signal="accel" class="sig-signal-btn px-4 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 transition-colors">Acelerômetro</button>
                <button data-signal="gyro" class="sig-signal-btn px-4 py-2 text-xs font-semibold text-gray-500 transition-colors">Giroscópio</button>
            </div>
            <div id="sig-axis-selector" style="display:none" class="flex rounded-lg border border-gray-200 overflow-hidden">
                <button data-axis="x" class="sig-axis-btn px-3 py-2 text-xs font-bold border-r border-gray-200" style="background:#142B5B;color:#fff">X</button>
                <button data-axis="y" class="sig-axis-btn px-3 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200">Y</button>
                <button data-axis="z" class="sig-axis-btn px-3 py-2 text-xs font-semibold text-gray-500">Z</button>
            </div>
            <div class="ml-auto">
                <button id="sig-reset-zoom" class="text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:text-blue-600 transition-colors">&#8635; Resetar zoom</button>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr;gap:20px" class="mb-5 xl:grid-cols-4">

            <div style="grid-column:span 3" class="flex flex-col gap-4">

                <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="px-6 pt-5 pb-3 border-b border-gray-100">
                        <h2 id="sig-chart-title" class="text-sm font-bold text-gray-800">Ângulo do tronco</h2>
                        <p id="sig-chart-subtitle" class="text-xs text-gray-400 mt-0.5">Sinal processado durante a avaliação — 30sSTS</p>
                    </div>
                    <div class="signal-chart-container" style="position:relative;height:420px;min-height:320px;padding:16px 16px 8px;">
                        <canvas id="stsMainSignalChart" style="width:100%;height:100%;"></canvas>
                    </div>
                    <div class="px-4 pb-4">
                        <p style="font-size:10px" class="text-gray-400 uppercase tracking-wider mb-1">Navegador</p>
                        <div class="signal-nav-container" style="position:relative;height:90px;min-height:70px;">
                            <canvas id="stsNavChart" style="width:100%;height:100%;"></canvas>
                        </div>
                    </div>
                </div>

                <div id="sig-interval-stats" style="display:none" class="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <p class="text-xs font-bold text-blue-700 mb-3">Intervalo selecionado: <span id="sig-interval-range">0–30 s</span></p>
                    <div id="sig-interval-values" class="grid grid-cols-2 sm:grid-cols-4 gap-3"></div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="text-sm font-bold text-gray-800">Características por ciclo</h3>
                        <p class="text-xs text-gray-400">Clique em um ciclo para destacar no gráfico</p>
                    </div>
                    <div style="overflow-x:auto">
                        <table style="width:100%;font-size:12px">
                            <thead><tr style="border-bottom:1px solid #f3f4f6">
                                <th style="padding:10px 16px;text-align:left;color:#9ca3af;font-size:10px;text-transform:uppercase">Ciclo</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Duração</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Amplitude</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Pico acel.</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Vel. ang.</th>
                            </tr></thead>
                            <tbody id="sig-cycle-table-body"></tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="px-5 py-4 border-b border-gray-100">
                        <h3 class="text-sm font-bold text-gray-800">Comportamento ao longo do teste</h3>
                        <p class="text-xs text-gray-400">Início (0–10 s) · Meio (10–20 s) · Final (20–30 s)</p>
                    </div>
                    <div style="overflow-x:auto">
                        <table style="width:100%;font-size:12px">
                            <thead><tr style="border-bottom:1px solid #f3f4f6">
                                <th style="padding:10px 16px;text-align:left;color:#9ca3af;font-size:10px;text-transform:uppercase">Período</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Amplitude</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Dur./ciclo</th>
                                <th style="padding:10px 16px;text-align:right;color:#9ca3af;font-size:10px;text-transform:uppercase">Variab.</th>
                            </tr></thead>
                            <tbody id="sig-period-table-body"></tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <button id="sig-tech-toggle" style="width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;text-align:left;cursor:pointer;background:none;border:none">
                        <span class="text-sm font-bold text-gray-800">&#9881; Detalhes técnicos <span class="text-xs font-normal text-gray-400">(estatísticas completas)</span></span>
                        <span id="sig-tech-chevron" style="font-size:14px;color:#9ca3af">&#9660;</span>
                    </button>
                    <div id="sig-tech-content" style="display:none;border-top:1px solid #f3f4f6">
                        <div class="p-5" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px" id="sig-tech-grid"></div>
                    </div>
                </div>

            </div>

            <div class="flex flex-col gap-4">

                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 style="font-size:10px" class="font-bold text-gray-500 uppercase tracking-wider mb-4">Características principais</h3>
                    <div id="sig-main-features" class="flex flex-col gap-3"></div>
                </div>

                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 style="font-size:10px" class="font-bold text-gray-500 uppercase tracking-wider mb-4">Características temporais</h3>
                    <div class="flex flex-col gap-2">
                        <div style="display:flex;justify-content:space-between;padding:4px 0">
                            <span style="font-size:12px;color:#6b7280">Duração total</span>
                            <span style="font-size:12px;font-weight:700;color:#1e293b">28,4 s</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid #f9fafb">
                            <span style="font-size:12px;color:#6b7280">Repetições</span>
                            <span style="font-size:12px;font-weight:700;color:#1e293b" id="sig-tempo-reps">--</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid #f9fafb">
                            <span style="font-size:12px;color:#6b7280">Dur. média/ciclo</span>
                            <span style="font-size:12px;font-weight:700;color:#1e293b" id="sig-tempo-avgcycle">--</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid #f9fafb">
                            <span style="font-size:12px;color:#6b7280">Variabilidade</span>
                            <span style="font-size:12px;font-weight:700;color:#1e293b" id="sig-tempo-var">--</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:4px 0;border-top:1px solid #f9fafb">
                            <span style="font-size:12px;color:#6b7280">Cadência</span>
                            <span style="font-size:12px;font-weight:700;color:#1e293b" id="sig-tempo-cadence">--</span>
                        </div>
                    </div>
                </div>

                <div style="background:#f9fafb;border:1px solid #f1f5f9;border-radius:16px;padding:16px">
                    <p style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">Legenda</p>
                    <div id="sig-legend" class="flex flex-col gap-2"></div>
                </div>

            </div>
        </div>
        `;
    },



    _getSignalArrays() {
        const { signal, data } = this._signalState;
        
        let axes = this._signalState.axes;
        if (!axes) {
            axes = new Set([this._signalState.axis || (signal === 'angle' ? 'angle' : 'x')]);
            this._signalState.axes = axes;
        }

        const inertial = data.inertial;
        const times = inertial ? inertial.times : data.trunkAngleData.map(d => d.x);

        if (signal === 'angle') {
            return [{
                values: data.trunkAngleData.map(d => d.y),
                times,
                label: 'Ângulo do tronco',
                unit: '°',
                color: '#142B5B',
            }];
        }

        const mapAccel = { x: inertial.accelX, y: inertial.accelY, z: inertial.accelZ };
        const colorsAccel = { x: '#ef4444', y: '#22c55e', z: '#3b82f6' };
        const labelsAccel = { x: 'Acelerômetro X', y: 'Acelerômetro Y', z: 'Acelerômetro Z' };

        const mapGyro = { x: inertial.gyroX, y: inertial.gyroY, z: inertial.gyroZ };
        const colorsGyro = { x: '#f97316', y: '#06b6d4', z: '#a855f7' };
        const labelsGyro = { x: 'Giroscópio X', y: 'Giroscópio Y', z: 'Giroscópio Z' };

        const datasets = [];
        const isAccel = signal === 'accel';
        const map = isAccel ? mapAccel : mapGyro;
        const colors = isAccel ? colorsAccel : colorsGyro;
        const labels = isAccel ? labelsAccel : labelsGyro;
        const unit = isAccel ? 'm/s²' : '°/s';

        Array.from(axes).forEach(ax => {
            if (map[ax]) {
                datasets.push({
                    values: map[ax],
                    times,
                    label: labels[ax],
                    unit: unit,
                    color: colors[ax]
                });
            }
        });

        return datasets;
    },

    _setupSignalControls() {
        const mc = document.querySelector('#main-content');
        if (!mc) return;

        // Signal buttons
        mc.querySelectorAll('.sig-signal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const sig = btn.getAttribute('data-signal');
                this._signalState.signal = sig;
                if (sig === 'angle') {
                    this._signalState.axes = new Set(['angle']);
                } else {
                    if (!this._signalState.axes || this._signalState.axes.has('angle')) {
                        this._signalState.axes = new Set(['x']); // default to x when switching from angle
                    }
                }
                this._signalState.selectedCycle = null;

                mc.querySelectorAll('.sig-signal-btn').forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('text-gray-500', 'hover:bg-gray-50');
                });
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('text-gray-500', 'hover:bg-gray-50');

                const axisSelector = mc.querySelector('#sig-axis-selector');
                if (sig === 'angle') {
                    axisSelector.classList.add('hidden');
                } else {
                    axisSelector.classList.remove('hidden');
                    // Update axis buttons based on current axes
                    mc.querySelectorAll('.sig-axis-btn').forEach(b => {
                        const bAxis = b.getAttribute('data-axis');
                        if (this._signalState.axes && this._signalState.axes.has(bAxis)) {
                            b.classList.add('bg-primary', 'text-white');
                            b.classList.remove('text-gray-500', 'hover:bg-gray-50');
                        } else {
                            b.classList.remove('bg-primary', 'text-white');
                            b.classList.add('text-gray-500', 'hover:bg-gray-50');
                        }
                    });
                }

                this._renderMainSignalChart();
                this._updateMainFeaturesPanel();
            });
        });

        // Axis buttons
        mc.querySelectorAll('.sig-axis-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const axis = btn.getAttribute('data-axis');
                
                if (!this._signalState.axes) {
                    this._signalState.axes = new Set([this._signalState.axis || 'x']);
                }

                if (this._signalState.axes.has(axis)) {
                    if (this._signalState.axes.size > 1) { // prevent deselecting all
                        this._signalState.axes.delete(axis);
                    }
                } else {
                    this._signalState.axes.add(axis);
                }

                mc.querySelectorAll('.sig-axis-btn').forEach(b => {
                    const bAxis = b.getAttribute('data-axis');
                    if (this._signalState.axes.has(bAxis)) {
                        b.classList.add('bg-primary', 'text-white');
                        b.classList.remove('text-gray-500', 'hover:bg-gray-50');
                    } else {
                        b.classList.remove('bg-primary', 'text-white');
                        b.classList.add('text-gray-500', 'hover:bg-gray-50');
                    }
                });

                this._renderMainSignalChart();
                this._updateMainFeaturesPanel();
            });
        });

        // Reset zoom button
        const resetBtn = mc.querySelector('#sig-reset-zoom');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const chart = this.instances['stsMainSignalChart'];
                if (chart) chart.resetZoom();
            });
        }
    },

    _renderMainSignalChart() {
        console.log('[LIA][Signals] creating main chart');
        if (typeof Chart === 'undefined') {
            console.error('[LIA][Signals] Chart.js não está carregado.');
            return;
        }

        const mc = document.querySelector('#main-content');
        if (!mc) return;

        const ctx = mc.querySelector('#stsMainSignalChart');
        const container = ctx?.parentElement;
        if (!ctx || !container) {
            console.error('[LIA][Signals] canvas or container not found.');
            return;
        }

        const rect = container.getBoundingClientRect();
        console.log('[LIA][Signals] dimensões canvas:', {
            width: rect.width,
            height: rect.height
        });

        if (rect.width === 0 || rect.height === 0) {
            console.warn('[LIA][Signals] Canvas ainda sem dimensões. Chart.js aguardará o ResizeObserver.');
        }

        const datasetsInfo = this._getSignalArrays();
        if (!datasetsInfo || !datasetsInfo.length) return;

        const primaryDataset = datasetsInfo[0];
        const times = primaryDataset.times;
        const unit = primaryDataset.unit;
        
        const { data, selectedCycle } = this._signalState;

        // Downsample for performance (every 2nd point)
        const step = 2;
        const dsTimes = times.filter((_, i) => i % step === 0);
        
        const chartDatasets = datasetsInfo.map(info => {
            const dsValues = info.values.filter((_, i) => i % step === 0);
            return {
                label: info.label,
                data: dsTimes.map((t, i) => ({ x: t, y: dsValues[i] })),
                borderColor: info.color,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.3,
                fill: false,
            };
        });

        // Build cycle highlight annotation
        const annotations = {};
        if (selectedCycle) {
            const cycle = data.cycles.find(c => c.id === selectedCycle);
            if (cycle) {
                annotations['cycleHighlight'] = {
                    type: 'box',
                    xMin: cycle.start, xMax: cycle.end,
                    backgroundColor: 'rgba(20,43,91,0.07)',
                    borderColor: '#142B5B',
                    borderWidth: 1.5,
                    borderDash: [4, 3],
                };
            }
        }

        // Destroy previous chart and observer
        const existing = Chart.getChart(ctx);
        if (existing) {
            existing.destroy();
        }
        if (this.instances['stsMainSignalChart']) {
            this.instances['stsMainSignalChart'].destroy();
        }
        if (!this.observers) this.observers = {};
        if (this.observers['stsMainSignalChart']) {
            this.observers['stsMainSignalChart'].disconnect();
            delete this.observers['stsMainSignalChart'];
        }

        const plugins = {
            legend: { 
                display: true,
                position: 'top',
                align: 'start',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'line',
                    boxWidth: 20,
                    font: { size: 10 }
                }
            },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${this._fmt(ctx.parsed.y, 2)} ${unit}`,
                    title: items => `Tempo: ${this._fmt(items[0].parsed.x, 2)} s`,
                }
            }
        };

        this._lastMainTimes = times;
        this._lastMainValues = primaryDataset.values;
        this._lastMainUnit = unit;

        if (typeof window.ChartZoom !== 'undefined' || (Chart.registry && Chart.registry.getPlugin('zoom'))) {
            plugins.zoom = {
                zoom: {
                    wheel: { enabled: false },
                    pinch: { enabled: false },
                    mode: 'x',
                    onZoomComplete: ({ chart }) => this._onZoomComplete(chart, times, primaryDataset.values, unit),
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                    onPanComplete: ({ chart }) => this._onZoomComplete(chart, times, primaryDataset.values, unit),
                },
            };
        }

        if (typeof window.ChartAnnotation !== 'undefined' || (Chart.registry && Chart.registry.getPlugin('annotation'))) {
            plugins.annotation = {
                annotations
            };
        }

        try {
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: chartDatasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: plugins,
                    scales: {
                        x: {
                            type: 'linear',
                            min: 0, max: 10,
                            title: { display: true, text: 'Tempo (s)', font: { size: 10 }, color: '#94a3b8' },
                            grid: { color: '#f8fafc', drawBorder: false },
                            ticks: { font: { size: 10 }, color: '#94a3b8', maxTicksLimit: 10 }
                        },
                        y: {
                            title: { display: true, text: unit, font: { size: 10 }, color: '#94a3b8' },
                            grid: { color: '#f1f5f9', drawBorder: false },
                            ticks: { font: { size: 10 }, color: '#94a3b8' }
                        }
                    }
                }
            });
            this.instances['stsMainSignalChart'] = chart;
            console.log('[LIA][Signals] Chart principal criado');

            const observer = new ResizeObserver(() => {
                if (this.instances['stsMainSignalChart']) {
                    this.instances['stsMainSignalChart'].resize();
                }
            });
            observer.observe(container);
            this.observers['stsMainSignalChart'] = observer;
        } catch (e) {
            console.error('[LIA][Signals] Erro ao criar gráfico principal:', e);
            const errDiv = document.getElementById('sig-error-msg');
            if (errDiv) {
                errDiv.textContent = 'Erro ao criar gráfico principal: ' + e.message;
                errDiv.style.display = 'block';
            }
            return;
        }

        console.log('[LIA][Signals] main chart created');

        // Update navigator
        this._renderNavChart(chartDatasets[0].data, chartDatasets[0].borderColor);

        // Update chart header
        const titleEl = mc.querySelector('#sig-chart-title');
        const subtitleEl = mc.querySelector('#sig-chart-subtitle');
        let mainTitle = this._signalState.signal === 'angle' ? 'Ângulo do tronco' : (this._signalState.signal === 'accel' ? 'Acelerômetro' : 'Giroscópio');
        if (titleEl) titleEl.textContent = mainTitle;
        if (subtitleEl) subtitleEl.textContent = `Sinal processado durante a avaliação — 30sSTS`;

        // Update features panel
        this._updateMainFeaturesPanel();
    },

    _onZoomComplete(chart, times, values, unit) {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const xMin = chart.scales.x.min;
        const xMax = chart.scales.x.max;

        const windowEl = mc.querySelector('#sigMinimapWindow');
        if (windowEl) {
            const minClamp = Math.max(0, xMin);
            const maxClamp = Math.min(30, xMax);
            const widthPct = ((maxClamp - minClamp) / 30) * 100;
            const leftPct = (minClamp / 30) * 100;
            windowEl.style.width = `${widthPct}%`;
            windowEl.style.left = `${leftPct}%`;
        }

        const inRange = times.map((t, i) => ({ t, v: values[i] })).filter(d => d.t >= xMin && d.t <= xMax).map(d => d.v);
        if (inRange.length < 2) return;

        const badge = mc.querySelector('#sig-selected-interval-badge');
        const rangeLabel = mc.querySelector('#sig-interval-label');
        const intervalStats = mc.querySelector('#sig-interval-stats');
        const intervalRange = mc.querySelector('#sig-interval-range');

        if (badge) { badge.classList.remove('hidden'); badge.classList.add('flex'); }
        if (rangeLabel) rangeLabel.textContent = `${this._fmt(xMin, 1)}–${this._fmt(xMax, 1)} s`;
        if (intervalStats) intervalStats.classList.remove('hidden');
        if (intervalRange) intervalRange.textContent = `${this._fmt(xMin, 1)}–${this._fmt(xMax, 1)} s`;

        const amp = this._getAmplitude(inRange);
        const rms = this._getRMS(inRange);
        const variab = this._getVariability(inRange);
        const mean = this._getMean(inRange);
        const { signal } = this._signalState;
        const unitLabel = signal === 'angle' ? '°' : (signal === 'accel' ? 'm/s²' : '°/s');

        const container = mc.querySelector('#sig-interval-values');
        if (container) {
            container.innerHTML = [
                { label: 'Amplitude', value: `${this._fmt(amp)} ${unitLabel}` },
                { label: 'Média', value: `${this._fmt(mean)} ${unitLabel}` },
                { label: 'RMS', value: this._fmt(rms) },
                { label: 'Variabilidade', value: `${this._fmt(variab)}%` },
            ].map(f => `
                <div class="bg-white rounded-xl p-3 border border-blue-100">
                    <p class="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">${f.label}</p>
                    <p class="text-sm font-black text-blue-700">${f.value}</p>
                </div>
            `).join('');
        }
    },

    _renderNavChart(mainData, color) {
        console.log('[LIA][Signals] creating navigator');
        const mc = document.querySelector('#main-content');
        if (!mc) return;

        const ctx = mc.querySelector('#stsNavChart');
        const container = ctx?.parentElement;
        if (!ctx || !container) return;

        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('[LIA][Signals] Canvas do navegador ainda sem dimensões. Chart.js aguardará o ResizeObserver.');
        }

        const existing = Chart.getChart(ctx);
        if (existing) {
            existing.destroy();
        }
        if (this.instances['stsNavChart']) {
            this.instances['stsNavChart'].destroy();
        }
        if (!this.observers) this.observers = {};
        if (this.observers['stsNavChart']) {
            this.observers['stsNavChart'].disconnect();
            delete this.observers['stsNavChart'];
        }

        try {
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [{
                        data: mainData,
                        borderColor: color,
                        borderWidth: 1,
                        pointRadius: 0,
                        tension: 0.3,
                        fill: { target: 'origin', above: color + '15' },
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: false } },
                    scales: {
                        x: { type: 'linear', display: false },
                        y: { display: false },
                    },
                    animation: false,
                }
            });
            this.instances['stsNavChart'] = chart;
            console.log('[LIA][Signals] Navigator criado');

            const observer = new ResizeObserver(() => {
                if (this.instances['stsNavChart']) {
                    this.instances['stsNavChart'].resize();
                }
            });
            observer.observe(container);
            this.observers['stsNavChart'] = observer;

            // Handle Drag no Minimap
            const minimapWindow = mc.querySelector('#sigMinimapWindow');
            if (minimapWindow) {
                let isDragging = false;
                
                const onDrag = (e) => {
                    if (!isDragging) return;
                    const cRect = ctx.getBoundingClientRect();
                    let x = e.clientX - cRect.left;
                    const windowWidth = minimapWindow.clientWidth;
                    x = x - (windowWidth / 2);
                    
                    const mainChart = this.instances['stsMainSignalChart'];
                    if (mainChart) {
                        const totalRange = 30; // maxTime
                        const currentInterval = mainChart.options.scales.x.max - mainChart.options.scales.x.min;
                        const pct = Math.max(0, Math.min(x / cRect.width, 1 - (currentInterval / totalRange)));
                        
                        const newMin = pct * totalRange;
                        const newMax = newMin + currentInterval;
                        
                        mainChart.options.scales.x.min = newMin;
                        mainChart.options.scales.x.max = newMax;
                        mainChart.update('none'); // Update smoothly
                        
                        if (this._lastMainTimes && this._lastMainValues && this._lastMainUnit) {
                            this._onZoomComplete(mainChart, this._lastMainTimes, this._lastMainValues, this._lastMainUnit);
                        }
                    }
                };

                minimapWindow.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    document.body.style.userSelect = 'none';
                    minimapWindow.classList.add('bg-primary/30');
                });

                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        document.body.style.userSelect = '';
                        minimapWindow.classList.remove('bg-primary/30');
                    }
                });
                
                // Clicking directly on the canvas
                container.addEventListener('mousedown', (e) => {
                    if(e.target === minimapWindow || e.target.closest('#sigMinimapWindow')) return;
                    const cRect = ctx.getBoundingClientRect();
                    let x = e.clientX - cRect.left;
                    const windowWidth = minimapWindow.clientWidth;
                    x = x - (windowWidth / 2);
                    
                    const mainChart = this.instances['stsMainSignalChart'];
                    if (mainChart) {
                        const totalRange = 30;
                        const currentInterval = mainChart.options.scales.x.max - mainChart.options.scales.x.min;
                        const pct = Math.max(0, Math.min(x / cRect.width, 1 - (currentInterval / totalRange)));
                        
                        const newMin = pct * totalRange;
                        const newMax = newMin + currentInterval;
                        
                        mainChart.options.scales.x.min = newMin;
                        mainChart.options.scales.x.max = newMax;
                        mainChart.update('none');
                        if (this._lastMainTimes && this._lastMainValues && this._lastMainUnit) {
                            this._onZoomComplete(mainChart, this._lastMainTimes, this._lastMainValues, this._lastMainUnit);
                        }
                    }
                    isDragging = true;
                    minimapWindow.classList.add('bg-primary/30');
                });
            }

            // Sync initial state
            setTimeout(() => {
                const mainChart = this.instances['stsMainSignalChart'];
                if (mainChart && this._lastMainTimes && this._lastMainValues && this._lastMainUnit) {
                    this._onZoomComplete(mainChart, this._lastMainTimes, this._lastMainValues, this._lastMainUnit);
                }
            }, 100);

        } catch (e) {
            console.error('[LIA][Signals] Erro ao criar gráfico navegador:', e);
            return;
        }
    },

    _updateMainFeaturesPanel() {
        const mc = document.querySelector('#main-content');
        if (!mc) return;

        const datasetsInfo = this._getSignalArrays();
        if (!datasetsInfo || !datasetsInfo.length) return;
        const primaryDataset = datasetsInfo[0];
        const values = primaryDataset.values;
        const unit = primaryDataset.unit;
        
        const { signal } = this._signalState;

        const amp = this._getAmplitude(values);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const rms = this._getRMS(values);
        const variab = this._getVariability(values);
        const mean = this._getMean(values);

        let features = [];
        if (signal === 'angle') {
            features = [
                { label: 'Amplitude angular', value: `${this._fmt(amp)}°`, sub: 'max − min' },
                { label: 'Máximo', value: `${this._fmt(max)}°` },
                { label: 'Mínimo', value: `${this._fmt(min)}°` },
                { label: 'Média', value: `${this._fmt(mean)}°` },
                { label: 'RMS', value: this._fmt(rms, 2) },
                { label: 'Variabilidade', value: `${this._fmt(variab)}%` },
            ];
        } else if (signal === 'accel') {
            const peak = this._getPeakValue(values);
            features = [
                { label: 'Pico de aceleração', value: `${this._fmt(peak, 2)} ${unit}` },
                { label: 'RMS', value: `${this._fmt(rms, 2)} ${unit}` },
                { label: 'Amplitude', value: `${this._fmt(amp, 2)} ${unit}` },
                { label: 'Máximo', value: `${this._fmt(max, 2)} ${unit}` },
                { label: 'Mínimo', value: `${this._fmt(min, 2)} ${unit}` },
                { label: 'Variabilidade', value: `${this._fmt(variab)}%` },
            ];
        } else {
            const peak = this._getPeakValue(values);
            const std = this._getStd(values);
            const zeroCrossings = values.reduce((acc, v, i) => i > 0 && values[i-1] * v < 0 ? acc + 1 : acc, 0);
            features = [
                { label: 'Vel. angular máxima', value: `${this._fmt(peak, 1)} ${unit}` },
                { label: 'RMS', value: `${this._fmt(rms, 2)} ${unit}` },
                { label: 'Amplitude', value: `${this._fmt(amp, 1)} ${unit}` },
                { label: 'Desvio-padrão', value: `${this._fmt(std, 2)}` },
                { label: 'Zero crossings', value: zeroCrossings.toString() },
                { label: 'Variabilidade', value: `${this._fmt(variab)}%` },
            ];
        }

        const container = mc.querySelector('#sig-main-features');
        if (container) {
            container.innerHTML = features.map(f => `
                <div class="flex items-baseline justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                    <span class="text-xs text-gray-500 leading-tight">${f.label}${f.sub ? `<br><span class='text-[10px] text-gray-400'>${f.sub}</span>` : ''}</span>
                    <span class="text-sm font-black text-text-main whitespace-nowrap">${f.value}</span>
                </div>
            `).join('');
        }
    },

    _updateLegend() {
        // Native Chart.js legend is used instead
    },

    _populateTemporalFeatures(data) {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const durations = data.cycles.map(c => c.duration);
        const avgCycle = this._getMean(durations);
        const varCycle = this._getVariability(durations);
        const cadence = (data.numReps / data.totalTime) * 60;

        const set = (id, v) => { const el = mc.querySelector(id); if (el) el.textContent = v; };
        set('#sig-tempo-reps', data.numReps);
        set('#sig-tempo-avgcycle', `${this._fmt(avgCycle, 2)} s`);
        set('#sig-tempo-var', `${this._fmt(varCycle)}%`);
        set('#sig-tempo-cadence', `${this._fmt(cadence)} rep/min`);
    },

    _populateCycleTable(data) {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const tbody = mc.querySelector('#sig-cycle-table-body');
        if (!tbody) return;

        const inertial = data.inertial;

        tbody.innerHTML = data.cycles.map(cycle => {
            // Get accel Y and gyro X values in cycle window
            const inWindow = (arr) => inertial ? arr.filter((_, i) => inertial.times[i] >= cycle.start && inertial.times[i] <= cycle.end) : [];
            const accelVals = inWindow(inertial ? inertial.accelMag : []);
            const gyroVals = inWindow(inertial ? inertial.gyroMag : []);
            const peakAccel = accelVals.length ? this._fmt(this._getPeakValue(accelVals), 2) : '--';
            const peakGyro = gyroVals.length ? this._fmt(this._getPeakValue(gyroVals), 1) : '--';

            return `<tr class="sig-cycle-row hover:bg-blue-50 cursor-pointer transition-colors" data-cycle-id="${cycle.id}">
                <td class="py-2.5 px-4 font-bold text-primary">${cycle.id}</td>
                <td class="py-2.5 px-4 text-right text-gray-600">${this._fmt(cycle.duration, 2)} s</td>
                <td class="py-2.5 px-4 text-right text-gray-600">${this._fmt(cycle.amplitude)}°</td>
                <td class="py-2.5 px-4 text-right text-gray-600">${peakAccel} m/s²</td>
                <td class="py-2.5 px-4 text-right text-gray-600">${peakGyro} °/s</td>
            </tr>`;
        }).join('');

        // Row click to highlight cycle
        tbody.querySelectorAll('.sig-cycle-row').forEach(row => {
            row.addEventListener('click', () => {
                const cycleId = parseInt(row.getAttribute('data-cycle-id'));
                const prevSelected = this._signalState.selectedCycle;

                if (prevSelected === cycleId) {
                    this._signalState.selectedCycle = null;
                    tbody.querySelectorAll('.sig-cycle-row').forEach(r => r.classList.remove('bg-blue-50', 'border-l-2', 'border-primary'));
                    const badge = mc.querySelector('#sig-selected-cycle-badge');
                    if (badge) badge.classList.add('hidden');
                } else {
                    this._signalState.selectedCycle = cycleId;
                    tbody.querySelectorAll('.sig-cycle-row').forEach(r => r.classList.remove('bg-blue-50', 'border-l-2', 'border-primary'));
                    row.classList.add('bg-blue-50', 'border-l-2', 'border-primary');
                    const badge = mc.querySelector('#sig-selected-cycle-badge');
                    if (badge) { badge.textContent = `Ciclo ${cycleId} selecionado`; badge.classList.remove('hidden'); }
                }

                this._renderMainSignalChart();
            });
        });
    },

    _populatePeriodTable(data) {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const tbody = mc.querySelector('#sig-period-table-body');
        if (!tbody) return;

        const periods = [
            { label: 'Início', start: 0, end: 10, icon: '🟢' },
            { label: 'Meio', start: 10, end: 20, icon: '🟡' },
            { label: 'Final', start: 20, end: 30, icon: '🔴' },
        ];

        tbody.innerHTML = periods.map(p => {
            const periodCycles = data.cycles.filter(c => c.start >= p.start && c.end <= p.end);
            const amplitudes = periodCycles.map(c => c.amplitude);
            const durations = periodCycles.map(c => c.duration);

            const avgAmp = amplitudes.length ? this._getMean(amplitudes) : 0;
            const avgDur = durations.length ? this._getMean(durations) : 0;
            const variab = amplitudes.length > 1 ? this._getVariability(amplitudes) : 0;

            return `<tr class="border-b border-gray-50">
                <td class="py-3 px-4 font-bold text-gray-700">${p.icon} ${p.label}</td>
                <td class="py-3 px-4 text-right text-gray-600">${this._fmt(avgAmp)}°</td>
                <td class="py-3 px-4 text-right text-gray-600">${this._fmt(avgDur, 2)} s</td>
                <td class="py-3 px-4 text-right text-gray-600">${this._fmt(variab)}%</td>
            </tr>`;
        }).join('');
    },

    _setupTechDetails(data) {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const grid = mc.querySelector('#sig-tech-grid');
        if (!grid) return;

        const inertial = data.inertial;
        const angleVals = data.trunkAngleData.map(d => d.y);

        const sections = [
            { title: 'Ângulo do tronco', values: angleVals, unit: '°' },
            { title: 'Acelerômetro X', values: inertial ? inertial.accelX : [], unit: 'm/s²' },
            { title: 'Acelerômetro Y', values: inertial ? inertial.accelY : [], unit: 'm/s²' },
            { title: 'Acelerômetro Z', values: inertial ? inertial.accelZ : [], unit: 'm/s²' },
            { title: 'Giroscópio X', values: inertial ? inertial.gyroX : [], unit: '°/s' },
            { title: 'Giroscópio Y', values: inertial ? inertial.gyroY : [], unit: '°/s' },
            { title: 'Giroscópio Z', values: inertial ? inertial.gyroZ : [], unit: '°/s' },
        ];

        grid.innerHTML = sections.map(s => {
            if (!s.values.length) return '';
            const st = this._getStatistics(s.values);
            const rows = [
                ['Média', `${this._fmt(st.mean, 3)} ${s.unit}`],
                ['Mediana', `${this._fmt(st.median, 3)} ${s.unit}`],
                ['Desvio-padrão', `${this._fmt(st.std, 3)}`],
                ['Variância', `${this._fmt(st.variance, 3)}`],
                ['Mínimo', `${this._fmt(st.min, 3)} ${s.unit}`],
                ['Máximo', `${this._fmt(st.max, 3)} ${s.unit}`],
                ['Amplitude', `${this._fmt(st.amplitude, 3)} ${s.unit}`],
                ['RMS', `${this._fmt(st.rms, 3)}`],
                ['Skewness', `${this._fmt(st.skewness, 3)}`],
                ['Kurtosis', `${this._fmt(st.kurtosis, 3)}`],
            ];
            return `<div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">${s.title}</p>
                <div class="flex flex-col gap-1.5">
                    ${rows.map(([k, v]) => `<div class="flex justify-between gap-2"><span class="text-xs text-gray-400">${k}</span><span class="text-xs font-semibold text-gray-700 font-mono">${v}</span></div>`).join('')}
                </div>
            </div>`;
        }).join('');
    },

    _setupCollapsible() {
        const mc = document.querySelector('#main-content');
        if (!mc) return;
        const toggle = mc.querySelector('#sig-tech-toggle');
        const content = mc.querySelector('#sig-tech-content');
        const chevron = mc.querySelector('#sig-tech-chevron');

        if (toggle && content) {
            toggle.addEventListener('click', () => {
                const isHidden = content.classList.contains('hidden');
                content.classList.toggle('hidden', !isHidden);
                if (chevron) chevron.style.transform = isHidden ? 'rotate(180deg)' : '';
            });
        }
    },

        _setupIndicadoresUI(data) {
        const setHTML = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };

        const reps = data.cycles.length;
        const durations = data.cycles.map(c => c.duration);
        
        const tLevantando = data.cycles.map(c => c.phases && c.phases.levantando ? c.phases.levantando : (c.duration * 0.4));
        const statsLev = this._getStatistics ? this._getStatistics(tLevantando) : { median: this._getMean(tLevantando) };
        const medLev = statsLev.median || this._getMean(tLevantando);

        const amplitudes = data.cycles.map(c => c.amplitude);
        const statsAmp = this._getStatistics ? this._getStatistics(amplitudes) : { mean: this._getMean(amplitudes) };
        const avgAmp = statsAmp.mean || this._getMean(amplitudes);

        const cvDur = this._getVariability(durations);

        const third = Math.max(1, Math.floor(reps / 3));
        const firstThird = this._getMean(durations.slice(0, third));
        const secondThird = this._getMean(durations.slice(third, third * 2));
        const lastThird = this._getMean(durations.slice(-third));
        const change = lastThird - firstThird;

        setHTML('ind-feat-reps-val', reps);
        setHTML('ind-feat-trans-val', `${this._fmt(medLev, 2)}`);
        setHTML('ind-feat-tronco-val', `${this._fmt(avgAmp, 1)}`);
        setHTML('ind-feat-vel-val', `82.4`);
        setHTML('ind-feat-var-val', `${this._fmt(cvDur, 1)}`);
        setHTML('ind-feat-evol-val', `${change > 0 ? '+' : ''}${this._fmt(change, 2)}`);

        setHTML('ind-header-participant', data.patientName || 'Maria Silva');
        setHTML('ind-header-id', data.patientId || 'P-1004');
        setHTML('ind-header-date', data.date || '18/09/2026');
        setHTML('ind-header-reps', reps);
        setHTML('ind-evolucao-delta', `${change > 0 ? '+' : ''}${this._fmt(change, 2)} s`);

        this._renderIndicadoresCharts(data, durations, firstThird, secondThird, lastThird);
    },

    _renderIndicadoresCharts(data, durations, firstThird, secondThird, lastThird) {
        ['indPerfilChart', 'indAngularChart', 'indVariabilidadeChart', 'indEvolucaoChart'].forEach(id => {
            if (this.instances[id]) {
                this.instances[id].destroy();
            }
        });

        // 1. Perfil das Repetições (Stacked Bar Chart - Absolute Time)
        const ctxPerfil = document.getElementById('indPerfilChart');
        if (ctxPerfil) {
            const numCycles = data.cycles.length;
            const container = document.getElementById('indPerfilChartContainer');
            if (container) {
                const requiredHeight = Math.max(350, numCycles * 40);
                container.style.height = `${requiredHeight}px`;
            }

            const labels = data.cycles.map(c => `R${c.id}`);
            const tLevantando = data.cycles.map(c => c.phases && c.phases.levantando ? c.phases.levantando : (c.duration * 0.4));
            const tDePe = data.cycles.map(c => c.phases && c.phases.em_pe ? c.phases.em_pe : (c.duration * 0.2));
            const tSentando = data.cycles.map(c => c.phases && c.phases.sentando ? c.phases.sentando : (c.duration * 0.4));

            this.instances['indPerfilChart'] = new Chart(ctxPerfil, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Levantando', data: tLevantando, backgroundColor: '#3b82f6' },
                        { label: 'Em pé', data: tDePe, backgroundColor: '#94a3b8' },
                        { label: 'Sentando', data: tSentando, backgroundColor: '#10b981' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: { position: 'top', align: 'start', labels: { boxWidth: 12, usePointStyle: true } },
                        tooltip: { 
                            mode: 'index', 
                            intersect: false, 
                            callbacks: { 
                                title: (ctx) => `Repetição ${ctx[0].label.replace('R', '')}`,
                                label: ctx => `${ctx.dataset.label.padEnd(12)} ${(ctx.raw).toFixed(2)} s`,
                                footer: (ctx) => {
                                    let sum = 0;
                                    ctx.forEach(item => { sum += item.raw; });
                                    return `\nCiclo total: ${sum.toFixed(2)} s`;
                                }
                            } 
                        }
                    },
                    scales: {
                        x: { stacked: true, title: { display: true, text: 'Tempo (s)' }, grid: { color: '#f1f5f9' } },
                        y: { stacked: true, grid: { display: false } }
                    },
                    interaction: { mode: 'index', intersect: true },
                    onHover: (e, activeEls, chart) => {
                        chart.canvas.style.cursor = activeEls.length ? 'pointer' : 'default';
                    }
                }
            });
        }

        // 2. Velocidade Angular por Fase (Aproximação de Boxplot com Floating Bars)
        const ctxAng = document.getElementById('indAngularChart');
        if (ctxAng) {
            const labels = ['Levantando', 'Em pé', 'Sentando'];
            // [Min, Max] para a barra flutuante simulando os quartis/limites
            const qData = [
                [60, 105], // Levantando
                [5, 25],   // Em pé
                [45, 95]   // Sentando
            ];
            const medianData = [82.4, 12.1, 68.5]; // Mediana

            this.instances['indAngularChart'] = new Chart(ctxAng, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Variação (Min-Max)',
                            data: qData,
                            backgroundColor: 'rgba(59, 130, 246, 0.2)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                            borderRadius: 4,
                            barPercentage: 0.5
                        },
                        {
                            label: 'Mediana',
                            data: medianData,
                            type: 'scatter',
                            backgroundColor: '#1e3a8a',
                            borderColor: '#1e3a8a',
                            pointStyle: 'rectRot',
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(ctx) {
                                    if (ctx.datasetIndex === 0) return `Variação: ${ctx.raw[0]} a ${ctx.raw[1]} °/s`;
                                    return `Mediana: ${ctx.raw} °/s`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Fases do Ciclo' }, grid: { display: false } },
                        y: { title: { display: true, text: 'Velocidade Angular (°/s)' }, beginAtZero: true }
                    }
                }
            });
        }

        // 3. Variabilidade entre Ciclos (Scatter Plot temporal real)
        const ctxVar = document.getElementById('indVariabilidadeChart');
        if (ctxVar) {
            const scatterData = data.cycles.map(c => ({ x: c.id, y: c.duration }));
            const stats = this._getStatistics ? this._getStatistics(durations) : { median: this._getMean(durations) };
            const medianDur = stats.median || this._getMean(durations);

            this.instances['indVariabilidadeChart'] = new Chart(ctxVar, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Tempo de Ciclo',
                            data: scatterData,
                            backgroundColor: '#8b5cf6',
                            borderColor: '#8b5cf6',
                            pointRadius: 6,
                            pointHoverRadius: 8
                        },
                        {
                            label: 'Mediana',
                            data: scatterData.map(d => ({ x: d.x, y: medianDur })),
                            type: 'line',
                            borderColor: '#94a3b8',
                            borderWidth: 1.5,
                            borderDash: [5, 5],
                            pointRadius: 0,
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: ctx => `R${ctx.raw.x}: ${ctx.raw.y.toFixed(2)} s` } }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Repetição' }, ticks: { stepSize: 1 } },
                        y: { title: { display: true, text: 'Tempo (s)' } }
                    }
                }
            });
        }

        // 4. Variação do Tempo de Ciclo (Linha dos Terços)
        const ctxEvolucao = document.getElementById('indEvolucaoChart');
        if (ctxEvolucao) {
            const labels = ['1º Terço', '2º Terço', 'Último Terço'];
            const tData = [firstThird, secondThird, lastThird];

            this.instances['indEvolucaoChart'] = new Chart(ctxEvolucao, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tempo de Ciclo (s)',
                            data: tData,
                            borderColor: '#0d9488',
                            backgroundColor: '#0d9488',
                            borderWidth: 3,
                            pointBackgroundColor: '#fff',
                            pointBorderColor: '#0d9488',
                            pointBorderWidth: 3,
                            pointRadius: 6,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: ctx => `Tempo: ${ctx.raw.toFixed(2)} s` } }
                    },
                    scales: {
                        x: { title: { display: true, text: 'Terço do Teste' }, grid: { display: false } },
                        y: { title: { display: true, text: 'Tempo (s)' }, min: 0 }
                    }
                }
            });
        }
    },


    _setupComparacaoUI(data) {
        // 1. HEADER
        const reps = data.numReps || 12;
        // 2. NORMATIVE
        this._renderNormativeSection(reps);

        // 3. HISTORY
        this._renderHistorySection(data);

        // 4. POPULATION
        this._renderPopulationSection(reps, 'female');
        
        const genderFilter = document.getElementById('compPopGenderSelect');
        if (genderFilter) {
            const updatePop = () => {
                this._renderPopulationSection(reps, genderFilter.value);
            };
            genderFilter.onchange = updatePop;
        }

        // 5. FEATURES TABLE
        this._renderFeatureComparisonTable(data);

        // 6. CHARTS (Profile, Cycle Time, Vel)
        this._renderComparacaoCharts(data);
    },

    _renderNormativeSection(reps) {
        const source = "Rikli & Jones / Senior Fitness Test";
        const catLow = "< 12", catAvg = "12 - 17", catHigh = "> 17";
        
        const sourceEl = document.getElementById('norm-source-val');
        if (sourceEl) sourceEl.innerText = source;
        const resEl = document.getElementById('norm-res-val');
        if (resEl) resEl.innerText = `${reps} repetições`;
        const lowEl = document.getElementById('norm-limit-low');
        if (lowEl) lowEl.innerText = catLow;
        const avgEl = document.getElementById('norm-limit-avg');
        if (avgEl) avgEl.innerText = catAvg;
        const highEl = document.getElementById('norm-limit-high');
        if (highEl) highEl.innerText = catHigh;

        let category = "Média";
        let leftPercent = 50;

        if (reps < 12) {
            category = "Abaixo da média";
            leftPercent = Math.max(0, (reps / 12) * 33.3);
        } else if (reps > 17) {
            category = "Acima da média";
            leftPercent = Math.min(100, 66.6 + ((reps - 17) / 10) * 33.3);
        } else {
            category = "Média";
            leftPercent = 33.3 + ((reps - 12) / 5) * 33.3;
        }

        const catValEl = document.getElementById('norm-cat-val');
        if (catValEl) catValEl.innerText = category;
        const marker = document.getElementById('normative-marker');
        const markerLabel = document.getElementById('normative-marker-label');
        
        if (marker && markerLabel) {
            setTimeout(() => {
                marker.style.left = `${leftPercent}%`;
                markerLabel.style.left = `${leftPercent}%`;
                markerLabel.innerText = reps;
            }, 100);
        }
    },

    _renderHistorySection(data) {
        const ctx = document.getElementById('compHistoryChart');
        if (!ctx) return;
        
        if (this.instances['compHistoryChart']) {
            this.instances['compHistoryChart'].destroy();
        }

        const dates = ['15/03/2026', '20/05/2026', '10/07/2026', '19/09/2026'];
        const values = [10, 10, 11, data.numReps || 12];
        
        this.instances['compHistoryChart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Repetições',
                    data: values,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    pointBackgroundColor: '#2563eb',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false }
                }
            }
        });

        const tbody = document.getElementById('compHistoryTableBody');
        if (tbody) {
            let html = '';
            values.forEach((v, i) => {
                let delta = i > 0 ? (v - values[i-1]) : '—';
                let deltaStr = delta === '—' ? delta : (delta > 0 ? `+${delta}` : delta);
                html += `
                    <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 font-medium text-gray-700">Avaliação ${i+1}${i === values.length-1 ? ' (Atual)' : ''}</td>
                        <td class="px-4 py-3 text-gray-500">${dates[i]}</td>
                        <td class="px-4 py-3 text-right font-bold text-text-main">${v}</td>
                        <td class="px-4 py-3 text-right font-semibold ${delta > 0 ? 'text-text-main' : (delta < 0 ? 'text-text-main' : 'text-gray-400')}">${deltaStr}</td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }
    },

    _getRikliJonesData(gender) {
        const female = {
            p75: [ {x: 60, y: 17}, {x: 65, y: 16}, {x: 70, y: 15}, {x: 75, y: 15}, {x: 80, y: 14}, {x: 85, y: 13}, {x: 90, y: 11} ],
            p50: [ {x: 60, y: 14.5}, {x: 65, y: 13.5}, {x: 70, y: 12.5}, {x: 75, y: 12.5}, {x: 80, y: 11.5}, {x: 85, y: 10.5}, {x: 90, y: 7.5} ],
            p25: [ {x: 60, y: 12}, {x: 65, y: 11}, {x: 70, y: 10}, {x: 75, y: 10}, {x: 80, y: 9}, {x: 85, y: 8}, {x: 90, y: 4} ]
        };
        const male = {
            p75: [ {x: 60, y: 19}, {x: 65, y: 18}, {x: 70, y: 17}, {x: 75, y: 17}, {x: 80, y: 15}, {x: 85, y: 14}, {x: 90, y: 12} ],
            p50: [ {x: 60, y: 16.5}, {x: 65, y: 15}, {x: 70, y: 14.5}, {x: 75, y: 14}, {x: 80, y: 12.5}, {x: 85, y: 11}, {x: 90, y: 9.5} ],
            p25: [ {x: 60, y: 14}, {x: 65, y: 12}, {x: 70, y: 12}, {x: 75, y: 11}, {x: 80, y: 10}, {x: 85, y: 8}, {x: 90, y: 7} ]
        };
        const all = {
            p75: female.p75.map((f, i) => ({ x: f.x, y: (f.y + male.p75[i].y) / 2 })),
            p50: female.p50.map((f, i) => ({ x: f.x, y: (f.y + male.p50[i].y) / 2 })),
            p25: female.p25.map((f, i) => ({ x: f.x, y: (f.y + male.p25[i].y) / 2 }))
        };

        if (gender === 'male') return male;
        if (gender === 'female') return female;
        return all;
    },

    _renderPopulationSection(reps, filterGender = 'female') {
        const norms = this._getRikliJonesData(filterGender);
        
        // As the chart shows all ages, we'll just leave the stats as generic or remove them.
        // For now, let's keep the patient's age bracket stats if we had one, or default to '--' 
        // since we no longer filter by age. The user's age is 68 in our mock.
        const patientAgeVal = 65; 
        let statP75 = '--', statP50 = '--', statP25 = '--';
        const pt75 = norms.p75.find(p => p.x === patientAgeVal);
        if (pt75) {
            statP75 = pt75.y;
            statP50 = norms.p50.find(p => p.x === patientAgeVal).y;
            statP25 = norms.p25.find(p => p.x === patientAgeVal).y;
        }

        const pctEl = document.getElementById('pop-stat-pct');
        if (pctEl) pctEl.innerText = 'P' + Math.round(Math.min(100, Math.max(0, (reps / 20) * 100)));
        const p25El = document.getElementById('pop-stat-p25');
        if (p25El) p25El.innerText = statP25;
        const medEl = document.getElementById('pop-stat-med');
        if (medEl) medEl.innerText = statP50;
        const p75El = document.getElementById('pop-stat-p75');
        if (p75El) p75El.innerText = statP75;

        const ctx = document.getElementById('compPopulationChart');
        if (!ctx) return;

        if (this.instances['compPopulationChart']) {
            this.instances['compPopulationChart'].destroy();
        }

        const patientAge = 68; // Exemplo de idade mockada

        this.instances['compPopulationChart'] = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'P75',
                        data: norms.p75,
                        borderColor: '#10b981', // emerald-500
                        backgroundColor: 'rgba(16, 185, 129, 0.25)',
                        pointBackgroundColor: '#10b981',
                        fill: 1,
                        tension: 0.2
                    },
                    {
                        label: 'P50 (Mediana)',
                        data: norms.p50,
                        borderColor: '#f59e0b', // amber-500
                        backgroundColor: 'rgba(245, 158, 11, 0.25)',
                        pointBackgroundColor: '#f59e0b',
                        borderWidth: 3,
                        fill: 2,
                        tension: 0.2
                    },
                    {
                        label: 'P25',
                        data: norms.p25,
                        borderColor: '#f43f5e', // rose-500
                        backgroundColor: 'transparent',
                        pointBackgroundColor: '#f43f5e',
                        fill: false,
                        tension: 0.2
                    },
                    {
                        label: 'Atual',
                        data: [{x: patientAge, y: reps}],
                        borderColor: '#2563eb',
                        backgroundColor: '#2563eb',
                        pointStyle: 'rectRot',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        showLine: false,
                        type: 'scatter'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: { usePointStyle: true, boxWidth: 8 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Atual') {
                                    return `Atual: ${context.raw.y} reps`;
                                }
                                return `${context.dataset.label}: ${context.raw.y} reps`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Idade' },
                        min: 60,
                        max: 95,
                        ticks: { stepSize: 5 },
                        grid: { borderDash: [5, 5] }
                    },
                    y: {
                        title: { display: true, text: 'Repetições' },
                        min: 0,
                        max: 25,
                        grid: { borderDash: [5, 5] }
                    }
                },
                animation: {
                    onComplete: function() {
                        const chartInstance = this;
                        const ctx = chartInstance.ctx;
                        const meta = chartInstance.getDatasetMeta(3);
                        if (meta && meta.data && meta.data[0]) {
                            const point = meta.data[0];
                            ctx.save();
                            ctx.fillStyle = '#2563eb';
                            ctx.font = 'bold 11px Inter, sans-serif';
                            ctx.textAlign = 'center';
                            // Ajustando para que o texto não corte no topo se estiver muito perto
                            ctx.fillText(`Atual: ${reps}`, point.x, point.y - 12);
                            ctx.restore();
                        }
                    }
                }
            }
        });
    },

    _renderFeatureComparisonTable(data) {
        const tbody = document.getElementById('compFeatureTableBody');
        if (!tbody) return;

        const currentReps = data.numReps || 12;
        
        const rows = [
            { name: 'Repetições', current: currentReps, previous: currentReps - 2, unit: '', deltaType: 'abs' },
            { name: 'Tempo de transferência', current: 1.12, previous: 1.31, unit: ' s', deltaType: 'abs' },
            { name: 'Amplitude angular', current: 42.8, previous: 39.2, unit: '°', deltaType: 'abs' },
            { name: 'Velocidade angular', current: 82, previous: 74, unit: ' °/s', deltaType: 'abs' },
            { name: 'Variabilidade temporal', current: 8.4, previous: 11.1, unit: '%', deltaType: 'pp' },
            { name: 'Variação do tempo de ciclo', current: 16.3, previous: 18.4, unit: '%', deltaType: 'pp' }
        ];

        let html = '';
        rows.forEach(r => {
            let delta = (r.current - r.previous).toFixed(r.current % 1 !== 0 ? 1 : 0);
            let deltaStr = delta > 0 ? `+${delta}` : delta;
            if (r.deltaType === 'pp') deltaStr += ' p.p.';
            else deltaStr += r.unit;

            html += `
                <tr class="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3 font-medium text-gray-700">${r.name}</td>
                    <td class="px-4 py-3 text-right font-bold text-text-main">${r.current}${r.unit}</td>
                    <td class="px-4 py-3 text-right font-semibold text-gray-500">${r.previous}${r.unit}</td>
                    <td class="px-4 py-3 text-right font-semibold text-text-main">${deltaStr}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    _renderComparacaoCharts(data) {
        // PERFIL DAS REPETIÇÕES (ATUAL VS ANTERIOR)
        const cycles = data.cycles || [];
        
        // Mock anterior phases: slightly longer
        const anteriorCycles = cycles.map(c => ({
            phases: {
                levantando: (c.phases.levantando || 0.5) * 1.1,
                em_pe: (c.phases.em_pe || 0.2) * 1.05,
                sentando: (c.phases.sentando || 0.6) * 1.15
            }
        }));
        // Remove 2 cycles to match the "10 vs 12" mock
        if (anteriorCycles.length > 2) {
            anteriorCycles.splice(-2, 2);
        }

        this._renderProfileStackedBar('compPerfilAtualChart', cycles);
        this._renderProfileStackedBar('compPerfilAntChart', anteriorCycles);

        // TEMPO DE CICLO (LINHA)
        const ctxCycle = document.getElementById('compCycleTimeChart');
        if (ctxCycle) {
            if (this.instances['compCycleTimeChart']) this.instances['compCycleTimeChart'].destroy();
            const currDurations = cycles.map(c => (c.phases.levantando || 0) + (c.phases.em_pe || 0) + (c.phases.sentando || 0));
            const antDurations = anteriorCycles.map(c => (c.phases.levantando || 0) + (c.phases.em_pe || 0) + (c.phases.sentando || 0));
            
            this.instances['compCycleTimeChart'] = new Chart(ctxCycle, {
                type: 'line',
                data: {
                    labels: Array.from({length: Math.max(currDurations.length, antDurations.length)}, (_, i) => `R${i+1}`),
                    datasets: [
                        {
                            label: 'Atual',
                            data: currDurations,
                            borderColor: '#2563eb',
                            backgroundColor: '#2563eb',
                            pointRadius: 4,
                            tension: 0.2
                        },
                        {
                            label: 'Anterior',
                            data: antDurations,
                            borderColor: '#94a3b8',
                            backgroundColor: '#94a3b8',
                            borderDash: [5, 5],
                            pointRadius: 4,
                            tension: 0.2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', align: 'end', labels: { boxWidth: 12, usePointStyle: true } },
                        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(2)} s` } }
                    },
                    scales: {
                        y: { title: { display: true, text: 'Tempo do Ciclo (s)' } }
                    }
                }
            });
        }

        // VELOCIDADE ANGULAR (BARRAS AGRUPADAS)
        const ctxVel = document.getElementById('compVelAngularChart');
        if (ctxVel) {
            if (this.instances['compVelAngularChart']) this.instances['compVelAngularChart'].destroy();
            
            this.instances['compVelAngularChart'] = new Chart(ctxVel, {
                type: 'bar',
                data: {
                    labels: ['Levantando', 'De Pé', 'Sentando'],
                    datasets: [
                        {
                            label: 'Atual',
                            data: [95, 17.5, 90],
                            backgroundColor: '#3b82f6',
                            borderRadius: 4,
                            barPercentage: 0.6,
                            categoryPercentage: 0.6
                        },
                        {
                            label: 'Anterior',
                            data: [82.5, 21, 77.5],
                            backgroundColor: '#94a3b8',
                            borderRadius: 4,
                            barPercentage: 0.6,
                            categoryPercentage: 0.6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', align: 'end', labels: { boxWidth: 12 } },
                        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw} °/s` } }
                    },
                    scales: {
                        y: { title: { display: true, text: 'Velocidade Angular (°/s)' }, beginAtZero: true },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
    },

    _renderProfileStackedBar(canvasId, cyclesData) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.instances[canvasId]) this.instances[canvasId].destroy();

        const labels = cyclesData.map((_, i) => `R${i + 1}`);
        const phase1 = cyclesData.map(c => c.phases ? c.phases.levantando : 0);
        const phase2 = cyclesData.map(c => c.phases ? c.phases.em_pe : 0);
        const phase3 = cyclesData.map(c => c.phases ? c.phases.sentando : 0);

        // Setup container height for horizontal scrolling/sizing
        const container = document.getElementById(canvasId.replace('Chart', 'Container'));
        if (container) {
            container.style.height = `${Math.max(300, cyclesData.length * 40)}px`;
        }

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Levantando', data: phase1, backgroundColor: '#3b82f6', borderRadius: 4 },
                    { label: 'De Pé', data: phase2, backgroundColor: '#93c5fd', borderRadius: 4 },
                    { label: 'Sentando', data: phase3, backgroundColor: '#1e40af', borderRadius: 4 }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)} s`;
                            },
                            afterBody: function(contexts) {
                                if (contexts.length > 0) {
                                    const total = contexts.reduce((sum, ctx) => sum + ctx.raw, 0);
                                    return `\nTempo Total: ${total.toFixed(2)} s`;
                                }
                                return '';
                            }
                        }
                    }
                },
                scales: {
                    x: { stacked: true, title: { display: true, text: 'Duração (s)' } },
                    y: { stacked: true, grid: { display: false } }
                }
            }
        });
    },

    // ============================================================================
    // TELA COMPARAR AVALIAÇÕES (NOVA)
    // ============================================================================

    initComparacaoIndividualScreen() {
        console.log('[LIA][ComparacaoInd] initComparacaoIndividualScreen executado');
        if (!this.instances) this.instances = {};
        
        // Simular histórico de avaliações para Maria Silva
        this.evalHistory = [
            { id: 'EV-2026-09-15', date: '15/09/2026', reps: 14, time: 27.5, amp: 48.2, vel: 78.5, var_temp: 12.4, var_ciclo: 15.2 },
            { id: 'EV-2026-08-10', date: '10/08/2026', reps: 12, time: 28.4, amp: 44.5, vel: 72.1, var_temp: 14.8, var_ciclo: 18.5 },
            { id: 'EV-2026-07-05', date: '05/07/2026', reps: 10, time: 29.8, amp: 41.0, vel: 65.3, var_temp: 18.2, var_ciclo: 22.1 },
            { id: 'EV-2026-06-01', date: '01/06/2026', reps: 9, time: 30.0, amp: 38.5, vel: 58.7, var_temp: 22.5, var_ciclo: 25.8 }
        ];

        const selectA = document.getElementById('select-eval-a');
        const selectB = document.getElementById('select-eval-b');
        
        if (selectA && selectB) {
            let options = '';
            this.evalHistory.forEach((ev, idx) => {
                options += `<option value="${idx}">${ev.date} (EV-${ev.id.split('-')[3]})</option>`;
            });
            
            selectA.innerHTML = options;
            selectB.innerHTML = options;
            
            // Set defaults: A = current (0), B = previous (1)
            selectA.value = 0;
            selectB.value = 1;
            
            const updateComparison = () => {
                const idxA = parseInt(selectA.value);
                const idxB = parseInt(selectB.value);
                
                if (idxA === idxB) {
                    document.getElementById('comp-error-msg').classList.remove('hidden');
                    document.getElementById('comp-content-area').classList.add('hidden');
                } else {
                    document.getElementById('comp-error-msg').classList.add('hidden');
                    document.getElementById('comp-content-area').classList.remove('hidden');
                    
                    document.getElementById('th-eval-a').innerText = this.evalHistory[idxA].date;
                    document.getElementById('th-eval-b').innerText = this.evalHistory[idxB].date;
                    document.getElementById('title-prof-a').innerText = this.evalHistory[idxA].date;
                    document.getElementById('title-prof-b').innerText = this.evalHistory[idxB].date;
                    
                    this.renderComparacaoIndividualCharts(idxA, idxB);
                }
            };

            selectA.addEventListener('change', updateComparison);
            selectB.addEventListener('change', updateComparison);
            
            // Shortcuts
            document.querySelectorAll('.comp-shortcut-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const shortcut = e.target.getAttribute('data-shortcut');
                    if (shortcut === 'atual-anterior') {
                        selectA.value = 0; selectB.value = 1;
                    } else if (shortcut === 'atual-primeira') {
                        selectA.value = 0; selectB.value = this.evalHistory.length - 1;
                    } else if (shortcut === 'primeira-atual') {
                        selectA.value = this.evalHistory.length - 1; selectB.value = 0;
                    }
                    updateComparison();
                });
            });

            updateComparison();
        }

        // Longitudinal history
        const featureSelect = document.getElementById('comp-feature-selector');
        if (featureSelect) {
            featureSelect.addEventListener('change', (e) => {
                this.renderLongitudinalHistory(e.target.value);
            });
            this.renderLongitudinalHistory(featureSelect.value);
        }
    },

    renderLongitudinalHistory(featureKey) {
        const ctx = document.getElementById('comp-longitudinal-chart');
        if (!ctx) return;
        if (this.instances.compLongitudinalChart) {
            this.instances.compLongitudinalChart.destroy();
        }

        // Reverter para ordem cronológica (do mais antigo para o mais novo)
        const sortedHistory = [...this.evalHistory].reverse();
        const labels = sortedHistory.map(ev => ev.date);
        const dataPoints = sortedHistory.map(ev => ev[featureKey]);

        let yLabel = '';
        if (featureKey === 'reps') yLabel = 'Repetições';
        else if (featureKey === 'time') yLabel = 'Tempo (s)';
        else if (featureKey === 'amp') yLabel = 'Amplitude (°)';
        else if (featureKey === 'vel') yLabel = 'Velocidade (°/s)';
        else if (featureKey === 'var_temp' || featureKey === 'var_ciclo') yLabel = 'Variabilidade (%)';

        this.instances.compLongitudinalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: yLabel,
                    data: dataPoints,
                    borderColor: '#142B5B',
                    backgroundColor: 'rgba(20, 43, 91, 0.1)',
                    borderWidth: 2,
                    pointBackgroundColor: '#142B5B',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${yLabel}: ${context.raw}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: yLabel }
                    }
                }
            }
        });
    },

    renderComparacaoIndividualCharts(idxA, idxB) {
        // Obter os metadados de A e B
        const evA = this.evalHistory[idxA];
        const evB = this.evalHistory[idxB];

        // Tabela Comparativa (sem interpretação clínica, apenas valores)
        const tbody = document.getElementById('comp-table-body');
        if (tbody) {
            const features = [
                { key: 'reps', label: 'Repetições Completas', unit: '' },
                { key: 'time', label: 'Duração Total', unit: 's' },
                { key: 'amp', label: 'Amplitude Média', unit: '°' },
                { key: 'vel', label: 'Velocidade Angular Média', unit: '°/s' },
                { key: 'var_temp', label: 'Variabilidade Temporal', unit: '%' }
            ];

            tbody.innerHTML = features.map(f => {
                const valA = evA[f.key];
                const valB = evB[f.key];
                const delta = valB - valA;
                
                // Formatação simples, sem coloração de semáforo para "bom/ruim"
                const deltaStr = (delta > 0 ? '+' : '') + delta.toFixed(1) + f.unit;
                
                return `
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td class="py-3 px-6 font-medium text-gray-700">${f.label}</td>
                        <td class="py-3 px-6 text-right font-bold text-primary">${valA.toFixed(1)}${f.unit}</td>
                        <td class="py-3 px-6 text-right font-bold text-orange-600">${valB.toFixed(1)}${f.unit}</td>
                        <td class="py-3 px-6 text-right font-semibold text-gray-600">${deltaStr}</td>
                    </tr>
                `;
            }).join('');
        }

        // Gerar dados simulados completos para os gráficos de A e B com base no histórico base
        // Como generate30sSTSData gera randomicamente em torno de 12 repetições,
        // vamos fixar sementes ou apenas gerar dados novos baseados nas repetições
        const generateDataForEval = (evBase) => {
            const data = this.generate30sSTSData();
            // Cortar as repetições de acordo com evBase.reps
            if (data.cycles.length > evBase.reps) {
                data.cycles = data.cycles.slice(0, evBase.reps);
            }
            return data;
        };

        const dataA = generateDataForEval(evA);
        const dataB = generateDataForEval(evB);

        // 1. Perfil das Repetições (Barras empilhadas)
        // Adaptar _renderProfileStackedBar para aceitar cor personalizada
        this._renderCustomProfileStackedBar('comp-rep-profile-a', dataA.cycles, '#3b82f6', '#10b981', '#f59e0b');
        this._renderCustomProfileStackedBar('comp-rep-profile-b', dataB.cycles, '#3b82f6', '#10b981', '#f59e0b');

        // 2. Tempo de Ciclo (Linhas A x B)
        this.renderCycleTimeCompare(dataA.cycles, dataB.cycles);
        
        // 3. Diferença de Tempo de Ciclo
        this.renderCycleTimeDiff(dataA.cycles, dataB.cycles);

        // 4. Velocidade Angular por Fase
        this.renderAngularVelocityCompare(dataA.segments, dataB.segments);

        // 5. Amplitude Angular do Tronco
        this.renderTrunkAmplitudeCompare(dataA.cycles, dataB.cycles);
    },

    _renderCustomProfileStackedBar(canvasId, cyclesData, color1, color2, color3) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.instances[canvasId]) this.instances[canvasId].destroy();

        const labels = cyclesData.map((_, i) => `R${i + 1}`);
        const phase1 = cyclesData.map(c => c.phases ? c.phases.levantando : 0);
        const phase2 = cyclesData.map(c => c.phases ? c.phases.em_pe : 0);
        const phase3 = cyclesData.map(c => c.phases ? c.phases.sentando : 0);

        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Levantando', data: phase1, backgroundColor: color1, borderRadius: 4 },
                    { label: 'Em pé', data: phase2, backgroundColor: color2, borderRadius: 4 },
                    { label: 'Sentando', data: phase3, backgroundColor: color3, borderRadius: 4 }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)} s`
                        }
                    }
                },
                scales: {
                    x: { stacked: true, title: { display: true, text: 'Duração (s)' } },
                    y: { stacked: true, grid: { display: false } }
                }
            }
        });
    },

    renderCycleTimeCompare(cyclesA, cyclesB) {
        const ctx = document.getElementById('comp-cycle-time-chart');
        if (!ctx) return;
        if (this.instances.compCycleTimeChart) this.instances.compCycleTimeChart.destroy();

        const maxReps = Math.max(cyclesA.length, cyclesB.length);
        const labels = Array.from({length: maxReps}, (_, i) => `R${i + 1}`);
        
        const dataA = labels.map((_, i) => cyclesA[i] ? cyclesA[i].duration : null);
        const dataB = labels.map((_, i) => cyclesB[i] ? cyclesB[i].duration : null);

        this.instances.compCycleTimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Avaliação A',
                        data: dataA,
                        borderColor: '#142B5B', // primary
                        backgroundColor: '#142B5B',
                        borderWidth: 2,
                        pointRadius: 4,
                        spanGaps: true
                    },
                    {
                        label: 'Avaliação B',
                        data: dataB,
                        borderColor: '#ea580c', // orange-600
                        backgroundColor: '#ea580c',
                        borderWidth: 2,
                        pointRadius: 4,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { title: { display: true, text: 'Tempo (s)' } }
                }
            }
        });
    },

    renderCycleTimeDiff(cyclesA, cyclesB) {
        const ctx = document.getElementById('comp-cycle-diff-chart');
        if (!ctx) return;
        if (this.instances.compCycleDiffChart) this.instances.compCycleDiffChart.destroy();

        const minReps = Math.min(cyclesA.length, cyclesB.length);
        const labels = Array.from({length: minReps}, (_, i) => `R${i + 1}`);
        
        // B - A
        const dataDiff = labels.map((_, i) => cyclesB[i].duration - cyclesA[i].duration);
        const bgColors = dataDiff.map(d => d > 0 ? '#ef4444' : '#22c55e'); // red se demorou mais, green se foi mais rapido (apenas pra diferencial basico)

        this.instances.compCycleDiffChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Δ (B - A)',
                    data: dataDiff,
                    backgroundColor: bgColors,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Diferença: ${context.raw > 0 ? '+' : ''}${context.raw.toFixed(2)}s`
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Segundos' }, grid: { color: (ctx) => ctx.tick.value === 0 ? '#000' : '#f3f4f6' } }
                }
            }
        });
    },

    renderAngularVelocityCompare(segmentsA, segmentsB) {
        const ctx = document.getElementById('comp-angular-velocity-chart');
        if (!ctx) return;
        if (this.instances.compAngularVelocityChart) this.instances.compAngularVelocityChart.destroy();

        // Para evitar incluir a lib de boxplot sem garantir que ela existe, usaremos um grafico de barra agrupada 
        // mostrando a media +- desvio padrao (simulado) ou apenas a barra com a media.
        // O user mencionou boxplot mas não temos o chartjs-chart-boxplot importado na base (pelo menos não com certeza).
        // Vou usar gráfico de barras agrupadas mostrando a Média das velocidades máximas por fase.
        
        const phases = ['LEVANTANDO', 'SENTANDO'];
        const getAvgVel = (segments, phase) => {
            const phaseSegs = segments.filter(s => s.phase === phase);
            if (phaseSegs.length === 0) return 0;
            return phaseSegs.reduce((sum, s) => sum + s.features.maxVelocity, 0) / phaseSegs.length;
        };

        const dataA = phases.map(p => getAvgVel(segmentsA, p));
        const dataB = phases.map(p => getAvgVel(segmentsB, p));

        this.instances.compAngularVelocityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Levantando', 'Sentando'],
                datasets: [
                    {
                        label: 'Avaliação A',
                        data: dataA,
                        backgroundColor: '#142B5B',
                        borderRadius: 4
                    },
                    {
                        label: 'Avaliação B',
                        data: dataB,
                        backgroundColor: '#ea580c',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)} °/s`
                        }
                    }
                },
                scales: {
                    y: { title: { display: true, text: 'Velocidade Média (°/s)' }, beginAtZero: true }
                }
            }
        });
    },

    renderTrunkAmplitudeCompare(cyclesA, cyclesB) {
        const ctx = document.getElementById('comp-trunk-amplitude-chart');
        if (!ctx) return;
        if (this.instances.compTrunkAmplitudeChart) this.instances.compTrunkAmplitudeChart.destroy();

        // Scatter / Dot plot para simular distribuição das amplitudes de cada repetição
        const scatterDataA = cyclesA.map(c => ({ x: 0, y: c.amplitude }));
        const scatterDataB = cyclesB.map(c => ({ x: 1, y: c.amplitude }));

        this.instances.compTrunkAmplitudeChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Avaliação A',
                        data: scatterDataA,
                        backgroundColor: '#142B5B',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Avaliação B',
                        data: scatterDataB,
                        backgroundColor: '#ea580c',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Amplitude: ${context.raw.y.toFixed(1)}°`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        labels: ['Avaliação A', 'Avaliação B'],
                        grid: { display: false }
                    },
                    y: {
                        title: { display: true, text: 'Amplitude (°)' }
                    }
                }
            }
        });
    },

    // ============================================================================
    // TELA ANÁLISE DA POPULAÇÃO (NOVA)
    // ============================================================================

    initPopulacao30sSTSScreen() {
        console.log('[LIA][Populacao30sSTS] init executado');
        if (!this.instances) this.instances = {};

        // 1. Gerar Dados Mock Populacionais
        this.generatePopulationData();

        // 2. Preencher totais no header
        document.getElementById('pop-total-evals').innerText = `${this.popData.evals.length} avaliações`;
        document.getElementById('pop-total-parts').innerText = `${new Set(this.popData.evals.map(e => e.partId)).size} participantes`;

        // 3. Inicializar listeners dos filtros
        const filterIds = ['filter-period', 'filter-age', 'filter-sex', 'filter-unit'];
        filterIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => this.updatePopulationView());
        });

        // 4. Inicializar seletores de gráficos
        const featSelect = document.getElementById('pop-feature-select');
        if (featSelect) featSelect.addEventListener('change', () => this.renderPopFeatureBoxplot());

        const groupSelect = document.getElementById('pop-group-select');
        if (groupSelect) groupSelect.addEventListener('change', () => this.renderPopGroupBoxplot());

        const scatterX = document.getElementById('pop-scatter-x');
        const scatterY = document.getElementById('pop-scatter-y');
        if (scatterX && scatterY) {
            scatterX.addEventListener('change', () => this.renderPopScatterChart());
            scatterY.addEventListener('change', () => this.renderPopScatterChart());
        }

        // 5. Renderizar view inicial
        this.updatePopulationView();
    },

    generatePopulationData() {
        // Gerar 400 avaliações de 150 participantes
        this.popData = { evals: [] };
        const units = ['U1', 'U2'];
        const sexes = ['M', 'F'];
        const periods = ['2023', '2024'];
        const ages = ['60-69', '70-79', '80+'];

        for (let i = 0; i < 400; i++) {
            const partId = `P-${Math.floor(Math.random() * 150) + 1}`;
            const age = ages[Math.floor(Math.random() * ages.length)];
            const sex = sexes[Math.floor(Math.random() * sexes.length)];
            const unit = units[Math.floor(Math.random() * units.length)];
            const period = periods[Math.floor(Math.random() * periods.length)];

            // Gerar características normais com alguma variância
            // Média de reps ~ 12, desvio ~ 3
            const repsBase = 12 + (age === '80+' ? -3 : (age === '60-69' ? 2 : 0)) + (sex === 'M' ? 1 : 0);
            let reps = Math.round(repsBase + (Math.random() * 6 - 3));
            if (reps < 0) reps = 0;

            const trans = 1.2 + (Math.random() * 0.8) + (age === '80+' ? 0.3 : 0);
            const trunk = 45 + (Math.random() * 20 - 10);
            const vel = 60 + (Math.random() * 30 - 15);
            const variance = 10 + (Math.random() * 15);
            const evol = 15 + (Math.random() * 10);

            // Tempos de fase
            const phaseUP = 0.8 + (Math.random() * 0.4);
            const phaseSTAND = 0.2 + (Math.random() * 0.3);
            const phaseDOWN = 0.7 + (Math.random() * 0.4);

            // Vel fase
            const velUP = vel * 1.1;
            const velSTAND = 0; // na prática quase 0
            const velDOWN = vel * 0.9;

            this.popData.evals.push({
                id: `E-${i}`, partId, age, sex, unit, period,
                reps, trans, trunk, vel, var: variance, evol,
                phaseUP, phaseSTAND, phaseDOWN,
                velUP, velSTAND, velDOWN
            });
        }
    },

    getFilteredPopData() {
        const period = document.getElementById('filter-period').value;
        const age = document.getElementById('filter-age').value;
        const sex = document.getElementById('filter-sex').value;
        const unit = document.getElementById('filter-unit').value;

        return this.popData.evals.filter(e => {
            if (period !== 'all' && e.period !== period) return false;
            if (age !== 'all' && e.age !== age) return false;
            if (sex !== 'all' && e.sex !== sex) return false;
            if (unit !== 'all' && e.unit !== unit) return false;
            return true;
        });
    },

    updatePopulationView() {
        const filtered = this.getFilteredPopData();
        const parts = new Set(filtered.map(e => e.partId)).size;

        // Atualizar texto de filtros ativos
        document.getElementById('pop-filtered-evals').innerText = `n = ${filtered.length} avaliações`;
        document.getElementById('pop-filtered-parts').innerText = `n = ${parts} participantes`;

        let filterText = [];
        const ageTxt = document.getElementById('filter-age').options[document.getElementById('filter-age').selectedIndex].text;
        const sexTxt = document.getElementById('filter-sex').options[document.getElementById('filter-sex').selectedIndex].text;
        const perTxt = document.getElementById('filter-period').options[document.getElementById('filter-period').selectedIndex].text;
        
        filterText.push(ageTxt === 'Todas' ? 'Todas as idades' : ageTxt);
        filterText.push(sexTxt === 'Todos' ? 'Ambos os sexos' : sexTxt);
        filterText.push(perTxt === 'Todos' ? 'Todos os anos' : perTxt);
        document.getElementById('pop-active-filters-text').innerText = filterText.join(' · ');

        if (filtered.length < 5) {
            console.warn('Poucos dados para análise populacional');
        }

        this.renderPopRepetitionsChart(filtered);
        this.renderPopNormativeBar(filtered);
        this.renderPopFeatureBoxplot(filtered);
        this.renderPopGroupBoxplot(filtered);
        this.renderPopPhaseVelBoxplot(filtered);
        this.renderPopPhaseTimeBoxplot(filtered);
        this.renderPopScatterChart(filtered);
    },

    _calcStats(arr) {
        if (!arr.length) return { min: 0, p25: 0, med: 0, p75: 0, max: 0, mean: 0, sd: 0, iqr: 0, n: 0 };
        arr.sort((a, b) => a - b);
        const n = arr.length;
        const sum = arr.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const sd = Math.sqrt(arr.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / n);
        
        const quantile = (p) => {
            const idx = (n - 1) * p;
            const lower = Math.floor(idx);
            const fraction = idx - lower;
            if (lower + 1 < n) return arr[lower] + fraction * (arr[lower + 1] - arr[lower]);
            return arr[lower];
        };

        const q1 = quantile(0.25);
        const q3 = quantile(0.75);
        const med = quantile(0.5);
        const iqr = q3 - q1;

        const min = Math.max(arr[0], q1 - 1.5 * iqr);
        const max = Math.min(arr[n-1], q3 + 1.5 * iqr);

        return { min, p25: q1, med, p75: q3, max, mean, sd, iqr, n };
    },

    _simBoxplotDatasets(label, statsList, colors) {
        const minQ1Data = [];
        const q1Q3Data = [];
        const q3MaxData = [];
        const medData = [];

        statsList.forEach((item, i) => {
            const s = item.s;
            const x = item.x;
            const color = colors[i % colors.length];
            minQ1Data.push({ x, y: [s.min, s.p25] });
            q1Q3Data.push({ x, y: [s.p25, s.p75] });
            q3MaxData.push({ x, y: [s.p75, s.max] });
            medData.push({ x, y: s.med });
        });

        return [
            { label: 'Whisker Inferior', type: 'bar', data: minQ1Data, backgroundColor: 'transparent', borderColor: '#475569', borderWidth: {left:1, right:0, top:1, bottom:1}, barPercentage: 0.1 },
            { label: 'IQR', type: 'bar', data: q1Q3Data, backgroundColor: colors.map(c => c.replace(')', ', 0.6)').replace('rgb', 'rgba')), borderColor: colors, borderWidth: 1, barPercentage: 0.5 },
            { label: 'Whisker Superior', type: 'bar', data: q3MaxData, backgroundColor: 'transparent', borderColor: '#475569', borderWidth: {left:1, right:0, top:1, bottom:1}, barPercentage: 0.1 },
            { label: 'Mediana', type: 'scatter', data: medData, backgroundColor: '#1e293b', pointStyle: 'line', pointRadius: 20, pointBorderWidth: 3, pointBorderColor: '#1e293b' }
        ];
    },

    renderPopRepetitionsChart(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const reps = filtered.map(e => e.reps);
        const stats = this._calcStats(reps);

        document.getElementById('stat-reps-n').innerText = `n = ${stats.n}`;
        document.getElementById('stat-reps-med').innerText = `Mediana = ${stats.med.toFixed(1)}`;
        document.getElementById('stat-reps-p25').innerText = `P25 = ${stats.p25.toFixed(1)}`;
        document.getElementById('stat-reps-p75').innerText = `P75 = ${stats.p75.toFixed(1)}`;
        document.getElementById('stat-reps-iqr').innerText = `IQR = ${stats.iqr.toFixed(1)}`;

        const counts = {};
        reps.forEach(r => { counts[r] = (counts[r] || 0) + 1; });
        const labels = Object.keys(counts).sort((a,b) => parseInt(a) - parseInt(b));
        const data = labels.map(l => counts[l]);

        if (this.instances['popRepetitionsChart']) this.instances['popRepetitionsChart'].destroy();
        const ctx = document.getElementById('popRepetitionsChart').getContext('2d');
        this.instances['popRepetitionsChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frequência',
                    data: data,
                    backgroundColor: '#142B5B',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { title: { display: true, text: 'Frequência' } },
                    x: { title: { display: true, text: 'Repetições' } }
                }
            }
        });
    },

    renderPopNormativeBar(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const reps = filtered.map(e => e.reps);
        
        let low = 0, avg = 0, high = 0;
        reps.forEach(r => {
            if (r < 10) low++;
            else if (r <= 14) avg++;
            else high++;
        });

        const total = filtered.length || 1;
        document.getElementById('norm-low-count').innerText = low;
        document.getElementById('norm-low-pct').innerText = ((low/total)*100).toFixed(1) + '%';
        document.getElementById('norm-avg-count').innerText = avg;
        document.getElementById('norm-avg-pct').innerText = ((avg/total)*100).toFixed(1) + '%';
        document.getElementById('norm-high-count').innerText = high;
        document.getElementById('norm-high-pct').innerText = ((high/total)*100).toFixed(1) + '%';

        if (this.instances['popNormativeChart']) this.instances['popNormativeChart'].destroy();
        const ctx = document.getElementById('popNormativeChart').getContext('2d');
        this.instances['popNormativeChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Classificação'],
                datasets: [
                    { label: 'Abaixo da média', data: [low], backgroundColor: '#ef4444', barPercentage: 1, categoryPercentage: 1 },
                    { label: 'Média', data: [avg], backgroundColor: '#f59e0b', barPercentage: 1, categoryPercentage: 1 },
                    { label: 'Acima da média', data: [high], backgroundColor: '#10b981', barPercentage: 1, categoryPercentage: 1 }
                ]
            },
            options: {
                indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: {
                    callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} (${((ctx.raw/total)*100).toFixed(1)}%)` }
                }},
                scales: {
                    x: { stacked: true, display: false, max: total },
                    y: { stacked: true, display: false }
                }
            }
        });
    },

    renderPopFeatureBoxplot(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const featureKey = document.getElementById('pop-feature-select').value;
        const featureNames = {
            'trans': 'Tempo de transferência (s)',
            'trunk': 'Amplitude angular do tronco (°)',
            'vel': 'Velocidade angular média (°/s)',
            'var': 'Variabilidade temporal (%)',
            'evol': 'Variação do tempo de ciclo (%)'
        };

        const values = filtered.map(e => e[featureKey]);
        const stats = this._calcStats(values);

        document.getElementById('stat-feat-n').innerText = stats.n;
        document.getElementById('stat-feat-mean').innerText = stats.mean.toFixed(2);
        document.getElementById('stat-feat-med').innerText = stats.med.toFixed(2);
        document.getElementById('stat-feat-sd').innerText = '± ' + stats.sd.toFixed(2);
        document.getElementById('stat-feat-p25').innerText = stats.p25.toFixed(2);
        document.getElementById('stat-feat-p75').innerText = stats.p75.toFixed(2);
        document.getElementById('stat-feat-iqr').innerText = stats.iqr.toFixed(2);

        const datasets = this._simBoxplotDatasets(featureNames[featureKey], [{x: featureNames[featureKey], s: stats}], ['rgb(20, 43, 91)']);

        if (this.instances['popFeatureBoxplot']) this.instances['popFeatureBoxplot'].destroy();
        const ctx = document.getElementById('popFeatureBoxplot').getContext('2d');
        this.instances['popFeatureBoxplot'] = new Chart(ctx, {
            data: { labels: [featureNames[featureKey]], datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: {
                    callbacks: {
                        label: () => `Mediana: ${stats.med.toFixed(2)} | IQR: [${stats.p25.toFixed(2)}, ${stats.p75.toFixed(2)}]`
                    }
                }},
                scales: {
                    y: { title: { display: true, text: featureNames[featureKey] } }
                }
            }
        });
    },

    renderPopGroupBoxplot(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const groupKey = document.getElementById('pop-group-select').value; // 'age' or 'sex'
        const featureKey = document.getElementById('pop-feature-select').value; // sync with main feature
        
        const featureNames = {
            'trans': 'Tempo de transferência (s)',
            'trunk': 'Amplitude angular do tronco (°)',
            'vel': 'Velocidade angular média (°/s)',
            'var': 'Variabilidade temporal (%)',
            'evol': 'Variação do tempo de ciclo (%)'
        };
        
        document.getElementById('pop-group-y-label').innerText = featureNames[featureKey];

        const groups = {};
        filtered.forEach(e => {
            const g = e[groupKey];
            if (!groups[g]) groups[g] = [];
            groups[g].push(e[featureKey]);
        });

        const labels = Object.keys(groups).sort();
        const statsList = labels.map(l => ({ x: l, s: this._calcStats(groups[l]) }));
        
        const colors = ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)'];
        const datasets = this._simBoxplotDatasets('Distribuição', statsList, colors);

        if (this.instances['popGroupBoxplot']) this.instances['popGroupBoxplot'].destroy();
        const ctx = document.getElementById('popGroupBoxplot').getContext('2d');
        this.instances['popGroupBoxplot'] = new Chart(ctx, {
            data: { labels: labels, datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    },

    renderPopPhaseVelBoxplot(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const phases = [
            { x: 'Levantando', s: this._calcStats(filtered.map(e => e.velUP)) },
            { x: 'Em pé', s: this._calcStats(filtered.map(e => e.velSTAND)) },
            { x: 'Sentando', s: this._calcStats(filtered.map(e => e.velDOWN)) }
        ];

        const colors = ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(16, 185, 129)'];
        const datasets = this._simBoxplotDatasets('Fases', phases, colors);

        if (this.instances['popPhaseVelBoxplot']) this.instances['popPhaseVelBoxplot'].destroy();
        const ctx = document.getElementById('popPhaseVelBoxplot').getContext('2d');
        this.instances['popPhaseVelBoxplot'] = new Chart(ctx, {
            data: { labels: ['Levantando', 'Em pé', 'Sentando'], datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    },

    renderPopPhaseTimeBoxplot(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const phases = [
            { x: 'Levantando', s: this._calcStats(filtered.map(e => e.phaseUP)) },
            { x: 'Em pé', s: this._calcStats(filtered.map(e => e.phaseSTAND)) },
            { x: 'Sentando', s: this._calcStats(filtered.map(e => e.phaseDOWN)) }
        ];

        const colors = ['rgb(59, 130, 246)', 'rgb(245, 158, 11)', 'rgb(16, 185, 129)'];
        const datasets = this._simBoxplotDatasets('Tempos', phases, colors);

        if (this.instances['popPhaseTimeBoxplot']) this.instances['popPhaseTimeBoxplot'].destroy();
        const ctx = document.getElementById('popPhaseTimeBoxplot').getContext('2d');
        this.instances['popPhaseTimeBoxplot'] = new Chart(ctx, {
            data: { labels: ['Levantando', 'Em pé', 'Sentando'], datasets: datasets },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    },

    renderPopScatterChart(filtered) {
        filtered = filtered || this.getFilteredPopData();
        const xKey = document.getElementById('pop-scatter-x').value;
        const yKey = document.getElementById('pop-scatter-y').value;

        const data = filtered.map(e => ({ x: e[xKey], y: e[yKey] }));
        
        // Simple Pearson
        const n = data.length;
        if (n > 1) {
            const sumX = data.reduce((a,b) => a+b.x, 0);
            const sumY = data.reduce((a,b) => a+b.y, 0);
            const sumXY = data.reduce((a,b) => a+(b.x*b.y), 0);
            const sumX2 = data.reduce((a,b) => a+(b.x*b.x), 0);
            const sumY2 = data.reduce((a,b) => a+(b.y*b.y), 0);
            
            const num = (n * sumXY) - (sumX * sumY);
            const den = Math.sqrt((n * sumX2 - sumX*sumX) * (n * sumY2 - sumY*sumY));
            const r = den === 0 ? 0 : (num / den);
            document.getElementById('pop-scatter-stats').innerText = `r = ${r.toFixed(2)} | n = ${n}`;
        }

        const xLabel = document.getElementById('pop-scatter-x').options[document.getElementById('pop-scatter-x').selectedIndex].text;
        const yLabel = document.getElementById('pop-scatter-y').options[document.getElementById('pop-scatter-y').selectedIndex].text;

        if (this.instances['popScatterChart']) this.instances['popScatterChart'].destroy();
        const ctx = document.getElementById('popScatterChart').getContext('2d');
        this.instances['popScatterChart'] = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Avaliações',
                    data: data,
                    backgroundColor: 'rgba(20, 43, 91, 0.6)',
                    borderColor: 'rgba(20, 43, 91, 0.9)',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: xLabel } },
                    y: { title: { display: true, text: yLabel } }
                }
            }
        });
    }

});

