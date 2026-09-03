import { Signal, DataSourceItem, SystemNotification } from './types';

// Helper to generate ISO dates relative to now for dynamic time-range testing
const getRelativeDate = (daysAgo: number, hoursAgo = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const mockSignals: Signal[] = [
  {
    id: 'sig-001',
    headline: 'Investigational long-acting bispecific antibody Phase 3 data presented at ISTH 2026 demonstrates zero treated bleeds in 88% of Severe Haemophilia A patients',
    category: 'Clinical',
    source: 'ISTH 2026 Congress / NEJM',
    sourceUrl: 'https://doi.org/10.1056/NEJMoa2601234',
    sourceType: 'clinicaltrials',
    sourceIdType: 'NCT',
    sourceId: 'NCT05047809',
    doi: '10.1056/NEJMoa2601234',
    pmid: '38891044',
    nctId: 'NCT05047809',
    date: getRelativeDate(0, 4), // 4 hours ago (Last 24 Hours)
    summary: 'Landmark 24-month Phase 3 HAVEN-7 follow-up dataset confirms monthly subcutaneous dosing of novel bispecific antibody maintains zero annualized bleeding rate (ABR) in 88.4% of patients with and without FVIII inhibitors, with no thromboembolic events reported.',
    whyItMatters: 'This landmark dataset confirms subcutaneously administered once-monthly bispecific antibody maintains zero ABR in 88% of patients. Poses a direct strategic threat to current once-weekly prophylaxis standards and accelerates competitive landscape shifts across Haemophilia A.',
    priority: 'Critical',
    impactScore: 94,
    scoreBreakdown: {
      sourceReliability: 19,
      clinicalSignificance: 20,
      competitiveRelevance: 19,
      marketRelevance: 18,
      regulatorySignificance: 9,
      novelty: 9
    },
    relevantFunctions: ['R&D', 'Medical Affairs', 'Commercial', 'Market Access', 'Regulatory', 'Leadership'],
    haemophiliaType: 'A',
    status: 'New',
    isBookmarked: true,
    tags: ['ISTH 2026', 'Bispecific Antibody', 'Phase 3', 'Zero Bleeds', 'Inhibitor & Non-Inhibitor']
  },
  {
    id: 'sig-002',
    headline: 'FDA grants Priority Review for AAV5 Gene Therapy label expansion in Severe Haemophilia B with pre-existing AAV neutralizing antibodies',
    category: 'Regulatory',
    source: 'FDA Press Announcement / CBER',
    sourceUrl: 'https://www.fda.gov/vaccines-blood-biologics/cellular-gene-therapy-products',
    sourceType: 'fda',
    sourceIdType: 'NCT',
    sourceId: 'NCT03569852',
    recordAnchorText: 'FDA sBLA #125740/S-018',
    nctId: 'NCT03569852',
    date: getRelativeDate(0, 11), // 11 hours ago (Last 24 Hours)
    summary: 'The U.S. FDA has accepted a Supplemental Biologics License Application (sBLA) with Priority Review for AAV5-FIX gene therapy using specialized plasmapheresis pre-conditioning, unlocking treatment eligibility for previously excluded antibody-positive patients.',
    whyItMatters: 'Expands the addressable Haemophilia B gene therapy patient population by up to 35%. Regulatory precedent for overcoming AAV pre-existing immunity will trigger immediate pipeline re-evaluations across all liver-directed gene therapies.',
    priority: 'Critical',
    impactScore: 91,
    scoreBreakdown: {
      sourceReliability: 20,
      clinicalSignificance: 18,
      competitiveRelevance: 18,
      marketRelevance: 17,
      regulatorySignificance: 10,
      novelty: 8
    },
    relevantFunctions: ['Regulatory', 'Medical Affairs', 'Market Access', 'R&D', 'Leadership'],
    haemophiliaType: 'B',
    status: 'Under Review',
    isBookmarked: false,
    tags: ['FDA', 'Priority Review', 'Gene Therapy', 'AAV5', 'Pre-existing Immunity']
  },
  {
    id: 'sig-003',
    headline: 'WHO VigiBase & EMA Pharmacovigilance alert: Post-market signal detection of transient thrombotic microangiopathy in combination regimens',
    category: 'Safety',
    source: 'EMA PRAC & WHO VigiBase Safety Bulletin',
    sourceUrl: 'https://www.ema.europa.eu/en/medicines/human/referrals/haemophilia-tma-signal',
    sourceType: 'ema',
    sourceIdType: 'EMA',
    sourceId: 'EMA/PRAC/482910/2026',
    recordAnchorText: 'EMA/PRAC/482910/2026',
    faersQuery: 'patient.drug.medicinalproduct:Factor+VIII+AND+patient.reaction.reactionmeddrapt:thrombotic+microangiopathy',
    date: getRelativeDate(2), // 2 days ago (Last 7 Days)
    summary: 'European Medicines Agency PRAC initiated a safety signal evaluation following 14 global spontaneous case reports of transient TMA when non-factor mimetics were co-administered with high-dose activated prothrombin complex concentrate (aPCC) during breakthrough bleed management.',
    whyItMatters: 'Mandates urgent updating of clinical guidance protocols for emergency breakthrough bleed management. Medical Affairs and Pharmacovigilance teams must immediately issue safety advisories to treatment centers to mitigate clinical risk.',
    priority: 'High',
    impactScore: 86,
    scoreBreakdown: {
      sourceReliability: 19,
      clinicalSignificance: 18,
      competitiveRelevance: 15,
      marketRelevance: 15,
      regulatorySignificance: 10,
      novelty: 9
    },
    relevantFunctions: ['Safety', 'Medical Affairs', 'Regulatory', 'Leadership'],
    haemophiliaType: 'A',
    status: 'New',
    isBookmarked: true,
    tags: ['Safety Signal', 'EMA PRAC', 'VigiBase', 'TMA Risk', 'Breakthrough Bleeds']
  },
  {
    id: 'sig-004',
    headline: 'EU National Health Authority expands 45% reimbursement coverage for subcutaneous non-factor prophylaxis in paediatric Haemophilia A',
    category: 'Market',
    source: 'EUNetHTA & National Health Ministry Bulletin',
    sourceUrl: 'https://doi.org/10.1016/S2352-3026(26)00142-9',
    sourceType: 'doi',
    sourceIdType: 'DOI',
    sourceId: 'DOI: 10.1016/S2352-3026(26)00142-9',
    doi: '10.1016/S2352-3026(26)00142-9',
    recordAnchorText: 'EU-HTA-2026-HA-044',
    date: getRelativeDate(3), // 3 days ago (Last 7 Days)
    summary: 'Joint European HTA body published positive comparative cost-effectiveness determination recommending universal first-line reimbursement for subcutaneous non-factor agents in pediatric non-inhibitor patients aged 0–12 years across 12 member states.',
    whyItMatters: 'Accelerates paediatric market conversion from intravenous FVIII replacement to subcutaneous non-factor prophylaxis. Provides strong health economics leverage for upcoming market access negotiations in tier-2 markets.',
    priority: 'High',
    impactScore: 83,
    scoreBreakdown: {
      sourceReliability: 18,
      clinicalSignificance: 16,
      competitiveRelevance: 17,
      marketRelevance: 19,
      regulatorySignificance: 7,
      novelty: 6
    },
    relevantFunctions: ['Market Access', 'Commercial', 'Medical Affairs', 'Leadership'],
    haemophiliaType: 'A',
    status: 'Under Review',
    isBookmarked: false,
    tags: ['HTA', 'Reimbursement', 'Paediatric', 'Health Economics', 'EU Market']
  },
  {
    id: 'sig-005',
    headline: 'First-in-human LNP-mRNA CRISPR editing of SERPINC1 in Haemophilia A & B achieves sustained antithrombin knockdown in Phase 1 study',
    category: 'Clinical',
    source: 'Nature Medicine / ClinicalTrials.gov NCT06129841',
    sourceUrl: 'https://clinicaltrials.gov/study/NCT06129841',
    sourceType: 'clinicaltrials',
    sourceIdType: 'NCT',
    sourceId: 'NCT06129841',
    nctId: 'NCT06129841',
    pmid: '38472910',
    doi: '10.1038/s41591-026-02845-x',
    date: getRelativeDate(4), // 4 days ago (Last 7 Days)
    summary: 'Interim Phase 1 dose-escalation data in 12 adults with severe Haemophilia A/B demonstrated dose-dependent 60-75% reduction in plasma antithrombin levels following single IV LNP infusion, resulting in normalized thrombin generation without severe adverse events.',
    whyItMatters: 'Proof-of-concept for in vivo gene editing targeting rebalancing pathways applicable to both Haemophilia A and B regardless of inhibitor status. Represents potential next-generation disruptive curative modality.',
    priority: 'High',
    impactScore: 79,
    scoreBreakdown: {
      sourceReliability: 17,
      clinicalSignificance: 17,
      competitiveRelevance: 16,
      marketRelevance: 12,
      regulatorySignificance: 7,
      novelty: 10
    },
    relevantFunctions: ['R&D', 'Medical Affairs', 'Leadership'],
    haemophiliaType: 'A',
    status: 'New',
    isBookmarked: false,
    tags: ['CRISPR', 'Gene Editing', 'SERPINC1', 'Phase 1', 'Nature Medicine']
  },
  {
    id: 'sig-006',
    headline: 'CHMP issues Positive Opinion for once-weekly recombinant Factor VIII variant with extended half-life in non-inhibitor patients',
    category: 'Regulatory',
    source: 'European Medicines Agency CHMP Highlights',
    sourceUrl: 'https://www.ema.europa.eu/en/medicines/human/summaries-opinion',
    sourceType: 'ema',
    sourceIdType: 'EMA',
    sourceId: 'EMA/CHMP/771924/2026',
    recordAnchorText: 'EMA/CHMP/771924/2026',
    pmid: '38120934',
    date: getRelativeDate(6), // 6 days ago (Last 7 Days)
    summary: 'The CHMP recommended approval of a novel PEGylated recombinant FVIII with an ultra-extended half-life (44 hours), enabling once-weekly intravenous prophylaxis in adults and adolescents with Haemophilia A.',
    whyItMatters: 'Provides a competitive extended half-life FVIII option for patients preferring factor-based prophylaxis over non-factor mimetics. Commercial teams should refine market positioning strategies.',
    priority: 'Medium',
    impactScore: 72,
    scoreBreakdown: {
      sourceReliability: 18,
      clinicalSignificance: 13,
      competitiveRelevance: 14,
      marketRelevance: 14,
      regulatorySignificance: 8,
      novelty: 5
    },
    relevantFunctions: ['Regulatory', 'Commercial', 'Medical Affairs'],
    haemophiliaType: 'A',
    status: 'Action Taken',
    isBookmarked: false,
    tags: ['CHMP', 'Factor VIII', 'Extended Half-Life', 'EMA', 'Prophylaxis']
  },
  {
    id: 'sig-007',
    headline: 'Major US Pharmacy Benefit Manager updates preferred formulary tier for recombinant FVIII with 30% rebate agreement',
    category: 'Market',
    source: 'FiercePharma & Managed Care Executive Review',
    sourceUrl: 'https://pubmed.ncbi.nlm.nih.gov/37912480/',
    sourceType: 'pubmed',
    sourceIdType: 'PMID',
    sourceId: 'PMID: 37912480',
    pmid: '37912480',
    recordAnchorText: 'PubMed PMID: 37912480',
    date: getRelativeDate(14), // 14 days ago (All)
    summary: 'One of the top three US PBMs announced preferred status for two recombinant FVIII concentrates for the 2027 plan year following confidential manufacturer rebate negotiations, impacting coverage for over 45M commercial lives.',
    whyItMatters: 'Payer pricing pressure remains intense for factor concentrates. Commercial and Market Access teams must evaluate formulary placement risks for existing portfolio brands.',
    priority: 'Medium',
    impactScore: 68,
    scoreBreakdown: {
      sourceReliability: 14,
      clinicalSignificance: 10,
      competitiveRelevance: 15,
      marketRelevance: 18,
      regulatorySignificance: 4,
      novelty: 7
    },
    relevantFunctions: ['Market Access', 'Commercial', 'Leadership'],
    haemophiliaType: 'A',
    status: 'Under Review',
    isBookmarked: false,
    tags: ['PBM', 'Formulary', 'US Market', 'Rebates', 'Commercial']
  },
  {
    id: 'sig-008',
    headline: 'FDA FAERS quarterly registry analysis highlights low-titre inhibitor development rate of 1.2% in previously untreated Haemophilia A cohort',
    category: 'Safety',
    source: 'FDA FAERS Registry / Journal of Thrombosis and Haemostasis',
    sourceUrl: 'https://doi.org/10.1016/j.jtha.2026.04.012',
    sourceType: 'faers',
    sourceIdType: 'FAERS',
    sourceId: 'Case ID: 2026-F-088492',
    faersCaseId: '2026-F-088492',
    faersQuery: 'patient.drug.medicinalproduct:Factor+VIII+AND+patient.reaction.reactionmeddrapt:Inhibitor+development',
    pmid: '38194021',
    doi: '10.1016/j.jtha.2026.04.012',
    date: getRelativeDate(21), // 21 days ago (All)
    summary: 'A 5-year longitudinal registry analysis of 450 previously untreated patients (PUPs) receiving third-generation rFVIII demonstrated a low-titre inhibitor rate of 1.2%, significantly lower than historical 25-30% benchmarks.',
    whyItMatters: 'Reassuring long-term real-world safety evidence supporting early factor prophylaxis initiation in neonates and infants. Useful for Medical Affairs scientific communication decks.',
    priority: 'Medium',
    impactScore: 65,
    scoreBreakdown: {
      sourceReliability: 16,
      clinicalSignificance: 12,
      competitiveRelevance: 11,
      marketRelevance: 12,
      regulatorySignificance: 6,
      novelty: 8
    },
    relevantFunctions: ['Safety', 'Medical Affairs', 'R&D'],
    haemophiliaType: 'A',
    status: 'Archived',
    isBookmarked: false,
    tags: ['FDA FAERS', 'Inhibitor Rate', 'PUPs', 'Real World Evidence', 'JTH']
  }
];



export const mockDataSources: DataSourceItem[] = [
  {
    id: 'src-1',
    name: 'ClinicalTrials.gov & WHO ICTRP',
    category: 'Clinical Trials & Research',
    status: 'Active',
    lastSync: '12 mins ago',
    reliabilityRating: 99,
    signalCount: 142,
    url: 'https://clinicaltrials.gov'
  },
  {
    id: 'src-2',
    name: 'FDA CBER & EMA CHMP Records',
    category: 'Regulatory Authorities',
    status: 'Active',
    lastSync: '25 mins ago',
    reliabilityRating: 100,
    signalCount: 98,
    url: 'https://fda.gov / https://ema.europa.eu'
  },
  {
    id: 'src-3',
    name: 'WHO VigiBase & FDA FAERS Safety DB',
    category: 'Adverse Drug Reaction Registries',
    status: 'Active',
    lastSync: '1 hour ago',
    reliabilityRating: 96,
    signalCount: 64,
    url: 'https://who-umc.org/vigibase'
  },
  {
    id: 'src-4',
    name: 'PubMed / NCBI & Major Journals',
    category: 'Scientific Publications',
    status: 'Active',
    lastSync: '45 mins ago',
    reliabilityRating: 98,
    signalCount: 310,
    url: 'https://pubmed.ncbi.nlm.nih.gov'
  },
  {
    id: 'src-5',
    name: 'ISTH & WFH Congress Abstracts',
    category: 'Scientific Congresses',
    status: 'Active',
    lastSync: '2 hours ago',
    reliabilityRating: 95,
    signalCount: 87,
    url: 'https://isth.org'
  },
  {
    id: 'src-6',
    name: 'FiercePharma & Industry Pipeline Feeds',
    category: 'Competitive Intelligence',
    status: 'Syncing',
    lastSync: 'Just now',
    reliabilityRating: 88,
    signalCount: 175,
    url: 'https://fiercepharma.com'
  }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Critical Signal Detected',
    message: 'New ISTH 2026 Phase 3 bispecific antibody dataset reached 94/100 Impact Score.',
    time: '10 mins ago',
    priority: 'Critical',
    read: false,
    signalId: 'sig-001'
  },
  {
    id: 'notif-2',
    title: 'FDA Priority Review Granted',
    message: 'AAV5 Haemophilia B Gene Therapy received Priority Review for neutralizing antibody patients.',
    time: '2 hours ago',
    priority: 'Critical',
    read: false,
    signalId: 'sig-002'
  },
  {
    id: 'notif-3',
    title: 'Safety Signal Flagged by EMA',
    message: 'EMA PRAC initiated evaluation of transient TMA reports during co-administration.',
    time: '1 day ago',
    priority: 'High',
    read: true,
    signalId: 'sig-003'
  }
];

export const radarChartData = {
  labels: ['Clinical Trials', 'Regulatory', 'Market Access', 'Safety', 'Publications', 'Partnerships'],
  datasets: [
    {
      label: 'High Density Signals (Current)',
      data: [92, 85, 78, 88, 70, 65],
      backgroundColor: 'rgba(220, 38, 38, 0.25)',
      borderColor: '#DC2626',
      pointBackgroundColor: '#DC2626',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#DC2626',
      borderWidth: 2,
    },
    {
      label: 'Medium Density Signals',
      data: [75, 68, 82, 60, 85, 72],
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      borderColor: '#F59E0B',
      pointBackgroundColor: '#F59E0B',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#F59E0B',
      borderWidth: 2,
    },
    {
      label: 'Low / Baseline Density',
      data: [40, 45, 50, 35, 60, 40],
      backgroundColor: 'rgba(22, 163, 74, 0.15)',
      borderColor: '#16A34A',
      pointBackgroundColor: '#16A34A',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#16A34A',
      borderWidth: 2,
    }
  ]
};
