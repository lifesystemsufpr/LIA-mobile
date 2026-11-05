import { create } from 'zustand';
import {
  ApplicationSite,
  Institution,
  InstitutionalRole,
  Professional,
} from '../types';
import { defaultAccessControlService } from '../services/accessControl';

export type SessionState = {
  professional: Professional | null;
  isAuthenticated: boolean;
  activeInstitutionId: string;
  activeApplicationSiteId: string;
  activeRole: InstitutionalRole | null;
  accessibleInstitutions: Institution[];
  accessibleApplicationSites: ApplicationSite[];
  login: (professional: Professional) => void;
  logout: () => void;
  updateProfessional: (partial: Partial<Professional>) => void;
  selectInstitution: (institutionId: string) => void;
  selectApplicationSite: (applicationSiteId: string) => void;
};

// Default demonstration professional (AVALIADOR vinculado exclusivamente à UFPR e ao Laboratório de Biomecânica - Lab A)
export const DEFAULT_PROFESSIONAL: Professional = {
  id: 'prof_demo_01',
  name: 'Dr. Roberto Silva',
  email: 'dr.roberto@lia.com',
  professionalCategory: 'Fisioterapeuta',
  professionalRegistration: 'CREFITO 12345-F',
};

function buildInitialInstitutionalContext(userId: string): {
  activeInstitutionId: string;
  activeApplicationSiteId: string;
  activeRole: InstitutionalRole | null;
  accessibleInstitutions: Institution[];
  accessibleApplicationSites: ApplicationSite[];
} {
  const allInstitutions = defaultAccessControlService.getAccessibleInstitutions(userId);
  const firstInstitution = allInstitutions[0];
  const activeInstitutionId = firstInstitution ? firstInstitution.id : 'inst_ufpr';
  const membership = firstInstitution
    ? defaultAccessControlService.getActiveInstitutionMembership(userId, activeInstitutionId)
    : null;
  const activeRole = membership ? membership.role : null;

  // Regra de negócio: um AVALIADOR pode pertencer a apenas 1 instituição e apenas 1 unidade de aplicação
  const accessibleInstitutions =
    activeRole === 'AVALIADOR' && firstInstitution ? [firstInstitution] : allInstitutions;

  const allSites = firstInstitution
    ? defaultAccessControlService.getAccessibleApplicationSites(userId, activeInstitutionId)
    : [];
  const firstSite = allSites[0];
  const accessibleApplicationSites =
    activeRole === 'AVALIADOR' && firstSite ? [firstSite] : allSites;
  const activeApplicationSiteId = firstSite ? firstSite.id : 'site_ufpr_lab_a';

  return {
    activeInstitutionId,
    activeApplicationSiteId,
    activeRole,
    accessibleInstitutions,
    accessibleApplicationSites,
  };
}

const initialContext = buildInitialInstitutionalContext(DEFAULT_PROFESSIONAL.id);

export const useSessionStore = create<SessionState>((set, get) => ({
  professional: DEFAULT_PROFESSIONAL,
  isAuthenticated: true,
  ...initialContext,
  login: (professional: Professional) => {
    const ctx = buildInitialInstitutionalContext(professional.id);
    set({
      professional,
      isAuthenticated: true,
      ...ctx,
    });
  },
  logout: () =>
    set({
      professional: null,
      isAuthenticated: false,
      activeRole: null,
      accessibleInstitutions: [],
      accessibleApplicationSites: [],
    }),
  updateProfessional: (partial) =>
    set((state) => ({
      professional: state.professional ? { ...state.professional, ...partial } : null,
    })),
  selectInstitution: (institutionId: string) => {
    const currentProfessional = get().professional;
    const currentRole = get().activeRole;
    if (!currentProfessional || currentRole === 'AVALIADOR') {
      return;
    }
    const sites = defaultAccessControlService.getAccessibleApplicationSites(
      currentProfessional.id,
      institutionId,
    );
    const membership = defaultAccessControlService.getActiveInstitutionMembership(
      currentProfessional.id,
      institutionId,
    );
    set({
      activeInstitutionId: institutionId,
      accessibleApplicationSites: sites,
      activeApplicationSiteId: sites[0]?.id ?? '',
      activeRole: membership?.role ?? null,
    });
  },
  selectApplicationSite: (applicationSiteId: string) => {
    const currentProfessional = get().professional;
    const activeInstitutionId = get().activeInstitutionId;
    const currentRole = get().activeRole;
    if (!currentProfessional || currentRole === 'AVALIADOR') {
      return;
    }
    const sites = defaultAccessControlService.getAccessibleApplicationSites(
      currentProfessional.id,
      activeInstitutionId,
    );
    const matchedSite = sites.find((s) => s.id === applicationSiteId);
    if (!matchedSite) {
      return;
    }
    set({
      activeApplicationSiteId: matchedSite.id,
    });
  },
}));
