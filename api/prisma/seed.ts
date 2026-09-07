import { fileURLToPath } from 'node:url';
import { createPrismaClient } from '../src/database/prisma.js';
import type {
  AuditEvent,
  Contact,
  FollowUpTask,
  Policy,
  PrismaClient,
  Renewal,
  Workspace,
} from '../src/generated/prisma/client.js';
import { SYNTHETIC_RENEWAL as S } from '../src/modules/renewals/domain.js';

const ALLOWED_DATABASE_URLS = new Set([
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public',
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public',
]);
const createdAt = new Date('2026-09-02T12:00:00.000Z');
const renewalDate = new Date('2027-01-15T00:00:00.000Z');
const dueAt = new Date('2026-12-15T15:00:00.000Z');
export const SYNTHETIC_RENEWAL_SEED = {
  workspace: {
    id: S.workspaceId,
    name: 'Harbor Demo Agency',
    sourceVersion: S.sourceVersion,
    sourceHash: S.sourceHash,
    createdAt,
  },
  contact: {
    id: S.contactId,
    workspaceId: S.workspaceId,
    displayName: 'Avery Harbor',
    createdAt,
  },
  policy: {
    id: S.policyId,
    workspaceId: S.workspaceId,
    contactId: S.contactId,
    displayLabel: 'Synthetic Term Policy',
    renewalDate,
    createdAt,
  },
  renewal: {
    id: S.renewalId,
    workspaceId: S.workspaceId,
    policyId: S.policyId,
    displayLabel: '2027 Synthetic Renewal',
    status: 'open',
    createdAt,
  },
  task: {
    id: S.taskId,
    workspaceId: S.workspaceId,
    renewalId: S.renewalId,
    title: 'Review synthetic renewal',
    status: 'pending',
    version: 1,
    dueAt,
    completedAt: null,
    createdAt,
  },
  creationAudit: {
    id: S.creationAuditId,
    workspaceId: S.workspaceId,
    actorId: S.actorId,
    eventType: 'renewal.created',
    recordId: S.renewalId,
    correlationId: S.correlationId,
    provenanceId: S.provenanceId,
    sourceVersion: S.sourceVersion,
    sourceHash: S.sourceHash,
    occurredAt: createdAt,
    createdAt,
  },
};

export interface SyntheticRenewalSeedInspection {
  fixed: {
    workspace: Workspace | null;
    contact: Contact | null;
    policy: Policy | null;
    renewal: Renewal | null;
    task: FollowUpTask | null;
    creationAudit: AuditEvent | null;
  };
  graph:
    | (Workspace & {
        contacts: Contact[];
        policies: Policy[];
        renewals: Renewal[];
        tasks: FollowUpTask[];
        auditEvents: AuditEvent[];
      })
    | null;
}

const drift = (): never => {
  throw new Error(
    'Synthetic renewal seed drift detected; refusing to overwrite',
  );
};

const isSameValue = (actual: unknown, expected: unknown) =>
  actual instanceof Date && expected instanceof Date
    ? actual.getTime() === expected.getTime()
    : actual === expected;

const matches = (actual: object, expected: object) =>
  Object.entries(expected).every(([key, value]) =>
    isSameValue((actual as Record<string, unknown>)[key], value),
  );

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export function classifySyntheticRenewalSeedState(
  inspection: SyntheticRenewalSeedInspection,
): 'empty' | 'pending' | 'completed' {
  const fixed = Object.values(inspection.fixed);
  if (fixed.every((record) => record === null)) {
    if (inspection.graph !== null) drift();
    return 'empty';
  }
  const { graph } = inspection;
  if (fixed.some((record) => record === null)) drift();
  const presentGraph = graph ?? drift();

  const fixture = SYNTHETIC_RENEWAL_SEED;
  if (
    !matches(inspection.fixed.workspace!, fixture.workspace) ||
    !matches(presentGraph, fixture.workspace) ||
    presentGraph.contacts.length !== 1 ||
    presentGraph.policies.length !== 1 ||
    presentGraph.renewals.length !== 1 ||
    presentGraph.tasks.length !== 1 ||
    !matches(inspection.fixed.contact!, fixture.contact) ||
    !matches(presentGraph.contacts[0], fixture.contact) ||
    !matches(inspection.fixed.policy!, fixture.policy) ||
    !matches(presentGraph.policies[0], fixture.policy) ||
    !matches(inspection.fixed.renewal!, fixture.renewal) ||
    !matches(presentGraph.renewals[0], fixture.renewal) ||
    !matches(inspection.fixed.creationAudit!, fixture.creationAudit) ||
    !matches(
      presentGraph.auditEvents.find(
        ({ id }) => id === fixture.creationAudit.id,
      ) ?? {},
      fixture.creationAudit,
    )
  )
    drift();

  const task = inspection.fixed.task!;
  if (!matches(presentGraph.tasks[0], task)) drift();
  if (matches(task, fixture.task) && presentGraph.auditEvents.length === 1)
    return 'pending';

  const completion = presentGraph.auditEvents.find(
    ({ eventType }) => eventType === 'task.completed',
  );
  const completedAt = task.completedAt;
  if (
    task.status !== 'completed' ||
    task.version !== 2 ||
    !completedAt ||
    !matches(task, {
      ...fixture.task,
      status: 'completed',
      version: 2,
      completedAt,
    }) ||
    presentGraph.auditEvents.length !== 2 ||
    !completion ||
    !isUuid(completion.id) ||
    !isUuid(completion.correlationId) ||
    completion.id === fixture.creationAudit.id ||
    completion.correlationId === fixture.creationAudit.correlationId ||
    !matches(completion, {
      workspaceId: S.workspaceId,
      actorId: S.actorId,
      eventType: 'task.completed',
      recordId: S.taskId,
      provenanceId: S.provenanceId,
      sourceVersion: S.sourceVersion,
      sourceHash: S.sourceHash,
      occurredAt: completedAt,
      createdAt: completedAt,
    })
  )
    drift();
  return 'completed';
}

export function requireSeedDatabaseUrl(value: string | undefined) {
  if (!value || !ALLOWED_DATABASE_URLS.has(value))
    throw new Error(
      'DATABASE_URL must be an approved synthetic local database URL',
    );
  return value;
}

export async function seedSyntheticRenewalGraph(client: PrismaClient) {
  return client.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('unlockedcrm.synthetic-renewal.seed.v1'))`;
    const fixed = {
      workspace: await tx.workspace.findUnique({
        where: { id: S.workspaceId },
      }),
      contact: await tx.contact.findUnique({ where: { id: S.contactId } }),
      policy: await tx.policy.findUnique({ where: { id: S.policyId } }),
      renewal: await tx.renewal.findUnique({ where: { id: S.renewalId } }),
      task: await tx.followUpTask.findUnique({ where: { id: S.taskId } }),
      creationAudit: await tx.auditEvent.findUnique({
        where: { id: S.creationAuditId },
      }),
    };
    const graph = fixed.workspace
      ? {
          ...fixed.workspace,
          contacts: await tx.contact.findMany({
            where: { workspaceId: S.workspaceId },
          }),
          policies: await tx.policy.findMany({
            where: { workspaceId: S.workspaceId },
          }),
          renewals: await tx.renewal.findMany({
            where: { workspaceId: S.workspaceId },
          }),
          tasks: await tx.followUpTask.findMany({
            where: { workspaceId: S.workspaceId },
          }),
          auditEvents: await tx.auditEvent.findMany({
            where: { workspaceId: S.workspaceId },
          }),
        }
      : null;
    if (classifySyntheticRenewalSeedState({ fixed, graph }) !== 'empty') return;

    const seed = SYNTHETIC_RENEWAL_SEED;
    await tx.workspace.create({ data: seed.workspace });
    await tx.contact.create({ data: seed.contact });
    await tx.policy.create({ data: seed.policy });
    await tx.renewal.create({ data: seed.renewal });
    await tx.followUpTask.create({ data: seed.task });
    await tx.auditEvent.create({ data: seed.creationAudit });
  });
}

async function main() {
  const client = createPrismaClient(
    requireSeedDatabaseUrl(process.env.DATABASE_URL),
  );
  try {
    await seedSyntheticRenewalGraph(client);
  } finally {
    await client.$disconnect();
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
