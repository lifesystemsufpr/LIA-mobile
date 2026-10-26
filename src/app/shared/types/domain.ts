export type BiologicalSex = 'female' | 'male' | 'other';

export type ProtocolId = '30sSTS' | '1MSTS' | '5TSTS' | '2MST' | 'UTT' | 'TUG';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type Professional = {
  id: string;
  name: string;
  email: string;
  professionalCategory: string;
  professionalRegistration: string;
};

export type Participant = {
  id: string;
  fullName: string;
  birthDate: string; // ISO 8601 (YYYY-MM-DD)
  biologicalSex: BiologicalSex;
  cpf: string;
  weightKg?: number;
  heightCm?: number;
  education?: string;
  socioeconomicLevel?: string;
  address?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  observations?: string;
  createdAt: string;
  updatedAt: string;
};

export type ProtocolStep = {
  stepNumber: number;
  title: string;
  description: string;
};

export type Protocol = {
  id: ProtocolId;
  name: string;
  shortName: string;
  description: string;
  functionalGoal: string;
  durationSeconds?: number;
  targetReps?: number;
  equipment: string[];
  safetyWarnings: string[];
  steps: ProtocolStep[];
  sensorRequirements: string;
  enabled?: boolean;
};

export type SensorSample = {
  timestamp: number;
  accelerationX: number;
  accelerationY: number;
  accelerationZ: number;
  gyroscopeX: number;
  gyroscopeY: number;
  gyroscopeZ: number;
};

export type Assessment = {
  id: string;
  participantId: string;
  professionalId: string;
  protocolId: ProtocolId;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  repetitions?: number;
  resultValue?: number;
  resultUnit?: string;
  syncStatus: SyncStatus;
  sensorDataUri?: string;
  sampleCount?: number;
  notes?: string;
  createdAt: string;
};

export type AppConfig = {
  voiceGuidanceEnabled: boolean;
  voiceRate: number;
  voicePitch: number;
  sampleRateHz: number;
};
