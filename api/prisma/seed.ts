import { fileURLToPath } from 'node:url';
import { createPrismaClient } from '../src/database/prisma.js';
import type { PrismaClient } from '../src/generated/prisma/client.js';
import { SYNTHETIC_RENEWAL as S } from '../src/modules/renewals/domain.js';

const ALLOWED_DATABASE_URLS = new Set([
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54329/unlockedcrm_dev?schema=public',
  'postgresql://unlockedcrm:synthetic-local-only@127.0.0.1:54330/unlockedcrm_test?schema=public',
]);
const createdAt = new Date('2026-09-02T12:00:00.000Z');
const renewalDate = new Date('2027-01-15T00:00:00.000Z');
const dueAt = new Date('2026-12-15T15:00:00.000Z');
const seed = {
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
  audit: {
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
    const existing = [
      await tx.workspace.findUnique({ where: { id: S.workspaceId } }),
      await tx.contact.findUnique({ where: { id: S.contactId } }),
      await tx.policy.findUnique({ where: { id: S.policyId } }),
      await tx.renewal.findUnique({ where: { id: S.renewalId } }),
      await tx.followUpTask.findUnique({ where: { id: S.taskId } }),
      await tx.auditEvent.findUnique({ where: { id: S.creationAuditId } }),
    ];
    if (existing.some(Boolean)) {
      if (JSON.stringify(existing) !== JSON.stringify(Object.values(seed)))
        throw new Error(
          'Synthetic renewal seed drift detected; refusing to overwrite',
        );
      return;
    }
    await tx.workspace.create({ data: seed.workspace });
    await tx.contact.create({ data: seed.contact });
    await tx.policy.create({ data: seed.policy });
    await tx.renewal.create({ data: seed.renewal });
    await tx.followUpTask.create({ data: seed.task });
    await tx.auditEvent.create({ data: seed.audit });
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
