import { apiClient } from '../../../infrastructure/apiClient';
import { API_CONFIG } from '../../../infrastructure/apiConfig';

export interface LoginRequest {
  email: string;
  secretKey: string;
}

export interface LoginResponse {
  adminId: string;
  email?: string;
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => 
    apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, data),
};
