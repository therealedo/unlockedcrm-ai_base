import { expect, test, type Route } from '@playwright/test';

const workspaceId = '10000000-0000-4000-8000-000000000001';
const contactId = '20000000-0000-4000-8000-000000000001';
const policyId = '30000000-0000-4000-8000-000000000001';
const managedId = (prefix: number, suffix: number) =>
  `${prefix}0000000-0000-4000-8000-${String(suffix).padStart(12, '0')}`;
const managedIds = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((prefix) => managedId(prefix, 1)),
  ...[2, 3, 4, 5, 6].map((prefix) => managedId(prefix, 2)),
  ...[2, 3, 4, 6].map((prefix) => managedId(prefix, 3)),
];

function renewalBody(items: unknown[]) {
  return {
    schemaVersion: 'renewal-workflow.v1',
    asOf: items.length ? '2026-09-07T08:56:12.175Z' : null,
    correlationId: '80000000-0000-4000-8000-000000000001',
    workspaceId,
    items,
  };
}

function managedRenewalItem({
  suffix = 1,
  taskStatus = 'completed',
  displayLabel = 'Synthetic Term Policy',
}: {
  suffix?: number;
  taskStatus?: 'pending' | 'completed' | null;
  displayLabel?: string;
} = {}) {
  const id = (prefix: number) =>
    `${prefix}0000000-0000-4000-8000-${String(suffix).padStart(12, '0')}`;
  const itemContactId = id(2);
  const itemPolicyId = id(3);
  const renewalId = id(4);
  return {
    source: { version: 'renewal-seed.v1', hash: 'synthetic-hash' },
    contact: { id: itemContactId, displayName: `Avery Harbor ${suffix}` },
    policy: {
      id: itemPolicyId,
      contactId: itemContactId,
      displayLabel,
      renewalDate: '2027-01-15',
    },
    renewal: {
      id: renewalId,
      policyId: itemPolicyId,
      displayLabel: 'Synthetic Annual Renewal',
      status: 'open',
    },
    followUpTask:
      taskStatus === null
        ? null
        : {
            id: id(5),
            renewalId,
            title: 'Review synthetic renewal',
            status: taskStatus,
            version: taskStatus === 'completed' ? 2 : 1,
            dueAt: '2027-01-01T12:00:00.000Z',
            completedAt:
              taskStatus === 'completed' ? '2026-09-07T08:56:12.175Z' : null,
          },
    auditEvents: [
      {
        id: id(6),
        type: 'renewal.created',
        occurredAt: '2026-09-01T12:00:00.000Z',
        actorId: '70000000-0000-4000-8000-000000000001',
        recordId: renewalId,
        correlationId: '80000000-0000-4000-8000-000000000001',
        provenanceId: '90000000-0000-4000-8000-000000000001',
      },
      ...(taskStatus === 'completed'
        ? [
            {
              id: id(7),
              type: 'task.completed',
              occurredAt: '2026-09-07T08:56:12.175Z',
              actorId: '70000000-0000-4000-8000-000000000001',
              recordId: id(5),
              correlationId: '80000000-0000-4000-8000-000000000001',
              provenanceId: '90000000-0000-4000-8000-000000000001',
            },
          ]
        : []),
    ],
    links: {
      home: '/',
      contact: `/contacts/${itemContactId}`,
      policy: `/policies/${itemPolicyId}`,
      renewals: '/policies/renewals',
      tasks: '/tasks',
      audit: '/analytics/audit',
    },
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('Unit 4D keeps six renewal surfaces linked to one cached projection', async ({
  page,
}) => {
  let requests = 0;
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  await page.route(pattern, async (route) => {
    requests += 1;
    await route.fulfill({
      status: 200,
      json: renewalBody([
        managedRenewalItem(),
        managedRenewalItem({
          suffix: 2,
          taskStatus: 'pending',
          displayLabel: 'Synthetic Indexed Policy',
        }),
        managedRenewalItem({
          suffix: 3,
          taskStatus: null,
          displayLabel: 'Synthetic Universal Policy',
        }),
      ]),
    });
  });

  await page.reload();
  await expect(
    page.getByRole('region', { name: 'Server-managed renewal summary' }),
  ).toBeVisible();
  for (const [label, value] of [
    ['Open renewals', '3'],
    ['Server-managed follow-ups', '2'],
    ['Pending follow-ups', '1'],
    ['Completed follow-ups', '1'],
    ['Renewal audit events', '4'],
  ]) {
    await expect(
      page.locator('article', { hasText: label }).locator('b'),
    ).toHaveText(value);
  }
  await expect(
    page.getByText("Today's Activity", { exact: true }),
  ).toBeVisible();

  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Contact detail' })
    .click();
  await expect(page).toHaveURL(`/contacts/${contactId}`);
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Policy detail' })
    .click();
  await expect(page).toHaveURL(`/policies/${policyId}`);
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Renewal Dashboard' })
    .click();
  await expect(page).toHaveURL('/policies/renewals');
  await expect(page.locator('.lp-side-content .lp-metrics article')).toHaveText(
    ['Open renewals3', 'Pending follow-ups1', 'Completed follow-ups1'],
  );
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Tasks' })
    .click();
  await expect(page).toHaveURL('/tasks');
  await expect(
    page.getByRole('region', { name: 'Server-managed renewal follow-ups' }),
  ).toContainText('Review synthetic renewal');
  await expect(
    page
      .getByRole('region', { name: 'Server-managed renewal follow-ups' })
      .locator('.lp-metrics article'),
  ).toHaveText([
    'Server-managed follow-ups2',
    'Pending follow-ups1',
    'Completed follow-ups1',
  ]);
  await expect(
    page.getByText('New Task', { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Analytics Audit' })
    .click();
  await expect(page).toHaveURL('/analytics/audit');
  await expect(
    page.getByRole('region', { name: 'Server-managed renewal audit' }),
  ).toContainText('renewal.created');
  await expect(
    page
      .getByRole('region', { name: 'Server-managed renewal audit' })
      .locator('.lp-metrics article'),
  ).toHaveText(['Renewal audit events4']);
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Home' })
    .click();
  await expect(page).toHaveURL('/');
  expect(requests).toBe(1);

  const persisted = await page.evaluate(() =>
    localStorage.getItem('unlockedcrm-live-parity-state-v1'),
  );
  expect(persisted).toContain('contact-mara-testwell');
  for (const id of managedIds) expect(persisted).not.toContain(id);
  await page.reload();
  await expect(
    page.locator('article', { hasText: 'Renewal audit events' }).locator('b'),
  ).toHaveText('4');
  expect(requests).toBe(2);
});

test('Unit 4D exposes honest loading, empty, error, and retry states on each new read', async ({
  page,
}) => {
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  let release!: () => void;
  let signalRequestArrival!: () => void;
  let loading = true;
  let retryAttempt = 0;
  let requests = 0;
  await page.route(pattern, async (route) => {
    requests += 1;
    if (loading) {
      await new Promise<void>((resolve) => {
        release = resolve;
        signalRequestArrival();
      });
      await route.fulfill({ status: 200, json: renewalBody([]) });
      return;
    }
    retryAttempt += 1;
    await route.fulfill(
      retryAttempt === 1
        ? { status: 503, json: { error: {} } }
        : { status: 200, json: renewalBody([managedRenewalItem()]) },
    );
  });

  for (const [path, readyText] of [
    ['/', 'Open renewals'],
    ['/tasks', 'Review synthetic renewal'],
    ['/analytics/audit', 'renewal.created'],
  ]) {
    loading = true;
    const requestArrived = new Promise<void>(
      (resolve) => (signalRequestArrival = resolve),
    );
    const navigation = page.goto(path);
    await expect(
      page.getByText('Loading server-managed renewals…'),
    ).toBeVisible();
    await requestArrived;
    release();
    await navigation;
    await expect(page.getByText('No server-managed renewals')).toBeVisible();
    await expect(page.getByText('Synthetic Term Policy')).toHaveCount(0);

    loading = false;
    retryAttempt = 0;
    await page.reload();
    await expect(page.getByRole('alert')).toContainText('could not be loaded');
    await expect(page.getByText('Synthetic Term Policy')).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Retry server-managed renewals' })
      .click();
    await expect(
      page.getByText(readyText, { exact: true }).first(),
    ).toBeVisible();
  }

  loading = false;
  retryAttempt = 1;
  for (const [path, readyText] of [
    ['/tasks', 'Review synthetic renewal'],
    ['/analytics/audit', 'renewal.created'],
  ]) {
    requests = 0;
    await page.goto(path);
    await expect(
      page.getByText(readyText, { exact: true }).first(),
    ).toBeVisible();
    expect(requests).toBe(1);
  }
});

test('Unit 4C projects policy detail and Renewal Dashboard from one cached graph', async ({
  page,
}) => {
  let requests = 0;
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  await page.route(pattern, async (route) => {
    requests += 1;
    await route.fulfill({
      status: 200,
      json: renewalBody([
        managedRenewalItem(),
        managedRenewalItem({
          suffix: 2,
          taskStatus: 'pending',
          displayLabel: 'Synthetic Indexed Policy',
        }),
        managedRenewalItem({
          suffix: 3,
          taskStatus: null,
          displayLabel: 'Synthetic Universal Policy',
        }),
      ]),
    });
  });

  await page.goto('/policies');
  await page
    .getByRole('button', { name: 'Synthetic Term Policy', exact: true })
    .click();
  await expect(page).toHaveURL(`/policies/${policyId}`);
  await expect(page.locator('h1')).toHaveText('Synthetic Term Policy');
  await expect(page.getByText('Avery Harbor 1', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Synthetic Annual Renewal', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Review synthetic renewal', { exact: true }),
  ).toBeVisible();
  await page
    .getByLabel('Managed renewal links')
    .getByRole('button', { name: 'Renewal Dashboard' })
    .click();

  await expect(page).toHaveURL('/policies/renewals');
  await expect(page.locator('h1')).toHaveText('Renewal Dashboard');
  await expect(page.getByText('Open renewals', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Completed follow-ups', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Avery Harbor 1', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Synthetic Term Policy', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('QA-MA-ACTIVE-001')).toHaveCount(0);
  await expect(
    page.locator('article', { hasText: 'Open renewals' }).locator('b'),
  ).toHaveText('3');
  await expect(
    page.locator('article', { hasText: 'Pending follow-ups' }).locator('b'),
  ).toHaveText('1');
  await expect(
    page.locator('article', { hasText: 'Completed follow-ups' }).locator('b'),
  ).toHaveText('1');
  expect(requests).toBe(1);
});

test('Unit 4C keeps dashboard and policy failures route-specific', async ({
  page,
}) => {
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  let responseStatus = 200;
  await page.route(pattern, (route) =>
    route.fulfill({ status: responseStatus, json: renewalBody([]) }),
  );
  await page.goto('/policies/renewals');
  await expect(page.getByText('No server-managed renewals')).toBeVisible();
  await expect(page.getByText('QA-MA-ACTIVE-001')).toHaveCount(0);

  await page.goto(`/policies/${policyId}`);
  await expect(page.locator('h1')).toHaveText('Policy');
  await expect(
    page.getByRole('heading', { name: 'Policy not found' }),
  ).toBeVisible();
  await page.evaluate(() => {
    history.pushState({}, '', '/policies/%E0%A4%A');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.locator('h1')).toHaveText('Policy');
  await expect(
    page.getByRole('heading', { name: 'Policy not found' }),
  ).toBeVisible();

  await page.waitForLoadState('networkidle');
  responseStatus = 404;
  await page.goto(`/policies/${policyId}`);
  await expect(
    page.getByRole('heading', { name: 'Policy not found' }),
  ).toBeVisible();
  await page.goto('/policies/renewals');
  await expect(page.getByRole('alert')).toContainText('could not be loaded');
  await expect(page.getByText('Contact not found')).toHaveCount(0);
  await expect(page.getByText('Policy not found')).toHaveCount(0);
});

test('Unit 4C retry replaces an invalid dashboard response with fresh rows', async ({
  page,
}) => {
  let attempt = 0;
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  await page.route(pattern, async (route) => {
    attempt += 1;
    await route.fulfill(
      attempt === 1
        ? { status: 200, json: { schemaVersion: 'renewal-workflow.v1' } }
        : {
            status: 200,
            json: renewalBody([
              managedRenewalItem(),
              managedRenewalItem({
                suffix: 2,
                taskStatus: 'pending',
                displayLabel: 'Synthetic Indexed Policy',
              }),
              managedRenewalItem({
                suffix: 3,
                taskStatus: 'pending',
                displayLabel: 'Synthetic Universal Policy',
              }),
              managedRenewalItem({
                suffix: 4,
                taskStatus: null,
                displayLabel: 'Synthetic Variable Policy',
              }),
            ]),
          },
    );
  });
  await page.goto('/policies/renewals');
  await expect(page.getByRole('alert')).toContainText('could not be loaded');
  await expect(page.getByText('Synthetic Term Policy')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Retry server-managed renewals' })
    .click();
  await expect(
    page.getByRole('button', { name: 'Synthetic Term Policy', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Open renewals', { exact: true })).toBeVisible();
  await expect(
    page.locator('article', { hasText: 'Open renewals' }).locator('b'),
  ).toHaveText('4');
  await expect(
    page.locator('article', { hasText: 'Pending follow-ups' }).locator('b'),
  ).toHaveText('2');
  await expect(
    page.locator('article', { hasText: 'Completed follow-ups' }).locator('b'),
  ).toHaveText('1');
  expect(attempt).toBe(2);
});

test('Unit 4C ignores a managed response after leaving its route', async ({
  page,
}) => {
  await page.addInitScript((id) => {
    const nativeFetch = window.fetch;
    window.fetch = (input, init) => {
      const url = input instanceof Request ? input.url : input.toString();
      if (!url.includes(`/api/v1/workspaces/${id}/renewals`))
        return nativeFetch(input, init);
      init?.signal?.addEventListener(
        'abort',
        () => (document.documentElement.dataset.renewalAbort = 'true'),
        { once: true },
      );
      return nativeFetch(input, { ...init, signal: undefined });
    };
  }, workspaceId);
  let release: (() => void) | undefined;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  let returning = false;
  let initialRequests = 0;
  let handledInitialResponses = 0;
  let freshRequests = 0;
  await page.route(
    `**/api/v1/workspaces/${workspaceId}/renewals`,
    async (route) => {
      if (!returning) {
        initialRequests += 1;
        await delayed;
        await route
          .fulfill({
            status: 200,
            json: renewalBody([
              managedRenewalItem({ displayLabel: 'Stale policy' }),
            ]),
          })
          .catch(() => undefined);
        handledInitialResponses += 1;
        return;
      }
      freshRequests += 1;
      await route.fulfill({
        status: 200,
        json: renewalBody([
          managedRenewalItem({ displayLabel: 'Fresh policy' }),
        ]),
      });
    },
  );
  await page.goto('/policies/renewals');
  await expect(
    page.getByText('Loading server-managed renewals…'),
  ).toBeVisible();
  await page.evaluate(
    () => delete document.documentElement.dataset.renewalAbort,
  );
  await page.evaluate(() => {
    history.pushState({}, '', '/commissions');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.locator('h1')).toHaveText('Commissions');
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.renewalAbort),
    )
    .toBe('true');
  await expect(page.getByText('Synthetic Term Policy')).toHaveCount(0);
  const initialRequestCount = initialRequests;
  returning = true;
  await page.evaluate(() => {
    history.pushState({}, '', '/policies/renewals');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(
    page.getByRole('button', { name: 'Fresh policy', exact: true }),
  ).toBeVisible();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  release?.();
  await expect.poll(() => handledInitialResponses).toBe(initialRequestCount);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await expect(
    page.getByRole('button', { name: 'Fresh policy', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Stale policy', { exact: true })).toHaveCount(0);
  expect(initialRequestCount).toBeGreaterThanOrEqual(1);
  expect(freshRequests).toBeGreaterThanOrEqual(1);
});

test('projects the seeded policy into its server-authoritative contact detail', async ({
  page,
}) => {
  await page.goto('/policies');
  await page.getByRole('button', { name: 'Avery Harbor', exact: true }).click();
  await expect(page).toHaveURL(`/contacts/${contactId}`);
  await expect(page.locator('h1')).toHaveText('Avery Harbor');
  await expect(
    page.getByText('Synthetic Term Policy', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/^(pending|completed)$/)).toBeVisible();
  await expect(page.getByText('QA-MA-ACTIVE-001', { exact: true })).toHaveCount(
    0,
  );
});

test('shows loading, empty, authority error, retry, and unknown-contact states without fallback', async ({
  page,
}) => {
  let attempt = 0;
  const pattern = `**/api/v1/workspaces/${workspaceId}/renewals`;
  const failTwice = async (route: Route) => {
    attempt += 1;
    if (attempt === 1)
      return route.fulfill({ status: 404, json: { error: {} } });
    if (attempt > 2) return route.fallback();
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.fulfill({ status: 503, json: { error: {} } });
  };
  await page.route(pattern, failTwice);
  await page.goto('/policies');
  await expect(page.getByRole('alert')).toContainText('could not be loaded');
  await expect(page.getByText('QA-MA-ACTIVE-001')).toBeVisible();
  await expect(page.getByText('Contact not found')).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByText('Loading server-managed renewals…'),
  ).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('could not be loaded');
  await expect(page.getByText('Synthetic Term Policy')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Retry server-managed renewals' })
    .click();
  await expect(page.getByText('Synthetic Term Policy')).toBeVisible();

  await page.unroute(pattern, failTwice);
  await page.route(pattern, (route) =>
    route.fulfill({ status: 200, json: renewalBody([]) }),
  );
  await page.reload();
  await expect(page.getByText('No server-managed renewals')).toBeVisible();
  await page.goto('/contacts/unknown-contact');
  await expect(
    page.getByRole('heading', { name: 'Contact not found' }),
  ).toBeVisible();
  await expect(page.getByText('Mara Testwell')).toHaveCount(0);
  await page.evaluate(() => {
    history.pushState({}, '', '/contacts/%E0%A4%A');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(
    page.getByRole('heading', { level: 1, name: 'Contact' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Contact not found' }),
  ).toBeVisible();
  await expect(page.getByText('Mara Testwell')).toHaveCount(0);
});

test('preserves local records and preferences while fixed server IDs never persist', async ({
  page,
}) => {
  await page.reload();
  await page.waitForFunction(() =>
    localStorage.getItem('unlockedcrm-live-parity-state-v1'),
  );
  await page.evaluate(
    ({ ids }) => {
      const stored = JSON.parse(
        localStorage.getItem('unlockedcrm-live-parity-state-v1') || '{}',
      );
      stored.contacts.push({ id: ids[1] });
      stored.policies.push({ id: ids[2] });
      localStorage.setItem(
        'unlockedcrm-live-parity-state-v1',
        JSON.stringify(stored),
      );
      localStorage.setItem('unlockedcrm-nav-collapsed', 'true');
    },
    { ids: managedIds },
  );
  await page.goto('/contacts');
  await expect(page.getByText('Mara Testwell', { exact: true })).toBeVisible();
  const persisted = await page.evaluate(() => ({
    data: localStorage.getItem('unlockedcrm-live-parity-state-v1'),
    collapsed: localStorage.getItem('unlockedcrm-nav-collapsed'),
  }));
  expect(persisted.collapsed).toBe('true');
  expect(persisted.data).toContain('contact-mara-testwell');
  for (const id of managedIds) expect(persisted.data).not.toContain(id);
});

test('reads the seeded renewal graph through the web proxy', async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const response = await fetch(
      '/api/v1/workspaces/10000000-0000-4000-8000-000000000001/renewals',
    );
    return { status: response.status, body: await response.json() };
  });
  expect(result.status).toBe(200);
  expect(result.body).toMatchObject({
    schemaVersion: 'renewal-workflow.v1',
    workspaceId: '10000000-0000-4000-8000-000000000001',
    items: [
      {
        contact: {
          id: '20000000-0000-4000-8000-000000000001',
          displayName: 'Avery Harbor',
        },
        policy: {
          id: '30000000-0000-4000-8000-000000000001',
          contactId: '20000000-0000-4000-8000-000000000001',
          displayLabel: 'Synthetic Term Policy',
        },
        renewal: {
          id: '40000000-0000-4000-8000-000000000001',
          policyId: '30000000-0000-4000-8000-000000000001',
          status: 'open',
        },
        followUpTask: {
          id: '50000000-0000-4000-8000-000000000001',
          renewalId: '40000000-0000-4000-8000-000000000001',
          status: 'pending',
          version: 1,
          completedAt: null,
        },
        auditEvents: [
          {
            id: '60000000-0000-4000-8000-000000000001',
            type: 'renewal.created',
            recordId: '40000000-0000-4000-8000-000000000001',
          },
        ],
      },
    ],
  });
});

test('renders the compact CRM workspace shell and dashboard actions', async ({
  page,
}) => {
  await page.goto('/dashboard');

  await expect(page).toHaveTitle('unLocked CRM Local');
  await expect(
    page.getByRole('heading', { name: 'Dashboard', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Switch workspace' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Make a call' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send SMS' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Ask unLocked', exact: true }),
  ).toBeVisible();
});

test('matches the populated live Contacts grid and persists a local contact', async ({
  page,
}) => {
  await page.goto('/contacts');

  await expect(
    page.getByRole('heading', { name: 'Contacts', exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByRole('button', { name: 'Lead Lists', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Family Trees' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'All Contacts' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'AI Upload' })).toBeVisible();
  await expect(page.getByText('2 records', { exact: true })).toBeVisible();

  for (const column of [
    'Person',
    'Phone',
    'Email',
    'Birth Date',
    'Gender',
    'Zip Code',
    'Connection Strength',
    'Last Interaction',
    'Tags',
    'Product Interest',
    'Lead Source',
    'Agent',
  ]) {
    await expect(
      page.getByRole('columnheader', { name: column }),
    ).toBeVisible();
  }

  await expect(page.getByText('Mara Testwell', { exact: true })).toBeVisible();
  await expect(page.getByText('Eli Sample', { exact: true })).toBeVisible();

  await page
    .getByRole('button', { name: 'Create Contact', exact: true })
    .click();
  await page.getByRole('menuitem', { name: 'Other' }).click();
  await page.getByLabel('First name').fill('Jordan');
  await page.getByLabel('Last name').fill('Rivera');
  await page.getByLabel('Email address').fill('jordan@example.com');
  await page.getByLabel('Phone number').fill('(305) 555-0199');
  await page.getByRole('button', { name: 'Save Contact', exact: true }).click();

  await expect(page.getByText('Jordan Rivera', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Jordan Rivera', { exact: true })).toBeVisible();
});

test('matches populated Pipeline, Tasks, and empty Calendar states', async ({
  page,
}) => {
  await page.goto('/pipeline');
  await expect(
    page.getByRole('heading', { name: 'Pipeline', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Board' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Table' })).toBeVisible();
  await expect(
    page.getByRole('combobox', { name: 'Pipeline', exact: true }),
  ).toHaveValue('Recruiting Pipeline');
  await expect(page.getByText('Eli Sample', { exact: true })).toBeVisible();
  await expect(page.getByText('Term Life', { exact: true })).toBeVisible();

  await page.goto('/tasks');
  await expect(page.getByRole('button', { name: 'All Tasks' })).toBeVisible();
  await expect(
    page.getByText('UI Sample – Follow Up', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Today', { exact: true })).toBeVisible();
  await expect(page.getByText('Unassigned', { exact: true })).toBeVisible();

  await page.goto('/calendar');
  await expect(page.getByRole('button', { name: 'Previous' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  await expect(
    page.getByRole('combobox', { name: 'Calendar view' }),
  ).toHaveValue('Week');
  await expect(
    page.getByRole('button', { name: 'Connect Calendar' }),
  ).toBeVisible();
  await expect(page.getByText('12 AM', { exact: true })).toBeVisible();
  await expect(page.getByText('11 PM', { exact: true })).toBeVisible();
});

test('renders the live Inbox empty two-pane hierarchy', async ({ page }) => {
  await page.goto('/inbox');

  await expect(
    page.getByRole('tab', { name: 'All', selected: true }),
  ).toBeVisible();
  await expect(
    page.getByText('0 conversations', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'No conversations yet' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'No conversation selected' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start New Conversation' }),
  ).toBeVisible();
});

test('matches Policies, Commissions, Booking Links, and Documents records', async ({
  page,
}) => {
  await page.goto('/policies');
  await expect(
    page.getByRole('button', { name: 'All Policies 1' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Mara Testwell' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'QA-MA-ACTIVE-001', exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('.lp-grid-shell')
      .filter({ hasText: 'QA-MA-ACTIVE-001' })
      .getByRole('columnheader', { name: 'Renewal Date' }),
  ).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Premium' })).toHaveCount(
    0,
  );

  await page.goto('/commissions');
  await expect(
    page.getByText('0 records', { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bulk Upload' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'No commission data yet' }),
  ).toBeVisible();

  await page.goto('/booking-links');
  await expect(
    page.getByRole('heading', { name: 'No booking links yet' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'New Folder' })).toBeVisible();

  await page.goto('/documents');
  await expect(
    page.getByRole('tab', { name: 'Documents', selected: true }),
  ).toBeVisible();
  await expect(
    page.getByText('UI Audit Samples', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('columnheader', { name: 'Carrier / Plan' }),
  ).toBeVisible();
});

test('renders the Analytics reports workspace instead of invented charts', async ({
  page,
}) => {
  await page.goto('/analytics');

  await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
  await expect(page.getByText('Total Calls', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Open Opportunities', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Activity Trends' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Outreach Metrics' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Revenue Insights' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Growth Metrics' }),
  ).toBeVisible();
});

test('matches the Automations, Campaigns, and Forms folder dashboards', async ({
  page,
}) => {
  await page.goto('/automations');
  await expect(page.getByRole('button', { name: 'All (8)' })).toBeVisible();
  await expect(
    page.getByText('Medicare Advantage', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Medicare Supplement', { exact: true }),
  ).toBeVisible();

  await page.goto('/campaigns');
  await expect(
    page.getByRole('button', { name: 'Create Campaign' }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Campaign Performance' }),
  ).toBeVisible();
  await expect(
    page.getByText('Email Conversion', { exact: true }),
  ).toBeVisible();

  await page.goto('/forms');
  await expect(
    page.getByText('0 forms · 2 folders', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Forms', selected: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Medicare Advantage Lead Intake', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Medicare Supplement (Medigap)', { exact: true }),
  ).toBeVisible();
});

test('matches the settled live Campaigns hierarchy and desktop geometry', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1707, height: 848 });
  await page.goto('/campaigns');

  await expect(
    page.getByRole('combobox', { name: 'All Agents' }),
  ).toBeDisabled();
  await expect(
    page.getByRole('heading', { name: 'Campaign Performance' }),
  ).toBeVisible();
  await expect(
    page
      .locator('.lp-campaign-performance')
      .getByRole('heading', { name: 'No Campaigns Yet' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Start creating campaigns to engage your audience and track performance metrics',
      { exact: true },
    ),
  ).toBeVisible();

  for (const heading of [
    'Campaign Health',
    'Engagement Trend',
    'Delivery Quality',
    'Engagement Summary',
    'Performance Analysis',
    'Recent Campaigns',
  ]) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }

  const moduleNav = await page.locator('.lp-module-nav').boundingBox();
  const performance = await page
    .locator('.lp-campaign-performance')
    .boundingBox();
  expect(moduleNav?.width).toBeGreaterThanOrEqual(220);
  expect(moduleNav?.width).toBeLessThanOrEqual(228);
  expect(performance?.height).toBeGreaterThanOrEqual(440);
  expect(
    await page.evaluate(() =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        ...Array.from(document.querySelectorAll<HTMLElement>('*')).map(
          (element) => element.scrollHeight,
        ),
      ),
    ),
  ).toBeGreaterThan(1800);
});

test('uses live shell hierarchy and keeps representative modules responsive', async ({
  page,
}) => {
  await page.goto('/ai-quoting');
  await expect(page.getByRole('heading', { name: 'AI Quoting' })).toHaveCount(
    1,
  );

  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'CRM' })).toHaveCount(0);
  await expect(page.getByLabel('Search settings')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Switch workspace' }),
  ).toBeVisible();

  await page.goto('/agent-ai');
  await expect(page.getByRole('button', { name: 'Test Call' })).toBeVisible();
  await expect(
    page
      .locator('.lp-agent-dashboard-header')
      .getByRole('button', { name: 'Create Campaign' }),
  ).toBeVisible();

  await page.goto('/org/dashboard');
  await expect(
    page.getByRole('heading', { level: 1, name: 'IMO/FMO' }),
  ).toBeVisible();
  await expect(page.getByRole('table')).toContainText('Annualized premium');

  for (const width of [1280, 1024, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/campaigns',
      '/pipeline',
      '/documents',
      '/aca-marketplace',
      '/org/dashboard',
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(
        page.getByRole('heading', { level: 1 }).first(),
      ).toBeInViewport();
    }
  }
});

test('reflows intermediate-width module content without internal clipping', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });

  await page.goto('/campaigns');
  const campaignHeading = await page
    .locator('.lp-campaign-performance .lp-panel-heading > div')
    .first()
    .boundingBox();
  expect.soft(campaignHeading?.width).toBeGreaterThanOrEqual(180);

  await page.goto('/agent-ai');
  const agentPanels = page.locator('.lp-agent-dashboard .lp-two-column > *');
  const firstAgentPanel = await agentPanels.nth(0).boundingBox();
  const secondAgentPanel = await agentPanels.nth(1).boundingBox();
  expect
    .soft(secondAgentPanel?.y)
    .toBeGreaterThanOrEqual(
      (firstAgentPanel?.y ?? 0) + (firstAgentPanel?.height ?? 0),
    );

  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/aca-marketplace');
  const overviewGrids = page.locator('.lp-two-column');
  for (let index = 0; index < (await overviewGrids.count()); index += 1) {
    expect
      .soft(
        await overviewGrids
          .nth(index)
          .evaluate(
            (element) => element.scrollWidth <= element.clientWidth + 1,
          ),
      )
      .toBe(true);
  }

  await page.goto('/commission-plus');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Auto-Sync Your Commissions',
    }),
  ).toBeVisible();
});

test('matches local-only AI and quoting mock surfaces', async ({ page }) => {
  await page.goto('/ai-quoting');
  await expect(
    page.getByRole('heading', { name: 'AI Quoting', level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Medigap AI', { exact: true })).toBeVisible();
  await expect(page.getByText('Upgrading', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Annuity Quote AI', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Share' })).toBeVisible();

  await page.goto('/underwriting');
  await expect(
    page.getByRole('heading', {
      name: 'Underwrite AI',
      exact: true,
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Select contact' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Add the case details and I'll track the rate class in real time.",
    ),
  ).toBeVisible();

  await page.goto('/agent-ai');
  await expect(
    page.getByRole('heading', { name: 'Agent AI', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Test Call' })).toBeVisible();
});

test('renders route-specific Phone, Email, quoting, insurance, and Commission+ workspaces', async ({
  page,
}) => {
  await page.goto('/phone-system');
  await expect(
    page.getByRole('heading', { name: 'Manage Numbers' }),
  ).toBeVisible();
  await expect(
    page.getByRole('tab', { name: 'Phone Numbers', selected: true }),
  ).toBeVisible();

  await page.goto('/email-services');
  await expect(
    page.getByRole('heading', { name: 'Email Suite' }),
  ).toBeVisible();
  await expect(page.getByText('Setup Required', { exact: true })).toBeVisible();

  await page.goto('/quoting');
  await expect(page.getByText('Private Plans', { exact: true })).toBeVisible();
  await expect(page.getByText('Annuity', { exact: true })).toBeVisible();

  await page.goto('/life');
  await expect(
    page.getByRole('heading', { name: 'Needs attention' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Saved quote pipeline' }),
  ).toBeVisible();

  await page.goto('/medicare');
  await expect(
    page.getByRole('heading', { name: 'Enrollment windows', level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Start a quote' }),
  ).toBeVisible();

  await page.goto('/aca-marketplace');
  await expect(
    page.getByText('Active ACA Leads', { exact: true }),
  ).toBeVisible();
  const needsAttention = page.locator('.lp-lead-list').first();
  await expect(
    needsAttention.getByText('Mara Testwell', { exact: true }),
  ).toBeVisible();
  await expect(
    needsAttention.getByText('Eli Sample', { exact: true }),
  ).toBeVisible();

  await page.goto('/commission-plus');
  await expect(
    page.getByRole('heading', { name: 'Auto-Sync Your Commissions' }),
  ).toBeVisible();
  await expect(
    page.getByText('300+ Insurance Carriers', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'How-To Tutorials' }),
  ).toBeVisible();
});

test('covers the remaining assistant, settings, agency, organization, and platform surfaces', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Good evening/ }),
  ).toBeVisible();

  await page.goto('/unlocked-ai');
  await expect(
    page.getByText('Burning the midnight oil, Brenda?', { exact: true }),
  ).toBeVisible();

  await page.goto('/settings');
  await expect(page.getByLabel('Search settings')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Workspace settings' }),
  ).toBeVisible();

  await page.goto('/agency');
  await expect(
    page.getByRole('heading', { name: 'Team performance' }),
  ).toBeVisible();

  await page.goto('/org/dashboard');
  await expect(
    page.getByRole('heading', { name: 'Carrier reach' }),
  ).toBeVisible();
  await expect(page.getByText('Humana', { exact: true })).toBeVisible();

  await page.goto('/more');
  await expect(
    page.getByRole('heading', { name: 'Platform', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Integrations', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Policy Analyzer', { exact: true }),
  ).toBeVisible();
});

test('opens Agency, IMO/FMO, and More as rail-controlled workspace menus', async ({
  page,
}) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Agency', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Agency' })).toBeVisible();
  await expect(
    page.getByText('Team, production, and operations', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close Agency' }).click();

  await page.getByRole('button', { name: 'IMO/FMO', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'IMO/FMO' })).toBeVisible();
  await expect(
    page.getByText('Downline organizations, agencies, and agents', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Close IMO/FMO' }).click();

  await page.getByRole('button', { name: 'More', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'More' })).toBeVisible();
  await expect(
    page.getByText('Jump to a tool, or manage what stays on your sidebar.', {
      exact: true,
    }),
  ).toBeVisible();
});

test('supports navigation personalization and global search', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Customize', exact: true }).click();
  await expect(
    page.getByRole('dialog', { name: 'Customize navigation' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Icons only', exact: true }).click();
  await page
    .getByRole('button', { name: 'Close customization', exact: true })
    .click();

  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.getByLabel('Search your CRM').fill('policy');
  await expect(
    page.getByText('Policies', { exact: true }).first(),
  ).toBeVisible();
});
