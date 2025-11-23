import { apiClient } from './client';

export interface TwitchUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  profileImage: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: TwitchUser;
  tokens: AuthTokens;
}

export const authApi = {
  // Get Twitch OAuth URL
  async getOAuthUrl(role?: 'dev' | 'streamer' | 'viewer'): Promise<{ url: string; state: string }> {
    return apiClient.get(`/auth/url?role=${role || 'viewer'}`);
  },

  // Exchange OAuth code for tokens
  async callback(code: string): Promise<AuthResponse> {
    return apiClient.post('/auth/callback', { code });
  },

  // Validate access token
  async validate(accessToken: string): Promise<{ valid: boolean; user?: TwitchUser }> {
    return apiClient.post('/auth/validate', { accessToken });
  },
};
