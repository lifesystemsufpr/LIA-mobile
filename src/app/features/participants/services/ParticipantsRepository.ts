import { defaultStorageService, Participant, StorageServiceContract } from '../../../shared';

const STORAGE_KEY = '@lia_participants';

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'part_01',
    fullName: 'Manuela Silva',
    birthDate: '1958-03-15',
    biologicalSex: 'female',
    cpf: '12345678900',
    weightKg: 62,
    heightCm: 160,
    education: 'Ensino Médio Completo',
    socioeconomicLevel: 'Classe B (10 a 20 salários mínimos)',
    street: 'Rua das Flores',
    number: '120',
    neighborhood: 'Centro',
    city: 'Nova Iguaçu',
    state: 'RJ',
    address: 'Rua das Flores, 120, Centro, Nova Iguaçu - RJ',
    zipCode: '26030-000',
    observations: 'Boa mobilidade geral, sem histórico recente de quedas.',
    createdAt: '2025-08-01T10:00:00.000Z',
    updatedAt: '2025-08-01T10:00:00.000Z',
  },
  {
    id: 'part_02',
    fullName: 'João Oliveira',
    birthDate: '1954-07-22',
    biologicalSex: 'male',
    cpf: '98765432111',
    weightKg: 78,
    heightCm: 172,
    education: 'Superior Completo',
    socioeconomicLevel: 'Classe A (Mais de 20 salários mínimos)',
    street: 'Av. Brasil',
    number: '4500',
    neighborhood: 'Bonsucesso',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Av. Brasil, 4500, Bonsucesso, Rio de Janeiro - RJ',
    zipCode: '26040-100',
    observations: 'Pratica caminhada 3 vezes por semana.',
    createdAt: '2025-08-05T14:30:00.000Z',
    updatedAt: '2025-08-05T14:30:00.000Z',
  },
  {
    id: 'part_03',
    fullName: 'Maria Santos',
    birthDate: '1951-11-04',
    biologicalSex: 'female',
    cpf: '45612378922',
    weightKg: 58,
    heightCm: 155,
    education: 'Fundamental Completo',
    socioeconomicLevel: 'Classe C (4 a 10 salários mínimos)',
    street: 'Rua São Paulo',
    number: '88',
    neighborhood: 'Vila Isabel',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Rua São Paulo, 88, Vila Isabel, Rio de Janeiro - RJ',
    zipCode: '26050-200',
    observations: 'Usa bengala ocasionalmente para longas distâncias.',
    createdAt: '2025-08-08T09:15:00.000Z',
    updatedAt: '2025-08-08T09:15:00.000Z',
  },
  {
    id: 'part_04',
    fullName: 'Carlos Pereira',
    birthDate: '1946-02-18',
    biologicalSex: 'male',
    cpf: '32165498733',
    weightKg: 70,
    heightCm: 168,
    education: 'Ensino Médio Incompleto',
    socioeconomicLevel: 'Classe C (4 a 10 salários mínimos)',
    street: 'Travessa Bela Vista',
    number: '14',
    neighborhood: 'Jardim América',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Travessa Bela Vista, 14, Jardim América, Rio de Janeiro - RJ',
    zipCode: '26060-300',
    observations: 'Queixa de desconforto leve nos joelhos ao flexionar.',
    createdAt: '2025-08-10T11:00:00.000Z',
    updatedAt: '2025-08-10T11:00:00.000Z',
  },
  {
    id: 'part_05',
    fullName: 'Ana Rodrigues',
    birthDate: '1961-09-30',
    biologicalSex: 'female',
    cpf: '15975348644',
    weightKg: 65,
    heightCm: 162,
    education: 'Superior Completo',
    socioeconomicLevel: 'Classe B (10 a 20 salários mínimos)',
    street: 'Rua Barão de Mesquita',
    number: '501',
    neighborhood: 'Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    address: 'Rua Barão de Mesquita, 501, Tijuca, Rio de Janeiro - RJ',
    zipCode: '26070-400',
    observations: 'Excelente condicionamento físico e autonomia.',
    createdAt: '2025-08-12T16:00:00.000Z',
    updatedAt: '2025-08-12T16:00:00.000Z',
  },
];

export class ParticipantsRepository {
  constructor(private storage: StorageServiceContract = defaultStorageService) {}

  async getAll(): Promise<Participant[]> {
    const data = await this.storage.getItem<Participant[]>(STORAGE_KEY);
    if (!data || data.length === 0) {
      await this.storage.setItem(STORAGE_KEY, INITIAL_PARTICIPANTS);
      return INITIAL_PARTICIPANTS;
    }
    const enriched = data.map((p) => {
      const initialMatch = INITIAL_PARTICIPANTS.find((item) => item.id === p.id);
      if (initialMatch && (!p.street || !p.socioeconomicLevel?.includes('('))) {
        return {
          ...p,
          street: p.street || initialMatch.street,
          number: p.number || initialMatch.number,
          complement: p.complement || initialMatch.complement,
          neighborhood: p.neighborhood || initialMatch.neighborhood,
          city: p.city || initialMatch.city,
          state: p.state || initialMatch.state,
          socioeconomicLevel:
            p.socioeconomicLevel && !p.socioeconomicLevel.includes('(')
              ? initialMatch.socioeconomicLevel
              : p.socioeconomicLevel,
        };
      }
      return p;
    });
    return enriched;
  }

  async getById(id: string): Promise<Participant | null> {
    const list = await this.getAll();
    return list.find((p) => p.id === id) ?? null;
  }

  async save(participant: Participant): Promise<void> {
    const list = await this.getAll();
    const index = list.findIndex((p) => p.id === participant.id);
    if (index >= 0) {
      list[index] = participant;
    } else {
      list.unshift(participant);
    }
    await this.storage.setItem(STORAGE_KEY, list);
  }

  async delete(id: string): Promise<void> {
    const list = await this.getAll();
    const filtered = list.filter((p) => p.id !== id);
    await this.storage.setItem(STORAGE_KEY, filtered);
  }
}

export const defaultParticipantsRepository = new ParticipantsRepository();
