// ============================================================
//  JK Edu-Care — Daily Updates Data File
//  HOW TO ADD: Copy a block below and paste a new entry.
//  HOW TO DELETE: Remove the { ... } block for that update.
//  Set isNew: true for fresh updates (shows a "NEW" badge).
//  Set isPriority: true to pin it to the top of the list.
//  Categories: 'NEET' | 'CUET' | 'MBBS' | 'ENGINEERING' |
//              'LAW' | 'MANAGEMENT' | 'SCHOLARSHIP' | 'GENERAL'
// ============================================================

export type UpdateCategory =
  | 'NEET'
  | 'CUET'
  | 'MBBS'
  | 'ENGINEERING'
  | 'LAW'
  | 'MANAGEMENT'
  | 'SCHOLARSHIP'
  | 'GENERAL'

export interface DailyUpdate {
  id: string              // unique string ID
  date: string            // format: "DD MMM YYYY" e.g. "15 Jul 2025"
  title: string
  description: string
  category: UpdateCategory
  link?: string           // optional: external link for more info
  isNew?: boolean         // shows "NEW" badge
  isPriority?: boolean    // shows at top of list
}

// ──────────────────────────────────────────────
//  ADD YOUR UPDATES BELOW THIS LINE
// ──────────────────────────────────────────────
export const dailyUpdates: DailyUpdate[] = [
  {
    id: 'u1',
    date: '15 Jul 2025',
    title: 'NEET UG 2025 Counselling Round 1 Registration Open',
    description:
      'MCC has opened Round 1 counselling registration for NEET UG 2025. Last date to register is 20 July 2025. Candidates must pay ₹1,000 registration fee online.',
    category: 'NEET',
    link: 'https://mcc.nic.in',
    isNew: true,
    isPriority: true,
  },
  {
    id: 'u2',
    date: '14 Jul 2025',
    title: 'CUET UG 2025 Result Declared',
    description:
      'NTA has released CUET UG 2025 scorecard. Candidates can download their scores from the official portal. Central university admissions will begin shortly.',
    category: 'CUET',
    link: 'https://cuet.samarth.ac.in',
    isNew: true,
  },
  {
    id: 'u3',
    date: '13 Jul 2025',
    title: 'Tamil Nadu MBBS Seat Allotment — Government Quota Round 1',
    description:
      'TN Health Dept has released Round 1 seat allotment for Government Quota MBBS seats. Candidates must report to allotted colleges by 18 July 2025 with original documents.',
    category: 'MBBS',
    isNew: true,
    isPriority: true,
  },
  {
    id: 'u4',
    date: '12 Jul 2025',
    title: 'TNEA 2025 Random Number List Published',
    description:
      'Tamil Nadu Engineering Admissions 2025 random number list is published. Students with same cut-off will be ranked using this list. Check the official portal.',
    category: 'ENGINEERING',
    link: 'https://www.tneaonline.org',
  },
  {
    id: 'u5',
    date: '11 Jul 2025',
    title: 'Scholarship Deadline: Tamil Nadu Government Merit Scholarship',
    description:
      'Last date to apply for TN Government Merit Scholarship for 2025-26 academic year is 31 July 2025. Final year and meritorious students of govt colleges can apply.',
    category: 'SCHOLARSHIP',
  },
  {
    id: 'u6',
    date: '10 Jul 2025',
    title: 'CLAT 2026 Registration Window Opens',
    description:
      'Consortium of NLUs has opened CLAT 2026 registration. The exam is scheduled for December 2025. Early registration is advised to avoid last-minute issues.',
    category: 'LAW',
    link: 'https://consortiumofnlus.ac.in',
  },
  {
    id: 'u7',
    date: '09 Jul 2025',
    title: 'CAT 2025 Notification Expected This Week',
    description:
      'IIM Calcutta is expected to release CAT 2025 official notification. Registration likely to open in August. Exam tentatively scheduled for November 2025.',
    category: 'MANAGEMENT',
  },
  {
    id: 'u8',
    date: '08 Jul 2025',
    title: 'Free WhatsApp Guidance Session — July 2025',
    description:
      'JK Sir is conducting free live guidance sessions for students confused about college choices after NEET results. Join the WhatsApp channel for updates.',
    category: 'GENERAL',
    link: 'https://whatsapp.com/channel/0029VaTOYogK5cDGKLRzxl23',
  },
]
