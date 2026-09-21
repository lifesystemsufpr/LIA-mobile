// Data Mocking for LIA Analytical Platform
const mockData = {
    // Demographics and high-level stats
    populationStats: {
        totalParticipants: 458,
        totalEvaluations: 1245,
        avgAge: 72.4,
        genderSplit: { m: 42, f: 58 },
        activeProtocols: 5
    },

    participants: [
        { id: '123.456.789-00', name: 'Maria Silva', age: 72, gender: 'Feminino', lastEval: '25/10/2023', evalCount: 5, primaryTrend: 'Estável' },
        { id: '234.567.890-11', name: 'João Batista', age: 68, gender: 'Masculino', lastEval: '20/10/2023', evalCount: 3, primaryTrend: 'Declínio Lento' },
        { id: '345.678.901-22', name: 'Ana Souza', age: 80, gender: 'Feminino', lastEval: '15/10/2023', evalCount: 8, primaryTrend: 'Estável' },
        { id: '456.789.012-33', name: 'Carlos Pereira', age: 75, gender: 'Masculino', lastEval: '10/10/2023', evalCount: 4, primaryTrend: 'Melhora' },
        { id: '567.890.123-44', name: 'Teresa Costa', age: 71, gender: 'Feminino', lastEval: '05/10/2023', evalCount: 2, primaryTrend: 'Estável' },
        { id: '678.901.234-55', name: 'Roberto Lima', age: 65, gender: 'Masculino', lastEval: '01/10/2023', evalCount: 1, primaryTrend: 'N/A' },
    ],

    evaluations: [
        { id: 'EV-8834', participant: 'Maria Silva', protocol: '30sSTS', date: '25/10/2023', mainMetric: '12 reps', status: 'Processado' },
        { id: 'EV-8833', participant: 'João Batista', protocol: '30sSTS', date: '20/10/2023', mainMetric: '14 reps', status: 'Processado' },
        { id: 'EV-8832', participant: 'Ana Souza', protocol: '30sSTS', date: '15/10/2023', mainMetric: '11 reps', status: 'Processado' },
        { id: 'EV-8831', participant: 'Carlos Pereira', protocol: '30sSTS', date: '10/10/2023', mainMetric: '15 reps', status: 'Processado' },
        { id: 'EV-8830', participant: 'Teresa Costa', protocol: '30sSTS', date: '05/10/2023', mainMetric: '9 reps', status: 'Processado' },
    ],

    protocols: [
        { 
            id: 'tug', 
            name: 'TUG', 
            fullName: 'Timed Up and Go',
            description: 'Avalia mobilidade básica, equilíbrio dinâmico e risco de quedas.',
            metricUnit: 'segundos',
            isLowerBetter: true,
            populationAvg: 11.2,
            evalCount: 542
        },
        { 
            id: '5tsts', 
            name: '5TSTS', 
            fullName: 'Five Times Sit-to-Stand',
            description: 'Avalia a força funcional de membros inferiores e potência de transição.',
            metricUnit: 'segundos',
            isLowerBetter: true,
            populationAvg: 13.5,
            evalCount: 310
        },
        { 
            id: '30ssts', 
            name: '30sSTS', 
            fullName: '30-Second Sit-to-Stand',
            description: 'Avalia resistência muscular e força funcional.',
            metricUnit: 'repetições',
            isLowerBetter: false,
            populationAvg: 12,
            evalCount: 198
        },
        { 
            id: 'utt', 
            name: 'UTT', 
            fullName: 'Up-on-the-Toes',
            description: 'Avaliação de força e resistência de plantiflexores.',
            metricUnit: 'repetições',
            isLowerBetter: false,
            populationAvg: 18,
            evalCount: 85
        },
        { 
            id: '2mst', 
            name: '2MST', 
            fullName: 'Two-Minute Step Test',
            description: 'Avalia resistência aeróbica e tolerância ao exercício.',
            metricUnit: 'passos',
            isLowerBetter: false,
            populationAvg: 72,
            evalCount: 110
        }
    ],

    participantProfile: {
        id: '123.456.789-00', 
        name: 'Maria Silva', 
        age: 72, 
        gender: 'Feminino', 
        lastEval: '25/10/2023', 
        evaluations: [
            { date: '25/10/2023', protocol: '30sSTS', result: 12, unit: 'reps' },
            { date: '10/08/2023', protocol: '30sSTS', result: 11, unit: 'reps' },
            { date: '15/05/2023', protocol: '30sSTS', result: 10, unit: 'reps' },
            { date: '20/02/2023', protocol: '30sSTS', result: 9, unit: 'reps' },
        ],
        kinematicsSummary: {
            maxAccel: '3.2 m/s²',
            angularPeak: '142 °/s',
            stepSymmetry: '92%'
        }
    }
};

window.mockData = mockData;
