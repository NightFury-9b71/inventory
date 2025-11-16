import api from "@/lib/api";
import { Distribution, DistributionFormData } from "@/types/distribution";

export const ENDPOINTS = {
  get_distributions: "/distributions",
  distribution_by_id: (id: number) => `/distributions/${id}`,
  create_distribution: "/distributions",
  update_distribution: (id: number) => `/distributions/${id}`,
  delete_distribution: (id: number) => `/distributions/${id}`,
  recent_distributions: "/distributions/recent",
  distributions_by_date_range: "/distributions/date-range",
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
  const response = await api.post(ENDPOINTS.create_distribution, {
    ...distribution,
    userId: parseInt(distribution.userId.toString())
  });
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