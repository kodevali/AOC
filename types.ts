
export type ModuleID = 'dashboard' | 'compliance' | 'gap-analysis' | 'sampling' | 'trend' | 'rcm';

export interface AuditModule {
  id: ModuleID;
  title: string;
  description: string;
  icon: string;
}

export enum AuditRating {
  EFFECTIVE = 'EFFECTIVE',
  GAP_IDENTIFIED = 'GAP_IDENTIFIED',
  INCONCLUSIVE = 'INCONCLUSIVE',
  PENDING = 'PENDING'
}

export enum ComplianceStatus {
  COMPLIANT = 'Compliant',
  NON_COMPLIANT = 'Non Compliant',
  PARTIALLY_COMPLIANT = 'Partial Compliant',
  NOT_APPLICABLE = 'N/A'
}

export interface ComplianceRecord {
  id: string;
  refId: string;
  requirement: string;
  procedure: string;
  evidence: string;
  criteria: string;
  riskRating: 'High' | 'Medium' | 'Low';
  sourceExcerpt: string;
  domainTag: string;
  status: ComplianceStatus;
  remarks: string;
}

export interface GapAnalysisRecord {
  id: string;
  refId: string; // Atomic Unit ID (e.g., Article 4.1.2)
  regulatoryRequirement: string;
  internalReference: string; // Section/Page/Paragraph
  internalText: string; // The exact snippet used for comparison
  gapStatus: 'Full Compliance' | 'Partial' | 'Gap' | 'N/A';
  gapDescription: string;
  riskRating: 'High' | 'Medium' | 'Low';
  remediationAction: string;
}

export interface SamplingRecord {
  id: string;
  isSampled: boolean;
  isOutlier: boolean;
  data: Record<string, any>;
  outlierReason?: string;
}

export interface TrendFinding {
  id: string;
  theme: string;
  frequency: number;
  severityTrend: 'Improving' | 'Degrading' | 'Stable';
  historicalContext: { year: string; count: number; status: string }[];
  aiSynthesis: string;
  recommendedAction: string;
}

export interface RCMRecord {
  id: string;
  refId: string;
  processName: string;
  controlObjective: string;
  riskDescription: string;
  inherentRiskRating: 'High' | 'Medium' | 'Low';
  controlActivity: string;
  controlType: 'Preventive' | 'Detective';
  controlNature: 'Manual' | 'Automated' | 'Semi Automated';
  frequency: string;
  controlOwner: string;
  evidenceOfPerformance: string;
  residualRiskRating: 'High' | 'Medium' | 'Low';
}

export interface ProcessingLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'thinking';
}
