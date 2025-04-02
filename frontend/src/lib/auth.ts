import Cookies from 'js-cookie';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const auth = {
  async signUp(data: SignUpData): Promise<User> {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sign up');
    }

    return response.json();
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sign in');
    }

    return response.json();
  },

  async getCurrentUser(): Promise<User> {
    const response = await this.authenticatedRequest('/api/users/me');
    return response.json();
  },

  setToken(token: string) {
    Cookies.set('token', token, { expires: 7 }); // Token expires in 7 days
  },

  removeToken() {
    Cookies.remove('token');
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token');
  },

  async authenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken();
        throw new Error('Authentication failed');
      }
      const error = await response.json();
      throw new Error(error.detail || 'Request failed');
    }

    return response;
  },
}; 