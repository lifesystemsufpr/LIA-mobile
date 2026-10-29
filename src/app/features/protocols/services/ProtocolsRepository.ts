import { Protocol, ProtocolId } from '../../../shared';

export const PROTOCOLS_CATALOG: Protocol[] = [
  {
    id: '30sSTS',
    name: 'Teste de Sentar e Levantar em 30 Segundos',
    shortName: '30sSTS',
    description: 'Sentar e levantar de uma cadeira o máximo de vezes possível durante 30 segundos.',
    functionalGoal: 'Avalia a força funcional, potência muscular e resistência de membros inferiores.',
    durationSeconds: 30,
    equipment: ['Cadeira firme sem braços (altura ~43-45 cm)', 'Espaço livre e seguro ao redor'],
    safetyWarnings: [
      'Não utilize as mãos para se apoiar nas pernas ou na cadeira.',
      'Se sentir dor aguda, tontura ou desequilíbrio, interrompa o teste imediatamente.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sentado',
        description: 'Comece sentado no centro da cadeira, costas eretas e pés totalmente apoiados no chão.',
      },
      {
        stepNumber: 2,
        title: 'Levante',
        description: 'Levante-se completamente até a extensão total dos joelhos e quadril.',
      },
      {
        stepNumber: 3,
        title: 'Em pé',
        description: 'Mantenha a postura ereta por uma fração de segundo sem apoios.',
      },
      {
        stepNumber: 4,
        title: 'Sente',
        description: 'Retorne à posição sentada de forma controlada e repita o ciclo.',
      },
    ],
    sensorRequirements: 'Smartphone posicionado na vertical sobre a região esternal (tórax) a 60 Hz.',
    enabled: true,
  },
  {
    id: '1MSTS',
    name: 'Teste de Sentar e Levantar em 1 Minuto',
    shortName: '1MSTS',
    description: 'Sentar e levantar de uma cadeira o máximo de vezes possível durante 1 minuto (60 segundos).',
    functionalGoal: 'Avalia a capacidade funcional, potência muscular e tolerância ao esforço cardiorrespiratório.',
    durationSeconds: 60,
    equipment: ['Cadeira firme sem braços (altura ~43-45 cm)', 'Espaço livre e seguro ao redor'],
    safetyWarnings: [
      'Braços cruzados sobre o peito durante todas as repetições.',
      'Não impulsione o corpo com as mãos apoiadas nas pernas ou na cadeira.',
      'Se sentir dor aguda, tontura, falta de ar ou desequilíbrio, interrompa o teste imediatamente.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sentado',
        description: 'Comece sentado no centro da cadeira, costas eretas e pés totalmente apoiados no chão.',
      },
      {
        stepNumber: 2,
        title: 'Levante',
        description: 'Levante-se completamente até a extensão total dos joelhos e quadril.',
      },
      {
        stepNumber: 3,
        title: 'Em pé',
        description: 'Mantenha a postura ereta por uma fração de segundo sem apoios.',
      },
      {
        stepNumber: 4,
        title: 'Sente',
        description: 'Retorne à posição sentada de forma controlada e repita o ciclo pelo período de 1 minuto.',
      },
    ],
    sensorRequirements: 'Smartphone posicionado na vertical sobre a região esternal (tórax) a 60 Hz.',
    enabled: true,
  },
  {
    id: '5TSTS',
    name: 'Teste de Sentar e Levantar 5 Vezes',
    shortName: '5TSTS',
    description: 'Sentar e levantar da cadeira exatamente 5 repetições o mais rápido possível.',
    functionalGoal: 'Mede a velocidade e potência muscular de membros inferiores e o risco de quedas.',
    targetReps: 5,
    equipment: ['Cadeira firme sem braços', 'Cronômetro inercial'],
    safetyWarnings: [
      'Braços cruzados sobre o peito durante todas as repetições.',
      'Interrompa caso o participante apresente instabilidade postural severa.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Posição Inicial',
        description: 'Sentado com braços cruzados sobre o peito.',
      },
      {
        stepNumber: 2,
        title: 'Execução Rápida',
        description: 'Fique em pé completamente e sente-se 5 vezes consecutivas o mais rápido possível.',
      },
      {
        stepNumber: 3,
        title: 'Conclusão',
        description: 'O cronômetro para assim que o participante se sentar pela 5ª vez.',
      },
    ],
    sensorRequirements: 'Acelerômetro e giroscópio no esterno a 60 Hz.',
    enabled: true,
  },
  {
    id: '2MST',
    name: 'Teste de Marcha Estacionária de 2 Minutos',
    shortName: '2MST',
    description: 'Marcha estacionária elevando os joelhos até a altura média da coxa durante 2 minutos.',
    functionalGoal: 'Avalia a capacidade aeróbica e a resistência cardiorrespiratória em idosos.',
    durationSeconds: 120,
    equipment: ['Fita métrica para marcar altura da marcha', 'Apoio próximo para emergência'],
    safetyWarnings: [
      'Monitore sinais de fadiga excessiva ou falta de ar.',
      'O participante pode diminuir o ritmo se necessário.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Marcação',
        description: 'Marque a altura do ponto médio entre a patela e a crista ilíaca.',
      },
      {
        stepNumber: 2,
        title: 'Marcha',
        description: 'Eleve os joelhos alternadamente até a marcação pelo período de 2 minutos.',
      },
    ],
    sensorRequirements: 'Sensor inercial no esterno ou quadril a 60 Hz.',
    enabled: false,
  },
  {
    id: 'TUG',
    name: 'Timed Up and Go',
    shortName: 'TUG',
    description: 'Levantar da cadeira, caminhar 3 metros em ritmo confortável, girar, retornar e sentar.',
    functionalGoal: 'Mede a mobilidade básica, agilidade e equilíbrio dinâmico.',
    equipment: ['Cadeira padrão', 'Fita métrica', 'Cone ou marcador a 3 metros'],
    safetyWarnings: [
      'Permitido uso de dispositivo de auxílio à marcha habitual (bengala/andador).',
      'Não correr; caminhar com segurança.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Partida',
        description: 'Levante-se da cadeira ao sinal sonoro.',
      },
      {
        stepNumber: 2,
        title: 'Caminhada',
        description: 'Caminhe 3 metros, contorne a marca e retorne à cadeira.',
      },
      {
        stepNumber: 3,
        title: 'Retorno',
        description: 'Sente-se novamente com as costas apoiadas.',
      },
    ],
    sensorRequirements: 'Smartphone fixado no tórax ou cintura com gravação inercial a 60 Hz.',
    enabled: false,
  },
];

export class ProtocolsRepository {
  getAll(): Protocol[] {
    return PROTOCOLS_CATALOG;
  }

  getById(id: ProtocolId): Protocol | null {
    return PROTOCOLS_CATALOG.find((p) => p.id === id) ?? null;
  }
}

export const defaultProtocolsRepository = new ProtocolsRepository();
