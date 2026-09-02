'use client';

import {
  BadgeDollarSign,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Filter,
  Folder,
  Grid2X2,
  Mail,
  MessageSquareText,
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Upload,
  Users,
  WandSparkles,
  X,
} from 'lucide-react';
import { type CSSProperties, type ReactNode, useState } from 'react';

import { type CrmData, PIPELINE_STAGES, currency } from '@/lib/crm-data';

type ParityRouterProps = {
  route: string;
  data: CrmData;
  navigate: (path: string) => void;
  pipelineView: string;
  taskView: string;
  calendarView: string;
  setPipelineView: (view: string) => void;
  setTaskView: (view: string) => void;
  setCalendarView: (view: string) => void;
  openContact: () => void;
  openTask: () => void;
  openOpportunity: () => void;
  openAppointment: () => void;
  openPolicy: () => void;
  openCommission: () => void;
  openBooking: () => void;
};

type ActionButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
};

function ActionButton({
  children,
  onClick,
  primary = false,
  disabled = false,
  className = '',
  title,
}: ActionButtonProps) {
  return (
    <button
      className={`lp-button ${primary ? 'primary' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button className="lp-icon-button" aria-label={label}>
      {children}
    </button>
  );
}

function SearchField({
  placeholder,
  className = '',
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`lp-search ${className}`}>
      <Search size={14} />
      <input aria-label={placeholder} placeholder={placeholder} />
    </label>
  );
}

function SelectField({
  label,
  value,
  children,
  disabled = false,
}: {
  label: string;
  value?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <select
      className="lp-select"
      aria-label={label}
      defaultValue={value}
      disabled={disabled}
    >
      {children}
    </select>
  );
}

function Segmented({
  labels,
  active,
  onChange,
  ariaLabel,
}: {
  labels: string[];
  active: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className="lp-segmented" aria-label={ariaLabel}>
      {labels.map((label) => (
        <button
          className={active === label ? 'active' : ''}
          key={label}
          onClick={() => onChange(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Tabs({
  labels,
  active,
  onChange,
  variant = 'underline',
}: {
  labels: string[];
  active: string;
  onChange: (value: string) => void;
  variant?: 'underline' | 'pill';
}) {
  return (
    <div className={`lp-tabs lp-tabs-${variant}`} role="tablist">
      {labels.map((label) => (
        <button
          key={label}
          role="tab"
          aria-selected={label === active}
          className={label === active ? 'active' : ''}
          onClick={() => onChange(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MetricCards({
  items,
  columns = 4,
  className = '',
  interactive = false,
}: {
  items: Array<{
    label: string;
    value: string;
    detail?: string;
    icon?: ReactNode;
  }>;
  columns?: number;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`lp-metrics ${className}`}
      style={{ '--metric-columns': columns } as CSSProperties}
    >
      {items.map((item) => {
        const content = (
          <>
            {item.icon && <i className="lp-metric-icon">{item.icon}</i>}
            <span>{item.label}</span>
            <b>{item.value}</b>
            {item.detail && <small>{item.detail}</small>}
          </>
        );
        return interactive ? (
          <button type="button" key={item.label}>
            {content}
          </button>
        ) : (
          <article key={item.label}>{content}</article>
        );
      })}
    </div>
  );
}

function EmptyState({
  title,
  text,
  action,
  icon,
  className = '',
}: {
  title: string;
  text: string;
  action?: ReactNode;
  icon?: ReactNode | null;
  className?: string;
}) {
  const renderedIcon = icon === undefined ? <Folder size={19} /> : icon;
  return (
    <div className={`lp-empty ${className}`}>
      {renderedIcon && <span className="lp-empty-icon">{renderedIcon}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function Pagination({
  noun = 'records',
  total = 1,
}: {
  noun?: string;
  total?: number;
}) {
  return (
    <footer className="lp-pagination">
      <span>
        {total === 0 ? '0' : `1–${total}`} of {total} {noun}
      </span>
      <label>
        Rows per page
        <select defaultValue="50" aria-label="Rows per page">
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
      </label>
      <button disabled>Previous</button>
      <span>Page 1 of 1</span>
      <button disabled>Next</button>
    </footer>
  );
}

export function LiveParityHeaderExtras({
  route,
  data,
  pipelineView,
  taskView,
  calendarView,
  setPipelineView,
  setTaskView,
  setCalendarView,
}: Pick<
  ParityRouterProps,
  | 'route'
  | 'data'
  | 'pipelineView'
  | 'taskView'
  | 'calendarView'
  | 'setPipelineView'
  | 'setTaskView'
  | 'setCalendarView'
>) {
  if (route === '/contacts') {
    return (
      <div className="lp-header-extras lp-contact-header-extras">
        {['Lead Lists', 'Restore', 'Manage Lead Lists', 'Family Trees'].map(
          (label) => (
            <ActionButton key={label}>{label}</ActionButton>
          ),
        )}
      </div>
    );
  }
  if (route === '/pipeline') {
    return (
      <div className="lp-header-extras">
        <span className="lp-header-count">{data.opportunities.length}</span>
        <Segmented
          labels={['Board', 'Table']}
          active={pipelineView}
          onChange={setPipelineView}
          ariaLabel="Pipeline view"
        />
      </div>
    );
  }
  if (route === '/tasks') {
    return (
      <div className="lp-header-extras">
        <Segmented
          labels={['Board', 'List']}
          active={taskView}
          onChange={setTaskView}
          ariaLabel="Task view"
        />
      </div>
    );
  }
  if (route === '/calendar') {
    return (
      <div className="lp-header-extras">
        <b>September 01, 2026</b>
        <span className="lp-header-count">{data.appointments.length}</span>
        <Segmented
          labels={['Calendar', 'Table']}
          active={calendarView}
          onChange={setCalendarView}
          ariaLabel="Calendar mode"
        />
      </div>
    );
  }
  if (route === '/policies' || route === '/commissions') {
    const total =
      route === '/policies' ? data.policies.length : data.commissions.length;
    return (
      <div className="lp-header-extras">
        <span className="lp-header-count">{total}</span>
        <label className="lp-header-toggle">
          <input type="checkbox" />
          Unwired
        </label>
      </div>
    );
  }
  if (route === '/forms') {
    return (
      <div className="lp-header-extras">
        <span className="lp-header-count">0 forms · 2 folders</span>
      </div>
    );
  }
  return null;
}

export function LiveParityRouter(props: ParityRouterProps) {
  const { route } = props;
  switch (route) {
    case '/dashboard':
      return <DashboardScreen navigate={props.navigate} />;
    case '/contacts':
      return <ContactsScreen data={props.data} openModal={props.openContact} />;
    case '/pipeline':
      return (
        <PipelineScreen
          data={props.data}
          openModal={props.openOpportunity}
          view={props.pipelineView}
        />
      );
    case '/tasks':
      return (
        <TasksScreen
          data={props.data}
          openModal={props.openTask}
          view={props.taskView}
        />
      );
    case '/calendar':
      return (
        <CalendarScreen
          openModal={props.openAppointment}
          view={props.calendarView}
        />
      );
    case '/inbox':
      return <InboxScreen />;
    case '/policies':
      return <PoliciesScreen data={props.data} openModal={props.openPolicy} />;
    case '/commissions':
      return (
        <CommissionsScreen data={props.data} openModal={props.openCommission} />
      );
    case '/booking-links':
      return (
        <BookingLinksScreen data={props.data} openModal={props.openBooking} />
      );
    case '/documents':
      return <DocumentsScreen />;
    case '/analytics':
      return <AnalyticsScreen data={props.data} />;
    case '/automations':
      return <AutomationsScreen data={props.data} />;
    case '/unlocked-ai':
      return <UnlockedAiScreen />;
    case '/agent-ai':
      return <AgentAiScreen />;
    case '/ai-quoting':
      return <AiQuotingScreen />;
    case '/underwrite-ai':
    case '/underwriting':
      return <UnderwritingScreen />;
    case '/campaigns':
      return <CampaignsScreen />;
    case '/forms':
      return <FormsScreen />;
    case '/settings':
      return <SettingsScreen />;
    case '/phone-system':
      return <PhoneScreen />;
    case '/email-services':
      return <EmailScreen />;
    case '/quoting':
      return <QuotingScreen />;
    case '/life':
      return <LifeScreen />;
    case '/medicare':
      return <MedicareScreen />;
    case '/aca-marketplace':
      return <AcaScreen />;
    case '/commission-plus':
      return <CommissionPlusScreen />;
    case '/agency':
      return <AgencyScreen />;
    case '/imo-fmo':
    case '/org/dashboard':
      return <OrganizationScreen />;
    case '/more':
      return <MoreScreen navigate={props.navigate} />;
    default:
      return (
        <div className="lp-page">
          <EmptyState
            title="Page not found"
            text="This local workspace route has not been configured."
          />
        </div>
      );
  }
}

export type RailPopoverName = 'agency' | 'imo' | 'more';

export function RailWorkspacePopover({
  name,
  navigate,
  onClose,
}: {
  name: RailPopoverName;
  navigate: (path: string) => void;
  onClose: () => void;
}) {
  const configs = {
    agency: {
      title: 'Agency',
      subtitle: 'Team, production, and operations',
      path: '/agency',
      groups: [
        {
          label: 'Overview',
          items: ['Dashboard', 'Performance', 'Book of Business'],
        },
        {
          label: 'Team',
          items: ['Team', 'Sub-Agencies', 'Agents', 'Downlines', 'Recruiting'],
        },
        {
          label: 'Operations',
          items: ['Operations', 'Compliance', 'Lead Round Robin'],
        },
      ],
    },
    imo: {
      title: 'IMO/FMO',
      subtitle: 'Downline organizations, agencies, and agents',
      path: '/org/dashboard',
      groups: [
        { label: 'Overview', items: ['Dashboard'] },
        {
          label: 'Organization',
          items: ['Organizations', 'Agencies', 'Sub-Agencies', 'Agents'],
        },
        { label: 'Production', items: ['Production', 'Carriers'] },
        { label: 'Insights', items: ['Reports'] },
      ],
    },
    more: {
      title: 'More',
      subtitle: 'Jump to a tool, or manage what stays on your sidebar.',
      path: '/more',
      groups: [
        {
          label: 'Platform',
          items: [
            'Integrations',
            'Client Portal',
            'Clinic Portal',
            'Carriers',
            'Policy Analyzer',
          ],
        },
      ],
    },
  } satisfies Record<
    RailPopoverName,
    {
      title: string;
      subtitle: string;
      path: string;
      groups: Array<{ label: string; items: string[] }>;
    }
  >;
  const config = configs[name];
  return (
    <dialog className="lp-rail-popover" aria-label={config.title} open>
      <header>
        <span className="lp-logo">U</span>
        <div>
          <h2>{config.title}</h2>
          <p>{config.subtitle}</p>
        </div>
        <button aria-label={`Close ${config.title}`} onClick={onClose}>
          <X size={15} />
        </button>
      </header>
      <div className="lp-rail-popover-actions">
        {name === 'more' && <ActionButton>Manage</ActionButton>}
        <ActionButton
          primary
          onClick={() => {
            onClose();
            navigate(config.path);
          }}
        >
          Open
        </ActionButton>
      </div>
      {config.groups.map((group) => (
        <section key={group.label}>
          <h3>{group.label}</h3>
          <div>
            {group.items.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onClose();
                  navigate(config.path);
                }}
              >
                <span>
                  <Grid2X2 size={15} />
                </span>
                {item}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </section>
      ))}
    </dialog>
  );
}

function DashboardScreen({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="lp-page lp-dashboard">
      <div className="lp-toolbar lp-dashboard-actions">
        <ActionButton>
          Switch workspace <ChevronDown size={13} />
        </ActionButton>
        <ActionButton onClick={() => navigate('/phone-system')}>
          <Phone size={14} /> Make a call
        </ActionButton>
        <ActionButton onClick={() => navigate('/inbox')}>
          <MessageSquareText size={14} /> Send SMS
        </ActionButton>
        <ActionButton onClick={() => navigate('/calendar')}>
          <CalendarDays size={14} /> Create appointment
        </ActionButton>
        <ActionButton primary onClick={() => navigate('/unlocked-ai')}>
          <Sparkles size={14} /> Ask unLocked
        </ActionButton>
      </div>
      <div className="lp-dashboard-grid">
        <section className="lp-panel lp-hero-panel">
          <span className="lp-logo">U</span>
          <div>
            <p>Tuesday, September 1</p>
            <h2>Good evening, Brenda</h2>
            <span>Your insurance workspace is ready.</span>
          </div>
        </section>
        <section className="lp-panel">
          <div className="lp-panel-heading">
            <div>
              <h2>Quick actions</h2>
              <p>Pick up where you left off.</p>
            </div>
          </div>
          <div className="lp-quick-grid">
            {[
              ['Contacts', '/contacts'],
              ['Pipeline', '/pipeline'],
              ['Tasks', '/tasks'],
              ['Policies', '/policies'],
            ].map(([label, path]) => (
              <button key={label} onClick={() => navigate(path)}>
                <Plus size={15} />
                {label}
              </button>
            ))}
          </div>
        </section>
        <section className="lp-panel lp-wide">
          <div className="lp-panel-heading">
            <div>
              <h2>Notifications</h2>
              <p>Updates from your workspace.</p>
            </div>
          </div>
          <EmptyState title="No notifications" text="You're all caught up!" />
        </section>
      </div>
    </div>
  );
}

function ContactsScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <div className="lp-page lp-flush">
      <div className="lp-toolbar lp-view-toolbar">
        <ActionButton className="selected">
          All Contacts <ChevronDown size={13} />
        </ActionButton>
        <ActionButton disabled title="Coming soon">
          View settings <span className="lp-soon">Soon</span>
        </ActionButton>
        <ActionButton disabled>
          Quoted Not Enrolled <span className="lp-soon">Soon</span>
        </ActionButton>
        <ActionButton disabled>
          Policy Renewals <span className="lp-soon">Soon</span>
        </ActionButton>
        <ActionButton disabled>
          AEP Priority <span className="lp-soon">Soon</span>
        </ActionButton>
        <span className="lp-toolbar-spacer" />
        <ActionButton>
          <Sparkles size={14} /> AI Upload
        </ActionButton>
        <ActionButton>
          <Upload size={14} /> Upload List
        </ActionButton>
        <div className="lp-menu-anchor">
          <ActionButton
            primary
            onClick={() => setCreateOpen((value) => !value)}
          >
            <Plus size={14} /> Create Contact <ChevronDown size={13} />
          </ActionButton>
          {createOpen && (
            <menu className="lp-create-menu">
              {['Medicare', 'Life', 'ACA', 'Other'].map((type) => (
                <button
                  role="menuitem"
                  key={type}
                  onClick={() => {
                    setCreateOpen(false);
                    openModal();
                  }}
                >
                  <span>{type.slice(0, 1)}</span>
                  <div>
                    <b>{type}</b>
                    <small>Create a {type.toLowerCase()} contact</small>
                  </div>
                  <ChevronRight size={14} />
                </button>
              ))}
            </menu>
          )}
        </div>
      </div>
      <div className="lp-toolbar lp-filter-toolbar">
        <ActionButton>Sorted by None</ActionButton>
        <ActionButton>
          <Filter size={13} /> Add filter
        </ActionButton>
        <ActionButton>Recently viewed</ActionButton>
        <ActionButton>Leads &amp; Clients</ActionButton>
        <ActionButton>Columns</ActionButton>
        <ActionButton disabled>
          Active policies <span className="lp-soon">Soon</span>
        </ActionButton>
        <SearchField placeholder="Search contacts..." />
        <span>{data.contacts.length} records</span>
      </div>
      <div className="lp-grid-shell lp-contact-grid">
        <table>
          <thead>
            <tr>
              <th aria-label="Select all contacts">
                <input type="checkbox" aria-label="Select all contacts" />
              </th>
              {[
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
              ].map((column) => (
                <th key={column}>
                  <span>{column}</span>
                  <MoreHorizontal size={13} />
                  <i />
                </th>
              ))}
              <th>Add column</th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${contact.firstName} ${contact.lastName}`}
                  />
                </td>
                <td>
                  <button
                    className="lp-person"
                    aria-label={`Open ${contact.firstName} ${contact.lastName}`}
                  >
                    <span>
                      {contact.firstName[0]}
                      {contact.lastName[0]}
                    </span>
                    <b>
                      {contact.firstName} {contact.lastName}
                    </b>
                  </button>
                </td>
                <td>{contact.phone || '—'}</td>
                <td>{contact.email || '—'}</td>
                <td>{contact.birthDate || '—'}</td>
                <td>{contact.gender || '—'}</td>
                <td>{contact.zip || '—'}</td>
                <td>
                  <span className="lp-strength">{contact.strength}</span>
                </td>
                <td>{contact.lastInteraction}</td>
                <td>
                  <span className="lp-tag">{contact.tags.join(', ')}</span>
                </td>
                <td>{contact.product}</td>
                <td>{contact.source}</td>
                <td>{contact.agent}</td>
                <td>
                  <IconButton label={`Actions for ${contact.firstName}`}>
                    <MoreHorizontal size={14} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination total={data.contacts.length} />
    </div>
  );
}

function PipelineScreen({
  data,
  openModal,
  view,
}: {
  data: CrmData;
  openModal: () => void;
  view: string;
}) {
  return (
    <div className="lp-page lp-flush">
      <div className="lp-toolbar lp-filter-toolbar">
        <SearchField placeholder="Search opportunities..." />
        <SelectField label="Pipeline agent" value="All Agents">
          <option>All Agents</option>
        </SelectField>
        <IconButton label="Edit pipeline">
          <Settings size={14} />
        </IconButton>
        <SelectField label="Pipeline" value="Recruiting Pipeline">
          <option>Recruiting Pipeline</option>
        </SelectField>
        <span className="lp-toolbar-spacer" />
        <ActionButton>
          <Sparkles size={14} /> Pipeline AI
        </ActionButton>
        <ActionButton>
          <Filter size={14} /> Filters
        </ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> Add Opportunity
        </ActionButton>
      </div>
      {view === 'Board' ? (
        <div className="lp-board">
          {PIPELINE_STAGES.map((stage) => {
            const opportunities = data.opportunities.filter(
              (opportunity) => opportunity.stage === stage,
            );
            return (
              <section className="lp-board-column" key={stage}>
                <header>
                  <div>
                    <h3>{stage}</h3>
                    <span>{opportunities.length}</span>
                  </div>
                  <button
                    aria-label={`Add deal to ${stage}`}
                    onClick={openModal}
                  >
                    <Plus size={14} />
                  </button>
                </header>
                {opportunities.map((opportunity) => (
                  <article className="lp-deal-card" key={opportunity.id}>
                    <div className="lp-card-title">
                      <span>ES</span>
                      <b>{opportunity.contact}</b>
                      <small>Open</small>
                    </div>
                    <p>(202) 555-0168</p>
                    <div className="lp-card-tags">
                      <span>{opportunity.product}</span>
                      <span>{opportunity.carrier}</span>
                    </div>
                    <dl>
                      <div>
                        <dt>Commission</dt>
                        <dd>{currency(opportunity.value)}</dd>
                      </div>
                      <div>
                        <dt>Probability</dt>
                        <dd>{opportunity.probability}%</dd>
                      </div>
                    </dl>
                    <div className="lp-progress">
                      <i style={{ width: `${opportunity.probability}%` }} />
                    </div>
                    <footer>Last contact · Just now</footer>
                  </article>
                ))}
                {opportunities.length === 0 && (
                  <div className="lp-column-empty">
                    <Plus size={15} />
                    <b>New Deal</b>
                    <span>No deals in this stage yet</span>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="lp-grid-shell">
          <table>
            <thead>
              <tr>
                <th>Opportunity</th>
                <th>Stage</th>
                <th>Product</th>
                <th>Commission</th>
                <th>Probability</th>
                <th>Agent</th>
                <th>Last contact</th>
              </tr>
            </thead>
            <tbody>
              {data.opportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>{opportunity.contact}</td>
                  <td>{opportunity.stage}</td>
                  <td>{opportunity.product}</td>
                  <td>{currency(opportunity.value)}</td>
                  <td>{opportunity.probability}%</td>
                  <td>{opportunity.agent}</td>
                  <td>Just now</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination noun="opportunities" total={data.opportunities.length} />
        </div>
      )}
    </div>
  );
}

function TasksScreen({
  data,
  openModal,
  view,
}: {
  data: CrmData;
  openModal: () => void;
  view: string;
}) {
  const emptyCopy: Record<string, [string, string]> = {
    'To-Do': ['No tasks to start', 'Click to add your first task'],
    'In Progress': ['Nothing in progress', 'Drag tasks here or click to add'],
    Due: ['No tasks due', 'Tasks due today will appear here'],
    Done: ['No completed tasks', 'Completed tasks will appear here'],
  };
  const stages = ['To-Do', 'In Progress', 'Due', 'Done'];
  return (
    <div className="lp-page lp-flush">
      <div className="lp-toolbar lp-filter-toolbar">
        <ActionButton>
          All Tasks <ChevronDown size={13} />
        </ActionButton>
        <span className="lp-toolbar-spacer" />
        <ActionButton>
          <Download size={14} /> Export
        </ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> Add Task
        </ActionButton>
      </div>
      {view === 'Board' ? (
        <div className="lp-task-board">
          {stages.map((stage) => {
            const tasks = data.tasks.filter((task) => task.status === stage);
            return (
              <section className="lp-task-column" key={stage}>
                <header>
                  <div>
                    <h3>{stage}</h3>
                    <span>
                      {tasks.length} · {tasks.length} tasks
                    </span>
                  </div>
                  <button
                    aria-label={`Add task to ${stage}`}
                    onClick={openModal}
                  >
                    <Plus size={14} />
                  </button>
                </header>
                {tasks.map((task) => (
                  <article className="lp-task-card" key={task.id}>
                    <div className="lp-task-card-top">
                      <span className="lp-check" />
                      <b>{task.title}</b>
                      <MoreHorizontal size={14} />
                    </div>
                    <span className="lp-due">{task.due}</span>
                    <div className="lp-card-tags">
                      <span>{task.priority}</span>
                      <span>Pending</span>
                    </div>
                    <p>{task.contact}</p>
                    <footer>
                      <span>0 · 0</span>
                      <span>{task.assignee}</span>
                    </footer>
                  </article>
                ))}
                {tasks.length === 0 && (
                  <div className="lp-column-empty">
                    <Plus size={15} />
                    <b>New Task</b>
                    <strong>{emptyCopy[stage][0]}</strong>
                    <span>{emptyCopy[stage][1]}</span>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="lp-grid-shell">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Contact</th>
                <th>Due</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{task.contact}</td>
                  <td>{task.due}</td>
                  <td>{task.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CalendarScreen({
  openModal,
  view,
}: {
  openModal: () => void;
  view: string;
}) {
  const hours = Array.from({ length: 24 }, (_, hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  });
  return (
    <div className="lp-page lp-flush">
      <div className="lp-toolbar lp-filter-toolbar">
        <ActionButton>Previous</ActionButton>
        <ActionButton>Next</ActionButton>
        <SelectField label="Calendar view" value="Week">
          <option>Week</option>
          <option>Day</option>
          <option>Month</option>
        </SelectField>
        <ActionButton>Manage View</ActionButton>
        <span className="lp-toolbar-spacer" />
        <ActionButton>Connect Calendar</ActionButton>
        <ActionButton>Edit availability</ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> Create Appointment
        </ActionButton>
      </div>
      {view === 'Calendar' ? (
        <div className="lp-calendar">
          <div className="lp-calendar-head">
            <span>ET</span>
            {[
              ['Sun', '30'],
              ['Mon', '31'],
              ['Tue', '01'],
              ['Wed', '02'],
              ['Thu', '03'],
              ['Fri', '04'],
              ['Sat', '05'],
            ].map(([day, date]) => (
              <div className={date === '01' ? 'today' : ''} key={day}>
                <span>{day}</span>
                <b>{date}</b>
              </div>
            ))}
          </div>
          <div className="lp-calendar-body">
            {hours.map((hour) => (
              <div className="lp-calendar-hour" key={hour}>
                <span>{hour}</span>
                {Array.from({ length: 7 }, (_, index) => (
                  <i key={index} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No appointments"
          text="Connected calendar events and local appointments will appear here."
          action={
            <ActionButton primary onClick={openModal}>
              Create Appointment
            </ActionButton>
          }
        />
      )}
    </div>
  );
}

function InboxScreen() {
  const [tab, setTab] = useState('All');
  return (
    <div className="lp-inbox">
      <section className="lp-conversations">
        <Tabs
          labels={['Unread', 'Starred', 'Drafts', 'All']}
          active={tab}
          onChange={setTab}
        />
        <div className="lp-toolbar lp-inbox-tools">
          <SearchField placeholder="Search conversations..." />
          <IconButton label="Filter conversations">
            <Filter size={14} />
          </IconButton>
          <IconButton label="Refresh conversations">
            <RefreshCw size={14} />
          </IconButton>
        </div>
        <div className="lp-toolbar lp-inbox-count">
          <input type="checkbox" aria-label="Select all conversations" />
          <span>0 conversations</span>
          <SelectField label="Conversation order" value="Latest-All">
            <option>Latest-All</option>
          </SelectField>
        </div>
        <EmptyState
          title="No conversations yet"
          text="Messages from SMS, email, and calls will appear here"
        />
      </section>
      <section className="lp-message-pane">
        <span className="lp-empty-icon">
          <MessageSquareText size={20} />
        </span>
        <h3>No conversation selected</h3>
        <p>Select a conversation from the list to view messages.</p>
        <ActionButton primary>
          <Plus size={14} /> Start New Conversation
        </ActionButton>
      </section>
    </div>
  );
}

function ModuleSideNav({
  title,
  items,
  active,
  className = '',
  headerAction,
}: {
  title: string;
  items: Array<{ label: string; count?: number }>;
  active: string;
  className?: string;
  headerAction?: ReactNode;
}) {
  return (
    <aside className={`lp-module-nav ${className}`}>
      {headerAction}
      <div>
        <span>{title}</span>
        <button aria-label={`Collapse ${title} menu`}>
          <ChevronDown size={13} />
        </button>
      </div>
      {items.map((item) => (
        <button
          className={item.label === active ? 'active' : ''}
          key={item.label}
        >
          <span>{item.label}</span>
          {item.count !== undefined && <small>{item.count}</small>}
        </button>
      ))}
    </aside>
  );
}

function PoliciesScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  return (
    <div className="lp-page lp-business-page lp-policies-page">
      <div className="lp-toolbar lp-business-actions">
        <ActionButton>
          <Sparkles size={14} /> AI Insights
        </ActionButton>
        <ActionButton>
          <Download size={14} /> Export CSV
        </ActionButton>
        <ActionButton>
          <Upload size={14} /> Bulk Upload
        </ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> Add New Policy
        </ActionButton>
      </div>
      <div className="lp-side-layout">
        <ModuleSideNav
          title="Policies"
          active="All Policies"
          items={[
            { label: 'All Policies', count: data.policies.length },
            { label: 'Applications' },
            { label: 'Enrollments' },
            { label: 'Renewal Dashboard' },
            { label: 'Book of Business' },
            { label: 'Cross-Sell' },
          ]}
        />
        <section className="lp-side-content">
          <div className="lp-toolbar lp-filter-toolbar">
            <SelectField label="Agent filter" value="All Agents">
              <option>All Agents</option>
            </SelectField>
            <SelectField label="Product filter" value="All Products">
              <option>All Products</option>
            </SelectField>
            <SelectField label="Carrier filter" value="All Carriers">
              <option>All Carriers</option>
            </SelectField>
            <SelectField label="Status filter" value="All Statuses">
              <option>All Statuses</option>
            </SelectField>
            <ActionButton>Recently viewed</ActionButton>
            <SearchField placeholder="Search client, carrier, type, policy #" />
          </div>
          <div className="lp-grid-shell">
            <table>
              <thead>
                <tr>
                  <th aria-label="Select all policies">
                    <input
                      type="checkbox"
                      aria-label="Select all policies on this page"
                    />
                  </th>
                  {[
                    'Client',
                    'Agent',
                    'Carrier',
                    'Coverage Type',
                    'Policy #',
                    'Status',
                    'Renewal Date',
                    'Actions',
                  ].map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select policy ${policy.number}`}
                      />
                    </td>
                    <td>
                      <button className="lp-record-link">
                        {policy.client}
                      </button>
                      <small className="lp-cell-detail">lead</small>
                    </td>
                    <td>{policy.agent}</td>
                    <td>{policy.carrier}</td>
                    <td>{policy.type}</td>
                    <td>
                      <button className="lp-record-link">
                        {policy.number}
                      </button>
                    </td>
                    <td>
                      <span className="lp-status success">{policy.status}</span>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'UTC',
                      }).format(new Date(policy.renewal))}
                    </td>
                    <td>
                      <IconButton label={`Actions for ${policy.number}`}>
                        <MoreHorizontal size={14} />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination noun="policies" total={data.policies.length} />
          </div>
        </section>
      </div>
    </div>
  );
}

function CommissionsScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  const total = data.commissions.reduce(
    (sum, commission) => sum + commission.amount,
    0,
  );
  return (
    <div className="lp-page lp-commissions-page">
      <div className="lp-toolbar lp-business-actions">
        <ActionButton>
          <Sparkles size={14} /> AI Insights
        </ActionButton>
        <ActionButton>
          <Download size={14} /> Export CSV
        </ActionButton>
        <ActionButton>
          <Upload size={14} /> Bulk Upload
        </ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> Add Commission
        </ActionButton>
      </div>
      <MetricCards
        className="lp-commission-metrics"
        items={[
          {
            label: 'Total Paid',
            value: '$0',
            detail: `${data.commissions.length} records`,
          },
          {
            label: 'Pending Total Commissions',
            value: currency(total),
            detail: `${data.commissions.length} policies`,
          },
          {
            label: 'Total Commissions',
            value: String(data.commissions.length),
            detail: 'All time',
          },
          {
            label: 'Average Commission',
            value: data.commissions.length
              ? currency(total / data.commissions.length)
              : '$0',
            detail: 'Per commission',
          },
        ]}
      />
      <div className="lp-toolbar lp-filter-toolbar">
        <SearchField placeholder="Search commissions..." />
        {[
          ['Commission status', 'All Status'],
          ['Commission type', 'All Types'],
          ['Product', 'All Products'],
          ['Carrier', 'All Carriers'],
          ['Agent', 'All Agents'],
        ].map(([label, value]) => (
          <SelectField label={label} value={value} key={label}>
            <option>{value}</option>
          </SelectField>
        ))}
      </div>
      <div className="lp-grid-shell lp-commission-table">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" aria-label="Select all commissions" />
              </th>
              {[
                'Client',
                'Agent',
                'Carrier',
                'Product',
                'Type',
                'Policy #',
                'Amount',
                'Status',
                'Payment Date',
              ].map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.commissions.map((commission) => (
              <tr key={commission.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select commission ${commission.id}`}
                  />
                </td>
                <td>{commission.client}</td>
                <td>{commission.agent}</td>
                <td>{commission.carrier}</td>
                <td>{commission.product}</td>
                <td>{commission.type}</td>
                <td>{commission.policy}</td>
                <td>{currency(commission.amount)}</td>
                <td>{commission.status}</td>
                <td>{commission.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.commissions.length === 0 && (
          <EmptyState
            icon={<BadgeDollarSign size={22} />}
            title="No Commissions Yet"
            text="Start tracking your insurance commissions by adding your first record"
            action={
              <ActionButton primary onClick={openModal}>
                <Plus size={14} /> Add Commission
              </ActionButton>
            }
          />
        )}
        <Pagination noun="commissions" total={data.commissions.length} />
      </div>
      <section className="lp-panel lp-section-panel">
        <div className="lp-panel-heading">
          <div>
            <h2>Commissions by product line</h2>
            <p>
              Every commission matching the current filters, grouped by product
              type.
            </p>
          </div>
        </div>
        <EmptyState
          title="No commission data yet"
          text="Add commission records to see your earnings breakdown by product line."
          action={
            <ActionButton primary onClick={openModal}>
              Add Commission
            </ActionButton>
          }
        />
      </section>
    </div>
  );
}

function BookingLinksScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  return (
    <div className="lp-page lp-booking-links-page">
      <div className="lp-section-heading-row">
        <h2>All Booking Links</h2>
      </div>
      <div className="lp-toolbar lp-filter-toolbar">
        <SelectField label="Booking link status" value="All Status">
          <option>All Status</option>
        </SelectField>
        <SelectField label="Booking link type" value="All Types">
          <option>All Types</option>
        </SelectField>
        <SelectField label="Booking link agent" value="All Agents">
          <option>All Agents</option>
        </SelectField>
        <SearchField placeholder="Search..." />
        <span className="lp-toolbar-spacer" />
        <ActionButton>Submissions</ActionButton>
        <ActionButton>
          <Folder size={14} /> New Folder
        </ActionButton>
        <ActionButton primary onClick={openModal}>
          <Plus size={14} /> New Booking Link
        </ActionButton>
      </div>
      {data.bookingLinks.length === 0 ? (
        <section className="lp-booking-empty-panel">
          <EmptyState
            icon={<CalendarDays size={25} />}
            title="No booking links yet"
            text="Create your first booking link to start accepting appointments"
            action={
              <ActionButton primary onClick={openModal}>
                <Plus size={14} /> Create Booking Link
              </ActionButton>
            }
          />
        </section>
      ) : (
        <div className="lp-card-grid">
          {data.bookingLinks.map((link) => (
            <article className="lp-panel" key={link.id}>
              <h3>{link.name}</h3>
              <p>{link.duration} minutes</p>
              <span>{link.status}</span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentsScreen() {
  const [tab, setTab] = useState('Documents');
  return (
    <div className="lp-page lp-documents-page">
      <Tabs
        labels={['Documents', 'E&O Policy']}
        active={tab}
        onChange={setTab}
        variant="pill"
      />
      <section className="lp-documents-panel">
        <div className="lp-toolbar lp-document-actions">
          <span className="lp-toolbar-spacer" />
          <ActionButton>
            <Upload size={14} /> Bulk Upload
          </ActionButton>
          <ActionButton>
            <Download size={14} /> Download
          </ActionButton>
          <ActionButton>
            <Folder size={14} /> New Folder
          </ActionButton>
          <ActionButton primary>
            <Upload size={14} /> Upload
          </ActionButton>
        </div>
        <div className="lp-toolbar lp-document-filters">
          <SearchField placeholder="Search documents..." />
          <SelectField label="Document type" value="All Types">
            <option>All Types</option>
          </SelectField>
          <SelectField label="Document agent" value="All Agents">
            <option>All Agents</option>
          </SelectField>
          <SelectField label="Date added" value="Date added">
            <option>Date added</option>
          </SelectField>
        </div>
        {tab === 'Documents' ? (
          <>
            <div className="lp-folder-card">
              <span>
                <Folder size={18} />
              </span>
              <div>
                <b>UI Audit Samples</b>
                <small>0 documents</small>
              </div>
              <IconButton label="UI Audit Samples actions">
                <MoreHorizontal size={15} />
              </IconButton>
            </div>
            <div className="lp-grid-shell">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all documents on this page"
                      />
                    </th>
                    {[
                      'Name',
                      'Type',
                      'Contact',
                      'Carrier / Plan',
                      'Size',
                      'Added',
                      'Actions',
                    ].map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody />
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title="No E&O policy uploaded"
            text="Upload your current policy to keep compliance records together."
          />
        )}
      </section>
    </div>
  );
}

function AnalyticsScreen({ data }: { data: CrmData }) {
  return (
    <div className="lp-page lp-side-layout lp-analytics-page">
      <ModuleSideNav
        title="Reports"
        active="Overview"
        items={[
          { label: 'Overview' },
          { label: 'Calls', count: 0 },
          { label: 'Dispositions' },
          { label: 'Email', count: 0 },
          { label: 'SMS', count: 0 },
          { label: 'Appts', count: 0 },
          { label: 'Agents', count: 1 },
          { label: 'Marketing', count: 0 },
          { label: 'Sources' },
          { label: 'Audit', count: 0 },
          { label: 'Report Builder' },
        ]}
      />
      <section className="lp-side-content">
        <div className="lp-toolbar lp-filter-toolbar">
          <label className="lp-date-range">
            <input
              type="date"
              defaultValue="2026-08-02"
              aria-label="Start date"
            />
            <span>to</span>
            <input
              type="date"
              defaultValue="2026-09-01"
              aria-label="End date"
            />
          </label>
          <SelectField label="Analytics agent" value="All Agents">
            <option>All Agents</option>
          </SelectField>
          <span className="lp-toolbar-spacer" />
          <ActionButton>
            <Download size={14} /> Download Report
          </ActionButton>
        </div>
        <MetricCards
          columns={4}
          className="lp-analytics-metrics"
          items={[
            { label: 'Total Calls', value: '0', detail: '0% vs last period' },
            { label: 'SMS Messages', value: '0', detail: '0% vs last period' },
            { label: 'Emails', value: '0', detail: '0% vs last period' },
            { label: 'Appointments', value: '0', detail: '0% vs last period' },
            {
              label: 'New Leads',
              value: String(data.contacts.length),
              detail: '0% vs last period',
            },
            {
              label: 'Task Completion',
              value: '0%',
              detail: `0 of ${data.tasks.length} tasks`,
            },
            { label: 'Commissions', value: '$0', detail: 'This period' },
            {
              label: 'Open Opportunities',
              value: String(data.opportunities.length),
              detail: '$0 pipeline',
            },
          ]}
        />
        <section className="lp-panel lp-chart-panel lp-analytics-activity">
          <div className="lp-panel-heading">
            <div>
              <h2>Activity Trends</h2>
              <p>Calls, messages, emails, and appointments over time.</p>
            </div>
          </div>
          <EmptyState
            icon={<Sparkles size={21} />}
            title="No activity data yet"
            text="Start making calls, sending messages, or scheduling appointments to see your activity trends here."
            action={<ActionButton>Go to Inbox</ActionButton>}
          />
        </section>
        <div className="lp-two-column">
          <section className="lp-panel lp-chart-panel lp-analytics-channel">
            <div className="lp-panel-heading">
              <div>
                <h2>Channel Distribution</h2>
                <p>Communication volume by channel</p>
              </div>
            </div>
            <EmptyState
              icon={<MessageSquareText size={21} />}
              title="No activities to show"
              text="Activity will appear here."
            />
          </section>
          <section className="lp-panel lp-chart-panel lp-analytics-channel">
            <div className="lp-panel-heading">
              <div>
                <h2>Channel Proportion</h2>
                <p>Percentage breakdown of activities</p>
              </div>
            </div>
            <EmptyState
              icon={<Grid2X2 size={21} />}
              title="No activities to show"
              text="Activity will appear here."
            />
          </section>
        </div>
        <div className="lp-three-column">
          {[
            ['Outreach Metrics', 'Calls, SMS, and email engagement'],
            ['Revenue Insights', 'Pipeline and commission performance'],
            ['Growth Metrics', 'Lead and client growth'],
          ].map(([title, text]) => (
            <section className="lp-panel lp-insight-card" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <b>0</b>
              <small>No activity in this period</small>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}

function AutomationsScreen({ data }: { data: CrmData }) {
  const [tab, setTab] = useState('All (8)');
  return (
    <div className="lp-page lp-flush lp-automations-page">
      <div className="lp-toolbar lp-filter-toolbar">
        <Segmented
          labels={['All (8)', 'Active (0)', 'Inactive (8)', 'Deleted (0)']}
          active={tab}
          onChange={setTab}
          ariaLabel="Automation status"
        />
        <SelectField label="Automation agent" value="All Agents">
          <option>All Agents</option>
        </SelectField>
        <SearchField placeholder="Search..." />
        <span className="lp-toolbar-spacer" />
        <IconButton label="Automation folders">
          <Folder size={14} />
        </IconButton>
        <IconButton label="Import automations">
          <Upload size={14} />
        </IconButton>
        <IconButton label="Automation options">
          <MoreHorizontal size={14} />
        </IconButton>
        <ActionButton primary>
          <Sparkles size={14} /> Build with AI
        </ActionButton>
      </div>
      <div className="lp-grid-shell">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Total Enrolled</th>
              <th>Active Enrolled</th>
              <th>Last Updated</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.workflows.map((workflow) => (
              <tr key={workflow.id}>
                <td>
                  <button className="lp-folder-link">
                    <Folder size={15} />
                    {workflow.name}
                  </button>
                </td>
                <td>
                  <span className="lp-status neutral">{workflow.status}</span>
                </td>
                <td>{workflow.total || '—'}</td>
                <td>{workflow.active || '—'}</td>
                <td>{workflow.updated}</td>
                <td>{workflow.created}</td>
                <td>
                  <IconButton label={`${workflow.name} actions`}>
                    <MoreHorizontal size={14} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssistantSidebar({
  title,
  items,
  children,
}: {
  title: string;
  items: Array<{ label: string; disabled?: boolean }>;
  children?: ReactNode;
}) {
  return (
    <aside className="lp-assistant-sidebar">
      <div className="lp-assistant-brand">
        <span className="lp-logo">U</span>
        <b>{title}</b>
        <button aria-label="Collapse sidebar">
          <ChevronDown size={13} />
        </button>
      </div>
      <nav>
        {items.map((item, index) => (
          <button
            key={item.label}
            disabled={item.disabled}
            className={index === 0 ? 'active' : ''}
          >
            {index === 0 ? <Plus size={14} /> : <FileText size={14} />}
            <span>{item.label}</span>
            {item.disabled && <small>Soon</small>}
          </button>
        ))}
      </nav>
      <SearchField placeholder="Search chats..." />
      <section>
        <h3>Pinned</h3>
        <p>No pinned chats</p>
      </section>
      <section>
        <h3>Recents</h3>
        {children ?? <p>No recent chats</p>}
      </section>
    </aside>
  );
}

function AiComposer({
  placeholder,
  model = 'Starlite 3.4 · Max',
}: {
  placeholder: string;
  model?: string;
}) {
  return (
    <div className="lp-ai-composer">
      <textarea aria-label={placeholder} placeholder={placeholder} />
      <footer>
        <IconButton label="More input options">
          <Plus size={15} />
        </IconButton>
        <button className="lp-model-button">
          {model} <ChevronDown size={12} />
        </button>
        <span className="lp-toolbar-spacer" />
        <IconButton label="Voice input">
          <Mic size={15} />
        </IconButton>
        <button className="lp-send" aria-label="Send" disabled>
          <Send size={14} />
        </button>
      </footer>
    </div>
  );
}

function UnlockedAiScreen() {
  const prompts = [
    ['Write', 'Draft a follow-up for a new lead'],
    ['Strategize', 'Plan my outreach for this week'],
    ['From Email', 'Summarize recent client emails'],
    ['From Calendar', 'Prepare me for my next meeting'],
    ['From Contacts', 'Find leads who need attention'],
  ];
  return (
    <div className="lp-assistant-layout">
      <AssistantSidebar
        title="unLocked AI"
        items={[
          { label: 'New chat' },
          { label: 'Insights' },
          { label: 'Plugins', disabled: true },
          { label: 'Permissions' },
        ]}
      />
      <section className="lp-assistant-main">
        <div className="lp-ai-center">
          <span className="lp-logo large">U</span>
          <h1>Burning the midnight oil, Brenda?</h1>
          <AiComposer placeholder="Ask anything about your CRM…" />
          <div className="lp-prompt-grid">
            {prompts.map(([label, prompt]) => (
              <button key={label}>
                <Sparkles size={14} />
                <span>
                  <b>{label}</b>
                  <small>{prompt}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function VoiceSetupPanel() {
  const [step, setStep] = useState(1);
  return (
    <div className="lp-agent-ai">
      <p className="lp-route-subtitle">AI-powered voice calling system</p>
      <div className="lp-agent-setup">
        <div className="lp-setup-progress">
          {[
            ['1', 'Voice consent'],
            ['2', 'Record sample'],
            ['3', 'Review voice'],
          ].map(([number, label], index) => (
            <div className={step >= index + 1 ? 'active' : ''} key={number}>
              <span>{step > index + 1 ? <Check size={13} /> : number}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>
        <section className="lp-panel lp-voice-panel">
          <span className="lp-voice-icon">
            <Mic size={23} />
          </span>
          {step === 1 && (
            <>
              <h2>Create your AI voice</h2>
              <p>
                Confirm consent before recording a short sample used only in
                this local preview.
              </p>
              <label className="lp-consent">
                <input type="checkbox" />
                I consent to creating a private AI voice model.
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Record your voice sample</h2>
              <p>
                Read the sample script naturally. Recording is mocked locally.
              </p>
              <button className="lp-record-button" aria-label="Start recording">
                <Mic size={22} />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <h2>Review your voice</h2>
              <p>Your local preview voice is ready to test.</p>
              <div className="lp-waveform" aria-label="Voice sample waveform">
                {Array.from({ length: 32 }, (_, index) => (
                  <i
                    key={index}
                    style={{ height: `${12 + ((index * 11) % 30)}px` }}
                  />
                ))}
              </div>
            </>
          )}
          <footer>
            <ActionButton
              disabled={step === 1}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
            >
              Back
            </ActionButton>
            <ActionButton
              primary
              disabled={step === 3}
              onClick={() => setStep((current) => Math.min(3, current + 1))}
            >
              Continue
            </ActionButton>
          </footer>
        </section>
      </div>
    </div>
  );
}

function AgentAiScreen() {
  const [section, setSection] = useState('Dashboard');
  const items = [
    'New',
    'Dashboard',
    'Voice',
    'Phone',
    'Scripts',
    'Campaigns',
    'Conversations',
    'Analytics',
    'Settings',
  ];
  return (
    <div className="lp-agent-layout">
      <aside className="lp-agent-sidebar">
        <div className="lp-agent-sidebar-brand">
          <span className="lp-logo">U</span>
          <b>Agent AI</b>
        </div>
        <nav aria-label="Agent AI tools">
          {items.map((item) => (
            <button
              className={section === item ? 'active' : ''}
              key={item}
              onClick={() => setSection(item === 'New' ? 'Dashboard' : item)}
            >
              {item === 'New' ? <Plus size={15} /> : <FileText size={15} />}
              <span>{item}</span>
            </button>
          ))}
        </nav>
      </aside>
      <section className="lp-agent-main">
        {section === 'Voice' ? (
          <VoiceSetupPanel />
        ) : (
          <div className="lp-agent-dashboard">
            <div className="lp-agent-dashboard-header">
              <div>
                <span>Active conversations: 0</span>
                <h2>Good morning, Brenda</h2>
                <p>Manage your AI calling workspace and launch outreach.</p>
              </div>
              <div className="lp-toolbar">
                <ActionButton>
                  <Phone size={14} /> Test Call
                </ActionButton>
                <ActionButton primary>
                  <Plus size={14} /> Create Campaign
                </ActionButton>
              </div>
            </div>
            <MetricCards
              items={[
                { label: 'Active calls', value: '0', detail: 'Right now' },
                { label: 'Conversations', value: '0', detail: 'Today' },
                { label: 'Appointments', value: '0', detail: 'Booked' },
                { label: 'Conversion', value: '0%', detail: 'This month' },
              ]}
            />
            <div className="lp-two-column">
              <OverviewEmptyPanel
                title="Recent conversations"
                text="Calls and campaign conversations will appear here."
                action="View conversations"
              />
              <OverviewEmptyPanel
                title="Campaign activity"
                text="Create a campaign to begin tracking Agent AI outreach."
                action="Create Campaign"
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function AiQuotingScreen() {
  const quoters = [
    {
      name: 'Life Quote AI',
      text: 'Compare multi-carrier life insurance options.',
      action: 'Open Quoter',
    },
    {
      name: 'Medicare AI',
      text: 'Find Medicare Advantage and Part D plans.',
      action: 'Open Quoter',
    },
    {
      name: 'Medigap AI',
      text: 'Compare Medicare Supplement (Medigap) plans.',
      badge: 'Upgrading',
    },
    {
      name: 'ACA AI',
      text: 'Estimate ACA Marketplace plans and subsidies.',
      action: 'Open Quoter',
    },
    {
      name: 'Annuity Quote AI',
      text: 'Explore annuity products and illustrations.',
      badge: 'SOON',
    },
  ];
  return (
    <div className="lp-page lp-ai-quoting">
      <div className="lp-centered-heading">
        <span className="lp-logo large">U</span>
        <h1>AI Quoting</h1>
        <p>Choose a quoter to start generating quotes with AI</p>
      </div>
      <div className="lp-quote-grid">
        {quoters.map((quoter) => (
          <article className="lp-quote-card" key={quoter.name}>
            <span className="lp-quote-icon">
              <WandSparkles size={20} />
            </span>
            <div>
              <h3>{quoter.name}</h3>
              <p>{quoter.text}</p>
            </div>
            {quoter.badge ? (
              <span className="lp-upgrade-badge">{quoter.badge}</span>
            ) : (
              <ActionButton primary>{quoter.action}</ActionButton>
            )}
          </article>
        ))}
      </div>
      <div className="lp-feedback">
        <button aria-label="Dismiss feedback prompt">
          <X size={13} />
        </button>
        <Sparkles size={16} />
        <span>Help us improve AI Quoting. What should we build next?</span>
        <ActionButton>Share</ActionButton>
      </div>
    </div>
  );
}

function UnderwritingScreen() {
  return (
    <div className="lp-assistant-layout">
      <AssistantSidebar
        title="Underwrite AI"
        items={[
          { label: 'New chat' },
          { label: 'Select contact' },
          { label: 'Assessments' },
          { label: 'Carriers' },
        ]}
      >
        <button className="lp-recent-chat">
          <span>New chat</span>
          <MoreHorizontal size={13} />
        </button>
      </AssistantSidebar>
      <section className="lp-assistant-main">
        <div className="lp-ai-center">
          <span className="lp-logo large">U</span>
          <h2>Underwrite AI</h2>
          <p>
            Add the case details and I&apos;ll track the rate class in real
            time.
          </p>
          <AiComposer placeholder="Describe the client and case details…" />
          <small className="lp-disclaimer">
            Verify carrier-specific guidelines before presenting a rate class.
          </small>
          <div className="lp-prompt-grid four">
            {[
              'Healthy term case',
              'Diabetes case',
              'BP and cholesterol case',
              'Driving issue what-if',
            ].map((prompt) => (
              <button key={prompt}>{prompt}</button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CampaignsScreen() {
  const healthCards = [
    {
      title: 'Campaign Health',
      text: 'Overall open rates and campaign performance',
    },
    {
      title: 'Engagement Trend',
      text: 'Clicks and audience engagement over time',
    },
    {
      title: 'Delivery Quality',
      text: 'Successful delivery quality across every channel',
    },
  ];
  return (
    <div className="lp-page lp-side-layout lp-campaigns-page">
      <ModuleSideNav
        title="Campaigns"
        active="Overview"
        headerAction={
          <ActionButton primary className="lp-module-primary">
            <Plus size={14} /> Create Campaign <ChevronDown size={13} />
          </ActionButton>
        }
        items={[
          { label: 'Overview' },
          { label: 'Campaigns' },
          { label: 'Email Templates' },
          { label: 'SMS Templates' },
          { label: 'Quick Templates' },
          { label: 'Reports' },
          { label: 'Message Queue' },
        ]}
      />
      <section className="lp-side-content">
        <div className="lp-toolbar lp-filter-toolbar">
          <SelectField label="All Agents" value="All Agents" disabled>
            <option>All Agents</option>
          </SelectField>
          <SelectField label="Campaign filter" value="All Campaigns">
            <option>All Campaigns</option>
          </SelectField>
          <span className="lp-toolbar-spacer" />
          <ActionButton>
            <Download size={14} /> Export <ChevronDown size={12} />
          </ActionButton>
          <ActionButton primary>
            <Plus size={14} /> Create Campaign <ChevronDown size={12} />
          </ActionButton>
        </div>
        <MetricCards
          columns={5}
          className="lp-campaign-kpis"
          items={[
            { label: 'Total Contacts', value: '2', icon: <Users size={17} /> },
            { label: 'Emails Sent', value: '0', icon: <Mail size={17} /> },
            {
              label: 'SMS Sent',
              value: '0',
              icon: <MessageSquareText size={17} />,
            },
            {
              label: 'Email Conversion',
              value: '0.0%',
              icon: <Sparkles size={17} />,
            },
            {
              label: 'SMS Conversion',
              value: '0.0%',
              icon: <RefreshCw size={17} />,
            },
          ]}
        />
        <section className="lp-panel lp-chart-panel lp-campaign-performance">
          <div className="lp-panel-heading">
            <div>
              <h2>Campaign Performance</h2>
              <p>View and analyze all campaign activity</p>
            </div>
            <SearchField placeholder="Search campaigns..." />
            <ActionButton className="lp-date-range-button">
              <CalendarDays size={14} /> Jun 3 - Sep 1
            </ActionButton>
            <ActionButton>Export</ActionButton>
          </div>
          <EmptyState
            icon={<Mail size={23} />}
            title="No Campaigns Yet"
            text="Start creating campaigns to engage your audience and track performance metrics"
            action={
              <ActionButton primary>
                <Plus size={14} /> Create Campaign
              </ActionButton>
            }
          />
        </section>

        <div className="lp-campaign-health-grid">
          {healthCards.map((card) => (
            <section
              className="lp-panel lp-campaign-health-card"
              key={card.title}
            >
              <div className="lp-panel-heading">
                <h2>{card.title}</h2>
              </div>
              <div className="lp-campaign-health-body">
                <strong>0%</strong>
                <p>{card.text}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="lp-panel lp-campaign-engagement-summary">
          <div className="lp-panel-heading">
            <div>
              <h2>Engagement Summary</h2>
              <p>How contacts are interacting with your messages</p>
            </div>
          </div>
          <div className="lp-campaign-summary-grid">
            {[
              ['Delivered', '0', '0% delivery rate'],
              ['Opened', '0', '0% open rate'],
              ['Clicked', '0', '0% click rate'],
            ].map(([label, value, detail]) => (
              <article key={label}>
                <span>{label}</span>
                <b>{value}</b>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-panel lp-campaign-performance-analysis">
          <div className="lp-panel-heading">
            <div>
              <h2>Performance Analysis</h2>
              <p>Delivery and audience-quality signals</p>
            </div>
          </div>
          <div className="lp-campaign-analysis-grid">
            {[
              ['Delivered', '0', 'Successfully delivered'],
              ['Bounced', '0', 'Failed to deliver'],
              ['Unsubscribed', '0', 'Opted out'],
              ['Spam Reports', '0', 'Marked as spam'],
            ].map(([label, value, detail]) => (
              <article key={label}>
                <span>{label}</span>
                <b>{value}</b>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </section>

        <div className="lp-five-column lp-campaign-status-grid">
          {[
            ['Active', '0', 'Running now'],
            ['Messages', '0', 'Total sent'],
            ['Scheduled', '0', 'Queued'],
            ['Bookings', '0', 'From campaigns'],
            ['Conversion', '0%', 'Overall rate'],
          ].map(([label, value, detail]) => (
            <article className="lp-panel lp-mini-stat" key={label}>
              <span>{label}</span>
              <b>{value}</b>
              <small>{detail}</small>
            </article>
          ))}
        </div>
        <section className="lp-panel lp-section-panel lp-campaign-recent">
          <div className="lp-panel-heading">
            <div>
              <h2>Recent Campaigns</h2>
              <p>Your latest marketing campaigns</p>
            </div>
            <div className="lp-toolbar">
              <SelectField
                label="Recent campaign agent"
                value="All Agents"
                disabled
              >
                <option>All Agents</option>
              </SelectField>
              <SelectField label="Recent campaign filter" value="All Campaigns">
                <option>All Campaigns</option>
              </SelectField>
            </div>
          </div>
          <EmptyState
            icon={<Mail size={23} />}
            title="No Campaigns Yet"
            text="Create automated marketing campaigns to nurture leads and drive conversions."
            action={
              <ActionButton primary>
                <Plus size={14} /> Create Campaign
              </ActionButton>
            }
          />
        </section>
      </section>
    </div>
  );
}

function FormsScreen() {
  const [tab, setTab] = useState('Forms');
  const folders = [
    {
      title: 'Medicare Advantage Lead Intake',
      forms: 7,
      updated: 'Aug 31, 2026',
    },
    {
      title: 'Medicare Supplement (Medigap)',
      forms: 11,
      updated: 'Aug 31, 2026',
    },
  ];
  return (
    <div className="lp-page lp-flush">
      <div className="lp-toolbar lp-filter-toolbar">
        <Tabs
          labels={['Forms', 'Submissions']}
          active={tab}
          onChange={setTab}
        />
        <SearchField placeholder="Search forms..." />
        <SelectField label="Form agent" value="All Agents">
          <option>All Agents</option>
        </SelectField>
        <span className="lp-toolbar-spacer" />
        <ActionButton>
          <Folder size={14} /> New Folder
        </ActionButton>
        <ActionButton>
          <Sparkles size={14} /> AI Build
        </ActionButton>
        <ActionButton primary>
          <Plus size={14} /> Create Form
        </ActionButton>
      </div>
      {tab === 'Forms' ? (
        <div className="lp-grid-shell">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Fields</th>
                <th>Submissions</th>
                <th>Updated On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {folders.map((folder) => (
                <tr key={folder.title}>
                  <td>
                    <button className="lp-folder-link">
                      <Folder size={15} />
                      {folder.title}
                    </button>
                    <small className="lp-cell-detail">
                      {folder.forms} forms
                    </small>
                  </td>
                  <td>
                    <span className="lp-status neutral">Folder</span>
                  </td>
                  <td>—</td>
                  <td>0</td>
                  <td>{folder.updated}</td>
                  <td>
                    <IconButton label={`${folder.title} actions`}>
                      <MoreHorizontal size={14} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination noun="results" total={folders.length} />
        </div>
      ) : (
        <EmptyState
          title="No submissions yet"
          text="Form submissions will appear here."
        />
      )}
    </div>
  );
}

type ContextGroup = {
  label: string;
  items: Array<{ label: string; badge?: string }>;
};

const contextSidebars: Record<
  string,
  { title: string; search?: string; groups: ContextGroup[] }
> = {
  '/settings': {
    title: 'Settings',
    search: 'Search settings',
    groups: [],
  },
  '/phone-system': {
    title: 'Phone',
    groups: [
      {
        label: 'Phone',
        items: [
          { label: 'Phone Numbers' },
          { label: 'Power Dialer' },
          { label: 'Arwyn AI' },
          { label: 'Messaging' },
          { label: 'AI Auto-Reply' },
          { label: 'Scripts' },
          { label: 'Voice' },
          { label: 'Call Identity AI' },
          { label: 'Call Recordings' },
          { label: 'Voicemail' },
          { label: 'A2P Trust Center' },
          { label: 'Analytics' },
          { label: 'Settings' },
        ],
      },
    ],
  },
  '/email-services': {
    title: 'Email',
    groups: [
      {
        label: 'Email',
        items: [
          { label: 'Email Delivery' },
          { label: 'Dedicated Domain' },
          { label: 'Dedicated IP' },
          { label: 'SMTP' },
          { label: 'Gmail SMTP' },
          { label: 'Reply & Forward' },
          { label: 'Analytics' },
          { label: 'Risk' },
          { label: 'Bounce' },
        ],
      },
    ],
  },
  '/life': {
    title: 'Life',
    groups: [
      {
        label: 'Life',
        items: [
          { label: 'Overview' },
          { label: 'Quote' },
          { label: 'Saved Quotes' },
          { label: 'Underwrite AI' },
          { label: 'Marketing', badge: 'Soon' },
        ],
      },
      { label: 'AI Quoting', items: [{ label: 'Life AI' }] },
    ],
  },
  '/medicare': {
    title: 'Medicare',
    groups: [
      {
        label: 'Medicare',
        items: [
          { label: 'Overview' },
          { label: 'T65 Pipeline' },
          { label: 'Quote' },
          { label: 'HealthSherpa' },
          { label: 'Eligibility' },
          { label: 'Doctor Search' },
          { label: 'SOA Generator' },
          { label: 'Annual Reviews' },
          { label: 'CMS Rules' },
          { label: 'Marketing' },
        ],
      },
      {
        label: 'Medicare Quoting',
        items: [
          { label: 'Medicare Advantage' },
          { label: 'MAPD' },
          { label: 'Medicare Supp', badge: 'Upgrading' },
          { label: 'Medicare Part D' },
        ],
      },
      {
        label: 'AI Quoting',
        items: [
          { label: 'Medicare AI' },
          { label: 'Medigap AI', badge: 'Upgrading' },
        ],
      },
    ],
  },
  '/aca-marketplace': {
    title: 'ACA',
    groups: [
      {
        label: 'ACA',
        items: [
          { label: 'Overview' },
          { label: 'Quote' },
          { label: 'Leads & Contacts' },
          { label: 'Eligibility Tracker' },
          { label: 'Saved Quotes' },
          { label: 'Insights' },
          { label: 'Exports' },
          { label: 'Marketing' },
        ],
      },
    ],
  },
  '/agency': {
    title: 'Agency',
    groups: [
      {
        label: 'Overview',
        items: [{ label: 'Dashboard' }, { label: 'Live Call Wallboard' }],
      },
      {
        label: 'Team',
        items: [
          { label: 'Team' },
          { label: 'Sub-Agencies' },
          { label: 'Agents' },
          { label: 'Lead Flow' },
        ],
      },
      {
        label: 'Recruiting',
        items: [{ label: 'Recruiting' }, { label: 'Downlines' }],
      },
      {
        label: 'Production',
        items: [{ label: 'Performance' }, { label: 'Book of Business' }],
      },
      {
        label: 'Ops & Compliance',
        items: [{ label: 'Operations' }, { label: 'Complaints & Audit' }],
      },
    ],
  },
  '/imo-fmo': {
    title: 'Current Agent',
    search: 'Search IMO/FMO...',
    groups: [
      {
        label: 'Overview',
        items: [{ label: 'Dashboard' }],
      },
      {
        label: 'Organization',
        items: [
          { label: 'Organizations' },
          { label: 'Agencies' },
          { label: 'Sub-Agencies' },
          { label: 'Agents' },
        ],
      },
      {
        label: 'Production',
        items: [{ label: 'Production' }, { label: 'Carriers' }],
      },
      { label: 'Insights', items: [{ label: 'Reports' }] },
    ],
  },
  '/org/dashboard': {
    title: 'Current Agent',
    search: 'Search IMO/FMO...',
    groups: [
      {
        label: 'Overview',
        items: [{ label: 'Dashboard' }],
      },
      {
        label: 'Organization',
        items: [
          { label: 'Organizations' },
          { label: 'Agencies' },
          { label: 'Sub-Agencies' },
          { label: 'Agents' },
        ],
      },
      {
        label: 'Production',
        items: [{ label: 'Production' }, { label: 'Carriers' }],
      },
      { label: 'Insights', items: [{ label: 'Reports' }] },
    ],
  },
};

export function usesLiveContextSidebar(route: string) {
  return route in contextSidebars;
}

export function LiveContextSidebar({
  route,
}: {
  route: string;
  navigate: (path: string) => void;
}) {
  const config = contextSidebars[route];
  if (!config) return null;
  return (
    <>
      <div className="brand">
        <span className="brand-mark">U</span>
        <span>
          UNLOCKED <b>CRM</b>
        </span>
      </div>
      <div className="lp-context-title">
        <span>{config.title}</span>
        <ChevronDown size={13} />
      </div>
      {config.search && <SearchField placeholder={config.search} />}
      <nav className="lp-context-nav">
        {config.groups.map((group, groupIndex) => (
          <section key={group.label}>
            <h4>{group.label}</h4>
            {group.items.map((item, itemIndex) => (
              <button
                className={
                  groupIndex === 0 && itemIndex === 0 ? 'selected' : ''
                }
                key={item.label}
              >
                <span>{item.label}</span>
                {item.badge && <small>{item.badge}</small>}
              </button>
            ))}
          </section>
        ))}
      </nav>
      <div className="lp-context-footer">
        <button>
          <Users size={14} /> Brenda Sierra
        </button>
      </div>
    </>
  );
}

function PhoneScreen() {
  const [tab, setTab] = useState('Phone Numbers');
  return (
    <div className="lp-page">
      <div className="lp-panel-heading lp-main-heading">
        <div>
          <h2>Manage Numbers</h2>
          <p>0 Phone Numbers</p>
        </div>
        <ActionButton>
          <RefreshCw size={14} /> Refresh
        </ActionButton>
        <ActionButton primary>
          <Plus size={14} /> Add Number
        </ActionButton>
      </div>
      <p className="lp-intro">
        Manage your Phone Numbers and their configuration here
      </p>
      <Tabs
        labels={['Phone Numbers', 'Number Pools', 'Verified Caller IDs']}
        active={tab}
        onChange={setTab}
      />
      <SearchField placeholder="Search numbers..." />
      <section className="lp-panel lp-section-panel">
        <EmptyState
          title={`No ${tab.toLowerCase()} yet`}
          text="Add or connect a number to start using the local phone workspace."
          action={<ActionButton primary>Add Number</ActionButton>}
        />
      </section>
    </div>
  );
}

function EmailScreen() {
  return (
    <div className="lp-page">
      <section className="lp-email-intro">
        <p>
          Configure a sending domain for reliable bulk and transactional email.
        </p>
      </section>
      <div className="lp-warning">
        <Mail size={16} />
        <span>
          Upgrade email delivery by connecting a dedicated sending domain.
        </span>
        <button aria-label="Dismiss email notice">
          <X size={14} />
        </button>
      </div>
      <section className="lp-panel lp-email-setup">
        <div className="lp-panel-heading">
          <div>
            <h3>Email Delivery Connection</h3>
            <p>Action required — connect your sending domain</p>
          </div>
          <span className="lp-status warning">Setup Required</span>
        </div>
        <div className="lp-email-connect">
          <span className="lp-empty-icon">
            <Mail size={20} />
          </span>
          <div>
            <h4>Connect your sending domain</h4>
            <p>
              Add and verify a domain before sending production email from this
              workspace.
            </p>
          </div>
          <ActionButton primary>Add Dedicated Domain</ActionButton>
          <ActionButton>Contact Support</ActionButton>
        </div>
        <div className="lp-setup-list">
          <h4>Setup progress</h4>
          {[
            'Add your sending domain',
            'Add DNS records',
            'Verify your domain',
          ].map((item, index) => (
            <div key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="lp-panel lp-guide-card">
        <FileText size={19} />
        <div>
          <h3>Email Setup Guide</h3>
          <p>Follow a local walkthrough before connecting your provider.</p>
        </div>
        <ChevronRight size={16} />
      </section>
    </div>
  );
}

function QuotingScreen() {
  const products = [
    ['Life', 'Multi-carrier life quoting'],
    ['Annuity', 'Illustrations and product comparisons', 'Soon'],
    ['Medicare Advantage', 'Compare Medicare Advantage plans'],
    ['Medicare Advantage + Drug (MAPD)', 'Compare bundled MAPD coverage'],
    ['Medicare Supp', 'Compare standardized supplement plans', 'Upgrading'],
    ['Medicare Part D', 'Compare prescription drug coverage'],
    ['ACA Marketplace', 'Estimate plans and premium subsidies'],
    ['Private Plans', 'Explore private health coverage'],
  ];
  return (
    <div className="lp-page">
      <div className="lp-centered-heading left">
        <h2>Select a product to start quoting</h2>
        <p>Launch a local quote flow. Carrier connections are mocked.</p>
      </div>
      <div className="lp-product-grid">
        {products.map(([name, text, badge]) => (
          <button className="lp-product-card" key={name}>
            <span>
              <ClipboardCheck size={19} />
            </span>
            <div>
              <h3>{name}</h3>
              <p>{text}</p>
            </div>
            {badge ? <small>{badge}</small> : <ChevronRight size={16} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function InsuranceBanner({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: string;
}) {
  return (
    <div className="lp-insurance-banner">
      <span>
        <Sparkles size={17} />
      </span>
      <div>
        <b>{title}</b>
        <p>{text}</p>
      </div>
      {action && <ActionButton>{action}</ActionButton>}
    </div>
  );
}

function OverviewEmptyPanel({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: string;
}) {
  return (
    <section className="lp-panel lp-overview-panel">
      <div className="lp-panel-heading">
        <h2>{title}</h2>
        {action && <ActionButton>{action}</ActionButton>}
      </div>
      <EmptyState title="Nothing here yet" text={text} />
    </section>
  );
}

function LifeScreen() {
  return (
    <div className="lp-page">
      <InsuranceBanner
        title="Share a client-facing quote link"
        text="Create a branded quote experience for life insurance prospects."
        action="Marketing"
      />
      <MetricCards
        interactive
        className="lp-overview-metrics"
        items={[
          { label: 'Quotes Run (30d)', value: '0', detail: 'View quotes' },
          {
            label: 'Clients Quoted (30d)',
            value: '0',
            detail: 'View clients',
          },
          { label: 'Saved Quotes', value: '0', detail: 'Open saved quotes' },
          {
            label: 'Awaiting Application',
            value: '0',
            detail: 'Review cases',
          },
        ]}
      />
      <div className="lp-metric-strip">
        {[
          ['Average premium', '$0'],
          ['Average coverage', '$0'],
          ['Top carrier', '—'],
          ['Applied', '0'],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <div className="lp-two-column">
        <OverviewEmptyPanel
          title="Needs attention"
          text="Cases requiring action will appear here."
        />
        <OverviewEmptyPanel
          title="Saved quote pipeline"
          text="Saved quotes will appear here."
          action="Start a quote"
        />
      </div>
      <OverviewEmptyPanel
        title="Recent quotes"
        text="Your newest quotes will appear here."
        action="New quote"
      />
      <OverviewEmptyPanel
        title="Agent performance"
        text="Quote activity by agent will appear here."
      />
    </div>
  );
}

function MedicareScreen() {
  return (
    <div className="lp-page">
      <InsuranceBanner
        title="AEP opens October 15"
        text="Opens Oct 15 · in 44 days"
        action="Enrollment windows"
      />
      <h2 className="lp-section-title">Enrollment windows</h2>
      <MetricCards
        interactive
        className="lp-overview-metrics"
        items={[
          { label: 'T65 Pipeline', value: '0', detail: 'View pipeline' },
          { label: 'SOAs Pending', value: '0', detail: 'Open SOAs' },
          { label: 'Reviews Due', value: '0', detail: 'View reviews' },
          { label: 'Enrollments', value: '0', detail: 'View enrollments' },
        ]}
      />
      <div className="lp-two-column">
        <OverviewEmptyPanel
          title="Turning 65 soon"
          text="Clients approaching Medicare eligibility will appear here."
        />
        <section className="lp-panel lp-overview-panel">
          <div className="lp-panel-heading">
            <h2>T65 pipeline by window</h2>
          </div>
          <div className="lp-window-list">
            {['In IEP window', '3–6 months', '6–9 months', '9–12 months'].map(
              (window) => (
                <div key={window}>
                  <span>{window}</span>
                  <b>0</b>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
      <section className="lp-panel lp-section-panel">
        <div className="lp-panel-heading">
          <h2>Quick actions</h2>
        </div>
        <div className="lp-quick-grid four">
          {[
            'New SOA',
            'Start a quote',
            'Check eligibility',
            'Doctor search',
          ].map((action) => (
            <button key={action}>
              <Plus size={14} />
              {action}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function AcaScreen() {
  const leads = [
    {
      name: 'Mara Testwell',
      initials: 'MT',
      detail: 'Medicare transition review',
    },
    { name: 'Eli Sample', initials: 'ES', detail: 'Needs ACA quote' },
  ];
  return (
    <div className="lp-page">
      <InsuranceBanner
        title="Special Enrollment Period"
        text="Open Enrollment starts November 1. Prepare your lead pipeline now."
        action="View eligibility"
      />
      <MetricCards
        interactive
        className="lp-overview-metrics"
        items={[
          { label: 'Active ACA Leads', value: '2', detail: '100% of leads' },
          { label: 'Needs a Quote', value: '2', detail: '100% of leads' },
          {
            label: 'Pending Enrollment',
            value: '0',
            detail: '0% of leads',
          },
          {
            label: 'Medicare Pending',
            value: '0',
            detail: '0% of leads',
          },
        ]}
      />
      <div className="lp-metric-strip">
        {[
          ['Average subsidy', '$0'],
          ['Average net premium', '$0'],
          ['Estimated APTC', '$0'],
          ['Enrollments', '0'],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <div className="lp-two-column">
        <section className="lp-panel lp-overview-panel">
          <div className="lp-panel-heading">
            <h2>Needs attention</h2>
          </div>
          <div className="lp-lead-list">
            {leads.map((lead) => (
              <div key={lead.name}>
                <span>{lead.initials}</span>
                <div>
                  <b>{lead.name}</b>
                  <small>{lead.detail}</small>
                </div>
                <ActionButton>Quote</ActionButton>
              </div>
            ))}
          </div>
        </section>
        <section className="lp-panel lp-overview-panel">
          <div className="lp-panel-heading">
            <h2>ACA Lead Funnel</h2>
          </div>
          <div className="lp-funnel">
            {[
              ['New', '2 · 100%'],
              ['Quoted', '0 · 0%'],
              ['Enrolled', '0 · 0%'],
              ['Nurture', '0 · 0%'],
              ['Medicare Pending', '0 · 0%'],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="lp-two-column">
        <section className="lp-panel lp-overview-panel">
          <div className="lp-panel-heading">
            <h2>Recent leads</h2>
          </div>
          <div className="lp-lead-list">
            {leads.map((lead) => (
              <div key={lead.name}>
                <span>{lead.initials}</span>
                <div>
                  <b>{lead.name}</b>
                  <small>{lead.detail}</small>
                </div>
                <ActionButton>Open</ActionButton>
              </div>
            ))}
          </div>
        </section>
        <section className="lp-panel lp-overview-panel lp-agent-performance">
          <div className="lp-panel-heading">
            <h2>Agent performance</h2>
          </div>
          <div className="lp-grid-shell">
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Leads</th>
                  <th>Quoted</th>
                  <th>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Brenda Sierra</td>
                  <td>2</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function CommissionPlusScreen() {
  const benefits = [
    ['300+ Insurance Carriers', 'Connect carrier statements in one place.'],
    ['Auto-Sync Commission Records', 'Keep payment data up to date.'],
    ['Secure & Compliant', 'Protect sensitive commission information.'],
    ['Auto-Sync Book of Business', 'Match policies and payment records.'],
  ];
  return (
    <div className="lp-page lp-commission-plus">
      <section className="lp-commission-hero">
        <span className="lp-logo large">U</span>
        <div>
          <h1>Auto-Sync Your Commissions</h1>
          <p>
            Replace manual imports with a connected commission and book-of-
            business workflow.
          </p>
          <ActionButton primary>Auto-Sync Your Commissions</ActionButton>
        </div>
        <div
          className="lp-commission-chart"
          aria-label="Commission+ Visual Chart"
        >
          <span>Commission+ Visual Chart</span>
          {[
            [42, 78],
            [67, 54],
            [86, 91],
            [112, 66],
            [138, 112],
          ].map(([left, top], index) => (
            <i key={left} style={{ left, top, height: 34 + index * 11 }} />
          ))}
        </div>
      </section>
      <div className="lp-benefit-grid">
        {benefits.map(([title, text]) => (
          <article key={title}>
            <span>
              <Check size={15} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <section className="lp-tutorials">
        <h2>How-To Tutorials</h2>
        <div className="lp-card-grid">
          {[
            'Overview of Commission+',
            'Sync Your Book of Business',
            'Sync Your Commissions',
            'HealthSherpa & Disposition Forms',
          ].map((title, index) => (
            <button className="lp-tutorial-card" key={title}>
              <span>{index + 1}</span>
              <div>
                <b>{title}</b>
                <small>Watch tutorial</small>
              </div>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="lp-settings-content">
      <div className="lp-settings-empty">
        <Settings size={24} />
        <h2>Workspace settings</h2>
        <p>
          Select a settings category from search. Destructive account and
          billing controls are intentionally unavailable in this local copy.
        </p>
      </div>
    </div>
  );
}

function AgencyScreen() {
  return (
    <div className="lp-page">
      <MetricCards
        items={[
          { label: 'Agents', value: '1' },
          { label: 'Sub-Agencies', value: '0' },
          { label: 'Active Leads', value: '2' },
          { label: 'Policies', value: '1' },
        ]}
      />
      <div className="lp-two-column">
        <OverviewEmptyPanel
          title="Team performance"
          text="Production activity will appear here."
        />
        <OverviewEmptyPanel
          title="Lead flow"
          text="Routing activity will appear here."
        />
      </div>
    </div>
  );
}

function OrganizationScreen() {
  const metrics = [
    ['Organizations', '0', 'Manage downline organizations'],
    ['IMO', '0', 'Insurance marketing organizations'],
    ['FMO', '0', 'Field marketing organizations'],
    ['BGA', '0', 'Brokerage general agencies'],
    ['MGA', '0', 'Managing general agencies'],
    ['Agencies', '0', 'Active agency relationships'],
    ['Agents', '1', 'Licensed producers'],
    ['Active policies', '1', 'Across all organizations'],
    ['Annualized premium', '$0', 'Current production'],
    ['Commissions', '$0', 'Paid and pending'],
    ['Carriers', '1', 'Available carrier relationships'],
  ];
  return (
    <div className="lp-page lp-organization-page">
      <div className="lp-organization-intro">
        <span className="lp-beta">Beta</span>
        <p>
          Monitor organizations, agencies, agents, production, and carrier
          relationships from one workspace.
        </p>
      </div>
      <MetricCards
        columns={5}
        className="lp-organization-metrics"
        interactive
        items={metrics.map(([label, value, detail]) => ({
          label,
          value,
          detail,
        }))}
      />
      <section className="lp-panel lp-organization-production">
        <div className="lp-panel-heading">
          <div>
            <h2>Organizations by production</h2>
            <p>Compare annualized premium across your downline.</p>
          </div>
          <ActionButton>View all</ActionButton>
        </div>
        <EmptyState
          icon={<Sparkles size={22} />}
          title="No production data yet"
          text="Organization production will appear here as policies are issued."
        />
      </section>
      <section className="lp-panel lp-organization-carriers">
        <div className="lp-panel-heading">
          <div>
            <h2>Carrier reach</h2>
            <p>Policies and annualized premium by carrier.</p>
          </div>
        </div>
        <div className="lp-grid-shell">
          <table>
            <thead>
              <tr>
                <th>Carrier</th>
                <th>Policies</th>
                <th>Annualized premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Humana</td>
                <td>1</td>
                <td>$0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MoreScreen({ navigate }: { navigate: (path: string) => void }) {
  const tools = [
    ['Integrations', '/settings'],
    ['Client Portal', '/contacts'],
    ['Clinic Portal', '/contacts'],
    ['Carriers', '/policies'],
    ['Policy Analyzer', '/underwriting'],
  ];
  return (
    <div className="lp-page lp-more-page">
      <p>Jump to a tool, or manage what stays on your sidebar.</p>
      <ActionButton>Manage</ActionButton>
      <h2>Platform</h2>
      <div className="lp-more-grid">
        {tools.map(([label, path]) => (
          <button key={label} onClick={() => navigate(path)}>
            <span>
              <Grid2X2 size={17} />
            </span>
            <b>{label}</b>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </div>
  );
}
