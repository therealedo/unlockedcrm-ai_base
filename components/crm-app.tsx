/* oxlint-disable jsx-a11y/prefer-tag-over-role */
'use client';

import { type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BadgeDollarSign,
  Bell,
  Bot,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  FileChartColumn,
  FileText,
  Filter,
  Folder,
  FormInput,
  Grid2X2,
  Headphones,
  HeartPulse,
  Home,
  Inbox,
  LifeBuoy,
  Link2,
  Mail,
  Menu,
  MessageSquareText,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  CrmData,
  DEFAULT_CRM_DATA,
  PIPELINE_STAGES,
  STORAGE_KEY,
  currency,
} from '@/lib/crm-data';
import {
  LiveContextSidebar,
  LiveParityHeaderExtras,
  LiveParityRouter,
  type RailPopoverName,
  RailWorkspacePopover,
  usesLiveContextSidebar,
} from '@/components/live-parity-pages';

type ModalName =
  | 'contact'
  | 'task'
  | 'opportunity'
  | 'appointment'
  | 'policy'
  | 'commission'
  | 'booking'
  | null;

const railItems = [
  [Home, 'Home', '/'],
  [Phone, 'Phone', '/phone-system'],
  [Mail, 'Email', '/email-services'],
  [ClipboardCheck, 'Quoting', '/quoting'],
  [ShieldCheck, 'Life', '/life'],
  [HeartPulse, 'Medicare', '/medicare'],
  [HeartPulse, 'ACA', '/aca-marketplace'],
  [Zap, 'Build', '/automations'],
  [CircleDollarSign, 'Comm+', '/commission-plus'],
  [Users, 'Agency', '/agency'],
  [Target, 'IMO/FMO', '/imo-fmo'],
  [Menu, 'More', '/more'],
] as const;

const menuGroups = [
  {
    label: 'CRM',
    items: [
      [Sparkles, 'unLocked AI', '/unlocked-ai'],
      [Inbox, 'Inbox', '/inbox'],
      [Users, 'Contacts', '/contacts'],
      [TrendingUp, 'Pipeline', '/pipeline'],
      [CalendarDays, 'Calendar', '/calendar'],
    ],
  },
  {
    label: 'Tools',
    items: [
      [Bot, 'Agent AI', '/agent-ai'],
      [Zap, 'Automations', '/automations'],
      [WandSparkles, 'AI Quoting', '/ai-quoting'],
      [ShieldCheck, 'Underwrite AI', '/underwriting'],
      [Mail, 'Campaigns', '/campaigns'],
      [FormInput, 'Forms', '/forms'],
    ],
  },
  {
    label: 'Business',
    items: [
      [ClipboardCheck, 'Policies', '/policies'],
      [BadgeDollarSign, 'Commissions', '/commissions'],
      [ClipboardCheck, 'Tasks', '/tasks'],
      [Target, 'Booking Links', '/booking-links'],
      [Activity, 'Analytics', '/analytics'],
      [FileText, 'Documents', '/documents'],
    ],
  },
] as const;

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/unlocked-ai': 'unLocked AI',
  '/inbox': 'Inbox',
  '/contacts': 'Contacts',
  '/pipeline': 'Pipeline',
  '/calendar': 'Calendar',
  '/agent-ai': 'Agent AI',
  '/automations': 'Automations',
  '/ai-quoting': 'AI Quoting',
  '/underwrite-ai': 'Underwrite AI',
  '/underwriting': 'Underwrite AI',
  '/campaigns': 'Campaigns',
  '/forms': 'Forms',
  '/policies': 'Policies',
  '/commissions': 'Commissions',
  '/tasks': 'Tasks',
  '/booking-links': 'Booking Links',
  '/analytics': 'Analytics',
  '/documents': 'Documents',
  '/phone-system': 'Phone System',
  '/email-services': 'Email Suite',
  '/quoting': 'Quoting',
  '/life': 'Overview',
  '/medicare': 'Overview',
  '/aca-marketplace': 'Overview',
  '/commission-plus': 'Commission+',
  '/agency': 'Agency',
  '/imo-fmo': 'IMO/FMO',
  '/org/dashboard': 'IMO/FMO',
  '/more': 'More',
  '/settings': 'Settings',
};

const immersiveRoutes = new Set([
  '/unlocked-ai',
  '/ai-quoting',
  '/commission-plus',
]);

const coreRoutes = new Set([
  '/contacts',
  '/pipeline',
  '/tasks',
  '/calendar',
  '/inbox',
]);

const notifications = [
  [
    'Need help? We’re here 🤝',
    'Check the Help Center or reach out directly anytime.',
    'about 1 hour ago',
  ],
  [
    'Book your onboarding call 📞',
    '1-hour strategy call to get you fully set up.',
    'about 1 hour ago',
  ],
  [
    'Welcome to unLocked CRM! 🚀',
    'Your insurance command center is ready.',
    'about 1 hour ago',
  ],
  [
    'Last Contacted now looks after itself',
    'Calls, texts, and emails update the date automatically.',
    'about 14 hours ago',
  ],
];

function cloneDefaults(): CrmData {
  return JSON.parse(JSON.stringify(DEFAULT_CRM_DATA)) as CrmData;
}

function formString(form: FormData, key: string, fallback = '') {
  const value = form.get(key);
  return typeof value === 'string' && value ? value : fallback;
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/\b([a-z]+)ies\b/g, '$1y')
    .replace(/\b([a-z]{3,})s\b/g, '$1');
}

export default function CrmApp() {
  const [route, setRoute] = useState('/');
  const [pipelineView, setPipelineView] = useState('Board');
  const [taskView, setTaskView] = useState('Board');
  const [calendarView, setCalendarView] = useState('Calendar');
  const [data, setData] = useState<CrmData>(() => cloneDefaults());
  const [hydrated, setHydrated] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [iconsOnly, setIconsOnly] = useState(false);
  const [density, setDensity] = useState<'comfortable' | 'compact'>(
    'comfortable',
  );
  const [toast, setToast] = useState('');
  const [railPopover, setRailPopover] = useState<RailPopoverName | null>(null);

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.pathname || '/');
    window.addEventListener('popstate', syncRoute);
    const frame = window.requestAnimationFrame(() => {
      syncRoute();
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setData(JSON.parse(stored) as CrmData);
        setCollapsed(
          localStorage.getItem('unlockedcrm-nav-collapsed') === 'true',
        );
        setIconsOnly(localStorage.getItem('unlockedcrm-icons-only') === 'true');
      } catch {
        /* keep seeded local data */
      }
      setHydrated(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    setRoute(path);
    setAiOpen(false);
    setRailPopover(null);
  }

  function handleRailNavigation(path: string) {
    if (path === '/agency') {
      setRailPopover((current) => (current === 'agency' ? null : 'agency'));
      return;
    }
    if (path === '/imo-fmo') {
      setRailPopover((current) => (current === 'imo' ? null : 'imo'));
      return;
    }
    if (path === '/more') {
      setRailPopover((current) => (current === 'more' ? null : 'more'));
      return;
    }
    navigate(path);
  }

  function toggleCollapsed() {
    setCollapsed((value) => {
      localStorage.setItem('unlockedcrm-nav-collapsed', String(!value));
      return !value;
    });
  }

  const routeTitle =
    routeTitles[route] ??
    route.split('/').filter(Boolean).pop()?.replaceAll('-', ' ') ??
    'Home';
  const isImmersive = immersiveRoutes.has(route);
  const isCoreRoute = coreRoutes.has(route);
  const searchResults = useMemo(() => {
    const term = normalizeSearch(searchTerm.trim());
    if (!term) return [];
    const pages = Object.entries(routeTitles).map(([path, title]) => ({
      title,
      subtitle: 'Page',
      path,
    }));
    const contacts = data.contacts.map((contact) => ({
      title: `${contact.firstName} ${contact.lastName}`,
      subtitle: contact.product,
      path: '/contacts',
    }));
    return [...pages, ...contacts]
      .filter((item) =>
        normalizeSearch(`${item.title} ${item.subtitle}`).includes(term),
      )
      .slice(0, 8);
  }, [searchTerm, data.contacts]);

  function addContact(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const firstName = formString(form, 'firstName').trim();
    const lastName = formString(form, 'lastName').trim();
    const email = formString(form, 'email').trim();
    const phone = formString(form, 'phone').trim();
    if (!firstName || !lastName || (!email && !phone)) return;
    setData((current) => ({
      ...current,
      contacts: [
        {
          id: crypto.randomUUID(),
          firstName,
          lastName,
          email,
          phone,
          birthDate: '',
          gender: '—',
          zip: '',
          strength: 'New',
          lastInteraction: 'Just now',
          tags: ['New lead'],
          product: formString(form, 'product', 'Medicare Advantage'),
          source: formString(form, 'source', 'Manual'),
          agent: 'Brenda Sierra',
        },
        ...current.contacts,
      ],
    }));
    setModal(null);
    setToast('Contact created locally');
  }

  function addTask(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = formString(form, 'title').trim();
    if (!title) return;
    const status = formString(form, 'status', 'To-Do') as
      | 'To-Do'
      | 'In Progress'
      | 'Due'
      | 'Done';
    setData((current) => ({
      ...current,
      tasks: [
        {
          id: crypto.randomUUID(),
          title,
          status,
          priority: formString(form, 'priority', 'Medium') as
            | 'Low'
            | 'Medium'
            | 'High',
          contact: formString(form, 'contact', 'No contact linked'),
          due: formString(form, 'due', 'No due date'),
          assignee: 'Brenda Sierra',
          details: formString(form, 'details'),
        },
        ...current.tasks,
      ],
    }));
    setModal(null);
    setToast('Task saved locally');
  }

  function addOpportunity(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = formString(form, 'name').trim();
    if (!name) return;
    setData((current) => ({
      ...current,
      opportunities: [
        {
          id: crypto.randomUUID(),
          name,
          contact: formString(form, 'contact', 'Unassigned'),
          stage: formString(form, 'stage', 'Prospect'),
          value: Number(form.get('value') || 0),
          probability: 50,
          product: formString(form, 'product', 'Medicare Advantage'),
          carrier: formString(form, 'carrier', 'TBD'),
          agent: 'Brenda Sierra',
          days: 0,
        },
        ...current.opportunities,
      ],
    }));
    setModal(null);
    setToast('Opportunity added');
  }

  function addAppointment(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = formString(form, 'title').trim();
    if (!title) return;
    setData((current) => ({
      ...current,
      appointments: [
        ...current.appointments,
        {
          id: crypto.randomUUID(),
          title,
          contact: formString(form, 'contact', 'No contact'),
          date: formString(form, 'date', '2026-09-01'),
          time: formString(form, 'time', '9:00 AM'),
          type: formString(form, 'type', 'Phone Call'),
          status: 'Confirmed',
        },
      ],
    }));
    setModal(null);
    setToast('Appointment created');
  }

  function addPolicy(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const client = formString(form, 'client').trim();
    if (!client) return;
    setData((current) => ({
      ...current,
      policies: [
        {
          id: crypto.randomUUID(),
          client,
          agent: 'Brenda Sierra',
          carrier: formString(form, 'carrier', 'Carrier TBD'),
          type: formString(form, 'type', 'Medicare Advantage'),
          number: formString(
            form,
            'number',
            `LOCAL-${Date.now().toString().slice(-6)}`,
          ),
          status: 'Active',
          renewal: formString(form, 'renewal', '2027-01-01'),
          premium: Number(form.get('premium') || 0),
        },
        ...current.policies,
      ],
    }));
    setModal(null);
    setToast('Policy added');
  }

  function addCommission(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount') || 0);
    if (!(amount > 0)) {
      setToast('Commission amount must be greater than zero');
      return;
    }
    setData((current) => ({
      ...current,
      commissions: [
        {
          id: crypto.randomUUID(),
          client: formString(form, 'client', 'Unassigned'),
          agent: 'Brenda Sierra',
          carrier: formString(form, 'carrier', 'Carrier TBD'),
          product: formString(form, 'product', 'Medicare Advantage'),
          type: formString(form, 'type', 'Initial'),
          policy: formString(form, 'policy', '—'),
          amount,
          status: 'Pending',
          paymentDate: formString(form, 'date', '2026-09-30'),
        },
        ...current.commissions,
      ],
    }));
    setModal(null);
    setToast('Commission added');
  }

  function addBooking(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = formString(form, 'name').trim();
    if (!name) return;
    const slug = formString(
      form,
      'slug',
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    );
    setData((current) => ({
      ...current,
      bookingLinks: [
        ...current.bookingLinks,
        {
          id: crypto.randomUUID(),
          name,
          type: formString(form, 'type', 'Personal') as
            | 'Personal'
            | 'Round Robin',
          duration: Number(form.get('duration') || 30),
          slug,
          status: 'Active',
        },
      ],
    }));
    setModal(null);
    setToast('Booking link created');
  }

  if (!hydrated) {
    return (
      <main className="app-loading" aria-label="Loading local CRM">
        <span className="brand-mark">U</span>
        <span>Loading local workspace…</span>
      </main>
    );
  }

  return (
    <main
      className={`crm-shell ${collapsed ? 'nav-collapsed' : ''} ${iconsOnly ? 'icons-only' : ''}`}
    >
      <aside className="app-rail" aria-label="Product navigation">
        <button
          className="rail-collapse"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <PanelLeftOpen size={14} />
          ) : (
            <PanelLeftClose size={14} />
          )}
        </button>
        <nav className="rail-nav">
          {railItems.map(([Icon, label, path]) => {
            const popoverName: RailPopoverName | null =
              path === '/agency'
                ? 'agency'
                : path === '/imo-fmo'
                  ? 'imo'
                  : path === '/more'
                    ? 'more'
                    : null;
            const active =
              route === path ||
              (path === '/imo-fmo' && route === '/org/dashboard') ||
              (popoverName !== null && railPopover === popoverName);
            return (
              <button
                className={`rail-item ${active ? 'active' : ''}`}
                key={label}
                onClick={() => handleRailNavigation(path)}
              >
                <Icon size={15} strokeWidth={1.7} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
        <div className="rail-bottom">
          <button className="rail-item">
            <UserPlus size={15} />
            <span>Earn</span>
          </button>
          <button className="rail-item">
            <Headphones size={15} />
            <span>Support</span>
          </button>
          <button
            className={`rail-settings ${route === '/settings' ? 'active' : ''}`}
            aria-label="Settings"
            onClick={() => navigate('/settings')}
          >
            <Settings size={15} />
          </button>
        </div>
      </aside>

      {railPopover && (
        <RailWorkspacePopover
          name={railPopover}
          navigate={navigate}
          onClose={() => setRailPopover(null)}
        />
      )}

      <aside className="section-sidebar">
        {usesLiveContextSidebar(route) ? (
          <LiveContextSidebar route={route} navigate={navigate} />
        ) : (
          <>
            <div className="brand">
              <span className="brand-mark">U</span>
              <span>
                UNLOCKED <b>CRM</b>
              </span>
            </div>
            <button className="learn">
              <span className="learn-dot" />
              Learn unLocked <small>0/3</small>
              <X size={13} />
            </button>
            <div className="sidebar-tools">
              <button aria-label="Search" onClick={() => setSearchOpen(true)}>
                <Search size={17} />
              </button>
              <button
                aria-label="Customize"
                onClick={() => setCustomizeOpen(true)}
              >
                <SlidersHorizontal size={15} />
                Customize
              </button>
            </div>
            <nav className="section-nav">
              {menuGroups.map((group) => (
                <section key={group.label}>
                  <h2>
                    {group.label}
                    <ChevronDown size={11} />
                  </h2>
                  {group.items.map(([Icon, label, path]) => (
                    <button
                      className={route === path ? 'selected' : ''}
                      key={label}
                      onClick={() => navigate(path)}
                    >
                      <Icon size={16} strokeWidth={1.6} />
                      {!iconsOnly && <span>{label}</span>}
                    </button>
                  ))}
                </section>
              ))}
            </nav>
            <button className="invite">
              <UserPlus size={16} />
              Invite Agent
            </button>
          </>
        )}
      </aside>

      <section className="workspace">
        {route === '/' && (
          <div className="call-banner">
            <CalendarDays size={15} />
            <span>
              Book an onboarding or coaching call to optimize your system.
            </span>
            <button
              className="banner-link"
              onClick={() => navigate('/booking-links')}
            >
              Book a call <ChevronRight size={14} />
            </button>
            <button aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}
        {!isImmersive && (
          <header className="workspace-header">
            <div className="workspace-heading-group">
              <h1>{routeTitle}</h1>
              <LiveParityHeaderExtras
                route={route}
                data={data}
                pipelineView={pipelineView}
                taskView={taskView}
                calendarView={calendarView}
                setPipelineView={setPipelineView}
                setTaskView={setTaskView}
                setCalendarView={setCalendarView}
              />
            </div>
            <nav>
              {route === '/' && (
                <>
                  <button
                    className={`icon-button ${density === 'comfortable' ? 'selected' : ''}`}
                    aria-label="Comfortable view"
                    onClick={() => setDensity('comfortable')}
                  >
                    <Grid2X2 size={15} />
                  </button>
                  <button
                    className={`icon-button ${density === 'compact' ? 'selected' : ''}`}
                    aria-label="Compact view"
                    onClick={() => setDensity('compact')}
                  >
                    <Menu size={15} />
                  </button>
                </>
              )}
              {route === '/settings' && (
                <button className="support">
                  <RefreshCw size={15} />
                  Switch workspace
                </button>
              )}
              <button className="support">
                <LifeBuoy size={15} />
                Support
              </button>
              <button
                className="notification"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell size={16} />
                <span>4</span>
              </button>
              <button className="ask-ai" onClick={() => setAiOpen(true)}>
                <span className="tiny-logo">U</span>Ask unLocked AI
              </button>
              <button className="avatar">BS</button>
            </nav>
          </header>
        )}

        <div
          className={`workspace-scroll route-${route === '/' ? 'home' : 'module'} ${isImmersive ? 'is-immersive' : ''} ${isCoreRoute ? 'route-core' : ''}`}
        >
          {route === '/' && (
            <HomeScreen
              data={data}
              density={density}
              openTask={() => setModal('task')}
              openAppointment={() => setModal('appointment')}
            />
          )}
          {route !== '/' && (
            <LiveParityRouter
              route={route}
              data={data}
              navigate={navigate}
              pipelineView={pipelineView}
              taskView={taskView}
              calendarView={calendarView}
              setPipelineView={setPipelineView}
              setTaskView={setTaskView}
              setCalendarView={setCalendarView}
              openContact={() => setModal('contact')}
              openTask={() => setModal('task')}
              openOpportunity={() => setModal('opportunity')}
              openAppointment={() => setModal('appointment')}
              openPolicy={() => setModal('policy')}
              openCommission={() => setModal('commission')}
              openBooking={() => setModal('booking')}
            />
          )}
        </div>

        <button
          className="floating-ai"
          aria-label="Open unLocked AI"
          onClick={() => setAiOpen((value) => !value)}
        >
          U
        </button>
        {aiOpen && (
          <AiDrawer routeTitle={routeTitle} onClose={() => setAiOpen(false)} />
        )}
        {notificationsOpen && (
          <NotificationDrawer onClose={() => setNotificationsOpen(false)} />
        )}
      </section>

      {customizeOpen && (
        <CustomizeDialog
          iconsOnly={iconsOnly}
          setIconsOnly={(value) => {
            setIconsOnly(value);
            localStorage.setItem('unlockedcrm-icons-only', String(value));
          }}
          onClose={() => setCustomizeOpen(false)}
        />
      )}
      {searchOpen && (
        <SearchDialog
          term={searchTerm}
          setTerm={setSearchTerm}
          results={searchResults}
          navigate={(path) => {
            navigate(path);
            setSearchOpen(false);
            setSearchTerm('');
          }}
          onClose={() => setSearchOpen(false)}
        />
      )}
      {modal && (
        <CrudModal
          modal={modal}
          data={data}
          onClose={() => setModal(null)}
          handlers={{
            contact: addContact,
            task: addTask,
            opportunity: addOpportunity,
            appointment: addAppointment,
            policy: addPolicy,
            commission: addCommission,
            booking: addBooking,
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <Check size={15} />
          {toast}
        </div>
      )}
    </main>
  );
}

function HomeScreen({
  data,
  density,
  openTask,
  openAppointment,
}: {
  data: CrmData;
  density: string;
  openTask: () => void;
  openAppointment: () => void;
}) {
  const pipelineValue = data.opportunities.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  return (
    <div className={`home-content ${density}`}>
      <div className="system-alert">
        <span>⚠</span>
        <b>Email upgrades in progress</b>
        <span>
          · We&apos;re making sending and deliverability more reliable. Some
          email features may be briefly unavailable in the meantime.
        </span>
        <button aria-label="Dismiss alert">
          <X size={14} />
        </button>
      </div>
      <div className="dashboard-column">
        <div className="kpi-strip">
          <Kpi label="CALLS TODAY" value="6" />
          <Kpi label="ACTIVE PIPELINE" value={currency(pipelineValue)} />
          <Kpi label="QUOTES TODAY" value="3" />
          <Kpi
            label="WALLET"
            value={currency(
              data.commissions
                .filter((c) => c.status === 'Paid')
                .reduce((s, c) => s + c.amount, 0),
            )}
          />
        </div>
        <section className="welcome">
          <h1>Good evening, Brenda.</h1>
          <div className="conversation-meta">
            <MessageSquareText size={14} />
            No recent chats <span>·</span>
            <button>New Conversation</button>
          </div>
          <div className="ai-composer">
            <textarea
              aria-label="Ask anything about your CRM"
              placeholder="Ask anything about your CRM..."
            />
            <div className="composer-footer">
              <button aria-label="Add">
                <Plus size={18} />
              </button>
              <div>
                <button className="model">
                  Starlite 3.4 <span>Max</span>
                  <ChevronDown size={13} />
                </button>
                <button aria-label="Voice">
                  <Mic size={16} />
                </button>
                <button className="send" aria-label="Send">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
          <button className="prep">
            <Sparkles size={16} />
            Prep for next meeting
          </button>
        </section>
        <section className="dashboard-card activity-card">
          <header>
            <div className="card-icon">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h2>Today&apos;s Activity</h2>
              <p>Everything on your plate today</p>
            </div>
            <div className="card-actions">
              <span>
                {data.tasks.filter((task) => task.status !== 'Done').length}
              </span>
              <button aria-label="Refresh">
                <RefreshCw size={15} />
              </button>
            </div>
          </header>
          <div className="activity-list">
            {data.tasks.slice(0, 3).map((task) => (
              <div key={task.id}>
                <span
                  className={`priority-dot ${task.priority.toLowerCase()}`}
                />
                <div>
                  <strong>{task.title}</strong>
                  <p>
                    {task.contact} · {task.due}
                  </p>
                </div>
                <span className="status-pill">{task.status}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="dashboard-grid">
          <section className="dashboard-card meetings-card">
            <header>
              <div className="card-icon">
                <CalendarDays size={18} />
              </div>
              <div>
                <h2>Meetings</h2>
                <p>Today, Aug 31</p>
              </div>
              <div className="card-actions">
                <ChevronLeft size={15} />
                <ChevronRight size={15} />
              </div>
            </header>
            <div className="mini-list">
              {data.appointments.slice(0, 2).map((item) => (
                <div key={item.id}>
                  <b>{item.time}</b>
                  <span>
                    {item.title}
                    <small>{item.contact}</small>
                  </span>
                </div>
              ))}
              <button onClick={openAppointment}>
                <Plus size={14} />
                Schedule meeting
              </button>
            </div>
          </section>
          <section className="dashboard-card tasks-card">
            <header>
              <div className="card-icon">
                <ClipboardCheck size={18} />
              </div>
              <div>
                <h2>Tasks</h2>
                <p>Stay on top of work</p>
              </div>
              <button className="text-action" onClick={openTask}>
                New task
              </button>
            </header>
            <div className="mini-list">
              {data.tasks.slice(0, 2).map((item) => (
                <div key={item.id}>
                  <span
                    className={`task-check ${item.status === 'Done' ? 'done' : ''}`}
                  >
                    {item.status === 'Done' ? '✓' : ''}
                  </span>
                  <span>
                    {item.title}
                    <small>{item.due}</small>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModuleHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="module-title">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="module-actions">{actions}</div>
    </div>
  );
}
function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function ContactsScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = data.contacts.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="module-page">
      <ModuleHeader
        title="Contacts"
        actions={
          <>
            <button className="secondary-button">
              <WandSparkles size={15} />
              AI Upload
            </button>
            <button className="secondary-button">
              <Upload size={15} />
              Upload List
            </button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Create Contact
            </button>
          </>
        }
      />
      <div className="subtabs">
        <Chip active>All Contacts</Chip>
        <Chip>Lead Lists</Chip>
        <Chip>Restore</Chip>
        <Chip>Manage Lead Lists</Chip>
        <Chip>Family Trees</Chip>
      </div>
      <div className="toolbar-row">
        <Chip>
          Sorted by <b>None</b>
        </Chip>
        <Chip>
          <Filter size={14} />
          Add filter
        </Chip>
        <Chip>Recently viewed</Chip>
        <Chip>Leads &amp; Clients</Chip>
        <Chip>Columns</Chip>
        <div className="search-box">
          <Search size={15} />
          <input
            aria-label="Search contacts"
            placeholder="Search contacts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span>{filtered.length} records</span>
      </div>
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Birth Date</th>
              <th>Gender</th>
              <th>Zip Code</th>
              <th>Connection Strength</th>
              <th>Last Interaction</th>
              <th>Tags</th>
              <th>Product Interest</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => (
              <tr key={contact.id}>
                <td aria-label={`${contact.firstName} ${contact.lastName}`}>
                  <div className="person-cell">
                    <span>
                      {contact.firstName[0]}
                      {contact.lastName[0]}
                    </span>
                    <b>
                      {contact.firstName} {contact.lastName}
                    </b>
                  </div>
                </td>
                <td>{contact.phone || '—'}</td>
                <td>{contact.email || '—'}</td>
                <td>{contact.birthDate || '—'}</td>
                <td>{contact.gender}</td>
                <td>{contact.zip || '—'}</td>
                <td>
                  <span
                    className={`strength ${contact.strength.toLowerCase()}`}
                  >
                    {contact.strength}
                  </span>
                </td>
                <td>{contact.lastInteraction}</td>
                <td>
                  {contact.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </td>
                <td>{contact.product}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination count={filtered.length} />
    </div>
  );
}

export function PipelineScreen({
  data,
  view,
  setView,
  openModal,
}: {
  data: CrmData;
  view: string;
  setView: (v: 'board' | 'table') => void;
  openModal: () => void;
}) {
  return (
    <div className="module-page">
      <ModuleHeader
        title="Recruiting Pipeline"
        subtitle={`${data.opportunities.length} active opportunities`}
        actions={
          <>
            <button className="secondary-button">
              <Sparkles size={15} />
              Pipeline AI
            </button>
            <button className="secondary-button">
              <Filter size={15} />
              Filters
            </button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Add Opportunity
            </button>
          </>
        }
      />
      <div className="subtabs">
        <Chip active={view === 'board'} onClick={() => setView('board')}>
          Board
        </Chip>
        <Chip active={view === 'table'} onClick={() => setView('table')}>
          Table
        </Chip>
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search opportunities..." />
        </div>
      </div>
      {view === 'board' ? (
        <div className="kanban">
          {PIPELINE_STAGES.map((stage, index) => {
            const cards = data.opportunities.filter((o) => o.stage === stage);
            return (
              <section className="kanban-column" key={stage}>
                <header>
                  <span
                    style={{ background: `hsl(${205 + index * 13} 75% 55%)` }}
                  />
                  <b>{stage}</b>
                  <small>{cards.length}</small>
                  <button>
                    <Plus size={14} />
                  </button>
                </header>
                <div className="kanban-cards">
                  {cards.map((card) => (
                    <article className="deal-card" key={card.id}>
                      <div>
                        <span className="person-avatar">
                          {card.contact
                            .split(' ')
                            .map((v) => v[0])
                            .join('')}
                        </span>
                        <b>{card.name}</b>
                      </div>
                      <p>
                        {card.product} · {card.carrier}
                      </p>
                      <footer>
                        <strong>{currency(card.value)}</strong>
                        <span>{card.probability}%</span>
                        <small>{card.days}d</small>
                      </footer>
                    </article>
                  ))}
                  <button className="new-deal">
                    <Plus size={14} />
                    New Deal
                  </button>
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <OpportunityTable data={data} />
      )}
    </div>
  );
}

function OpportunityTable({ data }: { data: CrmData }) {
  return (
    <div className="table-shell">
      <table className="data-table">
        <thead>
          <tr>
            <th>OPPORTUNITY</th>
            <th>STAGE</th>
            <th>DEAL VALUE</th>
            <th>PROBABILITY</th>
            <th>WEIGHTED</th>
            <th>PRODUCT</th>
            <th>CARRIER</th>
            <th>ASSIGNED AGENT</th>
            <th>DAYS IN STAGE</th>
          </tr>
        </thead>
        <tbody>
          {data.opportunities.map((o) => (
            <tr key={o.id}>
              <td>
                <b>{o.name}</b>
              </td>
              <td>
                <span className="status-pill">{o.stage}</span>
              </td>
              <td>{currency(o.value)}</td>
              <td>{o.probability}%</td>
              <td>{currency((o.value * o.probability) / 100)}</td>
              <td>{o.product}</td>
              <td>{o.carrier}</td>
              <td>{o.agent}</td>
              <td>{o.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TasksScreen({
  data,
  view,
  setView,
  openModal,
}: {
  data: CrmData;
  view: string;
  setView: (v: 'board' | 'table') => void;
  openModal: () => void;
}) {
  const statuses = ['To-Do', 'In Progress', 'Due', 'Done'] as const;
  return (
    <div className="module-page">
      <ModuleHeader
        title="Tasks"
        subtitle="Plan, assign, and complete client work"
        actions={
          <>
            <button className="secondary-button">Export</button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Add Task
            </button>
          </>
        }
      />
      <div className="subtabs">
        <Chip active={view === 'board'} onClick={() => setView('board')}>
          Board
        </Chip>
        <Chip active={view === 'table'} onClick={() => setView('table')}>
          List
        </Chip>
      </div>
      {view === 'board' ? (
        <div className="task-board">
          {statuses.map((status) => (
            <section
              className={`task-column ${status.toLowerCase().replace(' ', '-')}`}
              key={status}
            >
              <header>
                <b>{status}</b>
                <span>
                  {data.tasks.filter((t) => t.status === status).length}
                </span>
              </header>
              {data.tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <article className="task-card" key={task.id}>
                    <span
                      className={`priority-label ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                    <h3>{task.title}</h3>
                    <p>{task.contact}</p>
                    <footer>
                      <Clock3 size={13} />
                      {task.due}
                      <span>
                        {task.assignee
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </span>
                    </footer>
                  </article>
                ))}
            </section>
          ))}
        </div>
      ) : (
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Contact</th>
                <th>Due Date</th>
                <th>Assignee</th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <b>{task.title}</b>
                  </td>
                  <td>
                    <span className="status-pill">{task.status}</span>
                  </td>
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

export function CalendarScreen({
  data,
  view,
  setView,
  openModal,
}: {
  data: CrmData;
  view: string;
  setView: (v: 'board' | 'table') => void;
  openModal: () => void;
}) {
  const days = [
    'Sunday 30',
    'Monday 31',
    'Tuesday 1',
    'Wednesday 2',
    'Thursday 3',
    'Friday 4',
    'Saturday 5',
  ];
  return (
    <div className="module-page">
      <ModuleHeader
        title="Calendar"
        subtitle="September 2026 · Eastern Time"
        actions={
          <>
            <button className="secondary-button">Edit availability</button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Create Appointment
            </button>
          </>
        }
      />
      <div className="subtabs">
        <Chip active={view === 'board'} onClick={() => setView('board')}>
          Calendar
        </Chip>
        <Chip active={view === 'table'} onClick={() => setView('table')}>
          Table
        </Chip>
        <Chip>Month</Chip>
        <Chip active>Week</Chip>
        <Chip>Day</Chip>
      </div>
      {view === 'board' ? (
        <div className="calendar-grid">
          <div className="time-column">
            <span />
            {[
              '9 AM',
              '10 AM',
              '11 AM',
              '12 PM',
              '1 PM',
              '2 PM',
              '3 PM',
              '4 PM',
              '5 PM',
            ].map((time) => (
              <b key={time}>{time}</b>
            ))}
          </div>
          {days.map((day, dayIndex) => (
            <div className="calendar-day" key={day}>
              <header>{day}</header>
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  className={
                    dayIndex > 0 && dayIndex < 6 && i >= 1 && i <= 7
                      ? 'available'
                      : ''
                  }
                  key={i}
                >
                  {data.appointments
                    .filter(
                      (a) =>
                        Number(a.date.slice(-2)) ===
                          Number(day.split(' ')[1]) &&
                        a.time.startsWith(String(i + 8)),
                    )
                    .map((a) => (
                      <article key={a.id}>
                        <b>{a.title}</b>
                        <span>{a.time}</span>
                      </article>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.appointments.map((a) => (
                <tr key={a.id}>
                  <td>
                    <b>{a.title}</b>
                  </td>
                  <td>{a.contact}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.type}</td>
                  <td>
                    <span className="status-pill">{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function InboxScreen() {
  return (
    <div className="inbox-page">
      <aside className="conversation-list">
        <ModuleHeader
          title="Inbox"
          actions={
            <button className="round-button">
              <Plus size={16} />
            </button>
          }
        />
        <div className="subtabs">
          <Chip active>Unread</Chip>
          <Chip>Starred</Chip>
          <Chip>Drafts</Chip>
          <Chip>All</Chip>
        </div>
        <div className="search-box wide">
          <Search size={15} />
          <input placeholder="Search conversations..." />
        </div>
        {['Maria Thompson', 'David Chen', 'Angela Brooks'].map(
          (name, index) => (
            <button className="conversation" key={name}>
              <span className="person-avatar">
                {name
                  .split(' ')
                  .map((v) => v[0])
                  .join('')}
              </span>
              <div>
                <b>{name}</b>
                <p>
                  {index === 0
                    ? 'Thanks — that time works for me.'
                    : 'Following up on your coverage options…'}
                </p>
              </div>
              <small>{index + 1}h</small>
            </button>
          ),
        )}
      </aside>
      <section className="message-pane">
        <div className="message-empty">
          <MessageSquareText size={36} />
          <h2>No conversation selected</h2>
          <p>Choose a thread or start a new conversation.</p>
          <button className="primary-button">
            <Plus size={16} />
            Start New Conversation
          </button>
        </div>
      </section>
    </div>
  );
}

export function PoliciesScreen({
  data,
  tab,
  setTab,
  openModal,
}: {
  data: CrmData;
  tab: string;
  setTab: (t: string) => void;
  openModal: () => void;
}) {
  const tabs = [
    'All Policies',
    'Applications',
    'Enrollments',
    'Renewal Dashboard',
    'Book of Business',
    'Cross-Sell',
  ];
  const totalPremium = data.policies.reduce(
    (sum, item) => sum + item.premium,
    0,
  );
  return (
    <div className="module-page">
      <ModuleHeader
        title="Policies"
        subtitle="Manage every client policy and renewal"
        actions={
          <>
            <button className="secondary-button">
              <Sparkles size={15} />
              AI Insights
            </button>
            <button className="secondary-button">Export CSV</button>
            <button className="secondary-button">Bulk Upload</button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Add New Policy
            </button>
          </>
        }
      />
      <div className="subtabs">
        {tabs.map((item) => (
          <Chip active={tab === item} onClick={() => setTab(item)} key={item}>
            {item}
          </Chip>
        ))}
      </div>
      {tab === 'All Policies' && (
        <>
          <div className="toolbar-row">
            <Chip>All Agents</Chip>
            <Chip>All Products</Chip>
            <Chip>All Carriers</Chip>
            <Chip>All Statuses</Chip>
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search client, carrier, type, policy #" />
            </div>
          </div>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Agent</th>
                  <th>Carrier</th>
                  <th>Coverage Type</th>
                  <th>Policy #</th>
                  <th>Status</th>
                  <th>Renewal Date</th>
                  <th>Premium</th>
                </tr>
              </thead>
              <tbody>
                {data.policies.map((policy) => (
                  <tr key={policy.id}>
                    <td>
                      <b>{policy.client}</b>
                    </td>
                    <td>{policy.agent}</td>
                    <td>{policy.carrier}</td>
                    <td>{policy.type}</td>
                    <td>{policy.number}</td>
                    <td>
                      <span
                        className={`status-pill ${policy.status.toLowerCase()}`}
                      >
                        {policy.status}
                      </span>
                    </td>
                    <td>{policy.renewal}</td>
                    <td>{currency(policy.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab !== 'All Policies' && (
        <div className="report-view">
          <div className="kpi-cards">
            <KpiCard
              label="Active policies"
              value={String(
                data.policies.filter((p) => p.status === 'Active').length,
              )}
            />
            <KpiCard
              label="Premium managed"
              value={currency(totalPremium * 12)}
            />
            <KpiCard label="Renewals next 90 days" value="2" />
            <KpiCard label="Retention rate" value="96.4%" />
          </div>
          <div className="report-grid">
            <ReportCard title={tab} />
            <ReportCard
              title={
                tab === 'Book of Business'
                  ? 'Carrier Mix'
                  : 'Coverage Gap Scanner'
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function CommissionsScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  const paid = data.commissions
    .filter((c) => c.status === 'Paid')
    .reduce((s, c) => s + c.amount, 0);
  const pending = data.commissions
    .filter((c) => c.status !== 'Paid')
    .reduce((s, c) => s + c.amount, 0);
  return (
    <div className="module-page">
      <ModuleHeader
        title="Commissions"
        subtitle="Track expected, pending, and paid revenue"
        actions={
          <>
            <button className="secondary-button">
              <Sparkles size={15} />
              AI Insights
            </button>
            <button className="secondary-button">Export CSV</button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              Add Commission
            </button>
          </>
        }
      />
      <div className="kpi-cards">
        <KpiCard label="Total Paid" value={currency(paid)} />
        <KpiCard label="Pending Total Commissions" value={currency(pending)} />
        <KpiCard label="Total Commissions" value={currency(paid + pending)} />
        <KpiCard
          label="Average Commission"
          value={currency((paid + pending) / data.commissions.length)}
        />
      </div>
      <div className="toolbar-row">
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search commissions..." />
        </div>
        <Chip>All Status</Chip>
        <Chip>All Types</Chip>
        <Chip>All Products</Chip>
        <Chip>All Carriers</Chip>
      </div>
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Agent</th>
              <th>Carrier</th>
              <th>Product</th>
              <th>Type</th>
              <th>Policy #</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {data.commissions.map((item) => (
              <tr key={item.id}>
                <td>
                  <b>{item.client}</b>
                </td>
                <td>{item.agent}</td>
                <td>{item.carrier}</td>
                <td>{item.product}</td>
                <td>{item.type}</td>
                <td>{item.policy}</td>
                <td>
                  <b>{currency(item.amount)}</b>
                </td>
                <td>
                  <span className={`status-pill ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>{item.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BookingLinksScreen({
  data,
  openModal,
}: {
  data: CrmData;
  openModal: () => void;
}) {
  return (
    <div className="module-page">
      <ModuleHeader
        title="Booking Links"
        subtitle="Let clients schedule time without the back-and-forth"
        actions={
          <>
            <button className="secondary-button">Submissions</button>
            <button className="secondary-button">
              <Folder size={15} />
              New Folder
            </button>
            <button className="primary-button" onClick={openModal}>
              <Plus size={16} />
              New Booking Link
            </button>
          </>
        }
      />
      <div className="toolbar-row">
        <Chip>All Status</Chip>
        <Chip>All Types</Chip>
        <Chip>All Agents</Chip>
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search..." />
        </div>
      </div>
      <div className="booking-grid">
        {data.bookingLinks.map((link) => (
          <article className="booking-card" key={link.id}>
            <div className="booking-icon">
              <Link2 size={21} />
            </div>
            <span className={`status-pill ${link.status.toLowerCase()}`}>
              {link.status}
            </span>
            <h2>{link.name}</h2>
            <p>
              {link.type} · {link.duration} minutes
            </p>
            <div className="booking-url">
              localhost:3000/bookings/{link.slug}
            </div>
            <footer>
              <button>Copy link</button>
              <button>Edit</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AutomationsScreen({ data }: { data: CrmData }) {
  return (
    <div className="module-page">
      <ModuleHeader
        title="Automations"
        subtitle="8 workflows · 0 active"
        actions={
          <>
            <button className="secondary-button">
              <Folder size={15} />
            </button>
            <button className="primary-button">
              <Sparkles size={16} />
              Build with AI
            </button>
          </>
        }
      />
      <div className="subtabs">
        <Chip active>All (8)</Chip>
        <Chip>Active (0)</Chip>
        <Chip>Inactive (8)</Chip>
        <Chip>Deleted (0)</Chip>
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search workflows..." />
        </div>
      </div>
      <div className="table-shell">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Total Enrolled</th>
              <th>Active Enrolled</th>
              <th>Last Updated</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {data.workflows.map((workflow) => (
              <tr key={workflow.id}>
                <td>
                  <div className="workflow-name">
                    {workflow.status === 'Folder' ? (
                      <Folder size={17} />
                    ) : (
                      <Zap size={17} />
                    )}
                    <b>{workflow.name}</b>
                  </div>
                </td>
                <td>
                  <span className="status-pill">{workflow.status}</span>
                </td>
                <td>{workflow.status === 'Folder' ? '—' : workflow.total}</td>
                <td>{workflow.status === 'Folder' ? '—' : workflow.active}</td>
                <td>{workflow.updated}</td>
                <td>{workflow.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UnlockedAiScreen({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (tab: 'chat' | 'insights' | 'permissions') => void;
}) {
  return (
    <div className="ai-page">
      <aside className="tertiary-sidebar">
        <button className="primary-button">
          <Plus size={15} />
          New chat
        </button>
        <button
          className={tab === 'insights' ? 'active' : ''}
          onClick={() => setTab('insights')}
        >
          <ChartNoAxesCombined size={16} />
          Insights
        </button>
        <button>
          <Zap size={16} />
          Plugins <small>Soon</small>
        </button>
        <button
          className={tab === 'permissions' ? 'active' : ''}
          onClick={() => setTab('permissions')}
        >
          <ShieldCheck size={16} />
          Permissions
        </button>
        <div className="search-box">
          <Search size={15} />
          <input placeholder="Search chats" />
        </div>
        <h3>Pinned</h3>
        <p>No pinned chats</p>
        <h3>Recents</h3>
        <p>No recent chats</p>
      </aside>
      <section className="ai-main">
        {tab === 'chat' && (
          <div className="ai-chat-empty">
            <span className="ai-orb">U</span>
            <h1>Night owl mode, Brenda</h1>
            <p>What can I help you accomplish in your CRM?</p>
            <div className="ai-composer large">
              <textarea placeholder="Ask anything about your CRM..." />
              <div className="composer-footer">
                <Plus size={18} />
                <div>
                  <button className="model">
                    Starlite 3.4 <span>Max</span>
                  </button>
                  <Mic size={17} />
                  <button className="send">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
            <div className="prompt-chips">
              {[
                'Write',
                'Strategize',
                'From Email',
                'From Calendar',
                'From Contacts',
              ].map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </div>
        )}
        {tab === 'insights' && <InsightsPanel />}
        {tab === 'permissions' && <PermissionsPanel />}
      </section>
    </div>
  );
}

function InsightsPanel() {
  return (
    <div className="panel-page">
      <ModuleHeader
        title="Insights"
        subtitle="Understand how you use unLocked AI and shape how it sounds for you."
      />
      <div className="subtabs">
        <Chip active>Your Usage</Chip>
        <Chip>Your Voice</Chip>
        <Chip>Personalization</Chip>
        <Chip>Transforms</Chip>
      </div>
      <div className="kpi-cards">
        <KpiCard label="Prompts this month" value="24" />
        <KpiCard label="Hours saved" value="3.8" />
        <KpiCard label="Email outputs" value="12" />
        <KpiCard label="Current streak" value="6 days" />
      </div>
      <div className="personalization-grid">
        <ReportCard title="Your Voice" />
        <section className="settings-card">
          <h2>Personalization</h2>
          <p>Audiences</p>
          <div className="tag-cloud">
            {[
              'Medicare prospects',
              'Existing policyholders',
              'Final expense leads',
              'Retirees and families',
            ].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
          <p>Products</p>
          <div className="tag-cloud">
            {['Medicare', 'Life insurance', 'Annuities', 'ACA and health'].map(
              (v) => (
                <span key={v}>{v}</span>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
function PermissionsPanel() {
  const actions = [
    'Send email',
    'Send SMS',
    'Place a call',
    'Create contact / lead',
    'Update policy',
    'Delete records',
    'Book appointment',
    'Run workflow',
    'Generate document',
    'Run quotes',
    'Export data CSV',
    'Manage team / permissions',
  ];
  return (
    <div className="panel-page">
      <ModuleHeader
        title="AI Permissions"
        subtitle="Choose what unLocked AI can do automatically and what always needs approval."
        actions={<button className="primary-button">Save changes</button>}
      />
      <div className="permission-summary">
        <b>19 Auto</b>
        <b>34 Ask first</b>
        <b>0 Blocked</b>
      </div>
      <div className="settings-card">
        <div className="permission-head">
          <b>Action</b>
          <b>Auto</b>
          <b>Ask first</b>
          <b>Blocked</b>
        </div>
        {actions.map((action, index) => (
          <div className="permission-row" key={action}>
            <span>{action}</span>
            {['auto', 'ask', 'blocked'].map((mode, modeIndex) => (
              <input
                key={mode}
                type="radio"
                name={action}
                defaultChecked={
                  (index < 4 ? 0 : index > 8 ? 2 : 1) === modeIndex
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentAiScreen() {
  return (
    <div className="module-page narrow-page">
      <ModuleHeader
        title="Agent AI"
        subtitle="Set up your AI receptionist and calling assistant"
      />
      <div className="stepper">
        <div className="active">
          <span>1</span>
          <b>Voice</b>
        </div>
        <div>
          <span>2</span>
          <b>Phone</b>
        </div>
        <div>
          <span>3</span>
          <b>Compliance</b>
        </div>
      </div>
      <section className="onboarding-card">
        <span className="eyebrow">STEP 1 OF 3 · REQUIRED</span>
        <h1>Clone your voice</h1>
        <p>
          Choose a ready voice or create a short custom clone for outbound and
          inbound AI calls.
        </p>
        <div className="voice-grid">
          <VoiceCard name="Default — Sarah" type="Female" />
          <VoiceCard name="Default — George" type="Male" />
        </div>
        <div className="voice-form">
          <h2>Create your AI voice clone</h2>
          <label>
            Voice profile name
            <input placeholder="e.g. Jacob – Warm outbound" />
          </label>
          <div className="drop-zone">
            <Mic size={22} />
            <b>Record voice</b>
            <span>Up to 30 seconds in a quiet room</span>
            <button className="secondary-button">Upload audio</button>
          </div>
        </div>
      </section>
    </div>
  );
}
function VoiceCard({ name, type }: { name: string; type: string }) {
  return (
    <article className="voice-card">
      <span className="voice-wave">◖≋◗</span>
      <div>
        <b>{name}</b>
        <p>{type}</p>
      </div>
      <button>Preview voice</button>
      <button className="primary-button">Use</button>
    </article>
  );
}

export function QuotingHub({ navigate }: { navigate: (path: string) => void }) {
  const cards = [
    [
      'Life Quote AI',
      'Next-gen life quoting — 100+ carriers, instant rates.',
      'Open Quoter',
    ],
    [
      'Medicare AI',
      'Quote Medicare Advantage, MAPD & Part D plans with AI assistance.',
      'Open Quoter',
    ],
    [
      'Medigap AI',
      'Find Medicare Supplement plans quickly with AI.',
      'Upgrading',
    ],
    [
      'ACA AI',
      'ACA marketplace plan quotes with subsidy calculations.',
      'Open Quoter',
    ],
    [
      'Annuity Quote AI',
      'Annuity quoting powered by AI — coming soon.',
      'Soon',
    ],
  ];
  return (
    <div className="module-page">
      <ModuleHeader
        title="AI Quoting"
        subtitle="Fast, guided quoting across every product line"
      />
      <div className="quote-grid">
        {cards.map(([title, desc, action], index) => (
          <article className="quote-card" key={title}>
            <span className={`quote-icon q${index}`}>
              <WandSparkles size={24} />
            </span>
            <small>
              {action === 'Soon' || action === 'Upgrading'
                ? action.toUpperCase()
                : 'AI QUOTER'}
            </small>
            <h2>{title}</h2>
            <p>{desc}</p>
            <button
              className={
                action === 'Open Quoter' ? 'primary-button' : 'secondary-button'
              }
              onClick={() => index === 0 && navigate('/life')}
            >
              {action}
            </button>
          </article>
        ))}
      </div>
      <div className="feedback-banner">
        <div>
          <b>Which quoter or feature is missing?</b>
          <p>Tell us in one sentence.</p>
        </div>
        <input placeholder="Share your idea..." />
        <button className="secondary-button">Share</button>
      </div>
    </div>
  );
}

export function UnderwriteScreen() {
  return (
    <div className="assistant-workspace">
      <aside>
        <ShieldCheck size={24} />
        <h2>Underwrite AI</h2>
        <button className="primary-button">
          <Plus size={15} />
          New assessment
        </button>
        <h3>Saved assessments</h3>
        <p>No saved assessments yet</p>
      </aside>
      <section>
        <span className="ai-orb">U</span>
        <h1>Start with the applicant&apos;s health story</h1>
        <p>
          Describe medications, conditions, height and weight, tobacco use, and
          the coverage goal. The local assistant will organize the facts and
          suggest follow-up questions.
        </p>
        <div className="ai-composer large">
          <textarea placeholder="Example: 52-year-old male, non-smoker, controlled hypertension…" />
          <div className="composer-footer">
            <Plus size={18} />
            <button className="send">
              <Send size={15} />
            </button>
          </div>
        </div>
        <div className="prompt-chips">
          <Chip>Compare carrier fit</Chip>
          <Chip>Find missing information</Chip>
          <Chip>Estimate risk class</Chip>
        </div>
      </section>
    </div>
  );
}

export function CampaignsScreen() {
  return (
    <CardCollection
      title="Campaigns & Automations"
      subtitle="Create insurance-specific outreach with review-first guardrails"
      action="Create Campaign"
      cards={[
        ['Lead nurturing drip', 'SMS + Email', 'Draft'],
        ['AEP reminder workflow', 'SMS', 'Active'],
        ['Policy renewal outreach', 'Email', 'Scheduled'],
        ['No-show appointment recovery', 'SMS + Task', 'Active'],
      ]}
    />
  );
}
export function FormsScreen() {
  return (
    <CardCollection
      title="Forms"
      subtitle="Capture compliant client data and route submissions into your pipeline"
      action="AI Build"
      cards={[
        ['Medicare Intake', '12 fields', 'Published'],
        ['Life Needs Analysis', '9 fields', 'Draft'],
        ['Scope of Appointment', 'Signature + consent', 'Published'],
        ['ACA Eligibility', '14 fields', 'Published'],
      ]}
    />
  );
}
function CardCollection({
  title,
  subtitle,
  action,
  cards,
}: {
  title: string;
  subtitle: string;
  action: string;
  cards: string[][];
}) {
  return (
    <div className="module-page">
      <ModuleHeader
        title={title}
        subtitle={subtitle}
        actions={
          <button className="primary-button">
            <Sparkles size={16} />
            {action}
          </button>
        }
      />
      <div className="content-card-grid">
        {cards.map(([name, meta, status]) => (
          <article className="content-card" key={name}>
            <div className="content-card-icon">
              <FileText size={20} />
            </div>
            <span className="status-pill">{status}</span>
            <h2>{name}</h2>
            <p>{meta}</p>
            <footer>
              <button>Open</button>
              <button>•••</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsScreen({ data }: { data: CrmData }) {
  const premium = data.policies.reduce((s, p) => s + p.premium * 12, 0);
  return (
    <div className="module-page">
      <ModuleHeader
        title="Analytics"
        subtitle="Production, pipeline, retention, and revenue at a glance"
        actions={
          <>
            <button className="secondary-button">Last 90 days</button>
            <button className="secondary-button">Export CSV</button>
          </>
        }
      />
      <div className="kpi-cards">
        <KpiCard label="Annualized premium" value={currency(premium)} />
        <KpiCard
          label="Pipeline forecast"
          value={currency(
            data.opportunities.reduce(
              (s, o) => s + (o.value * o.probability) / 100,
              0,
            ),
          )}
        />
        <KpiCard label="Active clients" value={String(data.contacts.length)} />
        <KpiCard label="Retention risk" value="Low" />
      </div>
      <div className="analytics-grid">
        <ChartCard title="Production and revenue" />
        <ChartCard title="Lead sources" />
        <ChartCard title="Pipeline forecast" />
        <ChartCard title="Carrier mix" />
      </div>
    </div>
  );
}
function ChartCard({ title }: { title: string }) {
  const values = [38, 62, 46, 78, 55, 84, 69, 91];
  return (
    <article className="chart-card">
      <header>
        <h2>{title}</h2>
        <button>•••</button>
      </header>
      <div className="bar-chart">
        {values.map((value, index) => (
          <span key={index} style={{ height: `${value}%` }} />
        ))}
      </div>
      <footer>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </footer>
    </article>
  );
}

export function DocumentsScreen() {
  return (
    <div className="module-page">
      <ModuleHeader
        title="Documents"
        subtitle="Store, analyze, and compare client files"
        actions={
          <button className="primary-button">
            <Upload size={16} />
            Upload Document
          </button>
        }
      />
      <div className="document-drop">
        <FileText size={35} />
        <h2>Drop policy PDFs, images, or scans here</h2>
        <p>
          OCR extracts coverage, premiums, exclusions, riders, dates, and
          beneficiaries.
        </p>
        <button className="secondary-button">Choose files</button>
      </div>
      <div className="content-card-grid">
        <article className="content-card">
          <div className="content-card-icon">
            <FileText size={20} />
          </div>
          <span className="status-pill">Analyzed</span>
          <h2>Humana MAPD Summary</h2>
          <p>Maria Thompson · PDF</p>
          <footer>
            <button>Open summary</button>
          </footer>
        </article>
        <article className="content-card">
          <div className="content-card-icon">
            <FileChartColumn size={20} />
          </div>
          <span className="status-pill">Ready</span>
          <h2>Plan G Comparison</h2>
          <p>Robert Williams · 3 policies</p>
          <footer>
            <button>Compare</button>
          </footer>
        </article>
      </div>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div className="module-page">
      <ModuleHeader
        title="Settings"
        subtitle="Workspace, team, routing, and white-label controls"
      />
      <div className="settings-layout">
        <aside>
          {[
            'Workspace',
            'Branding',
            'Team',
            'Access Levels',
            'Routing',
            'Custom Fields',
            'Integrations',
            'Email & Domains',
            'Billing',
          ].map((item, index) => (
            <button className={index === 1 ? 'active' : ''} key={item}>
              {item}
            </button>
          ))}
        </aside>
        <section className="settings-card">
          <h1>Branding</h1>
          <p>
            Apply your agency identity to portals, booking links, emails,
            documents, and reports.
          </p>
          <div className="form-grid">
            <label>
              Agency name
              <input defaultValue="Sierra Insurance Advisors" />
            </label>
            <label>
              Portal subdomain
              <input defaultValue="sierra-insurance" />
            </label>
            <label>
              Primary brand color
              <input type="color" defaultValue="#2458dd" />
            </label>
            <label>
              Support email
              <input defaultValue="support@example.com" />
            </label>
            <label className="full">
              Privacy policy link
              <input placeholder="https://..." />
            </label>
          </div>
          <button className="primary-button">Save branding</button>
          <div className="settings-note">
            <ShieldCheck size={18} />
            <div>
              <b>Local preview</b>
              <p>
                Domain, DKIM/SPF, billing, and live integrations stay
                disconnected in this private build.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function InsuranceModuleScreen({
  route,
  title,
  navigate,
}: {
  route: string;
  title: string;
  navigate: (path: string) => void;
}) {
  const modules: Record<string, { description: string; items: string[] }> = {
    '/phone-system': {
      description: 'Call, text, power dial, and log every client conversation.',
      items: [
        'Phone Numbers',
        'Power Dialer',
        'Arwyn AI',
        'Messaging',
        'AI Auto-Reply',
        'Scripts',
        'Call Recordings',
        'Voicemail',
        'A2P Trust Center',
        'Analytics',
      ],
    },
    '/email-services': {
      description:
        'Manage inboxes, sending identity, deliverability, and analytics.',
      items: [
        'Email',
        'Email Delivery',
        'Dedicated Domain',
        'Dedicated IP',
        'SMTP',
        'Gmail SMTP',
        'Reply & Forward',
        'Analytics',
        'Risk',
        'Bounce',
      ],
    },
    '/quoting': {
      description: 'Launch guided quotes across health and life product lines.',
      items: [
        'Life Quote AI',
        'Medicare Advantage',
        'MAPD',
        'Medicare Part D',
        'ACA Marketplace',
        'Saved Quotes',
      ],
    },
    '/life': {
      description:
        'Life insurance production, quoting, underwriting, and saved cases.',
      items: [
        'Overview',
        'Quote',
        'Saved Quotes',
        'Underwrite AI',
        'Life AI',
        'Marketing — Soon',
      ],
    },
    '/medicare': {
      description:
        'T65, quoting, eligibility, SOA, reviews, and CMS-aware workflows.',
      items: [
        'Overview',
        'T65 Pipeline',
        'Quote',
        'HealthSherpa',
        'Eligibility',
        'Doctor Search',
        'SOA Generator',
        'Annual Reviews',
        'CMS Rules',
        'Marketing',
      ],
    },
    '/aca-marketplace': {
      description: 'ACA lead management, eligibility, quoting, and exports.',
      items: [
        'Overview',
        'Quote',
        'Leads & Contacts',
        'Eligibility Tracker',
        'Saved Quotes',
        'Insights',
        'Exports',
        'Marketing',
      ],
    },
    '/commission-plus': {
      description:
        'Reconcile carrier statements and manage producer hierarchies.',
      items: [
        'Overview',
        'Connections',
        'Reconciliation',
        'Exceptions',
        'Hierarchy',
        'Statements',
      ],
    },
    '/agency': {
      description: 'Monitor producers, activity, production, and licensing.',
      items: [
        'Command Center',
        'Agents',
        'Production',
        'Licenses',
        'Carrier Appointments',
        'Resources',
      ],
    },
    '/imo-fmo': {
      description:
        'Manage downline agencies, overrides, recruiting, and white-label inheritance.',
      items: [
        'Downline Agencies',
        'Hierarchy',
        'Overrides',
        'Recruiting Pipeline',
        'Production',
        'Alerts & Flags',
      ],
    },
    '/more': {
      description: 'Additional insurance operations and client experiences.',
      items: [
        'Policy Analyzer',
        'Client Portal',
        'Clinic Portal',
        'Carriers',
        'Integrations',
        'Resources',
      ],
    },
  };
  const moduleConfig = modules[route] ?? {
    description: 'Insurance operations workspace.',
    items: [],
  };
  return (
    <div className="module-page">
      <ModuleHeader title={title} subtitle={moduleConfig.description} />
      <div className="module-launch-grid">
        {moduleConfig.items.map((item, index) => (
          <button
            key={item}
            onClick={() => item.includes('Quote AI') && navigate('/ai-quoting')}
          >
            <span className={`launch-icon i${index % 4}`}>
              {index % 3 === 0 ? (
                <Sparkles size={20} />
              ) : index % 3 === 1 ? (
                <FileText size={20} />
              ) : (
                <ChartNoAxesCombined size={20} />
              )}
            </span>
            <div>
              <b>{item}</b>
              <p>Open {item.toLowerCase()} workspace</p>
            </div>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>Updated locally</small>
    </article>
  );
}
function ReportCard({ title }: { title: string }) {
  return (
    <article className="report-card">
      <header>
        <h2>{title}</h2>
        <button>•••</button>
      </header>
      <div className="donut">
        <span>76%</span>
      </div>
      <div className="legend">
        <span>
          <i />
          Active
        </span>
        <span>
          <i />
          Pending
        </span>
        <span>
          <i />
          At risk
        </span>
      </div>
    </article>
  );
}
function Pagination({ count }: { count: number }) {
  return (
    <div className="pagination">
      <span>Rows per page</span>
      <select defaultValue="20">
        <option>5</option>
        <option>20</option>
        <option>50</option>
        <option>100</option>
        <option>200</option>
      </select>
      <span>Page 1 of {Math.max(1, Math.ceil(count / 20))}</span>
      <button disabled>Previous</button>
      <button disabled={count <= 20}>Next</button>
    </div>
  );
}

function NotificationDrawer({ onClose }: { onClose: () => void }) {
  return (
    <aside className="notification-drawer">
      <header>
        <div>
          <h2>Notifications</h2>
          <span>4 unread</span>
        </div>
        <button aria-label="Close notifications" onClick={onClose}>
          <X size={18} />
        </button>
      </header>
      <div className="notification-actions">
        <button>Clear all</button>
        <button>Mark all as read</button>
      </div>
      <div className="search-box wide">
        <Search size={15} />
        <input placeholder="Search notifications..." />
      </div>
      <h3>Today</h3>
      {notifications.map(([title, message, time]) => (
        <article key={title}>
          <span className="notification-dot" />
          <div>
            <b>{title}</b>
            <p>{message}</p>
            <small>{time}</small>
          </div>
        </article>
      ))}
      <button className="notification-settings">
        <Settings size={15} />
        Notification settings
      </button>
    </aside>
  );
}
function AiDrawer({
  routeTitle,
  onClose,
}: {
  routeTitle: string;
  onClose: () => void;
}) {
  return (
    <aside className="ai-drawer">
      <header>
        <div>
          <span className="tiny-logo">U</span>
          <div>
            <b>unLocked AI</b>
            <small>On: {routeTitle}</small>
          </div>
        </div>
        <button onClick={onClose}>
          <X size={17} />
        </button>
      </header>
      <span className="release-pill">You&apos;re using v2, newly released</span>
      <h2>Ask about this page</h2>
      <p>
        I know you&apos;re on {routeTitle}. Ask me anything about your local CRM
        data.
      </p>
      {[
        'Summarize what’s on this page',
        'What should I do next?',
        'Show me my top priorities today',
      ].map((prompt) => (
        <button className="ai-suggestion" key={prompt}>
          {prompt}
        </button>
      ))}
      <div className="ai-drawer-input">
        <textarea placeholder={`Ask about ${routeTitle.toLowerCase()}…`} />
        <button>
          <Send size={15} />
        </button>
      </div>
      <small>unLocked AI can make mistakes</small>
    </aside>
  );
}

function SearchDialog({
  term,
  setTerm,
  results,
  navigate,
  onClose,
}: {
  term: string;
  setTerm: (v: string) => void;
  results: { title: string; subtitle: string; path: string }[];
  navigate: (p: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop search-backdrop">
      <section
        className="search-dialog"
        role="dialog"
        aria-label="Global search"
      >
        <header>
          <Search size={20} />
          <input
            autoFocus
            aria-label="Search your CRM"
            placeholder="Search your CRM"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {!term && (
          <div className="search-empty">
            <Search size={31} />
            <h2>Search your CRM</h2>
            <p>
              Find pages, leads, clients, policies, workflows, emails, and
              documents.
            </p>
          </div>
        )}
        {term && (
          <div className="search-results">
            {results.map((item) => (
              <button
                key={`${item.path}-${item.title}`}
                onClick={() => navigate(item.path)}
              >
                <span className="result-icon">
                  <Search size={15} />
                </span>
                <div>
                  <b>{item.title}</b>
                  <small>{item.subtitle}</small>
                </div>
                <ChevronRight size={15} />
              </button>
            ))}
            {results.length === 0 && <p>No results found.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

function CustomizeDialog({
  iconsOnly,
  setIconsOnly,
  onClose,
}: {
  iconsOnly: boolean;
  setIconsOnly: (v: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop">
      <section
        className="customize-dialog"
        role="dialog"
        aria-label="Customize navigation"
      >
        <header>
          <div>
            <h2>Customize navigation</h2>
            <p>Choose how your insurance workspaces appear.</p>
          </div>
          <button aria-label="Close customization" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="search-box wide">
          <Search size={15} />
          <input placeholder="Search navigation items..." />
        </div>
        <div className="placement-legend">
          <span>Rail</span>
          <span>Menu</span>
          <span>More</span>
          <span>Hidden</span>
        </div>
        <div className="customize-items">
          {[
            'Contacts',
            'Pipeline',
            'Calendar',
            'Automations',
            'Policies',
            'Commissions',
            'Analytics',
          ].map((item, index) => (
            <div key={item}>
              <b>{item}</b>
              <select defaultValue={index < 2 ? 'Rail' : 'Menu'}>
                <option>Rail</option>
                <option>Menu</option>
                <option>More</option>
                <option>Hidden</option>
              </select>
            </div>
          ))}
        </div>
        <h3>Appearance</h3>
        <div className="appearance-options">
          <button
            className={iconsOnly ? 'active' : ''}
            aria-label="Icons only"
            onClick={() => setIconsOnly(true)}
          >
            <Menu size={18} />
            <b>Icons only</b>
            <span>More compact</span>
          </button>
          <button
            className={!iconsOnly ? 'active' : ''}
            aria-label="Icons & labels"
            onClick={() => setIconsOnly(false)}
          >
            <PanelLeftOpen size={18} />
            <b>Icons & labels</b>
            <span>Easier to scan</span>
          </button>
        </div>
      </section>
    </div>
  );
}

type CrudHandlers = Record<
  Exclude<ModalName, null>,
  (event: SyntheticEvent<HTMLFormElement>) => void
>;
function CrudModal({
  modal,
  data,
  onClose,
  handlers,
}: {
  modal: Exclude<ModalName, null>;
  data: CrmData;
  onClose: () => void;
  handlers: CrudHandlers;
}) {
  const titles = {
    contact: 'Create Contact',
    task: 'Create Task',
    opportunity: 'Add Opportunity',
    appointment: 'Create Appointment',
    policy: 'Add New Policy',
    commission: 'Add Commission Record',
    booking: 'New Booking Link',
  };
  return (
    <div className="modal-backdrop">
      <form
        className="crud-modal"
        role="dialog"
        aria-label={titles[modal]}
        onSubmit={handlers[modal]}
      >
        <header>
          <div>
            <h2>{titles[modal]}</h2>
            <p>Saved only in this browser&apos;s local CRM workspace.</p>
          </div>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="form-grid">
          {modal === 'contact' && (
            <>
              <label>
                First name
                <input name="firstName" aria-label="First name" required />
              </label>
              <label>
                Last name
                <input name="lastName" aria-label="Last name" required />
              </label>
              <label>
                Email address
                <input name="email" aria-label="Email address" type="email" />
              </label>
              <label>
                Phone number
                <input name="phone" aria-label="Phone number" />
              </label>
              <label>
                Product type
                <select name="product">
                  <option>Medicare Advantage</option>
                  <option>Medicare Supplement</option>
                  <option>Term Life</option>
                  <option>ACA Health</option>
                  <option>Annuity</option>
                </select>
              </label>
              <label>
                Source
                <select name="source">
                  <option>Manual</option>
                  <option>Referral</option>
                  <option>Website</option>
                  <option>Seminar</option>
                  <option>Social media</option>
                </select>
              </label>
              <label className="full">
                Notes
                <textarea name="notes" />
              </label>
              <label className="full">
                Workflow
                <select name="workflow">
                  <option>Do not enroll</option>
                  <option>New Lead</option>
                  <option>Annual Review Workflow</option>
                </select>
              </label>
              <p className="form-hint full">
                Add at least an email or phone number.
              </p>
            </>
          )}
          {modal === 'task' && (
            <>
              <label className="full">
                Task title
                <input
                  name="title"
                  aria-label="Task title"
                  defaultValue="Untitled task"
                  required
                />
              </label>
              <label>
                Contact
                <select name="contact">
                  <option>No contact linked</option>
                  {data.contacts.map((c) => (
                    <option key={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select name="priority">
                  <option>Low</option>
                  <option selected>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label>
                Due date
                <input name="due" type="date" />
              </label>
              <label>
                Status
                <select name="status" defaultValue="To-Do">
                  <option>To-Do</option>
                  <option>In Progress</option>
                  <option>Due</option>
                  <option>Done</option>
                </select>
              </label>
              <label className="full">
                Details
                <textarea name="details" />
              </label>
            </>
          )}
          {modal === 'opportunity' && (
            <>
              <label className="full">
                Opportunity name
                <input name="name" required />
              </label>
              <label>
                Contact
                <select name="contact">
                  {data.contacts.map((c) => (
                    <option key={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Initial stage
                <select name="stage">
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Deal value
                <input name="value" type="number" defaultValue="1500" />
              </label>
              <label>
                Policy type
                <select name="product">
                  <option>Medicare Advantage</option>
                  <option>Term Life</option>
                  <option>ACA Health</option>
                </select>
              </label>
              <label>
                Carrier
                <input name="carrier" />
              </label>
              <label className="full">
                Description
                <textarea />
              </label>
            </>
          )}
          {modal === 'appointment' && (
            <>
              <label className="full">
                Appointment Title
                <input name="title" required />
              </label>
              <label>
                Contact
                <select name="contact">
                  {data.contacts.map((c) => (
                    <option key={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input name="date" type="date" defaultValue="2026-09-01" />
              </label>
              <label>
                Time
                <input name="time" defaultValue="9:00 AM" />
              </label>
              <label>
                Meeting Location
                <select name="type">
                  <option>Phone Call</option>
                  <option>Zoom</option>
                  <option>Google Meet</option>
                  <option>In Person</option>
                </select>
              </label>
              <label className="full">
                Internal Notes
                <textarea />
              </label>
            </>
          )}
          {modal === 'policy' && (
            <>
              <label>
                Assign to Client
                <select name="client">
                  {data.contacts.map((c) => (
                    <option key={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Carrier
                <input name="carrier" required />
              </label>
              <label>
                Coverage Type
                <select name="type">
                  <option>Medicare Advantage</option>
                  <option>Medicare Supplement</option>
                  <option>Term Life</option>
                  <option>Whole Life</option>
                  <option>ACA Health</option>
                </select>
              </label>
              <label>
                Policy Number
                <input name="number" />
              </label>
              <label>
                Premium Amount
                <input name="premium" type="number" step="0.01" />
              </label>
              <label>
                Renewal Date
                <input name="renewal" type="date" />
              </label>
            </>
          )}
          {modal === 'commission' && (
            <>
              <label>
                Client
                <select name="client">
                  <option>Unassigned</option>
                  {data.contacts.map((c) => (
                    <option key={c.id}>
                      {c.firstName} {c.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Commission Type
                <select name="type">
                  <option>Initial</option>
                  <option>Renewal</option>
                  <option>Override</option>
                </select>
              </label>
              <label>
                Carrier
                <input name="carrier" />
              </label>
              <label>
                Product
                <input name="product" />
              </label>
              <label>
                Policy
                <input name="policy" />
              </label>
              <label>
                Commission Amount
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Payment Date
                <input name="date" type="date" />
              </label>
              <label className="full">
                Notes
                <textarea maxLength={500} />
              </label>
            </>
          )}
          {modal === 'booking' && (
            <>
              <label className="full">
                Calendar name
                <input name="name" required />
              </label>
              <label>
                Calendar type
                <select name="type">
                  <option>Personal</option>
                  <option>Round Robin</option>
                </select>
              </label>
              <label>
                Meeting duration
                <select name="duration">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </label>
              <label className="full">
                Custom URL
                <div className="input-prefix">
                  <span>/bookings/</span>
                  <input name="slug" pattern="[a-z0-9-]+" />
                </div>
              </label>
            </>
          )}
        </div>
        <footer>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            {modal === 'contact'
              ? 'Save Contact'
              : modal === 'task'
                ? 'Save Task'
                : modal === 'booking'
                  ? 'Confirm'
                  : modal === 'commission'
                    ? 'Add Commission'
                    : modal === 'policy'
                      ? 'Add Policy'
                      : modal === 'appointment'
                        ? 'Create Appointment'
                        : 'Add Opportunity'}
          </button>
        </footer>
      </form>
    </div>
  );
}
