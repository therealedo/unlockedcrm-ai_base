export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  zip: string;
  strength: 'New' | 'Warm' | 'Strong';
  lastInteraction: string;
  tags: string[];
  product: string;
  source: string;
  agent: string;
};

export type Opportunity = {
  id: string;
  name: string;
  contact: string;
  stage: string;
  value: number;
  probability: number;
  product: string;
  carrier: string;
  agent: string;
  days: number;
};

export type CrmTask = {
  id: string;
  title: string;
  status: 'To-Do' | 'In Progress' | 'Due' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  contact: string;
  due: string;
  assignee: string;
  details?: string;
};

export type Policy = {
  id: string;
  client: string;
  agent: string;
  carrier: string;
  type: string;
  number: string;
  status: 'Active' | 'Pending' | 'Inactive';
  renewal: string;
  premium: number;
};

export type Commission = {
  id: string;
  client: string;
  agent: string;
  carrier: string;
  product: string;
  type: string;
  policy: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Expected';
  paymentDate: string;
};

export type Appointment = {
  id: string;
  title: string;
  contact: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Tentative';
};

export type BookingLink = {
  id: string;
  name: string;
  type: 'Personal' | 'Round Robin';
  duration: number;
  slug: string;
  status: 'Active' | 'Draft';
};

export type Workflow = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Folder';
  total: number;
  active: number;
  updated: string;
  created: string;
};

export type CrmData = {
  contacts: Contact[];
  opportunities: Opportunity[];
  tasks: CrmTask[];
  policies: Policy[];
  commissions: Commission[];
  appointments: Appointment[];
  bookingLinks: BookingLink[];
  workflows: Workflow[];
};

export const PIPELINE_STAGES = [
  'Prospect',
  'Contacted',
  'Conversation',
  'Interested',
  'Appointment Booked',
  'Interview',
  'Contract Sent',
  'Contracted',
  'Activated',
];

export const DEFAULT_CRM_DATA: CrmData = {
  contacts: [
    {
      id: 'contact-mara-testwell',
      firstName: 'Mara',
      lastName: 'Testwell',
      email: 'mara.testwell@example.com',
      phone: '(202) 555-0114',
      birthDate: '1956-04-12',
      gender: 'Female',
      zip: '10001',
      strength: 'New',
      lastInteraction: 'Just now',
      tags: ['Medicare'],
      product: 'Medicare Advantage',
      source: 'Manual',
      agent: '—',
    },
    {
      id: 'contact-eli-sample',
      firstName: 'Eli',
      lastName: 'Sample',
      email: 'eli.sample@example.com',
      phone: '(202) 555-0168',
      birthDate: '',
      gender: '—',
      zip: '',
      strength: 'New',
      lastInteraction: 'Just now',
      tags: ['Life'],
      product: 'Term Life',
      source: 'UI Audit',
      agent: '—',
    },
  ],
  opportunities: [
    {
      id: 'opportunity-eli-sample',
      name: 'Eli Sample',
      contact: 'Eli Sample',
      stage: 'Prospect',
      value: 0,
      probability: 50,
      product: 'Term Life',
      carrier: 'Manual',
      agent: 'Unassigned',
      days: 0,
    },
  ],
  tasks: [
    {
      id: 'task-ui-sample-follow-up',
      title: 'UI Sample – Follow Up',
      status: 'Due',
      priority: 'Medium',
      contact: 'Eli Sample',
      due: 'Today',
      assignee: 'Unassigned',
    },
  ],
  policies: [
    {
      id: 'policy-mara-mapd',
      client: 'Mara Testwell',
      agent: '—',
      carrier: 'Humana',
      type: 'Medicare Advantage (MAPD)',
      number: 'QA-MA-ACTIVE-001',
      status: 'Active',
      renewal: '2026-09-30',
      premium: 0,
    },
  ],
  commissions: [],
  appointments: [],
  bookingLinks: [],
  workflows: [
    {
      id: 'workflow-folder-ma',
      name: 'Medicare Advantage',
      status: 'Folder',
      total: 0,
      active: 0,
      updated: 'Sep 1, 2026',
      created: 'Aug 31, 2026',
    },
    {
      id: 'workflow-folder-ms',
      name: 'Medicare Supplement',
      status: 'Folder',
      total: 0,
      active: 0,
      updated: 'Sep 1, 2026',
      created: 'Aug 31, 2026',
    },
  ],
};

// This schema intentionally resets older demo fixtures to the verified trial data.
export const STORAGE_KEY = 'unlockedcrm-live-parity-state-v1';

export function currency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
