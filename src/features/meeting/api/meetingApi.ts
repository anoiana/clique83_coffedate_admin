import { apiClient } from '../../../infrastructure/apiClient';
import { API_CONFIG } from '../../../infrastructure/apiConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MeetingUser {
  id: string;
  fullName: string;
  email: string;
}

export interface MeetingLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  userAId: string;
  userBId: string;
  status: 'awaiting_availability' | 'awaiting_confirmation' | 'confirmed' | 'completed' | 'cancelled';
  suggestedAt: string;
  scheduledAt?: string;
  locationId?: string;
  location?: MeetingLocation;
  userA: MeetingUser;
  userB: MeetingUser;
}

export interface MeetingsResponse {
  meetings: Meeting[];
}

export interface LocationsResponse {
  locations: MeetingLocation[];
}

export interface CreateLocationRequest {
  name: string;
  address: string;
  city: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  address?: string;
  city?: string;
  description?: string;
  imageUrl?: string;
}

export interface LocationsQueryParams {
  city?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const meetingApi = {
  // 1. GET /admin/meetings — Xem tất cả các cuộc hẹn
  getMeetings: async (): Promise<MeetingsResponse> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.MEETINGS);
  },

  // 2. GET /meetings/locations — Danh sách địa điểm hẹn hò
  getLocations: async (params?: LocationsQueryParams): Promise<LocationsResponse> => {
    const queryParams: Record<string, string> = {};
    if (params?.city) queryParams.city = params.city;
    return apiClient.get(API_CONFIG.ENDPOINTS.LOCATIONS, { params: queryParams });
  },

  // 3. POST /meetings/locations — Thêm địa điểm mới
  createLocation: async (data: CreateLocationRequest): Promise<MeetingLocation> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.LOCATIONS, data);
  },

  // 4. PATCH /meetings/locations/:id — Cập nhật địa điểm
  updateLocation: async (id: string, data: UpdateLocationRequest): Promise<MeetingLocation> => {
    return apiClient.patch(API_CONFIG.ENDPOINTS.LOCATION_DETAIL(id), data);
  },

  // 5. DELETE /meetings/locations/:id — Xóa địa điểm
  deleteLocation: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(API_CONFIG.ENDPOINTS.LOCATION_DETAIL(id));
  },
};
