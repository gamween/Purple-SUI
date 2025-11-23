import { apiClient } from './client';

export interface Donation {
  id: string;
  bountyId: string;
  donorAddress: string;
  amount: number;
  message?: string;
  timestamp: string;
  onChainTx?: string;
}

export interface CreateDonationRequest {
  bountyId: string;
  donorAddress: string;
  amount: number;
  message?: string;
  coinObjectId?: string;
  streamerAddress?: string;
  devAddress?: string;
  splitBps?: number;
}

export const donationApi = {
  // Get donations with optional filters
  async getAll(params?: {
    bountyId?: string;
    donorAddress?: string;
    limit?: number;
  }): Promise<{ donations: Donation[] }> {
    const queryParams = new URLSearchParams();
    if (params?.bountyId) queryParams.append('bountyId', params.bountyId);
    if (params?.donorAddress) queryParams.append('donorAddress', params.donorAddress);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return apiClient.get(`/donations${query ? `?${query}` : ''}`);
  },

  // Get donation by ID
  async getById(id: string): Promise<{ donation: Donation }> {
    return apiClient.get(`/donations/${id}`);
  },

  // Create a new donation
  async create(data: CreateDonationRequest): Promise<{ donation: Donation }> {
    return apiClient.post('/donations', data);
  },

  // Get total donations for a bounty
  async getTotalByBounty(bountyId: string): Promise<{ bountyId: string; total: number }> {
    return apiClient.get(`/donations/bounty/${bountyId}/total`);
  },
};
