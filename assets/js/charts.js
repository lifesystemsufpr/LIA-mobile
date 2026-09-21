const LIACharts = {
    instances: {},

    // New Color Palette based on Logo
    colors: {
        primary: '#142B5B', // Navy Blue
        primaryLight: '#1A5092',
        secondary: '#00B3B0', // Teal/Cyan
        secondaryLight: '#5CE1E6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        muted: '#64748B',
        grid: '#F1F5F9',
        background: '#F8FAFC'
    },

    commonOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                grid: { color: '#F1F5F9', drawBorder: false }
            }
        }
    },

    destroyChart(id) {
        if (this.instances[id]) {
            this.instances[id].destroy();
            delete this.instances[id];
        }
    },

    renderDashboardEvolution() {
        this.destroyChart('dashboardEvolutionChart');
        const ctx = document.getElementById('dashboardEvolutionChart');
        if (!ctx) return;

        this.instances['dashboardEvolutionChart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
                datasets: [{
                    label: 'Avaliações Realizadas',
                    data: [120, 135, 125, 145, 160, 155, 180, 195, 210, 240],
                    borderColor: this.colors.primary,
                    backgroundColor: 'rgba(20, 43, 91, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.colors.primary,
                    pointRadius: 2
                }]
            },
            options: this.commonOptions
        });
    },

    renderTestDistribution() {
        this.destroyChart('testDistributionChart');
        const ctx = document.getElementById('testDistributionChart');
        if (!ctx) return;

        this.instances['testDistributionChart'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['< 8s', '8-10s', '10-12s', '12-15s', '> 15s'],
                datasets: [{
                    label: 'Participantes (TUG)',
                    data: [15, 45, 85, 40, 25],
                    backgroundColor: this.colors.secondary,
                    borderRadius: 4
                }]
            },
            options: {
                ...this.commonOptions,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + ' participantes';
                            }
                        }
                    }
                }
            }
        });
    },

    renderPopulationScatter() {
        this.destroyChart('populationScatterChart');
        const ctx = document.getElementById('populationScatterChart');
        if (!ctx) return;

        // Generate mock scatter data: Age vs TUG time
        const scatterData = Array.from({length: 100}, () => ({
            x: 60 + Math.random() * 30, // Idade (60-90)
            y: 8 + Math.random() * 10 + (Math.random() * 5) // TUG Tempo
        }));

        this.instances['populationScatterChart'] = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Participantes',
                    data: scatterData,
                    backgroundColor: this.colors.secondary + '80', // with transparency
                    borderColor: this.colors.secondary,
                    borderWidth: 1,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Idade: ${context.raw.x.toFixed(0)} anos | TUG: ${context.raw.y.toFixed(1)}s`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Idade (anos)', color: this.colors.muted },
                        grid: { display: false }
                    },
                    y: {
                        title: { display: true, text: 'Tempo TUG (s)', color: this.colors.muted },
                        grid: { color: this.colors.grid }
                    }
                }
            }
        });
    },

    renderIndividualEvolution(feature = 'reps') {
         this.destroyChart('evolutionChart');
        const ctx = document.getElementById('evolutionChart');
        if (!ctx) return;

        const featureConfig = {
            'reps': { label: 'Repetições', data: [10, 11, 13, 14], unit: ' repetições', min: 5, max: 20 },
            'time': { label: 'Tempo de transferência', data: [1.32, 1.25, 1.18, 1.12], unit: ' s', min: 0.5, max: 2.0 },
            'amp': { label: 'Amplitude angular do tronco', data: [45, 48, 52, 55], unit: '°', min: 30, max: 70 },
            'vel': { label: 'Velocidade angular', data: [120, 135, 150, 162], unit: ' °/s', min: 100, max: 200 },
            'var_temp': { label: 'Variabilidade temporal', data: [15, 12, 10, 8], unit: '%', min: 0, max: 25 },
            'var_ciclo': { label: 'Variação do tempo de ciclo', data: [0.4, 0.35, 0.3, 0.25], unit: ' s', min: 0, max: 1.0 }
        };

        const config = featureConfig[feature] || featureConfig['reps'];

        this.instances['evolutionChart'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['15/05/2023', '10/08/2023', '15/10/2023', '25/10/2023'],
                datasets: [
                    {
                        label: config.label,
                        data: config.data,
                        borderColor: this.colors.primary,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBackgroundColor: this.colors.primary,
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.1,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e293b',
                        bodyColor: '#334155',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            title: function(context) {
                                return 'Data: ' + context[0].label;
                            },
                            label: function(context) {
                                return 'Protocolo: 30sSTS';
                            },
                            afterLabel: function(context) {
                                return config.label + ': ' + context.raw + config.unit;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { font: { weight: 'bold' } }
                    },
                    y: {
                        grid: { color: this.colors.grid, borderDash: [5, 5] },
                        title: { display: true, text: config.label, color: this.colors.muted },
                        min: config.min,
                        max: config.max
                    }
                }
            }
        });
    },

    // Static Sensor Data Visualization for Movement Analysis
    renderKinematicsChart(canvasId, type) {
        this.destroyChart(canvasId);
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Generate synthetic data for a STS cycle
        const points = 100;
        const labels = Array.from({length: points}, (_, i) => (i * 0.1).toFixed(1) + 's');
        
        let dataY;
        if(type === 'accel') {
             // Mock Accel Y (Vertical) - peak during stand up
             dataY = Array.from({length: points}, (_, i) => {
                 if (i > 20 && i < 40) return 9.8 + Math.sin((i-20)*Math.PI/20) * 4;
                 return 9.8 + (Math.random() * 0.5 - 0.25);
             });
        } else {
             // Mock Gyro (Pitch) - rotation during stand up
             dataY = Array.from({length: points}, (_, i) => {
                if (i > 15 && i < 35) return Math.sin((i-15)*Math.PI/10) * 120;
                return Math.random() * 5 - 2.5;
            });
        }

        this.instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: type === 'accel' ? 'Aceleração Y (m/s²)' : 'Vel. Angular Pitch (°/s)',
                    data: dataY,
                    borderColor: type === 'accel' ? this.colors.primary : this.colors.secondary,
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    annotation: { // Conceptual representation of phases
                        annotations: {
                            box1: {
                                type: 'box', xMin: 0, xMax: 15,
                                backgroundColor: 'rgba(20, 43, 91, 0.05)', borderWidth: 0
                            },
                            box2: {
                                type: 'box', xMin: 15, xMax: 40,
                                backgroundColor: 'rgba(0, 179, 176, 0.05)', borderWidth: 0
                            }
                        }
                    }
                },
                scales: {
                    x: { ticks: { maxTicksLimit: 10 } },
                    y: { grid: { color: this.colors.grid } }
                }
            }
        });
    }
};

window.LIACharts = LIACharts;
