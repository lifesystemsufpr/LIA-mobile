/**
 * LIAAnalytics - Engine Analítica Funcional
 * Responsável por transformar features matemáticas em indicadores clínicos funcionais descritivos.
 */
window.LIAAnalytics = {
    
    /**
     * Calcula indicadores de contexto funcional baseado em um histórico longitudinal.
     * @param {Array} history - Lista ordenada (mais antiga -> mais nova) de testes com sua métrica principal (ex: repetições)
     * @param {string} metricName - Nome da métrica para usar nos textos (ex: 'repetições', 'segundos')
     * @returns {Object} Indicadores funcionais.
     */
    computeFunctionalContext(history, metricName = '') {
        if (!history || history.length === 0) return null;
        
        const values = history.map(h => h.value);
        const current = values[values.length - 1];
        const initial = values[0];
        const best = Math.max(...values); // Supondo que "maior é melhor" no 30sSTS. Para TUG seria Math.min
        const avg = values.reduce((a,b)=>a+b,0) / values.length;
        
        const changeFromBaseline = initial !== 0 ? ((current - initial) / initial) * 100 : 0;
        let recentChange = 0;
        if (values.length > 1) {
            const previous = values[values.length - 2];
            recentChange = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
        }

        // Determinação de Tendência
        let trend = "Estável";
        if (values.length >= 3) {
            // Regra simples: se os 2 últimos subiram, é melhora. Se os 2 desceram, é piora.
            const diff1 = values[values.length - 1] - values[values.length - 2];
            const diff2 = values[values.length - 2] - values[values.length - 3];
            if (diff1 > 0 && diff2 > 0) trend = "Melhora progressiva";
            else if (diff1 < 0 && diff2 < 0) trend = "Redução do desempenho";
            else trend = diff1 > 0 ? "Melhora recente" : "Flutuação do desempenho";
        } else if (values.length === 2) {
            if (recentChange > 5) trend = "Melhora em relação à inicial";
            else if (recentChange < -5) trend = "Redução em relação à inicial";
        }

        // Estabilidade (inverso da variância sobre a média)
        let stability = "Baixa";
        if (values.length > 1) {
            const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
            const cv = (Math.sqrt(variance) / avg) * 100;
            if (cv <= 10) stability = "Alta";
            else if (cv <= 20) stability = "Média";
        } else {
            stability = "N/A";
        }

        const percentageOfBest = (current / best) * 100;
        const distanceToBest = current - best; // Negativo significa quantas reps faltam

        return {
            current,
            initial,
            best,
            average: avg,
            changeFromBaseline,
            recentChange,
            trend,
            stability,
            percentageOfBest,
            distanceToBest,
            metricName
        };
    },

    /**
     * Gera uma síntese textual de evolução.
     */
    generateEvolutionSynthesis(indicators) {
        if (!indicators) return "Dados insuficientes para gerar síntese.";
        
        let text = `Desempenho acompanhado desde ${indicators.initial} ${indicators.metricName}. `;
        
        if (indicators.recentChange > 5) {
            text += `O resultado atual aumentou ${indicators.recentChange.toFixed(0)}% em relação à avaliação anterior, indicando uma evolução sustentada.`;
        } else if (indicators.recentChange < -5) {
            text += `Houve alteração do desempenho em relação à avaliação anterior (${indicators.recentChange.toFixed(0)}%).`;
        } else {
            text += `O desempenho atual mantém o mesmo platô da avaliação anterior.`;
        }

        if (indicators.distanceToBest === 0) {
            text += " Atualmente este é o melhor resultado histórico registrado para o participante.";
        }

        return text;
    },

    /**
     * Analisa o comportamento intra-teste do 30sSTS dividindo o sinal em 3 zonas.
     */
    analyzeIntraTestBehavior(timeData) {
        if (!timeData || timeData.length === 0) return null;
        
        const z1 = timeData.filter(d => d.timestamp <= 10).map(d => d.duration);
        const z2 = timeData.filter(d => d.timestamp > 10 && d.timestamp <= 20).map(d => d.duration);
        const z3 = timeData.filter(d => d.timestamp > 20).map(d => d.duration);
        
        const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
        const c1 = avg(z1) > 0 ? 60 / avg(z1) : 0;
        const c2 = avg(z2) > 0 ? 60 / avg(z2) : 0;
        const c3 = avg(z3) > 0 ? 60 / avg(z3) : 0;
        
        const diffStartEnd = c1 > 0 ? ((c3 - c1) / c1) * 100 : 0;
        
        let text = "";
        if (diffStartEnd < -10) text = "Redução do ritmo na fase final";
        else if (diffStartEnd > 10) text = "Aumento de ritmo na fase final";
        else text = "Ritmo mantido constante durante o teste";

        return {
            cadenceZ1: c1,
            cadenceZ2: c2,
            cadenceZ3: c3,
            diffStartEnd,
            behaviorText: text
        };
    },

    /**
     * Determina classificações amigáveis (high, mod, low) baseadas em métricas.
     * Serve para preencher os "Características do movimento" (ex: Vigor, Amplitude).
     */
    classifyFeature(metric, type) {
        // Regras demonstrativas configuráveis
        switch(type) {
            case 'vigor':
                // Baseado em accRMS ou accPeak
                if (metric > 4.5) return { label: 'Alto', color: 'text-success' };
                if (metric >= 3.5) return { label: 'Moderado', color: 'text-primary' };
                return { label: 'Baixo', color: 'text-warning' };
                
            case 'amplitude':
                // Baseado em ROM (Range of motion)
                if (metric > 85) return { label: 'Ampla', color: 'text-success' };
                if (metric >= 70) return { label: 'Adequada', color: 'text-primary' };
                return { label: 'Reduzida', color: 'text-warning' };
                
            case 'regularidade':
                // Baseado em CV do tempo de ciclo
                if (metric < 10) return { label: 'Alta', color: 'text-success' };
                if (metric <= 20) return { label: 'Média', color: 'text-primary' };
                return { label: 'Baixa', color: 'text-warning' };
                
            case 'variabilidade':
                // Oposta a regularidade (CV)
                if (metric < 10) return { label: 'Baixa', color: 'text-success' };
                if (metric <= 20) return { label: 'Média', color: 'text-primary' };
                return { label: 'Alta', color: 'text-warning' };
        }
        return { label: '-', color: 'text-gray-400' };
    }
};
