import api from "@/lib/api";
import { Distribution, DistributionFormData } from "@/types/distribution";
import { ItemInstance } from "@/types/purchase";

export const ENDPOINTS = {
  get_distributions: "/distributions",
  distribution_by_id: (id: number) => `/distributions/${id}`,
  distribution_barcodes: (id: number) => `/distributions/${id}/barcodes`,
  create_distribution: "/distributions",
  update_distribution: (id: number) => `/distributions/${id}`,
  delete_distribution: (id: number) => `/distributions/${id}`,
  recent_distributions: "/distributions/recent",
  distributions_by_date_range: "/distributions/date-range",
  approve_distribution: (id: number) => `/distributions/${id}/approve`,
  reject_distribution: (id: number) => `/distributions/${id}/reject`,
};

export const getDistributions = async (): Promise<Distribution[]> => {
  const response = await api.get(ENDPOINTS.get_distributions);
  return response.data;
};

export const getDistributionById = async (id: number): Promise<Distribution> => {
  const response = await api.get(ENDPOINTS.distribution_by_id(id));
  return response.data;
};

export const createDistribution = async (distribution: DistributionFormData): Promise<Distribution> => {
  // Build payload according to backend ItemDistributionRequestDTO
  const payload: any = {
    itemId: distribution.itemId,
    userId: parseInt(distribution.userId.toString()),
    fromOfficeId: distribution.fromOfficeId, // Always include fromOfficeId (user's office)
    toOfficeId: distribution.toOfficeId,
    quantity: distribution.quantity,
    dateDistributed: distribution.dateDistributed,
    remarks: distribution.remarks || null,
    transferType: 'TRANSFER', // Always TRANSFER for office-to-office transfers
  };

  // Add officeId for backward compatibility (same as toOfficeId)
  payload.officeId = distribution.toOfficeId;
  
  const response = await api.post(ENDPOINTS.create_distribution, payload);
  return response.data;
};

export const updateDistribution = async (id: number, distribution: Partial<DistributionFormData>): Promise<Distribution> => {
  const response = await api.put(ENDPOINTS.update_distribution(id), distribution);
  return response.data;
};

export const deleteDistribution = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.delete_distribution(id));
};

export const getRecentDistributions = async (): Promise<Distribution[]> => {
  const response = await api.get(ENDPOINTS.recent_distributions);
  return response.data;
};

export const getDistributionsByDateRange = async (startDate: string, endDate: string): Promise<Distribution[]> => {
  const response = await api.get(ENDPOINTS.distributions_by_date_range, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const approveDistribution = async (id: number): Promise<Distribution> => {
  const response = await api.put(ENDPOINTS.approve_distribution(id));
  return response.data;
};

export const rejectDistribution = async (id: number): Promise<Distribution> => {
  const response = await api.put(ENDPOINTS.reject_distribution(id));
  return response.data;
};

export const getDistributionBarcodes = async (id: number): Promise<ItemInstance[]> => {
  const response = await api.get(ENDPOINTS.distribution_barcodes(id));
  return response.data;
};