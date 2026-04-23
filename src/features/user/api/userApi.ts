import { apiClient } from '../../../infrastructure/apiClient';
import { API_CONFIG } from '../../../infrastructure/apiConfig';

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  location: string | null;
  isMember: boolean;
  round1Completed: boolean;
  round2Completed: boolean;
  createdAt: string;
  status?: string;
  adminStatus?: string;
}

export interface UsersResponse {
  users: UserSummary[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface UserDetail {
  id: string;
  email: string;
  fullName: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isMember: boolean;
  round1Completed: boolean;
  round2Completed: boolean;
  isFullyOnboarded: boolean;
  isInMatchingPool: boolean;
  membershipPaidAt: string | null;
  adminStatus?: string;
  status?: string;
  adminRejectionReason?: string | null;
  photos?: UserPhoto[];
  cccdPhoto?: string;
  evaluation?: {
    id: string;
    userId?: string;
    gender: string;
    preferGender: string[];
    birthdate: string;
    location: string;
    education: string;
    workField: string;
    incomeRange: string;
    intentGoals: string[];
    source?: string | null;
    openToSameGenderForBusiness?: boolean | null;
    phoneNumber?: string;
    fullName?: string;
  };
  round2Evaluation?: Round2Evaluation | null;
  round3Evaluation?: any | null;
  wallet?: {
    balance: number;
    updatedAt: string;
  };
}

export interface Round2Evaluation {
  id: string;
  userId: string;
  data: {
    bio: string;
    height: number;
    openness?: number;
    interests: string[];
    languages: string[];
    ageFlexible: boolean;
    fitnessLevel: number;
    socialEnergy: number;
    decisionStyle: string;
    loveLanguages: string[];
    lifePriorities: string[];
    religionBelief: string;
    attachmentStyle: string;
    lifeOrientation: number;
    preferredAgeMax: number;
    preferredAgeMin: number;
    communicationStyle: string;
  };
  submittedAt: string;
  updatedAt: string;
}

export interface UserPhoto {
  id: string;
  userId?: string;
  url: string;
  category?: string;
  isPublic: boolean;
  isVerified: boolean;
  createdAt?: string;
}

export interface PendingProfile {
  id: string;
  email: string;
  fullName: string;
  location: string | null;
  createdAt: string;
  round1Completed: boolean;
  round2Completed: boolean;
  isMember: boolean;
  isFullyOnboarded: boolean;
  adminStatus?: string;
  evaluation?: any | null;
  round2Evaluation?: Round2Evaluation | null;
  round3Evaluation?: any | null;
  photos?: UserPhoto[];
  submittedAt?: string; // Legacy field if any
}

export type ResubmitStep =
  | 'ROUND_1'
  | 'ROUND_2_ALL'
  | 'ROUND_2_VALUES'
  | 'ROUND_2_MATCH'
  | 'ROUND_2_PERSONALITY'
  | 'ROUND_2_LIFESTYLE'
  | 'ROUND_2_INTERESTS'
  | 'ROUND_2_BACKGROUND'
  | 'ROUND_2_EXPRESSION'
  | 'PHOTOS'
  | 'ROUND_3'
  | 'FULL_RESET';

export interface RejectRequest {
  reason: string;
  resubmitStep?: ResubmitStep;
}

export interface PhotoVisibilityRequest {
  photoIds: string[];
  isPublic: boolean;
}

export interface UsersQueryParams {
  search?: string;
  location?: string;
  isMember?: boolean;
  round1Completed?: boolean;
  round2Completed?: boolean;
  page?: number;
  limit?: number;
}

export const userApi = {
  // 1. GET /admin/users — Danh sách tất cả người dùng
  getUsers: async (params?: UsersQueryParams): Promise<UsersResponse> => {
    const queryParams: Record<string, any> = {};
    
    if (params) {
      if (params.search && params.search.trim() !== '') {
        queryParams.search = params.search;
      }
      if (params.location && params.location.trim() !== '') {
        queryParams.location = params.location;
      }
      if (params.isMember !== undefined) {
        queryParams.isMember = params.isMember ? 1 : 0;
      }
      if (params.round1Completed !== undefined) {
        queryParams.round1Completed = params.round1Completed ? 1 : 0;
      }
      if (params.round2Completed !== undefined) {
        queryParams.round2Completed = params.round2Completed ? 1 : 0;
      }
      
      // Optimization/Workaround: Only send page and limit if they are not the defaults
      // to avoid potential backend validation issues with stringified numbers.
      if (params.page && params.page > 1) {
        queryParams.page = params.page;
      }
      
      if (params.limit && params.limit !== 20) {
        queryParams.limit = params.limit;
      }
    }

    return apiClient.get(API_CONFIG.ENDPOINTS.USERS, { params: queryParams });
  },

  // 2. GET /admin/users/:id — Chi tiết một người dùng
  getUserById: async (id: string): Promise<UserDetail> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.USER_DETAIL(id));
  },

  // 3. GET /admin/pending-profiles — Danh sách hồ sơ chờ duyệt
  getPendingProfiles: async (): Promise<PendingProfile[]> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.PENDING_PROFILES);
  },

  // 4. POST /admin/users/:id/approve — Duyệt hồ sơ
  approveUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.APPROVE_USER(id));
  },

  // 5. POST /admin/users/:id/reject — Từ chối hồ sơ
  rejectUser: async (id: string, reason: string, resubmitStep?: ResubmitStep): Promise<{ success: boolean; message: string }> => {
    const payload: RejectRequest = resubmitStep ? { reason, resubmitStep } : { reason };
    return apiClient.post(API_CONFIG.ENDPOINTS.REJECT_USER(id), payload);
  },

  // 6. PATCH /admin/users/:id/photo-visibility — Quản lý ẩn/hiện ảnh
  updatePhotoVisibility: async (id: string, data: PhotoVisibilityRequest): Promise<{ success: boolean }> => {
    return apiClient.patch(API_CONFIG.ENDPOINTS.PHOTO_VISIBILITY(id), data);
  },
};
