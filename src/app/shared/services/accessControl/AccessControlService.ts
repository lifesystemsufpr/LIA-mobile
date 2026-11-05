import {
  ApplicationSite,
  ApplicationSiteMembership,
  Assessment,
  Institution,
  InstitutionalRole,
  InstitutionMembership,
  OrganizationalUnit,
  Participant,
  SiteScopedRole,
} from '../../types';

export class AccessControlError extends Error {
  constructor(
    public readonly statusCode: 401 | 403 | 404 | 409 | 422,
    message: string
  ) {
    super(message);
    this.name = 'AccessControlError';
  }
}

export type AccessContext = {
  authenticatedUserId: string;
  activeInstitutionId: string;
  activeApplicationSiteId?: string | null;
};

export type AuditLogEntry = {
  id: string;
  actorUserId: string;
  institutionId: string;
  action: string;
  targetId: string;
  timestamp: string;
};

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: 'inst_ufpr',
    name: 'Universidade Federal do Paraná',
    acronym: 'UFPR',
    status: 'active',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'inst_puc',
    name: 'Pontifícia Universidade Católica',
    acronym: 'PUC',
    status: 'active',
    createdAt: '2025-01-12T08:00:00.000Z',
    updatedAt: '2025-01-12T08:00:00.000Z',
  },
  {
    id: 'inst_unesp',
    name: 'Universidade Estadual Paulista',
    acronym: 'UNESP',
    status: 'active',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2025-01-15T08:00:00.000Z',
  },
];

export const INITIAL_ORGANIZATIONAL_UNITS: OrganizationalUnit[] = [
  {
    id: 'org_ufpr_bio',
    institutionId: 'inst_ufpr',
    parentUnitId: null,
    name: 'Setor de Ciências Biológicas',
    type: 'FACULDADE',
    status: 'active',
  },
  {
    id: 'org_ufpr_def',
    institutionId: 'inst_ufpr',
    parentUnitId: 'org_ufpr_bio',
    name: 'Departamento de Educação Física',
    type: 'DEPARTAMENTO',
    status: 'active',
  },
  {
    id: 'org_puc_vida',
    institutionId: 'inst_puc',
    parentUnitId: null,
    name: 'Escola de Ciências da Vida',
    type: 'FACULDADE',
    status: 'active',
  },
  {
    id: 'org_unesp_fct',
    institutionId: 'inst_unesp',
    parentUnitId: null,
    name: 'Faculdade de Ciências e Tecnologia',
    type: 'FACULDADE',
    status: 'active',
  },
];

export const INITIAL_APPLICATION_SITES: ApplicationSite[] = [
  {
    id: 'site_ufpr_lab_a',
    institutionId: 'inst_ufpr',
    organizationalUnitId: 'org_ufpr_def',
    name: 'Laboratório de Biomecânica (Lab A)',
    description: 'Laboratório de avaliação cinemática e sensores inerciais',
    address: 'Centro Politécnico — Jardim das Américas, Curitiba - PR',
    status: 'active',
    createdAt: '2025-01-10T09:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 'site_ufpr_amb_b',
    institutionId: 'inst_ufpr',
    organizationalUnitId: 'org_ufpr_def',
    name: 'Ambulatório de Gerontologia (Lab B)',
    description: 'Ambulatório clínico-funcional de atenção ao idoso',
    address: 'Rua XV de Novembro, 1299, Curitiba - PR',
    status: 'active',
    createdAt: '2025-01-10T09:30:00.000Z',
    updatedAt: '2025-01-10T09:30:00.000Z',
  },
  {
    id: 'site_puc_clinica',
    institutionId: 'inst_puc',
    organizationalUnitId: 'org_puc_vida',
    name: 'Clínica Escola de Fisioterapia',
    description: 'Clínica de reabilitação e avaliação funcional',
    address: 'Rua Imaculada Conceição, 1155, Curitiba - PR',
    status: 'active',
    createdAt: '2025-01-12T09:00:00.000Z',
    updatedAt: '2025-01-12T09:00:00.000Z',
  },
  {
    id: 'site_unesp_cefi',
    institutionId: 'inst_unesp',
    organizationalUnitId: 'org_unesp_fct',
    name: 'Centro de Reabilitação e Pesquisa (CEFI)',
    description: 'Laboratório de avaliação motora da UNESP',
    address: 'Rua Roberto Simonsen, 305, Presidente Prudente - SP',
    status: 'active',
    createdAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2025-01-15T09:00:00.000Z',
  },
];

export const INITIAL_INSTITUTION_MEMBERSHIPS: InstitutionMembership[] = [
  {
    id: 'im_prof01_ufpr',
    userId: 'prof_01',
    institutionId: 'inst_ufpr',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'im_prof01_puc',
    userId: 'prof_01',
    institutionId: 'inst_puc',
    role: 'GESTOR_UNIDADE',
    status: 'active',
    createdAt: '2025-01-12T10:00:00.000Z',
    updatedAt: '2025-01-12T10:00:00.000Z',
  },
  {
    id: 'im_admin_puc',
    userId: 'prof_admin_puc',
    institutionId: 'inst_puc',
    role: 'ADMIN',
    status: 'active',
    createdAt: '2025-01-12T09:00:00.000Z',
    updatedAt: '2025-01-12T09:00:00.000Z',
  },
  {
    id: 'im_demo_ufpr',
    userId: 'prof_demo_01',
    institutionId: 'inst_ufpr',
    role: 'AVALIADOR',
    status: 'active',
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
];

export const INITIAL_SITE_MEMBERSHIPS: ApplicationSiteMembership[] = [
  {
    id: 'sm_prof01_puc_clinica',
    institutionMembershipId: 'im_prof01_puc',
    applicationSiteId: 'site_puc_clinica',
    role: 'GESTOR_UNIDADE',
    status: 'active',
    createdAt: '2025-01-12T10:05:00.000Z',
    updatedAt: '2025-01-12T10:05:00.000Z',
  },
  {
    id: 'sm_demo_ufpr_lab_a',
    institutionMembershipId: 'im_demo_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    role: 'AVALIADOR',
    status: 'active',
    createdAt: '2025-01-10T10:05:00.000Z',
    updatedAt: '2025-01-10T10:05:00.000Z',
  },
];

export class AccessControlService {
  private institutions: Institution[];
  private organizationalUnits: OrganizationalUnit[];
  private applicationSites: ApplicationSite[];
  private institutionMemberships: InstitutionMembership[];
  private siteMemberships: ApplicationSiteMembership[];
  private auditLogs: AuditLogEntry[] = [];

  constructor(
    institutions: Institution[] = INITIAL_INSTITUTIONS,
    organizationalUnits: OrganizationalUnit[] = INITIAL_ORGANIZATIONAL_UNITS,
    applicationSites: ApplicationSite[] = INITIAL_APPLICATION_SITES,
    institutionMemberships: InstitutionMembership[] = INITIAL_INSTITUTION_MEMBERSHIPS,
    siteMemberships: ApplicationSiteMembership[] = INITIAL_SITE_MEMBERSHIPS
  ) {
    this.institutions = [...institutions];
    this.organizationalUnits = [...organizationalUnits];
    this.applicationSites = [...applicationSites];
    this.institutionMemberships = [...institutionMemberships];
    this.siteMemberships = [...siteMemberships];
  }

  getAuditLogs(): ReadonlyArray<AuditLogEntry> {
    return this.auditLogs;
  }

  private recordAudit(actorUserId: string, institutionId: string, action: string, targetId: string): void {
    this.auditLogs.push({
      id: `audit_${Date.now()}_${this.auditLogs.length + 1}`,
      actorUserId,
      institutionId,
      action,
      targetId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Verifica se o usuário possui papel ADMIN ativo no sistema.
   */
  hasActiveAdminRole(userId: string): boolean {
    return this.institutionMemberships.some(
      (m) => m.userId === userId && m.role === 'ADMIN' && m.status === 'active'
    );
  }

  /**
   * Retorna todas as instituições ativas acessíveis pelo usuário.
   * O ADMIN visualiza todas as instituições disponíveis; GESTOR_UNIDADE e AVALIADOR visualizam sua instituição vinculada.
   */
  getAccessibleInstitutions(userId: string): Institution[] {
    if (this.hasActiveAdminRole(userId)) {
      return this.institutions.filter((inst) => inst.status === 'active');
    }

    const activeInstitutionIds = new Set(
      this.institutionMemberships
        .filter((m) => m.userId === userId && m.status === 'active')
        .map((m) => m.institutionId)
    );
    return this.institutions.filter(
      (inst) => inst.status === 'active' && activeInstitutionIds.has(inst.id)
    );
  }

  /**
   * Retorna o vínculo institucional ativo do usuário (ou null se não houver).
   */
  getActiveInstitutionMembership(
    userId: string,
    institutionId: string
  ): InstitutionMembership | null {
    return (
      this.institutionMemberships.find(
        (m) =>
          m.userId === userId &&
          m.institutionId === institutionId &&
          m.status === 'active'
      ) ?? null
    );
  }

  /**
   * Valida o vínculo ativo do usuário com a instituição (MembershipGuard).
   */
  requireActiveInstitutionMembership(
    userId: string,
    institutionId: string
  ): InstitutionMembership {
    if (!userId) {
      throw new AccessControlError(401, 'Usuário não autenticado.');
    }

    const institution = this.institutions.find((i) => i.id === institutionId);
    if (!institution || institution.status !== 'active') {
      throw new AccessControlError(403, 'Instituição inexistente ou inativa.');
    }

    const membership = this.institutionMemberships.find(
      (m) => m.userId === userId && m.institutionId === institutionId
    );

    if (!membership || membership.status !== 'active') {
      throw new AccessControlError(
        403,
        'Acesso negado: usuário não possui vínculo ativo com esta instituição.'
      );
    }

    return membership;
  }

  /**
   * Retorna as unidades de aplicação acessíveis para visualização pelo usuário.
   * - ADMIN: visualiza todas as unidades de aplicação de todas as instituições (ou da instituição selecionada).
   * - GESTOR_UNIDADE: visualiza todas as unidades de aplicação de sua instituição.
   * - AVALIADOR: visualiza apenas a sua única unidade de aplicação (1:1).
   */
  getAccessibleApplicationSites(userId: string, institutionId: string): ApplicationSite[] {
    if (this.hasActiveAdminRole(userId)) {
      if (institutionId === 'ALL') {
        return this.applicationSites.filter((s) => s.status === 'active');
      }
      return this.applicationSites.filter(
        (s) => s.institutionId === institutionId && s.status === 'active'
      );
    }

    const membership = this.requireActiveInstitutionMembership(userId, institutionId);

    const institutionalSites = this.applicationSites.filter(
      (s) => s.institutionId === institutionId && s.status === 'active'
    );

    if (membership.role === 'ADMIN' || membership.role === 'GESTOR_UNIDADE') {
      return institutionalSites;
    }

    const authorizedSiteIds = new Set(
      this.siteMemberships
        .filter(
          (sm) => sm.institutionMembershipId === membership.id && sm.status === 'active'
        )
        .map((sm) => sm.applicationSiteId)
    );

    return institutionalSites.filter((s) => authorizedSiteIds.has(s.id));
  }

  /**
   * Valida se o usuário possui acesso operacional/administrativo a uma unidade específica (ApplicationSiteGuard).
   */
  requireApplicationSiteAccess(
    userId: string,
    institutionId: string,
    applicationSiteId: string,
    requireActiveSite = true
  ): { institutionMembership: InstitutionMembership; site: ApplicationSite; effectiveRole: InstitutionalRole } {
    const institutionMembership = this.requireActiveInstitutionMembership(userId, institutionId);

    const site = this.applicationSites.find((s) => s.id === applicationSiteId);
    if (!site) {
      throw new AccessControlError(404, 'Unidade de aplicação não encontrada.');
    }

    if (site.institutionId !== institutionId) {
      throw new AccessControlError(
        403,
        'Violação de isolamento institucional: a unidade pertence a outra instituição.'
      );
    }

    if (requireActiveSite && site.status !== 'active') {
      throw new AccessControlError(
        422,
        'Operação não permitida: a unidade de aplicação está inativa.'
      );
    }

    if (institutionMembership.role === 'ADMIN') {
      return { institutionMembership, site, effectiveRole: 'ADMIN' };
    }

    const siteMembership = this.siteMemberships.find(
      (sm) =>
        sm.institutionMembershipId === institutionMembership.id &&
        sm.applicationSiteId === applicationSiteId &&
        sm.status === 'active'
    );

    if (!siteMembership) {
      throw new AccessControlError(
        403,
        'Acesso negado: usuário não possui vínculo ativo com esta unidade de aplicação.'
      );
    }

    return {
      institutionMembership,
      site,
      effectiveRole: siteMembership.role,
    };
  }

  /**
   * Cria ou vincula um usuário a uma instituição (somente ADMIN da instituição).
   */
  assignInstitutionMembership(
    actorUserId: string,
    institutionId: string,
    targetUserId: string,
    role: InstitutionalRole
  ): InstitutionMembership {
    const actorMembership = this.requireActiveInstitutionMembership(actorUserId, institutionId);
    if (actorMembership.role !== 'ADMIN') {
      throw new AccessControlError(
        403,
        'Apenas administradores institucionais podem atribuir papéis na instituição.'
      );
    }

    const existing = this.institutionMemberships.find(
      (m) => m.userId === targetUserId && m.institutionId === institutionId
    );
    if (existing) {
      throw new AccessControlError(
        409,
        'O usuário já possui um vínculo cadastrado nesta instituição.'
      );
    }

    const otherActiveMemberships = this.institutionMemberships.filter(
      (m) =>
        m.userId === targetUserId &&
        m.institutionId !== institutionId &&
        m.status === 'active'
    );

    if (
      otherActiveMemberships.length > 0 &&
      (role === 'AVALIADOR' || otherActiveMemberships.some((m) => m.role === 'AVALIADOR'))
    ) {
      throw new AccessControlError(
        422,
        'Um avaliador pode pertencer a apenas uma instituição ativa.'
      );
    }

    const now = new Date().toISOString();
    const created: InstitutionMembership = {
      id: `im_${targetUserId}_${institutionId}`,
      userId: targetUserId,
      institutionId,
      role,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.institutionMemberships.push(created);
    this.recordAudit(actorUserId, institutionId, 'ASSIGN_INSTITUTION_MEMBERSHIP', created.id);
    return created;
  }

  /**
   * Altera o papel ou status de um vínculo institucional, protegendo contra auto-elevação e remoção do último ADMIN.
   */
  updateInstitutionMembership(
    actorUserId: string,
    institutionId: string,
    membershipId: string,
    updates: { role?: InstitutionalRole; status?: 'active' | 'inactive' }
  ): InstitutionMembership {
    const actorMembership = this.requireActiveInstitutionMembership(actorUserId, institutionId);
    if (actorMembership.role !== 'ADMIN') {
      throw new AccessControlError(
        403,
        'Proibida elevação de privilégio ou alteração de vínculo institucional por não-administrador.'
      );
    }

    const target = this.institutionMemberships.find(
      (m) => m.id === membershipId && m.institutionId === institutionId
    );
    if (!target) {
      throw new AccessControlError(404, 'Vínculo institucional não encontrado.');
    }

    const isLosingAdmin =
      target.role === 'ADMIN' &&
      target.status === 'active' &&
      ((updates.role && updates.role !== 'ADMIN') || updates.status === 'inactive');

    if (isLosingAdmin) {
      const activeAdminsCount = this.institutionMemberships.filter(
        (m) =>
          m.institutionId === institutionId &&
          m.role === 'ADMIN' &&
          m.status === 'active'
      ).length;

      if (activeAdminsCount <= 1) {
        throw new AccessControlError(
          422,
          'Não é permitido remover ou desativar o último ADMIN ativo da instituição.'
        );
      }
    }

    const nextRole = updates.role ?? target.role;
    const nextStatus = updates.status ?? target.status;

    if (nextStatus === 'active' && nextRole === 'AVALIADOR') {
      const hasOtherActiveInstitution = this.institutionMemberships.some(
        (m) =>
          m.userId === target.userId &&
          m.id !== target.id &&
          m.status === 'active'
      );
      if (hasOtherActiveInstitution) {
        throw new AccessControlError(
          422,
          'Um avaliador pode pertencer a apenas uma instituição ativa.'
        );
      }
    }

    if (updates.role) {
      target.role = updates.role;
    }
    if (updates.status) {
      target.status = updates.status;
    }
    target.updatedAt = new Date().toISOString();
    this.recordAudit(actorUserId, institutionId, 'UPDATE_INSTITUTION_MEMBERSHIP', target.id);
    return target;
  }

  /**
   * Vincula um usuário a uma unidade de aplicação (ADMIN pode vincular GESTOR_UNIDADE ou AVALIADOR;
   * GESTOR_UNIDADE pode vincular apenas AVALIADOR na sua própria unidade).
   */
  assignApplicationSiteMembership(
    actorUserId: string,
    institutionId: string,
    targetInstitutionMembershipId: string,
    applicationSiteId: string,
    role: SiteScopedRole
  ): ApplicationSiteMembership {
    const { effectiveRole } = this.requireApplicationSiteAccess(
      actorUserId,
      institutionId,
      applicationSiteId,
      true
    );

    if (effectiveRole === 'AVALIADOR') {
      throw new AccessControlError(
        403,
        'Avaliadores não têm permissão para gerenciar vínculos de unidades.'
      );
    }

    if (effectiveRole === 'GESTOR_UNIDADE' && role !== 'AVALIADOR') {
      throw new AccessControlError(
        403,
        'Gestores de unidade podem atribuir apenas o papel AVALIADOR.'
      );
    }

    const targetInstMembership = this.institutionMemberships.find(
      (m) => m.id === targetInstitutionMembershipId && m.institutionId === institutionId
    );
    if (!targetInstMembership || targetInstMembership.status !== 'active') {
      throw new AccessControlError(
        422,
        'O usuário alvo não possui vínculo ativo com esta instituição.'
      );
    }

    const duplicate = this.siteMemberships.find(
      (sm) =>
        sm.institutionMembershipId === targetInstitutionMembershipId &&
        sm.applicationSiteId === applicationSiteId
    );
    if (duplicate) {
      throw new AccessControlError(
        409,
        'O usuário já possui vínculo cadastrado com esta unidade de aplicação.'
      );
    }

    if (role === 'AVALIADOR' || targetInstMembership.role === 'AVALIADOR') {
      const existingActiveSiteForEvaluator = this.siteMemberships.find(
        (sm) =>
          sm.institutionMembershipId === targetInstitutionMembershipId &&
          sm.status === 'active' &&
          sm.applicationSiteId !== applicationSiteId
      );
      if (existingActiveSiteForEvaluator) {
        throw new AccessControlError(
          422,
          'Um avaliador pode pertencer a apenas uma unidade de aplicação ativa.'
        );
      }
    }

    const now = new Date().toISOString();
    const created: ApplicationSiteMembership = {
      id: `sm_${targetInstitutionMembershipId}_${applicationSiteId}`,
      institutionMembershipId: targetInstitutionMembershipId,
      applicationSiteId,
      role,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.siteMemberships.push(created);
    this.recordAudit(actorUserId, institutionId, 'ASSIGN_SITE_MEMBERSHIP', created.id);
    return created;
  }

  /**
   * Cadastra uma nova unidade de aplicação na instituição (somente ADMIN da própria instituição).
   */
  createApplicationSite(
    actorUserId: string,
    institutionId: string,
    payload: {
      name: string;
      description?: string;
      address?: string;
      organizationalUnitId?: string | null;
    }
  ): ApplicationSite {
    const membership = this.requireActiveInstitutionMembership(actorUserId, institutionId);
    if (membership.role !== 'ADMIN') {
      throw new AccessControlError(
        403,
        'Apenas administradores institucionais podem cadastrar unidades de aplicação.'
      );
    }

    const now = new Date().toISOString();
    const created: ApplicationSite = {
      id: `site_${institutionId}_${Date.now()}`,
      institutionId,
      organizationalUnitId: payload.organizationalUnitId ?? null,
      name: payload.name,
      description: payload.description,
      address: payload.address,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.applicationSites.push(created);
    this.recordAudit(actorUserId, institutionId, 'CREATE_APPLICATION_SITE', created.id);
    return created;
  }

  /**
   * Desativa uma unidade de aplicação (somente ADMIN) preservando avaliações históricas.
   */
  deactivateApplicationSite(
    actorUserId: string,
    institutionId: string,
    applicationSiteId: string
  ): ApplicationSite {
    const membership = this.requireActiveInstitutionMembership(actorUserId, institutionId);
    if (membership.role !== 'ADMIN') {
      throw new AccessControlError(
        403,
        'Apenas administradores podem desativar unidades de aplicação.'
      );
    }

    const site = this.applicationSites.find(
      (s) => s.id === applicationSiteId && s.institutionId === institutionId
    );
    if (!site) {
      throw new AccessControlError(404, 'Unidade de aplicação não encontrada na instituição.');
    }

    site.status = 'inactive';
    site.updatedAt = new Date().toISOString();
    this.recordAudit(actorUserId, institutionId, 'DEACTIVATE_APPLICATION_SITE', site.id);
    return site;
  }

  /**
   * Desativa o vínculo de um avaliador com uma unidade de aplicação (ADMIN ou GESTOR_UNIDADE da unidade).
   */
  deactivateSiteMembership(
    actorUserId: string,
    institutionId: string,
    siteMembershipId: string
  ): ApplicationSiteMembership {
    const targetSm = this.siteMemberships.find((sm) => sm.id === siteMembershipId);
    if (!targetSm) {
      throw new AccessControlError(404, 'Vínculo de unidade não encontrado.');
    }

    const { effectiveRole } = this.requireApplicationSiteAccess(
      actorUserId,
      institutionId,
      targetSm.applicationSiteId,
      false
    );

    if (effectiveRole === 'AVALIADOR') {
      throw new AccessControlError(
        403,
        'Avaliadores não podem desativar vínculos de unidade.'
      );
    }

    if (effectiveRole === 'GESTOR_UNIDADE' && targetSm.role !== 'AVALIADOR') {
      throw new AccessControlError(
        403,
        'Gestores de unidade só podem desativar vínculos de avaliadores.'
      );
    }

    targetSm.status = 'inactive';
    targetSm.updatedAt = new Date().toISOString();
    this.recordAudit(actorUserId, institutionId, 'DEACTIVATE_SITE_MEMBERSHIP', targetSm.id);
    return targetSm;
  }

  /**
   * Valida exclusão de avaliação finalizada (proibido para AVALIADOR).
   */
  assertCanDeleteAssessment(context: AccessContext, assessment: Assessment): void {
    const { effectiveRole } = this.requireApplicationSiteAccess(
      context.authenticatedUserId,
      context.activeInstitutionId,
      assessment.applicationSiteId ?? 'site_ufpr_lab_a',
      false
    );

    if (effectiveRole === 'AVALIADOR' && Boolean(assessment.completedAt)) {
      throw new AccessControlError(
        403,
        'Avaliadores não podem excluir avaliações finalizadas.'
      );
    }
  }

  /**
   * Filtra participantes conforme a regra de visibilidade:
   * - ADMIN: visualiza todas as informações disponíveis de todas as instituições (ou filtradas por instituição/unidade).
   * - GESTOR_UNIDADE: visualiza todas as unidades de aplicação de sua instituição.
   * - AVALIADOR: visualiza apenas a sua única unidade de aplicação (1:1).
   */
  filterParticipantsByScope(
    context: AccessContext,
    participants: Participant[]
  ): Participant[] {
    if (this.hasActiveAdminRole(context.authenticatedUserId)) {
      const byInstitution =
        context.activeInstitutionId === 'ALL'
          ? participants
          : participants.filter(
              (p) => (p.institutionId ?? 'inst_ufpr') === context.activeInstitutionId
            );

      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return byInstitution.filter((p) => {
          const singleSite = p.applicationSiteId ?? p.applicationSiteIds?.[0];
          return !singleSite || singleSite === context.activeApplicationSiteId;
        });
      }
      return byInstitution;
    }

    const membership = this.requireActiveInstitutionMembership(
      context.authenticatedUserId,
      context.activeInstitutionId
    );

    const institutionalParticipants = participants.filter(
      (p) => (p.institutionId ?? 'inst_ufpr') === context.activeInstitutionId
    );

    if (membership.role === 'ADMIN' || membership.role === 'GESTOR_UNIDADE') {
      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return institutionalParticipants.filter((p) => {
          const singleSite = p.applicationSiteId ?? p.applicationSiteIds?.[0];
          return !singleSite || singleSite === context.activeApplicationSiteId;
        });
      }
      return institutionalParticipants;
    }

    const authorizedSiteIds = new Set(
      this.getAccessibleApplicationSites(
        context.authenticatedUserId,
        context.activeInstitutionId
      ).map((s) => s.id)
    );

    return institutionalParticipants.filter((p) => {
      const singleSite = p.applicationSiteId ?? p.applicationSiteIds?.[0];
      if (!singleSite) {
        return false;
      }
      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return (
          authorizedSiteIds.has(context.activeApplicationSiteId) &&
          singleSite === context.activeApplicationSiteId
        );
      }
      return authorizedSiteIds.has(singleSite);
    });
  }

  /**
   * Registra um participante na instituição e na sua única unidade de aplicação (regra 1:1 de participante com instituição e unidade).
   */
  registerOrAssociateParticipant(
    context: AccessContext,
    applicationSiteId: string,
    participantInput: Participant,
    existingParticipants: Participant[]
  ): { participant: Participant; isNewRecord: boolean } {
    this.requireApplicationSiteAccess(
      context.authenticatedUserId,
      context.activeInstitutionId,
      applicationSiteId,
      true
    );

    const normalizedCpf = participantInput.cpf.replace(/\D/g, '');
    const existingInInstitution = existingParticipants.find(
      (p) =>
        (p.institutionId ?? 'inst_ufpr') === context.activeInstitutionId &&
        p.cpf.replace(/\D/g, '') === normalizedCpf
    );

    if (existingInInstitution) {
      const existingSiteId =
        existingInInstitution.applicationSiteId ??
        existingInInstitution.applicationSiteIds?.[0] ??
        applicationSiteId;

      if (existingSiteId !== applicationSiteId) {
        throw new AccessControlError(
          422,
          'Um participante pertence a apenas uma instituição e uma unidade de aplicação.'
        );
      }

      const updatedParticipant: Participant = {
        ...existingInInstitution,
        applicationSiteId: existingSiteId,
        applicationSiteIds: [existingSiteId],
        updatedAt: new Date().toISOString(),
      };
      return { participant: updatedParticipant, isNewRecord: false };
    }

    const newParticipant: Participant = {
      ...participantInput,
      institutionId: context.activeInstitutionId,
      institutionalCode:
        participantInput.institutionalCode ??
        `${context.activeInstitutionId.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      applicationSiteId,
      applicationSiteIds: [applicationSiteId],
      status: participantInput.status ?? 'active',
    };

    return { participant: newParticipant, isNewRecord: true };
  }

  /**
   * Valida o vínculo 1:1 do participante com sua única instituição e única unidade de aplicação.
   */
  associateParticipantWithSite(
    context: AccessContext,
    participant: Participant,
    targetApplicationSiteId: string
  ): Participant {
    const participantInstitutionId = participant.institutionId ?? 'inst_ufpr';
    if (participantInstitutionId !== context.activeInstitutionId) {
      throw new AccessControlError(
        403,
        'Violação de isolamento institucional: participante pertence a outra instituição.'
      );
    }

    this.requireApplicationSiteAccess(
      context.authenticatedUserId,
      context.activeInstitutionId,
      targetApplicationSiteId,
      true
    );

    const existingSiteId =
      participant.applicationSiteId ?? participant.applicationSiteIds?.[0];
    if (existingSiteId && existingSiteId !== targetApplicationSiteId) {
      throw new AccessControlError(
        422,
        'Um participante pertence a apenas uma instituição e uma unidade de aplicação.'
      );
    }

    return {
      ...participant,
      applicationSiteId: targetApplicationSiteId,
      applicationSiteIds: [targetApplicationSiteId],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Valida e cria uma avaliação aplicando as 10 regras obrigatórias da Seção 6.
   */
  validateAndBuildAssessment(
    context: AccessContext,
    participant: Participant,
    applicationSiteId: string,
    assessmentPayload: Omit<Assessment, 'evaluatorUserId' | 'institutionId' | 'applicationSiteId'>
  ): Assessment {
    const { site } = this.requireApplicationSiteAccess(
      context.authenticatedUserId,
      context.activeInstitutionId,
      applicationSiteId,
      true
    );

    const participantInstitutionId = participant.institutionId ?? 'inst_ufpr';
    if (participantInstitutionId !== context.activeInstitutionId || site.institutionId !== participantInstitutionId) {
      throw new AccessControlError(
        422,
        'Integridade institucional violada: a instituição da avaliação deve corresponder à instituição do participante e da unidade.'
      );
    }

    const participantSiteId =
      participant.applicationSiteId ?? participant.applicationSiteIds?.[0];
    if (participantSiteId && participantSiteId !== site.id) {
      throw new AccessControlError(
        422,
        'O participante pertence exclusivamente a outra unidade de aplicação.'
      );
    }

    if (participant.status === 'inactive') {
      throw new AccessControlError(
        422,
        'Não é permitido iniciar novas avaliações para participantes inativos.'
      );
    }

    return {
      ...assessmentPayload,
      institutionId: context.activeInstitutionId,
      applicationSiteId: site.id,
      evaluatorUserId: context.authenticatedUserId,
      professionalId: context.authenticatedUserId,
    };
  }

  /**
   * Filtra avaliações conforme a regra de visibilidade:
   * - ADMIN: visualiza todas as avaliações disponíveis de todas as instituições (ou filtradas por instituição/unidade).
   * - GESTOR_UNIDADE: visualiza todas as unidades de aplicação de sua instituição.
   * - AVALIADOR: visualiza apenas a sua única unidade de aplicação (1:1).
   */
  filterAssessmentsByScope(
    context: AccessContext,
    assessments: Assessment[]
  ): Assessment[] {
    if (this.hasActiveAdminRole(context.authenticatedUserId)) {
      const byInstitution =
        context.activeInstitutionId === 'ALL'
          ? assessments
          : assessments.filter(
              (a) => (a.institutionId ?? 'inst_ufpr') === context.activeInstitutionId
            );

      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return byInstitution.filter(
          (a) =>
            !a.applicationSiteId ||
            a.applicationSiteId === context.activeApplicationSiteId
        );
      }
      return byInstitution;
    }

    const membership = this.requireActiveInstitutionMembership(
      context.authenticatedUserId,
      context.activeInstitutionId
    );

    const institutionalAssessments = assessments.filter(
      (a) => (a.institutionId ?? 'inst_ufpr') === context.activeInstitutionId
    );

    if (membership.role === 'ADMIN' || membership.role === 'GESTOR_UNIDADE') {
      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return institutionalAssessments.filter(
          (a) =>
            !a.applicationSiteId ||
            a.applicationSiteId === context.activeApplicationSiteId
        );
      }
      return institutionalAssessments;
    }

    const authorizedSiteIds = new Set(
      this.siteMemberships
        .filter(
          (sm) => sm.institutionMembershipId === membership.id && sm.status === 'active'
        )
        .map((sm) => sm.applicationSiteId)
    );

    return institutionalAssessments.filter((a) => {
      const siteId = a.applicationSiteId ?? 'site_ufpr_lab_a';
      if (context.activeApplicationSiteId && context.activeApplicationSiteId !== 'ALL') {
        return (
          authorizedSiteIds.has(context.activeApplicationSiteId) &&
          siteId === context.activeApplicationSiteId
        );
      }
      return authorizedSiteIds.has(siteId);
    });
  }
}

export const defaultAccessControlService = new AccessControlService();
