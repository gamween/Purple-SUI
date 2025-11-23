import { apiClient } from './client';

export interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  split: number;
  duration: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  devAddress: string;
  streamerAddress?: string;
  createdAt: string;
  updatedAt: string;
  onChainTx?: string;
  donations?: number;
}

export interface CreateBountyRequest {
  title: string;
  description: string;
  amount: number;
  split?: number;
  duration?: string;
  devAddress: string;
  rewardCoinObjectId?: string;
  streamerAddress?: string;
}

export const bountyApi = {
  // Get all bounties with optional filters
  async getAll(params?: {
    status?: string;
    devAddress?: string;
    streamerAddress?: string;
  }): Promise<{ bounties: Bounty[] }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.devAddress) queryParams.append('devAddress', params.devAddress);
    if (params?.streamerAddress) queryParams.append('streamerAddress', params.streamerAddress);
    
    const query = queryParams.toString();
    return apiClient.get(`/bounties${query ? `?${query}` : ''}`);
  },

  // Get bounty by ID
  async getById(id: string): Promise<{ bounty: Bounty }> {
    return apiClient.get(`/bounties/${id}`);
  },

  // Create a new bounty
  async create(data: CreateBountyRequest): Promise<{ bounty: Bounty }> {
    return apiClient.post('/bounties', data);
  },

  // Accept a bounty (streamer)
  async accept(id: string, data: {
    streamerAddress: string;
    bountyObjectId?: string;
  }): Promise<{ bounty: Bounty }> {
    return apiClient.post(`/bounties/${id}/accept`, data);
  },

  // Complete a bounty
  async complete(id: string, data?: {
    bountyObjectId?: string;
    vaultCoinObjectId?: string;
  }): Promise<{ bounty: Bounty }> {
    return apiClient.post(`/bounties/${id}/complete`, data);
  },

  // Cancel a bounty
  async cancel(id: string): Promise<{ bounty: Bounty }> {
    return apiClient.post(`/bounties/${id}/cancel`);
  },

  // Update donation amount
  async updateDonations(id: string, amount: number): Promise<{ bounty: Bounty }> {
    return apiClient.post(`/bounties/${id}/donations`, { amount });
  },
};
