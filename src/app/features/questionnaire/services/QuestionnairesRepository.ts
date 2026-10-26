import { defaultStorageService, Participant, StorageServiceContract } from '../../../shared';
import {
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireResult,
} from '../types/questionnaire.types';

const STORAGE_KEY = '@lia_questionnaires_submissions';

export const CLINICAL_QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'sarc-f',
    code: 'SARC-F',
    title: 'Rastreio de Sarcopenia',
    category: 'sarcopenia',
    categoryLabel: 'Sarcopenia',
    description:
      'Questionário de triagem rápida para identificar perda de força, massa e função muscular em pessoas idosas.',
    targetAudience: 'Pessoas com 60 anos ou mais',
    estimatedMinutes: 3,
    instructions:
      'Responda com base na sua rotina habitual das últimas semanas. Escolha a alternativa que melhor descreve seu nível de dificuldade.',
    questions: [
      {
        id: 'sarc_1',
        number: 1,
        title: 'Força',
        description: 'Quanta dificuldade você tem para levantar e carregar 5 kg (ex: uma sacola pesada)?',
        options: [
          { id: 'sarc_1_0', label: 'Nenhuma dificuldade', score: 0 },
          { id: 'sarc_1_1', label: 'Alguma dificuldade', score: 1 },
          { id: 'sarc_1_2', label: 'Muita dificuldade ou incapaz', score: 2 },
        ],
      },
      {
        id: 'sarc_2',
        number: 2,
        title: 'Ajuda para caminhar',
        description: 'Quanta dificuldade você tem para atravessar um cômodo ou andar pelo quarto?',
        options: [
          { id: 'sarc_2_0', label: 'Nenhuma dificuldade', score: 0 },
          { id: 'sarc_2_1', label: 'Alguma dificuldade', score: 1 },
          { id: 'sarc_2_2', label: 'Muita dificuldade, uso de apoio ou incapaz', score: 2 },
        ],
      },
      {
        id: 'sarc_3',
        number: 3,
        title: 'Levantar da cadeira',
        description: 'Quanta dificuldade você tem para levantar de uma cadeira ou da cama?',
        options: [
          { id: 'sarc_3_0', label: 'Nenhuma dificuldade', score: 0 },
          { id: 'sarc_3_1', label: 'Alguma dificuldade', score: 1 },
          { id: 'sarc_3_2', label: 'Muita dificuldade ou incapaz sem auxílio', score: 2 },
        ],
      },
      {
        id: 'sarc_4',
        number: 4,
        title: 'Subir escadas',
        description: 'Quanta dificuldade você tem para subir um lance de 10 degraus de escada?',
        options: [
          { id: 'sarc_4_0', label: 'Nenhuma dificuldade', score: 0 },
          { id: 'sarc_4_1', label: 'Alguma dificuldade', score: 1 },
          { id: 'sarc_4_2', label: 'Muita dificuldade ou incapaz', score: 2 },
        ],
      },
      {
        id: 'sarc_5',
        number: 5,
        title: 'Quedas',
        description: 'Quantas vezes você caiu no último ano?',
        options: [
          { id: 'sarc_5_0', label: 'Nenhuma queda', score: 0 },
          { id: 'sarc_5_1', label: '1 a 3 quedas', score: 1 },
          { id: 'sarc_5_2', label: '4 ou mais quedas', score: 2 },
        ],
      },
    ],
    scoreRanges: [
      {
        minScore: 0,
        maxScore: 3,
        classification: 'Rastreio Negativo',
        severity: 'normal',
        recommendation:
          'Sem indicativo sugestivo de sarcopenia. Recomenda-se manter rotina de exercícios físicos e acompanhamento periódico.',
      },
      {
        minScore: 4,
        maxScore: 10,
        classification: 'Rastreio Positivo (Risco Elevado)',
        severity: 'alert',
        recommendation:
          'Pontuação indicativa de risco aumentado para sarcopenia. Recomenda-se avaliação funcional com dinamometria e teste de sentar e levantar.',
      },
    ],
  },
  {
    id: 'katz',
    code: 'KATZ',
    title: 'Índice de Katz (ABVD)',
    category: 'funcionalidade',
    categoryLabel: 'Funcionalidade',
    description:
      'Avaliação da independência funcional nas Atividades Básicas de Vida Diária (alimentação, higiene, locomoção e continência).',
    targetAudience: 'Pessoas idosas em acompanhamento geriátrico',
    estimatedMinutes: 4,
    instructions:
      'Indique o nível de independência para cada uma das funções básicas de autocuidado descritas abaixo.',
    questions: [
      {
        id: 'katz_1',
        number: 1,
        title: 'Banho',
        description: 'Capacidade de lavar-se por inteiro ou necessita de ajuda?',
        options: [
          { id: 'katz_1_1', label: 'Independente: lava-se sozinho ou precisa de ajuda só para uma parte', score: 1 },
          { id: 'katz_1_0', label: 'Dependente: necessita de ajuda para lavar mais de uma parte do corpo', score: 0 },
        ],
      },
      {
        id: 'katz_2',
        number: 2,
        title: 'Vestir-se',
        description: 'Capacidade de pegar as roupas e vestir-se completamente?',
        options: [
          { id: 'katz_2_1', label: 'Independente: pega as roupas e veste-se sem ajuda', score: 1 },
          { id: 'katz_2_0', label: 'Dependente: precisa de ajuda parcial ou total para vestir-se', score: 0 },
        ],
      },
      {
        id: 'katz_3',
        number: 3,
        title: 'Uso do Vaso Sanitário',
        description: 'Capacidade de ir ao sanitário, higienizar-se e ajeitar as roupas?',
        options: [
          { id: 'katz_3_1', label: 'Independente: usa o banheiro e se higieniza sem auxílio', score: 1 },
          { id: 'katz_3_0', label: 'Dependente: necessita de ajuda para transferir-se ou higienizar-se', score: 0 },
        ],
      },
      {
        id: 'katz_4',
        number: 4,
        title: 'Transferência',
        description: 'Capacidade de deitar-se, levantar-se da cama e sentar-se na cadeira?',
        options: [
          { id: 'katz_4_1', label: 'Independente: senta e levanta sem auxílio de outra pessoa', score: 1 },
          { id: 'katz_4_0', label: 'Dependente: precisa de assistência humana para transferir-se', score: 0 },
        ],
      },
      {
        id: 'katz_5',
        number: 5,
        title: 'Continência',
        description: 'Controle das funções de micção e evacuação?',
        options: [
          { id: 'katz_5_1', label: 'Independente: controle esfincteriano completo', score: 1 },
          { id: 'katz_5_0', label: 'Dependente: episódios frequentes de incontinência ou uso de fralda', score: 0 },
        ],
      },
      {
        id: 'katz_6',
        number: 6,
        title: 'Alimentação',
        description: 'Capacidade de levar a comida do prato até a boca?',
        options: [
          { id: 'katz_6_1', label: 'Independente: alimenta-se sozinho', score: 1 },
          { id: 'katz_6_0', label: 'Dependente: precisa de ajuda para levar a comida à boca', score: 0 },
        ],
      },
    ],
    scoreRanges: [
      {
        minScore: 6,
        maxScore: 6,
        classification: 'Independência Completa',
        severity: 'normal',
        recommendation:
          'O participante é plenamente independente nas atividades básicas de vida diária. Promover a manutenção da capacidade funcional.',
      },
      {
        minScore: 4,
        maxScore: 5,
        classification: 'Dependência Leve a Moderada',
        severity: 'attention',
        recommendation:
          'Há declínio funcional em uma ou duas atividades básicas. Recomenda-se plano terapêutico focado em fortalecimento e reabilitação.',
      },
      {
        minScore: 0,
        maxScore: 3,
        classification: 'Dependência Grave',
        severity: 'alert',
        recommendation:
          'O participante necessita de auxílio contínuo de cuidadores para a maioria das funções vitais. Adequar ambiente e suporte interdisciplinar.',
      },
    ],
  },
  {
    id: 'gds-15',
    code: 'GDS-15',
    title: 'Escala de Depressão Geriátrica',
    category: 'humor',
    categoryLabel: 'Humor e Bem-estar',
    description:
      'Escala padronizada de 15 itens desenhada especificamente para rastreio de sintomas depressivos na população idosa.',
    targetAudience: 'Pessoas idosas com sintomas de desânimo ou isolamento',
    estimatedMinutes: 5,
    instructions:
      'Responda considerando como o participante tem se sentido na maior parte do tempo na última semana.',
    questions: [
      {
        id: 'gds_1',
        number: 1,
        title: 'Satisfação de vida',
        description: 'Você está basicamente satisfeito(a) com a sua vida?',
        options: [
          { id: 'gds_1_sim', label: 'Sim', score: 0 },
          { id: 'gds_1_nao', label: 'Não', score: 1 },
        ],
      },
      {
        id: 'gds_2',
        number: 2,
        title: 'Interesses recentes',
        description: 'Você deixou muitos de seus interesses e atividades recentes?',
        options: [
          { id: 'gds_2_sim', label: 'Sim', score: 1 },
          { id: 'gds_2_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_3',
        number: 3,
        title: 'Sensação de vazio',
        description: 'Você sente que sua vida está vazia?',
        options: [
          { id: 'gds_3_sim', label: 'Sim', score: 1 },
          { id: 'gds_3_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_4',
        number: 4,
        title: 'Aborrecimento frequente',
        description: 'Você se aborrece ou se chateia com frequência?',
        options: [
          { id: 'gds_4_sim', label: 'Sim', score: 1 },
          { id: 'gds_4_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_5',
        number: 5,
        title: 'Bom humor habitual',
        description: 'Você se sente de bom humor na maior parte do tempo?',
        options: [
          { id: 'gds_5_sim', label: 'Sim', score: 0 },
          { id: 'gds_5_nao', label: 'Não', score: 1 },
        ],
      },
      {
        id: 'gds_6',
        number: 6,
        title: 'Medo e apreensão',
        description: 'Você tem medo de que algo de ruim vá acontecer com você?',
        options: [
          { id: 'gds_6_sim', label: 'Sim', score: 1 },
          { id: 'gds_6_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_7',
        number: 7,
        title: 'Felicidade',
        description: 'Você se sente feliz na maior parte do tempo?',
        options: [
          { id: 'gds_7_sim', label: 'Sim', score: 0 },
          { id: 'gds_7_nao', label: 'Não', score: 1 },
        ],
      },
      {
        id: 'gds_8',
        number: 8,
        title: 'Desamparo',
        description: 'Você frequentemente se sente desamparado(a) ou sem saída?',
        options: [
          { id: 'gds_8_sim', label: 'Sim', score: 1 },
          { id: 'gds_8_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_9',
        number: 9,
        title: 'Permanência no domicílio',
        description: 'Você prefere ficar em casa a sair e fazer coisas novas?',
        options: [
          { id: 'gds_9_sim', label: 'Sim', score: 1 },
          { id: 'gds_9_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_10',
        number: 10,
        title: 'Memória',
        description: 'Você acha que tem mais problemas de memória do que as outras pessoas?',
        options: [
          { id: 'gds_10_sim', label: 'Sim', score: 1 },
          { id: 'gds_10_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_11',
        number: 11,
        title: 'Vontade de viver',
        description: 'Você acha maravilhoso estar vivo(a) agora?',
        options: [
          { id: 'gds_11_sim', label: 'Sim', score: 0 },
          { id: 'gds_11_nao', label: 'Não', score: 1 },
        ],
      },
      {
        id: 'gds_12',
        number: 12,
        title: 'Autoestima',
        description: 'Você se sente sem valor ou inútil na sua condição atual?',
        options: [
          { id: 'gds_12_sim', label: 'Sim', score: 1 },
          { id: 'gds_12_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_13',
        number: 13,
        title: 'Disposição',
        description: 'Você se sente cheio(a) de energia e disposição?',
        options: [
          { id: 'gds_13_sim', label: 'Sim', score: 0 },
          { id: 'gds_13_nao', label: 'Não', score: 1 },
        ],
      },
      {
        id: 'gds_14',
        number: 14,
        title: 'Esperança',
        description: 'Você sente que a sua situação é sem esperança?',
        options: [
          { id: 'gds_14_sim', label: 'Sim', score: 1 },
          { id: 'gds_14_nao', label: 'Não', score: 0 },
        ],
      },
      {
        id: 'gds_15',
        number: 15,
        title: 'Comparação com outros',
        description: 'Você acha que a maioria das pessoas está em situação melhor que você?',
        options: [
          { id: 'gds_15_sim', label: 'Sim', score: 1 },
          { id: 'gds_15_nao', label: 'Não', score: 0 },
        ],
      },
    ],
    scoreRanges: [
      {
        minScore: 0,
        maxScore: 5,
        classification: 'Sem Indício de Depressão',
        severity: 'normal',
        recommendation:
          'Pontuação dentro da normalidade para a faixa etária. Manter convívio social ativo e estímulo a atividades de lazer.',
      },
      {
        minScore: 6,
        maxScore: 10,
        classification: 'Suspeita de Depressão Leve a Moderada',
        severity: 'warning',
        recommendation:
          'Presença de sintomas sugestivos de rebaixamento de humor. Recomenda-se avaliação clínica e psicológica aprofundada.',
      },
      {
        minScore: 11,
        maxScore: 15,
        classification: 'Suspeita de Depressão Severa',
        severity: 'alert',
        recommendation:
          'Pontuação elevada indicativa de sofrimento psíquico significativo. Encaminhamento médico/psiquiátrico prioritário indicado.',
      },
    ],
  },
  {
    id: 'ivcf-20',
    code: 'IVCF-20',
    title: 'Índice de Vulnerabilidade Clínico-Funcional',
    category: 'fragilidade',
    categoryLabel: 'Fragilidade',
    description:
      'Instrumento multidimensional para identificar o grau de vulnerabilidade e fragilidade clínico-funcional da pessoa idosa.',
    targetAudience: 'Rastreio amplo de saúde no idoso',
    estimatedMinutes: 5,
    instructions:
      'Responda às questões sobre diferentes dimensões de saúde e funcionalidade do idoso.',
    questions: [
      {
        id: 'ivcf_1',
        number: 1,
        title: 'Autopercepção da Saúde',
        description: 'Em geral, em comparação a outras pessoas da sua idade, como você considera sua saúde?',
        options: [
          { id: 'ivcf_1_0', label: 'Excelente, muito boa ou boa', score: 0 },
          { id: 'ivcf_1_1', label: 'Regular ou má', score: 1 },
        ],
      },
      {
        id: 'ivcf_2',
        number: 2,
        title: 'Atividades Instrumentais (Compras e Finanças)',
        description: 'Por motivo de saúde ou físico, deixou de fazer compras ou cuidar do seu dinheiro?',
        options: [
          { id: 'ivcf_2_0', label: 'Não, continua fazendo normalmente', score: 0 },
          { id: 'ivcf_2_4', label: 'Sim, precisou deixar de fazer ou precisa de ajuda', score: 4 },
        ],
      },
      {
        id: 'ivcf_3',
        number: 3,
        title: 'Tarefas Domésticas',
        description: 'Por motivo de saúde ou físico, deixou de fazer pequenos trabalhos domésticos?',
        options: [
          { id: 'ivcf_3_0', label: 'Não, realiza sem impedimentos', score: 0 },
          { id: 'ivcf_3_4', label: 'Sim, precisou parar ou necessita de ajuda', score: 4 },
        ],
      },
      {
        id: 'ivcf_4',
        number: 4,
        title: 'Memória e Atenção',
        description: 'Algum familiar ou amigo comentou que você está esquecido(a) ou isso atrapalha seu dia?',
        options: [
          { id: 'ivcf_4_0', label: 'Não', score: 0 },
          { id: 'ivcf_4_2', label: 'Sim', score: 2 },
        ],
      },
      {
        id: 'ivcf_5',
        number: 5,
        title: 'Humor e Desânimo',
        description: 'No último mês, sentiu-se triste, desanimado(a) ou sem esperança na maioria dos dias?',
        options: [
          { id: 'ivcf_5_0', label: 'Não', score: 0 },
          { id: 'ivcf_5_2', label: 'Sim', score: 2 },
        ],
      },
      {
        id: 'ivcf_6',
        number: 6,
        title: 'Mobilidade e Equilíbrio',
        description: 'Apresenta marcha lenta, desequilíbrio ou dificuldade para levantar de cadeiras?',
        options: [
          { id: 'ivcf_6_0', label: 'Não, caminha com firmeza', score: 0 },
          { id: 'ivcf_6_2', label: 'Sim, marcha lenta ou instabilidade', score: 2 },
        ],
      },
    ],
    scoreRanges: [
      {
        minScore: 0,
        maxScore: 6,
        classification: 'Idoso Robusto',
        severity: 'normal',
        recommendation:
          'O participante apresenta boa reserva fisiológica e independência funcional preservada. Foco em promoção da saúde.',
      },
      {
        minScore: 7,
        maxScore: 14,
        classification: 'Idoso em Risco de Fragilização',
        severity: 'warning',
        recommendation:
          'Presença de fatores de risco clínico-funcional. Intervenção preventiva precoce para evitar perda de autonomia.',
      },
      {
        minScore: 15,
        maxScore: 40,
        classification: 'Idoso Frágil',
        severity: 'alert',
        recommendation:
          'Quadro de fragilidade estabelecida com alta vulnerabilidade. Necessário plano individualizado de cuidados geriátricos.',
      },
    ],
  },
];

export class QuestionnairesRepository {
  constructor(private storage: StorageServiceContract = defaultStorageService) {}

  async getAll(): Promise<Questionnaire[]> {
    return CLINICAL_QUESTIONNAIRES;
  }

  async getById(id: string): Promise<Questionnaire | null> {
    const list = await this.getAll();
    return list.find((q) => q.id === id) ?? null;
  }

  async getSubmissions(participantId?: string): Promise<QuestionnaireResult[]> {
    const data = await this.storage.getItem<QuestionnaireResult[]>(STORAGE_KEY);
    const list = data || [];
    if (participantId) {
      return list.filter((item) => item.participantId === participantId);
    }
    return list;
  }

  async saveSubmission(result: QuestionnaireResult): Promise<void> {
    const list = await this.getSubmissions();
    const updated = [result, ...list];
    await this.storage.setItem(STORAGE_KEY, updated);
  }

  calculateResult(
    questionnaire: Questionnaire,
    answers: QuestionnaireAnswer[],
    participant: Participant
  ): QuestionnaireResult {
    const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);

    const maxScore = questionnaire.questions.reduce((acc, q) => {
      const highestOption = Math.max(...q.options.map((o) => o.score), 0);
      return acc + highestOption;
    }, 0);

    const range =
      questionnaire.scoreRanges.find(
        (r) => totalScore >= r.minScore && totalScore <= r.maxScore
      ) ||
      questionnaire.scoreRanges[questionnaire.scoreRanges.length - 1];

    return {
      id: `qsub_${Date.now()}`,
      questionnaireId: questionnaire.id,
      questionnaireTitle: questionnaire.title,
      questionnaireCode: questionnaire.code,
      participantId: participant.id,
      participantName: participant.fullName,
      totalScore,
      maxScore,
      classification: range.classification,
      severity: range.severity,
      recommendation: range.recommendation,
      answers,
      completedAt: new Date().toISOString(),
    };
  }
}

export const defaultQuestionnairesRepository = new QuestionnairesRepository();
