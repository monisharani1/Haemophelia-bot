export type Category = 'Clinical' | 'Regulatory' | 'Safety' | 'Market';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type RelevantFunction = 'R&D' | 'Medical Affairs' | 'Commercial' | 'Market Access' | 'Regulatory' | 'Safety' | 'Leadership';
export type HaemophiliaType = 'A' | 'B' | 'Other';

export interface ScoreBreakdown {
  sourceReliability: number;     // max 20
  clinicalSignificance: number;  // max 20
  competitiveRelevance: number;  // max 20
  marketRelevance: number;       // max 20
  regulatorySignificance: number;// max 10
  novelty: number;               // max 10
}

export interface Signal {
  id: string;
  headline: string;
  category: Category;
  source: string;
  sourceUrl: string;
  date: string;
  summary: string;
  whyItMatters: string;
  priority: Priority;
  impactScore: number;
  scoreBreakdown: ScoreBreakdown;
  relevantFunctions: RelevantFunction[];
  haemophiliaType: HaemophiliaType;
  status?: 'New' | 'Under Review' | 'Action Taken' | 'Archived';
  isBookmarked?: boolean;
  assignedTo?: string;
  tags?: string[];
}

export type NavPage = 
  | 'home' 
  | 'feed' 
  | 'radar' 
  | 'clinical' 
  | 'regulatory' 
  | 'safety' 
  | 'publications' 
  | 'access' 
  | 'companies' 
  | 'reports' 
  | 'settings';

export interface DataSourceItem {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Syncing' | 'Paused';
  lastSync: string;
  reliabilityRating: number; // 0 - 100
  signalCount: number;
  url: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  priority: Priority;
  read: boolean;
  signalId?: string;
}
