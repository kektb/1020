export type Gender = '남성' | '여성' | '기타' | '답변거부';
export type AgeGroup = '10대 이하' | '20대' | '30대' | '40대' | '50대' | '60대 이상';
export type AIPerception = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  gender: Gender;
  age_group: AgeGroup;
  ai_perception: AIPerception;
  savedAt?: string;
}

export interface Dilemma {
  id: string;
  title: string;
  category?: string;
  description: string;
  option_a: string;
  option_b: string;
  philosophical_context?: string;
  created_at?: string;
}

export interface ResponseItem {
  id: string;
  dilemma_id: string;
  gender: Gender | string;
  age_group: AgeGroup | string;
  ai_perception: number;
  selected_option: 'A' | 'B';
  reason?: string | null;
  likes_count?: number;
  created_at: string;
}

export interface UserVote {
  dilemma_id: string;
  selected_option: 'A' | 'B';
  reason: string;
}

export interface DilemmaStatistics {
  dilemma_id: string;
  totalVotes: number;
  countA: number;
  countB: number;
  percentageA: number;
  percentageB: number;
  byAgeGroup: Record<string, { countA: number; countB: number }>;
  byGender: Record<string, { countA: number; countB: number }>;
  byPerception: Record<number, { countA: number; countB: number }>;
}
