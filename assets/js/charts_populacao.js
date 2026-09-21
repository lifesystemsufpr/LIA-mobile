window.LIAPopulacao = {
    instances: {},
    popData: [],

    init() {
        console.log('[LIA][PopulacaoGeral] init executado');
        
        this.generateMockData();
        this.setupListeners();
        this.updateView();
    },

    generateMockData() {
        this.popData = [];
        const protocols = ['30sSTS', 'TUG', '5TSTS', 'UTT', '2MST'];
        const ages = ['<60', '60-69', '70-79', '80+'];
        const sexes = ['M', 'F'];
        const units = ['U1', 'U2'];
        const years = ['2025', '2026'];
        
        // Participants
        const numParticipants = 250;
        const participants = [];
        for (let i = 1; i <= numParticipants; i++) {
            participants.push({
                partId: `P-${i}`,
                age: ages[Math.floor(Math.random() * ages.length)],
                sex: sexes[Math.floor(Math.random() * sexes.length)],
                unit: units[Math.floor(Math.random() * units.length)]
            });
        }

        // Evaluations
        const numEvals = 850;
        for (let i = 1; i <= numEvals; i++) {
            const p = participants[Math.floor(Math.random() * participants.length)];
            const protocol = protocols[Math.floor(Math.random() * protocols.length)];
            const year = years[Math.floor(Math.random() * years.length)];
            const month = Math.floor(Math.random() * 12) + 1;
            const monthStr = month < 10 ? `0${month}` : `${month}`;
            const dateStr = `${year}-${monthStr}`;

            let result = 0;
            switch(protocol) {
                case '30sSTS': result = Math.floor(8 + Math.random() * 10); break; // reps
                case 'TUG': result = +(8 + Math.random() * 8).toFixed(1); break; // time
                case '5TSTS': result = +(10 + Math.random() * 8).toFixed(1); break; // time
                case 'UTT': result = Math.floor(12 + Math.random() * 12); break; // reps
                case '2MST': result = Math.floor(40 + Math.random() * 50); break; // steps
            }

            this.popData.push({
                evalId: `E-${i}`,
                partId: p.partId,
                age: p.age,
                sex: p.sex,
                unit: p.unit,
                protocol: protocol,
                period: year,
                dateStr: dateStr, // YYYY-MM
                result: result
            });
        }
    },

    setupListeners() {
        const filters = ['pg-filter-period', 'pg-filter-age', 'pg-filter-sex', 'pg-filter-unit', 'pg-filter-protocol'];
        filters.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // remove listeners if already attached (to prevent memory leaks in SPA)
                const newEl = el.cloneNode(true);
                el.parentNode.replaceChild(newEl, el);
                newEl.addEventListener('change', () => this.updateView());
            }
        });

        const btn = document.getElementById('pg-explorer-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const prot = document.getElementById('pg-filter-protocol').value;
                if (prot === '30sSTS') {
                    App.navigate('30ssts/populacao');
                }
            });
        }
    },

    getFilteredData() {
        const period = document.getElementById('pg-filter-period').value;
        const age = document.getElementById('pg-filter-age').value;
        const sex = document.getElementById('pg-filter-sex').value;
        const unit = document.getElementById('pg-filter-unit').value;
        const protocol = document.getElementById('pg-filter-protocol').value;

        return this.popData.filter(e => {
            if (period !== 'all' && e.period !== period) return false;
            if (age !== 'all' && e.age !== age) return false;
            if (sex !== 'all' && e.sex !== sex) return false;
            if (unit !== 'all' && e.unit !== unit) return false;
            if (protocol !== 'all' && e.protocol !== protocol) return false;
            return true;
        });
    },

    updateView() {
        const filtered = this.getFilteredData();
        const partsSet = new Set(filtered.map(e => e.partId));
        const numParts = partsSet.size;
        const numEvals = filtered.length;
        const protocolsSet = new Set(filtered.map(e => e.protocol));
        
        // Update Headers
        document.getElementById('pg-total-participants').innerText = numParts;
        document.getElementById('pg-total-evals').innerText = numEvals;
        document.getElementById('pg-total-protocols').innerText = protocolsSet.size;

        // Active Filters Text
        document.getElementById('pg-filtered-parts').innerText = `${numParts} participantes`;
        document.getElementById('pg-filtered-evals').innerText = `${numEvals} avaliações`;

        const getOptionText = (id) => {
            const el = document.getElementById(id);
            return el.options[el.selectedIndex].text;
        };

        const texts = [];
        const protText = getOptionText('pg-filter-protocol');
        const perText = getOptionText('pg-filter-period');
        const ageText = getOptionText('pg-filter-age');
        const sexText = getOptionText('pg-filter-sex');
        const unitText = getOptionText('pg-filter-unit');

        texts.push(protText === 'Todos' ? 'Todos os protocolos' : protText);
        texts.push(perText === 'Todos' ? 'Todos os anos' : perText);
        if (ageText !== 'Todas') texts.push(ageText);
        if (sexText !== 'Todos') texts.push(sexText);
        texts.push(unitText === 'Todas' ? 'Todas as unidades' : unitText);

        document.getElementById('pg-active-filters-text').innerText = texts.join(' · ');

        // Explorer Card visibility
        const explorerCard = document.getElementById('pg-explorer-card');
        if (document.getElementById('pg-filter-protocol').value === '30sSTS') {
            explorerCard.classList.remove('hidden');
            setTimeout(() => explorerCard.classList.remove('opacity-0', 'pointer-events-none'), 10);
            document.getElementById('pg-explorer-title').innerText = 'Explorar População 30sSTS';
            document.getElementById('pg-explorer-desc').innerText = `${numEvals} avaliações · ${numParts} participantes`;
        } else {
            explorerCard.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => explorerCard.classList.add('hidden'), 300);
        }

        // Render Charts
        this.renderAgeChart(filtered, partsSet);
        this.renderSexChart(filtered, partsSet);
        this.renderTimelineChart(filtered);
        this.renderProtocolChart(filtered);
        this.renderEvalsPerPartChart(filtered, partsSet);
        
        // Render Tables
        this.renderCoverageTable(filtered);
        this.renderResultsTable(filtered);
    },

    // 1. Age Chart (Participants)
    renderAgeChart(filtered, partsSet) {
        // We need unique participants and their age
        const partsAge = {};
        filtered.forEach(e => {
            if (!partsAge[e.partId]) partsAge[e.partId] = e.age;
        });

        const counts = { '<60': 0, '60-69': 0, '70-79': 0, '80+': 0 };
        Object.values(partsAge).forEach(age => {
            if (counts[age] !== undefined) counts[age]++;
        });

        const labels = Object.keys(counts);
        const data = labels.map(l => counts[l]);

        if (this.instances['pgAgeChart']) this.instances['pgAgeChart'].destroy();
        const ctx = document.getElementById('pgAgeChart').getContext('2d');
        this.instances['pgAgeChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Participantes',
                    data: data,
                    backgroundColor: '#142B5B',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { title: { display: true, text: 'Participantes' } }
                }
            }
        });
    },

    // 2. Sex Chart (Participants - Horizontal Bar)
    renderSexChart(filtered, partsSet) {
        const partsSex = {};
        filtered.forEach(e => {
            if (!partsSex[e.partId]) partsSex[e.partId] = e.sex;
        });

        let f = 0, m = 0;
        Object.values(partsSex).forEach(sex => {
            if (sex === 'F') f++;
            else if (sex === 'M') m++;
        });

        const total = f + m || 1;
        
        if (this.instances['pgSexChart']) this.instances['pgSexChart'].destroy();
        const ctx = document.getElementById('pgSexChart').getContext('2d');
        this.instances['pgSexChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Feminino', 'Masculino'],
                datasets: [{
                    label: 'Participantes',
                    data: [f, m],
                    backgroundColor: ['#ec4899', '#3b82f6'],
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.raw} (${((ctx.raw/total)*100).toFixed(1)}%)`
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Participantes' } },
                    y: { grid: { display: false } }
                }
            }
        });
    },

    // 3. Timeline Chart (Evaluations per month)
    renderTimelineChart(filtered) {
        const counts = {};
        filtered.forEach(e => {
            counts[e.dateStr] = (counts[e.dateStr] || 0) + 1;
        });

        // Sort months chronologically
        const labels = Object.keys(counts).sort();
        const data = labels.map(l => counts[l]);

        // Tooltip logic requires knowing unique participants per month
        const partsPerMonth = {};
        labels.forEach(l => partsPerMonth[l] = new Set());
        filtered.forEach(e => {
            partsPerMonth[e.dateStr].add(e.partId);
        });

        if (this.instances['pgTimelineChart']) this.instances['pgTimelineChart'].destroy();
        const ctx = document.getElementById('pgTimelineChart').getContext('2d');
        this.instances['pgTimelineChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Avaliações',
                    data: data,
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            afterLabel: (ctx) => `Participantes únicos: ${partsPerMonth[ctx.label].size}`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { title: { display: true, text: 'Avaliações' } }
                }
            }
        });
    },

    // 4. Protocol Chart (Evaluations - Horizontal Bar)
    renderProtocolChart(filtered) {
        const counts = {};
        filtered.forEach(e => {
            counts[e.protocol] = (counts[e.protocol] || 0) + 1;
        });

        // Sort descending
        const sorted = Object.keys(counts).map(k => ({ p: k, v: counts[k] })).sort((a,b) => b.v - a.v);
        const labels = sorted.map(item => item.p);
        const data = sorted.map(item => item.v);
        const total = filtered.length || 1;

        if (this.instances['pgProtocolChart']) this.instances['pgProtocolChart'].destroy();
        const ctx = document.getElementById('pgProtocolChart').getContext('2d');
        this.instances['pgProtocolChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Avaliações',
                    data: data,
                    backgroundColor: '#ea580c',
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.raw} avaliações (${((ctx.raw/total)*100).toFixed(1)}%)`
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Avaliações' } },
                    y: { grid: { display: false } }
                }
            }
        });
    },

    // 5. Evaluations Per Participant (Histogram)
    renderEvalsPerPartChart(filtered, partsSet) {
        const evalsPerPart = {};
        filtered.forEach(e => {
            evalsPerPart[e.partId] = (evalsPerPart[e.partId] || 0) + 1;
        });

        const counts = { '1': 0, '2': 0, '3': 0, '4': 0, '5+': 0 };
        Object.values(evalsPerPart).forEach(v => {
            if (v === 1) counts['1']++;
            else if (v === 2) counts['2']++;
            else if (v === 3) counts['3']++;
            else if (v === 4) counts['4']++;
            else counts['5+']++;
        });

        if (this.instances['pgEvalsPerPartChart']) this.instances['pgEvalsPerPartChart'].destroy();
        const ctx = document.getElementById('pgEvalsPerPartChart').getContext('2d');
        this.instances['pgEvalsPerPartChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 aval.', '2 aval.', '3 aval.', '4 aval.', '5+ aval.'],
                datasets: [{
                    label: 'Participantes',
                    data: [counts['1'], counts['2'], counts['3'], counts['4'], counts['5+']],
                    backgroundColor: '#8b5cf6',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, title: { display: true, text: 'Qtd de Avaliações' } },
                    y: { title: { display: true, text: 'Participantes' } }
                }
            }
        });
    },

    // 6. Coverage Table
    renderCoverageTable(filtered) {
        const protData = {};
        filtered.forEach(e => {
            if (!protData[e.protocol]) protData[e.protocol] = { evals: 0, parts: new Set() };
            protData[e.protocol].evals++;
            protData[e.protocol].parts.add(e.partId);
        });

        const getLongitudinalParts = (protocol) => {
            const counts = {};
            filtered.filter(e => e.protocol === protocol).forEach(e => {
                counts[e.partId] = (counts[e.partId] || 0) + 1;
            });
            return Object.values(counts).filter(v => v >= 2).length;
        };

        const tbody = document.getElementById('pg-coverage-table');
        let html = '';
        Object.keys(protData).sort((a,b) => protData[b].evals - protData[a].evals).forEach(p => {
            const evals = protData[p].evals;
            const parts = protData[p].parts.size;
            const long = getLongitudinalParts(p);
            
            html += `
                <tr class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-4 py-3 font-semibold text-primary border-b border-gray-100">${p}</td>
                    <td class="px-4 py-3 text-right text-gray-700 border-b border-gray-100">${evals}</td>
                    <td class="px-4 py-3 text-right text-gray-700 border-b border-gray-100">${parts}</td>
                    <td class="px-4 py-3 text-right text-gray-700 border-b border-gray-100">${long}</td>
                </tr>
            `;
        });

        if (html === '') html = '<tr><td colspan="4" class="px-4 py-6 text-center text-gray-500">Número insuficiente de registros.</td></tr>';
        tbody.innerHTML = html;
    },

    // 7. Results Table
    renderResultsTable(filtered) {
        const protocols = ['30sSTS', 'TUG', '5TSTS', 'UTT', '2MST'];
        const pNames = {
            '30sSTS': 'Repetições',
            'TUG': 'Tempo (s)',
            '5TSTS': 'Tempo (s)',
            'UTT': 'Repetições',
            '2MST': 'Passos'
        };

        const calcStats = (arr) => {
            if (!arr.length) return null;
            arr.sort((a,b) => a-b);
            const n = arr.length;
            const q = (p) => {
                const i = (n-1)*p;
                const low = Math.floor(i);
                const fr = i - low;
                if(low+1 < n) return arr[low] + fr*(arr[low+1] - arr[low]);
                return arr[low];
            };
            return { n, med: q(0.5), p25: q(0.25), p75: q(0.75) };
        };

        const tbody = document.getElementById('pg-results-table');
        let html = '';

        protocols.forEach(p => {
            const vals = filtered.filter(e => e.protocol === p).map(e => e.result);
            const st = calcStats(vals);
            if (st) {
                html += `
                    <tr class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-4 py-3 font-semibold text-primary border-b border-gray-100">
                            ${p} <span class="text-xs font-normal text-gray-500 block">${pNames[p]}</span>
                        </td>
                        <td class="px-4 py-3 text-right font-mono font-bold text-gray-700 border-b border-gray-100">${st.med.toFixed(1)}</td>
                        <td class="px-4 py-3 text-right font-mono text-gray-400 border-b border-gray-100">${st.p25.toFixed(1)}</td>
                        <td class="px-4 py-3 text-right font-mono text-gray-400 border-b border-gray-100">${st.p75.toFixed(1)}</td>
                        <td class="px-4 py-3 text-right text-gray-500 border-b border-gray-100">${st.n}</td>
                    </tr>
                `;
            }
        });

        if (html === '') html = '<tr><td colspan="5" class="px-4 py-6 text-center text-gray-500">Número insuficiente de registros.</td></tr>';
        tbody.innerHTML = html;
    }
};
