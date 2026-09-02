import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
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
    page.getByRole('columnheader', { name: 'Renewal Date' }),
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
