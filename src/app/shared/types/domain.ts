export type BiologicalSex = 'female' | 'male' | 'other';

export type ProtocolId = '30sSTS' | '1MSTS' | '5TSTS' | '2MST' | 'UTT' | 'TUG' | 'IVCF-20';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type InstitutionalRole = 'ADMIN' | 'GESTOR_UNIDADE' | 'AVALIADOR';

export type SiteScopedRole = 'GESTOR_UNIDADE' | 'AVALIADOR';

export type RecordStatus = 'active' | 'inactive';

export type OrganizationalUnitType =
  | 'CAMPUS'
  | 'FACULDADE'
  | 'DEPARTAMENTO'
  | 'CENTRO'
  | 'OUTRO';

export type Institution = {
  id: string;
  name: string;
  acronym: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationalUnit = {
  id: string;
  institutionId: string;
  parentUnitId?: string | null;
  name: string;
  type: OrganizationalUnitType;
  status: RecordStatus;
};

export type ApplicationSite = {
  id: string;
  institutionId: string;
  organizationalUnitId?: string | null;
  name: string;
  description?: string;
  address?: string;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type InstitutionMembership = {
  id: string;
  userId: string;
  institutionId: string;
  role: InstitutionalRole;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationSiteMembership = {
  id: string;
  institutionMembershipId: string;
  applicationSiteId: string;
  role: SiteScopedRole;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
};

export type Professional = {
  id: string;
  name: string;
  email: string;
  professionalCategory: string;
  professionalRegistration: string;
  status?: RecordStatus;
};

export type Participant = {
  id: string;
  institutionId?: string;
  institutionalCode?: string;
  applicationSiteId?: string;
  applicationSiteIds?: string[];
  status?: RecordStatus;
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
  institutionId?: string;
  applicationSiteId?: string;
  evaluatorUserId?: string;
  protocolVersionId?: string;
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
