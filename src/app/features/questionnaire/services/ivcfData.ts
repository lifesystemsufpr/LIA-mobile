export type IVCFOption = {
  id: string;
  label: string;
  score: number;
};

export type IVCFQuestion = {
  id: string;
  number: number;
  section: string;
  title: string;
  options: IVCFOption[];
  isMultiSelect?: boolean;
};

export type IVCFResultData = {
  totalScore: number;
  maxScore: number;
  classification: string;
  severity: 'normal' | 'warning' | 'alert';
  recommendation: string;
};

export const IVCF_QUESTIONS: IVCFQuestion[] = [
  {
    id: 'ivcf_q1',
    number: 1,
    section: 'IDADE',
    title: 'Qual é a sua idade?',
    options: [
      { id: 'q1_0', label: '60 a 74 anos', score: 0 },
      { id: 'q1_1', label: '75 a 84 anos', score: 1 },
      { id: 'q1_3', label: '≥ 85 anos', score: 3 },
    ],
  },
  {
    id: 'ivcf_q2',
    number: 2,
    section: 'AUTO-PERCEPÇÃO DA SAÚDE',
    title: 'No, geral comparando com pessoas da sua idade, como o sr(a) avalia a sua própria saúde ?',
    options: [
      { id: 'q2_0', label: 'Excelente', score: 0 },
      { id: 'q2_1', label: 'Muito boa', score: 0 },
      { id: 'q2_2', label: 'Boa', score: 0 },
      { id: 'q2_3', label: 'Regular', score: 1 },
      { id: 'q2_4', label: 'Ruim', score: 1 },
    ],
  },
  {
    id: 'ivcf_q3',
    number: 3,
    section: 'AVD INSTRUMENTAL',
    title: 'Por causa de sua saúde ou condição física, você deixou de fazer compras?',
    options: [
      { id: 'q3_sim', label: 'Sim', score: 4 },
      { id: 'q3_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q4',
    number: 4,
    section: 'AVD INSTRUMENTAL',
    title: 'Por causa de sua saúde ou condição física, você deixou de controlar seu dinheiro, gastos ou pagar as contas de sua casa?',
    options: [
      { id: 'q4_sim', label: 'Sim', score: 4 },
      { id: 'q4_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q5',
    number: 5,
    section: 'AVD INSTRUMENTAL',
    title: 'Por causa de sua saúde ou condição física, você deixou de realizar pequenos trabalhos domésticos, como lavar louça, arrumar a casa ou fazer limpeza leve?',
    options: [
      { id: 'q5_sim', label: 'Sim', score: 4 },
      { id: 'q5_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q6',
    number: 6,
    section: 'AVD BÁSICA',
    title: 'Por causa de sua saúde ou condição física, você deixou de tomar banho sozinho?',
    options: [
      { id: 'q6_sim', label: 'Sim', score: 6 },
      { id: 'q6_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q7',
    number: 7,
    section: 'COGNIÇÃO',
    title: 'Algum familiar ou amigo falou que você está ficando esquecido?',
    options: [
      { id: 'q7_sim', label: 'Sim', score: 1 },
      { id: 'q7_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q8',
    number: 8,
    section: 'COGNIÇÃO',
    title: 'Este esquecimento está piorando nos últimos meses?',
    options: [
      { id: 'q8_sim', label: 'Sim', score: 1 },
      { id: 'q8_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q9',
    number: 9,
    section: 'COGNIÇÃO',
    title: 'Este esquecimento está impedindo a realização de alguma atividade do cotidiano?',
    options: [
      { id: 'q9_sim', label: 'Sim', score: 2 },
      { id: 'q9_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q10',
    number: 10,
    section: 'HUMOR',
    title: 'No último mês, você ficou com desânimo, tristeza ou desesperança?',
    options: [
      { id: 'q10_sim', label: 'Sim', score: 2 },
      { id: 'q10_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q11',
    number: 11,
    section: 'HUMOR',
    title: 'No último mês, você perdeu o interesse ou prazer em atividades anteriormente prazerosas?',
    options: [
      { id: 'q11_sim', label: 'Sim', score: 2 },
      { id: 'q11_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q12',
    number: 12,
    section: 'MOBILIDADE',
    title: 'Você é incapaz de elevar os braços acima do nível do ombro?',
    options: [
      { id: 'q12_sim', label: 'Sim', score: 1 },
      { id: 'q12_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q13',
    number: 13,
    section: 'MOBILIDADE',
    title: 'Você é incapaz de manusear ou segurar pequenos objetos?',
    options: [
      { id: 'q13_sim', label: 'Sim', score: 1 },
      { id: 'q13_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q14',
    number: 14,
    section: 'MOBILIDADE',
    title: 'Você tem alguma das quatro condições abaixo relacionadas?',
    isMultiSelect: true,
    options: [
      {
        id: 'q14_perda_peso',
        label: 'Perda de peso não intencional (≥ 4,5 kg no último ano ou 3 kg no último mês)',
        score: 2,
      },
      {
        id: 'q14_imc',
        label: 'Índice de Massa Corporal (IMC) menor que 22 kg/m²',
        score: 2,
      },
      {
        id: 'q14_panturrilha',
        label: 'Circunferência da panturrilha < 31 cm',
        score: 2,
      },
      {
        id: 'q14_marcha',
        label: 'Tempo gasto no teste de velocidade da marcha (4m) > 5 segundos',
        score: 2,
      },
      {
        id: 'q14_nenhuma',
        label: 'Nenhuma das condições',
        score: 0,
      },
    ],
  },
  {
    id: 'ivcf_q15',
    number: 15,
    section: 'MOBILIDADE',
    title: 'Você tem dificuldade para caminhar capaz de impedir a realização de alguma atividade do cotidiano?',
    options: [
      { id: 'q15_sim', label: 'Sim', score: 2 },
      { id: 'q15_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q16',
    number: 16,
    section: 'MOBILIDADE',
    title: 'Você teve duas ou mais quedas no último ano?',
    options: [
      { id: 'q16_sim', label: 'Sim', score: 2 },
      { id: 'q16_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q17',
    number: 17,
    section: 'MOBILIDADE',
    title: 'Você perde urina ou fezes, sem querer, em algum momento?',
    options: [
      { id: 'q17_sim', label: 'Sim', score: 2 },
      { id: 'q17_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q18',
    number: 18,
    section: 'COMUNICAÇÃO',
    title: 'Você tem problemas de visão capazes de impedir a realização de alguma atividade do cotidiano?\n(É permitido o uso de óculos ou lentes de contato)',
    options: [
      { id: 'q18_sim', label: 'Sim', score: 2 },
      { id: 'q18_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q19',
    number: 19,
    section: 'COMUNICAÇÃO',
    title: 'Você tem problemas de audição capazes de impedir a realização de alguma atividade do cotidiano?\n(É permitido o uso de aparelhos de audição)',
    options: [
      { id: 'q19_sim', label: 'Sim', score: 2 },
      { id: 'q19_nao', label: 'Não', score: 0 },
    ],
  },
  {
    id: 'ivcf_q20',
    number: 20,
    section: 'COMORBIDADES MÚLTIPLAS',
    title: 'Você tem alguma das três condições abaixo relacionadas?',
    isMultiSelect: true,
    options: [
      {
        id: 'q20_doencas',
        label: 'Cinco ou mais doenças crônicas',
        score: 4,
      },
      {
        id: 'q20_medicamentos',
        label: 'Uso regular de cinco ou mais medicamentos diferentes, todo dia',
        score: 4,
      },
      {
        id: 'q20_internacao',
        label: 'Internação recente nos últimos 6 meses',
        score: 4,
      },
      {
        id: 'q20_nenhuma',
        label: 'Nenhuma das condições',
        score: 0,
      },
    ],
  },
];

export function calculateIVCFScore(answers: Record<number, number>): IVCFResultData {
  let total = 0;

  // Q1 (Idade)
  total += answers[1] ?? 0;

  // Q2 (Auto-percepção)
  total += answers[2] ?? 0;

  // Q3, Q4, Q5 (AVD Instrumental: máximo de 4 pontos no total do bloco)
  const hasInstrumentalPositive =
    (answers[3] ?? 0) > 0 || (answers[4] ?? 0) > 0 || (answers[5] ?? 0) > 0;
  if (hasInstrumentalPositive) {
    total += 4;
  }

  // Q6 (AVD Básica - Banho: 6 pontos se sim)
  total += answers[6] ?? 0;

  // Q7, Q8, Q9 (Cognição)
  total += answers[7] ?? 0;
  total += answers[8] ?? 0;
  total += answers[9] ?? 0;

  // Q10, Q11 (Humor)
  total += answers[10] ?? 0;
  total += answers[11] ?? 0;

  // Q12, Q13 (Alcance, preensão e pinça)
  total += answers[12] ?? 0;
  total += answers[13] ?? 0;

  // Q14 (Capacidade aeróbica/muscular)
  total += answers[14] ?? 0;

  // Q15, Q16 (Marcha e quedas)
  total += answers[15] ?? 0;
  total += answers[16] ?? 0;

  // Q17 (Continência)
  total += answers[17] ?? 0;

  // Q18 (Visão)
  total += answers[18] ?? 0;

  // Q19 (Audição)
  total += answers[19] ?? 0;

  // Q20 (Comorbidades múltiplas)
  total += answers[20] ?? 0;

  const maxScore = 40;

  if (total <= 6) {
    return {
      totalScore: total,
      maxScore,
      classification: 'Robusto',
      severity: 'normal',
      recommendation:
        'Este resultado indica que o idoso apresenta boa reserva funcional e independência preservada. Recomenda-se ações de promoção à saúde e acompanhamento preventivo regular.',
    };
  }

  if (total <= 14) {
    return {
      totalScore: total,
      maxScore,
      classification: 'Risco de Fragilização',
      severity: 'warning',
      recommendation:
        'Este resultado indica um risco moderado de fragilização clínico-funcional. Recomenda-se o acompanhamento com um profissional de saúde para uma avaliação mais detalhada e orientações preventivas',
    };
  }

  return {
    totalScore: total,
    maxScore,
    classification: 'Frágil',
    severity: 'alert',
    recommendation:
      'Este resultado indica presença de fragilidade clínico-funcional estabelecida e alta vulnerabilidade. Recomenda-se avaliação geriátrica ampla e plano de cuidados individualizado com equipe multidisciplinar.',
  };
}
