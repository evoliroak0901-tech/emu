export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AnalysisLog {
  visual_feature: string;
  musical_translation: string;
  parameter: string; // e.g., "BPM", "Instrument", "Mood"
}

export interface AnalysisResult {
  prompt: string;
  logs: AnalysisLog[];
  technical_summary: string;
}

export interface GridCell {
  id: number;
  opacity: number;
  active: boolean;
}