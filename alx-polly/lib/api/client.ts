// API client configuration and base functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0);
  }
}

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    
    register: (userData: { email: string; username: string; name: string; password: string }) =>
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    logout: () =>
      apiRequest('/auth/logout', {
        method: 'POST',
      }),
    
    me: () =>
      apiRequest('/auth/me'),
    
    updateProfile: (data: Partial<{ name: string; username: string; email: string }>) =>
      apiRequest('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Poll endpoints
  polls: {
    getAll: (params?: { page?: number; limit?: number; search?: string; sortBy?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      
      const query = searchParams.toString();
      return apiRequest(`/polls${query ? `?${query}` : ''}`);
    },
    
    getById: (id: string) =>
      apiRequest(`/polls/${id}`),
    
    create: (pollData: any) =>
      apiRequest('/polls', {
        method: 'POST',
        body: JSON.stringify(pollData),
      }),
    
    update: (id: string, pollData: any) =>
      apiRequest(`/polls/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(pollData),
      }),
    
    delete: (id: string) =>
      apiRequest(`/polls/${id}`, {
        method: 'DELETE',
      }),
    
    vote: (pollId: string, optionId: string) =>
      apiRequest(`/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId }),
      }),
    
    getUserPolls: (userId: string) =>
      apiRequest(`/users/${userId}/polls`),
  },
};
