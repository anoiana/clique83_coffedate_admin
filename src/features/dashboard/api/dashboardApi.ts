import { apiClient } from '../../../infrastructure/apiClient';
import { API_CONFIG } from '../../../infrastructure/apiConfig';

export interface DashboardAnalytics {
  totalUsers: number;
  totalEvaluations: number;
  totalMembers: number;
  activeMatches: number;
  completedDates: number;
}

export interface RevenueData {
  label: string;
  value: number;
}

export interface DemographicData {
  label: string;
  value: number;
}

export interface LifecycleStage {
  label: string;
  value: number;
}

export interface RevenueAnalytics {
  revenue: RevenueData[];
  demographics: {
    gender: DemographicData[];
    city: DemographicData[];
    age: DemographicData[];
  };
}

export interface SeedDataResult {
  success: boolean;
  message: string;
  seededCount?: number;
}

export interface CleanupResult {
  success: boolean;
  message: string;
  deletedCount?: number;
}

export interface ForceMatchRequest {
  userAId: string;
  userBId: string;
}

export const dashboardApi = {
  getAnalytics: async (): Promise<DashboardAnalytics> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS);
  },

  getRevenueAnalytics: async (timeframe: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<RevenueAnalytics> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.REVENUE_ANALYTICS, {
      params: { timeframe },
    });
  },

  getLifecycleAnalytics: async (): Promise<LifecycleStage[]> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.LIFECYCLE_ANALYTICS);
  },

  // 1. POST /admin/analytics/seed — Tạo dữ liệu mẫu (Demo)
  seedData: async (): Promise<SeedDataResult> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.SEED_DATA);
  },

  // 2. POST /admin/analytics/cleanup — Dọn dẹp dữ liệu mẫu
  cleanupData: async (): Promise<CleanupResult> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.CLEANUP_DATA);
  },

  // 3. POST /test/force-match — Ép buộc ghép đôi nhanh (Test)
  forceMatch: async (userAId: string, userBId: string): Promise<{ success: boolean }> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.FORCE_MATCH, { userAId, userBId });
  },
};
