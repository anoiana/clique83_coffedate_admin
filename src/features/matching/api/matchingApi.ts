import { apiClient } from '../../../infrastructure/apiClient';
import { API_CONFIG } from '../../../infrastructure/apiConfig';

export interface LocalizedText {
  en: string;
  vn: string;
}

export interface AISubStory {
  hook: LocalizedText;
  thesis: LocalizedText;
  fastProof: LocalizedText[];
  honestyCheck: LocalizedText;
  complementarity: LocalizedText;
  dateVisualization: LocalizedText;
  heroIdentityLabel: LocalizedText;
  compatibilityStory: LocalizedText;
}

export interface AIStory {
  userAStory: AISubStory;
  userBStory: AISubStory;
}

export interface MatchSuggestion {
  id: string;
  userId: string;
  suggestedId: string;
  score: number;
  confidenceFlag: string;
  status: string;
  suggestedAt: string;
  decisionDeadline: string;
  aiStory: AIStory;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  suggested: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface UnmatchedRecord {
  id: string;
  userId: string;
  date: string;
  maxStepTried: number;
  criteriaSnapshot: {
    gender: string;
    intentGoals: string[];
    preferGender: string[];
  };
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export const matchingApi = {
  getSuggestions: async (): Promise<MatchSuggestion[]> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.SUGGESTIONS);
  },

  getSuggestionById: async (id: string): Promise<MatchSuggestion> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.SUGGESTION_DETAIL(id));
  },

  getUnmatched: async (): Promise<UnmatchedRecord[]> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.UNMATCHED);
  },

  manualMatch: async (userAId: string, userBId: string): Promise<{ success: boolean; suggestionA: MatchSuggestion; suggestionB: MatchSuggestion }> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.MANUAL_MATCH, { userAId, userBId });
  },

  // 4. POST /suggestions/admin/check-deadlines — Ép kiểm tra thời hạn gợi ý
  checkDeadlines: async (): Promise<{ expiredCount: number; processedAt: string }> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.CHECK_DEADLINES);
  },
};
