import { API_CONFIG } from './apiConfig';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export const apiClient = {
  get: (url: string, options?: RequestOptions) => 
    apiClient.request(url, { ...options, method: 'GET' }),
    
  post: (url: string, body?: any, options?: RequestOptions) =>
    apiClient.request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),

  patch: (url: string, body?: any, options?: RequestOptions) =>
    apiClient.request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  delete: (url: string, options?: RequestOptions) =>
    apiClient.request(url, { ...options, method: 'DELETE' }),

  request: async (url: string, options: RequestOptions = {}) => {
    const { params, ...fetchOptions } = options;
    const fullUrl = new URL(`${API_CONFIG.BASE_URL}${url}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fullUrl.searchParams.set(key, String(value));
        }
      });
    }

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (options.method !== 'GET' && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Auto-add admin key from localStorage for all admin API calls
    const adminKey = localStorage.getItem('adminSecret');
    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    }

    const response = await fetch(fullUrl.toString(), {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
  },
};
