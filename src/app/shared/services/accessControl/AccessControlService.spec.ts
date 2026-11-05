import {
  AccessControlError,
  AccessControlService,
} from './AccessControlService';
import { Assessment, Participant } from '../../types';

export type TestScenarioResult = {
  scenarioNumber: number;
  title: string;
  passed: boolean;
  details: string;
};

const TEST_PARTICIPANTS: Participant[] = [
  {
    id: 'part_01',
    institutionId: 'inst_ufpr',
    institutionalCode: 'UFPR-2025-001',
    applicationSiteId: 'site_ufpr_lab_a',
    applicationSiteIds: ['site_ufpr_lab_a'],
    status: 'active',
    fullName: 'Manuela Silva',
    birthDate: '1958-03-15',
    biologicalSex: 'female',
    cpf: '12345678900',
    createdAt: '2025-08-01T10:00:00.000Z',
    updatedAt: '2025-08-01T10:00:00.000Z',
  },
  {
    id: 'part_02',
    institutionId: 'inst_ufpr',
    institutionalCode: 'UFPR-2025-002',
    applicationSiteId: 'site_ufpr_lab_a',
    applicationSiteIds: ['site_ufpr_lab_a'],
    status: 'active',
    fullName: 'João Oliveira',
    birthDate: '1954-07-22',
    biologicalSex: 'male',
    cpf: '98765432111',
    createdAt: '2025-08-05T14:30:00.000Z',
    updatedAt: '2025-08-05T14:30:00.000Z',
  },
  {
    id: 'part_04',
    institutionId: 'inst_ufpr',
    institutionalCode: 'UFPR-2025-004',
    applicationSiteId: 'site_ufpr_amb_b',
    applicationSiteIds: ['site_ufpr_amb_b'],
    status: 'active',
    fullName: 'Carlos Pereira',
    birthDate: '1946-02-18',
    biologicalSex: 'male',
    cpf: '32165498733',
    createdAt: '2025-08-10T11:00:00.000Z',
    updatedAt: '2025-08-10T11:00:00.000Z',
  },
  {
    id: 'part_05',
    institutionId: 'inst_puc',
    institutionalCode: 'PUC-2025-001',
    applicationSiteId: 'site_puc_clinica',
    applicationSiteIds: ['site_puc_clinica'],
    status: 'active',
    fullName: 'Ana Rodrigues',
    birthDate: '1961-09-30',
    biologicalSex: 'female',
    cpf: '15975348644',
    createdAt: '2025-08-12T16:00:00.000Z',
    updatedAt: '2025-08-12T16:00:00.000Z',
  },
];

const TEST_ASSESSMENTS: Assessment[] = [
  {
    id: 'eval_01',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_lab_a',
    participantId: 'part_01',
    professionalId: 'prof_demo_01',
    evaluatorUserId: 'prof_demo_01',
    protocolId: '30sSTS',
    protocolVersionId: '30sSTS-v1.0',
    startedAt: '2025-08-12T14:30:00.000Z',
    completedAt: '2025-08-12T14:30:30.000Z',
    durationSeconds: 30,
    repetitions: 12,
    resultValue: 12,
    resultUnit: 'repetições',
    syncStatus: 'synced',
    createdAt: '2025-08-12T14:30:30.000Z',
  },
  {
    id: 'eval_06',
    institutionId: 'inst_ufpr',
    applicationSiteId: 'site_ufpr_amb_b',
    participantId: 'part_04',
    professionalId: 'prof_01',
    evaluatorUserId: 'prof_01',
    protocolId: 'IVCF-20',
    protocolVersionId: 'IVCF-20-v1.0',
    startedAt: '2025-08-05T11:02:00.000Z',
    completedAt: '2025-08-05T11:10:00.000Z',
    resultValue: 19,
    resultUnit: 'pontos',
    syncStatus: 'pending',
    createdAt: '2025-08-05T11:10:00.000Z',
  },
];

function assertCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function expectAccessError(
  fn: () => unknown,
  expectedStatus: 401 | 403 | 404 | 409 | 422,
): AccessControlError {
  try {
    fn();
  } catch (err) {
    if (err instanceof AccessControlError) {
      assertCondition(
        err.statusCode === expectedStatus,
        `Esperado HTTP ${expectedStatus}, mas recebeu ${err.statusCode}: ${err.message}`,
      );
      return err;
    }
    throw err;
  }
  throw new Error(`Esperava AccessControlError(${expectedStatus}), mas nenhuma exceção foi lançada.`);
}

export function runMultiInstitutionalTestSuite(): TestScenarioResult[] {
  const results: TestScenarioResult[] = [];

  // Cenário 1: Admin visualizando todas as instituições e gerenciando sua instituição
  {
    const service = new AccessControlService();
    const allInstitutions = service.getAccessibleInstitutions('prof_01');
    const allParticipantsForAdmin = service.filterParticipantsByScope(
      {
        authenticatedUserId: 'prof_01',
        activeInstitutionId: 'ALL',
      },
      TEST_PARTICIPANTS,
    );
    assertCondition(
      allInstitutions.length === 3 && allParticipantsForAdmin.length === TEST_PARTICIPANTS.length,
      'Admin deve visualizar todas as informações disponíveis de todas as instituições',
    );

    const ownSite = service.createApplicationSite('prof_01', 'inst_ufpr', {
      name: 'Laboratório de Marcha UFPR',
      description: 'Análise cinemática',
      address: 'Curitiba - PR',
    });
    assertCondition(ownSite.institutionId === 'inst_ufpr', 'Admin UFPR deve criar unidade na UFPR');

    const crossInstErr = expectAccessError(
      () =>
        service.createApplicationSite('prof_01', 'inst_unesp', {
          name: 'Unidade Indevida na UNESP',
          description: 'Tentativa cruzada',
          address: 'Presidente Prudente - SP',
        }),
      403,
    );

    results.push({
      scenarioNumber: 1,
      title: 'Admin visualizando todas as instituições e gerenciando unidades',
      passed: true,
      details: `Admin visualizou ${allInstitutions.length} instituições e ${allParticipantsForAdmin.length} participantes globais; unidade criada na UFPR (${ownSite.id}) e criação sem vínculo bloqueada com HTTP ${crossInstErr.statusCode}.`,
    });
  }

  // Cenário 2: Impedir remoção do último Admin ativo
  {
    const service = new AccessControlService();
    // im_prof01_ufpr é o único ADMIN ativo na UFPR
    const err = expectAccessError(
      () =>
        service.updateInstitutionMembership('prof_01', 'inst_ufpr', 'im_prof01_ufpr', {
          status: 'inactive',
        }),
      422,
    );

    results.push({
      scenarioNumber: 2,
      title: 'Impedir remoção do último Admin ativo',
      passed: true,
      details: `Remoção do último ADMIN bloqueada com HTTP ${err.statusCode}: "${err.message}".`,
    });
  }

  // Cenário 3: Gestor visualizando todas as unidades de aplicação de sua instituição
  {
    const service = new AccessControlService();
    const gestorInstMem = service.assignInstitutionMembership(
      'prof_01',
      'inst_ufpr',
      'prof_gestor_lab_a',
      'GESTOR_UNIDADE',
    );
    service.assignApplicationSiteMembership(
      'prof_01',
      'inst_ufpr',
      gestorInstMem.id,
      'site_ufpr_lab_a',
      'GESTOR_UNIDADE',
    );

    const visibleSites = service.getAccessibleApplicationSites('prof_gestor_lab_a', 'inst_ufpr');
    const visibleInstitutionParticipants = service.filterParticipantsByScope(
      {
        authenticatedUserId: 'prof_gestor_lab_a',
        activeInstitutionId: 'inst_ufpr',
      },
      TEST_PARTICIPANTS,
    );
    assertCondition(
      visibleSites.length === 2 && visibleInstitutionParticipants.length === 3,
      'Gestor deve visualizar todas as unidades de aplicação (Lab A e Amb B) e participantes de sua instituição',
    );

    const forbiddenCrossInstErr = expectAccessError(
      () =>
        service.filterParticipantsByScope(
          {
            authenticatedUserId: 'prof_gestor_lab_a',
            activeInstitutionId: 'inst_puc',
          },
          TEST_PARTICIPANTS,
        ),
      403,
    );

    results.push({
      scenarioNumber: 3,
      title: 'Gestor visualizando todas as unidades de aplicação de sua instituição',
      passed: true,
      details: `Gestor visualizou todas as ${visibleSites.length} unidades da UFPR (${visibleInstitutionParticipants.length} participantes) e teve acesso bloqueado à outra instituição com HTTP ${forbiddenCrossInstErr.statusCode}.`,
    });
  }

  // Cenário 4: Gestor Unidade impedido de atribuir papel Admin ou Gestor Unidade
  {
    const service = new AccessControlService();
    const gestorInstMem = service.assignInstitutionMembership(
      'prof_01',
      'inst_ufpr',
      'prof_gestor_01',
      'GESTOR_UNIDADE',
    );
    service.assignApplicationSiteMembership(
      'prof_01',
      'inst_ufpr',
      gestorInstMem.id,
      'site_ufpr_lab_a',
      'GESTOR_UNIDADE',
    );
    const evalInstMem = service.assignInstitutionMembership(
      'prof_01',
      'inst_ufpr',
      'prof_eval_01',
      'AVALIADOR',
    );

    const errAdmin = expectAccessError(
      () =>
        service.assignInstitutionMembership(
          'prof_gestor_01',
          'inst_ufpr',
          'prof_novo_admin',
          'ADMIN',
        ),
      403,
    );
    const errGestor = expectAccessError(
      () =>
        service.assignApplicationSiteMembership(
          'prof_gestor_01',
          'inst_ufpr',
          evalInstMem.id,
          'site_ufpr_lab_a',
          'GESTOR_UNIDADE',
        ),
      403,
    );

    results.push({
      scenarioNumber: 4,
      title: 'Gestor Unidade impedido de atribuir papel Admin ou Gestor Unidade',
      passed: true,
      details: `Atribuição de ADMIN (HTTP ${errAdmin.statusCode}) e GESTOR_UNIDADE (HTTP ${errGestor.statusCode}) bloqueadas pelo RoleGuard.`,
    });
  }

  // Cenário 5: Avaliador acessando apenas sua única unidade e instituição autorizada (e bloqueado ao tentar vincular a uma 2ª instituição ou 2ª unidade)
  {
    const service = new AccessControlService();
    // prof_demo_01 já é AVALIADOR em inst_ufpr -> site_ufpr_lab_a
    const labAssessments = service.filterAssessmentsByScope(
      {
        authenticatedUserId: 'prof_demo_01',
        activeInstitutionId: 'inst_ufpr',
        activeApplicationSiteId: 'site_ufpr_lab_a',
      },
      TEST_ASSESSMENTS,
    );
    assertCondition(
      labAssessments.length > 0 &&
        labAssessments.every((a: Assessment) => a.applicationSiteId === 'site_ufpr_lab_a'),
      'Avaliador deve ver apenas avaliações de sua única unidade site_ufpr_lab_a',
    );

    // Bloqueio de acesso a outra unidade da mesma instituição
    const ambErr = expectAccessError(
      () =>
        service.requireApplicationSiteAccess(
          'prof_demo_01',
          'inst_ufpr',
          'site_ufpr_amb_b',
          true,
        ),
      403,
    );

    // Bloqueio ao tentar vincular o AVALIADOR a uma segunda unidade de aplicação (regra 1:1 de unidade)
    const secondSiteErr = expectAccessError(
      () =>
        service.assignApplicationSiteMembership(
          'prof_01',
          'inst_ufpr',
          'im_demo_ufpr',
          'site_ufpr_amb_b',
          'AVALIADOR',
        ),
      422,
    );

    // Bloqueio ao tentar vincular o AVALIADOR a uma segunda instituição (regra 1:1 de instituição)
    const secondInstErr = expectAccessError(
      () =>
        service.assignInstitutionMembership(
          'prof_admin_puc',
          'inst_puc',
          'prof_demo_01',
          'AVALIADOR',
        ),
      422,
    );

    results.push({
      scenarioNumber: 5,
      title: 'Avaliador restrito a apenas 1 instituição e 1 unidade de aplicação autorizada',
      passed: true,
      details: `Avaliador acessou apenas site_ufpr_lab_a; acesso a site_ufpr_amb_b negado (HTTP ${ambErr.statusCode}), 2ª unidade bloqueada (HTTP ${secondSiteErr.statusCode}) e 2ª instituição bloqueada (HTTP ${secondInstErr.statusCode}).`,
    });
  }

  // Cenário 6: Avaliador realizando avaliação em sua unidade vinculada
  {
    const service = new AccessControlService();
    const participant = TEST_PARTICIPANTS[0];
    const created = service.validateAndBuildAssessment(
      {
        authenticatedUserId: 'prof_demo_01',
        activeInstitutionId: 'inst_ufpr',
        activeApplicationSiteId: 'site_ufpr_lab_a',
      },
      participant,
      'site_ufpr_lab_a',
      {
        id: 'eval_test_06',
        participantId: participant.id,
        professionalId: 'spoofed_frontend_id',
        protocolId: 'TUG',
        protocolVersionId: 'TUG-v1.0',
        startedAt: '2026-10-30T10:00:00.000Z',
        completedAt: '2026-10-30T10:00:10.000Z',
        durationSeconds: 10,
        resultValue: 10,
        resultUnit: 'segundos',
        syncStatus: 'synced',
        createdAt: '2026-10-30T10:00:10.000Z',
      },
    );

    assertCondition(
      created.evaluatorUserId === 'prof_demo_01' && created.professionalId === 'prof_demo_01',
      'Backend deve ignorar evaluatorUserId do frontend e usar o usuário autenticado',
    );

    results.push({
      scenarioNumber: 6,
      title: 'Avaliador realizando avaliação em unidade vinculada (ignorando evaluatorUserId do frontend)',
      passed: true,
      details: `Avaliação ${created.id} registrada com evaluatorUserId="${created.evaluatorUserId}" extraído da sessão autenticada.`,
    });
  }

  // Cenário 7: Avaliador bloqueado ao tentar avaliar em unidade não vinculada
  {
    const service = new AccessControlService();
    const participant = TEST_PARTICIPANTS[2]; // Carlos Pereira (site_ufpr_amb_b)
    const err = expectAccessError(
      () =>
        service.validateAndBuildAssessment(
          {
            authenticatedUserId: 'prof_demo_01',
            activeInstitutionId: 'inst_ufpr',
            activeApplicationSiteId: 'site_ufpr_amb_b',
          },
          participant,
          'site_ufpr_amb_b',
          {
            id: 'eval_test_07',
            participantId: participant.id,
            professionalId: 'prof_demo_01',
            protocolId: '30sSTS',
            startedAt: '2026-10-30T10:05:00.000Z',
            completedAt: '2026-10-30T10:05:30.000Z',
            resultValue: 14,
            resultUnit: 'repetições',
            syncStatus: 'pending',
            createdAt: '2026-10-30T10:05:30.000Z',
          },
        ),
      403,
    );

    results.push({
      scenarioNumber: 7,
      title: 'Avaliador bloqueado ao tentar avaliar em unidade não vinculada',
      passed: true,
      details: `Tentativa em site_ufpr_amb_b bloqueada com HTTP ${err.statusCode} ("${err.message}").`,
    });
  }

  // Cenário 8: Bloqueio de acesso entre instituições diferentes
  {
    const service = new AccessControlService();
    const pucParticipant = TEST_PARTICIPANTS[3]; // Ana Rodrigues (inst_puc)

    const errScope = expectAccessError(
      () =>
        service.filterParticipantsByScope(
          {
            authenticatedUserId: 'prof_demo_01',
            activeInstitutionId: 'inst_puc',
          },
          TEST_PARTICIPANTS,
        ),
      403,
    );

    const errCrossAssoc = expectAccessError(
      () =>
        service.associateParticipantWithSite(
          {
            authenticatedUserId: 'prof_01',
            activeInstitutionId: 'inst_ufpr',
          },
          pucParticipant,
          'site_ufpr_lab_a',
        ),
      403,
    );

    results.push({
      scenarioNumber: 8,
      title: 'Bloqueio de acesso e associação entre instituições diferentes',
      passed: true,
      details: `Consulta cruzada bloqueada com HTTP ${errScope.statusCode} e associação interinstitucional rejeitada com HTTP ${errCrossAssoc.statusCode}.`,
    });
  }

  // Cenário 9: Participante vinculado exclusivamente a 1 instituição e 1 unidade de aplicação (1:1)
  {
    const service = new AccessControlService();
    const listCopy: Participant[] = TEST_PARTICIPANTS.map((p) => ({
      ...p,
      applicationSiteIds: [...(p.applicationSiteIds ?? [])],
    }));
    const joaoBefore = listCopy.find((p) => p.id === 'part_02')!;

    // Re-registro na mesma unidade mantém ID único sem duplicar
    const sameSiteResult = service.registerOrAssociateParticipant(
      {
        authenticatedUserId: 'prof_01',
        activeInstitutionId: 'inst_ufpr',
        activeApplicationSiteId: 'site_ufpr_lab_a',
      },
      'site_ufpr_lab_a',
      joaoBefore,
      listCopy,
    );

    assertCondition(!sameSiteResult.isNewRecord, 'Não deve criar registro duplicado de participante na mesma unidade');
    assertCondition(
      sameSiteResult.participant.applicationSiteId === 'site_ufpr_lab_a',
      'Participante deve permanecer vinculado exclusivamente à sua unidade site_ufpr_lab_a',
    );

    // Tentativa de associar participante existente a uma 2ª unidade de aplicação deve ser bloqueada (HTTP 422)
    const secondSiteParticipantErr = expectAccessError(
      () =>
        service.registerOrAssociateParticipant(
          {
            authenticatedUserId: 'prof_01',
            activeInstitutionId: 'inst_ufpr',
            activeApplicationSiteId: 'site_ufpr_amb_b',
          },
          'site_ufpr_amb_b',
          joaoBefore,
          listCopy,
        ),
      422,
    );

    results.push({
      scenarioNumber: 9,
      title: 'Participante pertence exclusivamente a 1 instituição e 1 unidade de aplicação (1:1)',
      passed: true,
      details: `Participante ${sameSiteResult.participant.id} mantido em ${sameSiteResult.participant.applicationSiteId} sem duplicação; associação a 2ª unidade bloqueada com HTTP ${secondSiteParticipantErr.statusCode} ("${secondSiteParticipantErr.message}").`,
    });
  }

  // Cenário 10: Usuário (Admin / Gestor) com vínculos em múltiplas instituições operando com permissões distintas
  {
    const service = new AccessControlService();
    // prof_01 é ADMIN na UFPR e GESTOR_UNIDADE na PUC (já que AVALIADOR é exclusivo de 1 instituição e 1 unidade)
    const ufprMembership = service.requireActiveInstitutionMembership('prof_01', 'inst_ufpr');
    const pucMembership = service.requireActiveInstitutionMembership('prof_01', 'inst_puc');

    assertCondition(ufprMembership.role === 'ADMIN', 'Em inst_ufpr deve operar como ADMIN');
    assertCondition(pucMembership.role === 'GESTOR_UNIDADE', 'Em inst_puc deve operar como GESTOR_UNIDADE');

    const createdUfprSite = service.createApplicationSite('prof_01', 'inst_ufpr', {
      name: 'Unidade Avançada UFPR',
    });
    assertCondition(createdUfprSite.status === 'active', 'Criou unidade na UFPR como ADMIN');

    const pucErr = expectAccessError(
      () =>
        service.createApplicationSite('prof_01', 'inst_puc', {
          name: 'Unidade Não Autorizada PUC',
        }),
      403,
    );

    results.push({
      scenarioNumber: 10,
      title: 'Usuário com vínculos em múltiplas instituições operando com permissões distintas',
      passed: true,
      details: `Usuário prof_01 operou como ${ufprMembership.role} na UFPR (criou unidade) e como ${pucMembership.role} na PUC (criação de unidade bloqueada com HTTP ${pucErr.statusCode}).`,
    });
  }

  // Cenário 11: Preservação das avaliações históricas após revogação de acesso do avaliador
  {
    const service = new AccessControlService();
    const assessmentsList: Assessment[] = [...TEST_ASSESSMENTS];

    const newEval = service.validateAndBuildAssessment(
      {
        authenticatedUserId: 'prof_demo_01',
        activeInstitutionId: 'inst_ufpr',
        activeApplicationSiteId: 'site_ufpr_lab_a',
      },
      TEST_PARTICIPANTS[0],
      'site_ufpr_lab_a',
      {
        id: 'eval_hist_preserve',
        participantId: 'part_01',
        professionalId: 'prof_demo_01',
        protocolId: 'TUG',
        startedAt: '2026-10-30T11:00:00.000Z',
        completedAt: '2026-10-30T11:00:09.500Z',
        resultValue: 9.5,
        resultUnit: 'segundos',
        syncStatus: 'synced',
        createdAt: '2026-10-30T11:00:09.500Z',
      },
    );
    assessmentsList.unshift(newEval);

    const deleteByEvalErr = expectAccessError(
      () =>
        service.assertCanDeleteAssessment(
          {
            authenticatedUserId: 'prof_demo_01',
            activeInstitutionId: 'inst_ufpr',
            activeApplicationSiteId: 'site_ufpr_lab_a',
          },
          newEval,
        ),
      403,
    );
    assertCondition(deleteByEvalErr.statusCode === 403, 'Avaliador não pode excluir avaliação finalizada');

    // Desativa o vínculo do avaliador prof_demo_01 na unidade site_ufpr_lab_a
    service.deactivateSiteMembership('prof_01', 'inst_ufpr', 'sm_demo_ufpr_lab_a');

    const afterRevokeErr = expectAccessError(
      () =>
        service.validateAndBuildAssessment(
          {
            authenticatedUserId: 'prof_demo_01',
            activeInstitutionId: 'inst_ufpr',
            activeApplicationSiteId: 'site_ufpr_lab_a',
          },
          TEST_PARTICIPANTS[0],
          'site_ufpr_lab_a',
          {
            id: 'eval_after_revoke',
            participantId: 'part_01',
            professionalId: 'prof_demo_01',
            protocolId: 'TUG',
            startedAt: '2026-10-30T12:00:00.000Z',
            completedAt: '2026-10-30T12:00:10.000Z',
            resultValue: 10,
            resultUnit: 'segundos',
            syncStatus: 'synced',
            createdAt: '2026-10-30T12:00:10.000Z',
          },
        ),
      403,
    );

    const scopedHistory = service.filterAssessmentsByScope(
      {
        authenticatedUserId: 'prof_01',
        activeInstitutionId: 'inst_ufpr',
        activeApplicationSiteId: 'site_ufpr_lab_a',
      },
      assessmentsList,
    );
    const preservedEval = scopedHistory.find((a: Assessment) => a.id === 'eval_hist_preserve');
    assertCondition(
      Boolean(preservedEval && preservedEval.evaluatorUserId === 'prof_demo_01'),
      'Avaliação histórica deve permanecer preservada após desativação do vínculo do avaliador',
    );

    results.push({
      scenarioNumber: 11,
      title: 'Preservação das avaliações históricas após revogação de acesso do avaliador',
      passed: true,
      details: `Vínculo revogado (novas avaliações bloqueadas com HTTP ${afterRevokeErr.statusCode}), mas avaliação histórica ${preservedEval?.id} preservada com evaluatorUserId="${preservedEval?.evaluatorUserId}".`,
    });
  }

  return results;
}
