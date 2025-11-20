import api from "@/lib/api";

// Types
export interface OfficeDistributionRequest {
  itemId: number;
  fromOfficeId: number;
  toOfficeId: number;
  quantity: number;
  remarks?: string;
  initiatedByUserId: number;
}

export interface ReturnItemRequest {
  itemId: number;
  fromOfficeId: number;
  toOfficeId: number;
  quantity: number;
  remarks?: string;
  returnReason: string;
  initiatedByUserId: number;
}

export interface OfficeTransaction {
  id: number;
  itemId: number;
  itemName: string;
  itemCode: string;
  fromOfficeId: number;
  fromOfficeName: string;
  toOfficeId: number;
  toOfficeName: string;
  transactionType: "DISTRIBUTION" | "RETURN" | "PURCHASE" | "ADJUSTMENT";
  quantity: number;
  initiatedByUserId: number;
  initiatedByUserName: string;
  approvedByUserId?: number;
  approvedByUserName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  transactionDate: string;
  approvedDate?: string;
  remarks?: string;
  rejectionReason?: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeInventory {
  officeId: number;
  officeName: string;
  itemId: number;
  itemName: string;
  itemCode: string;
  quantity: number;
  unitName: string;
}

export interface ChildOffice {
  id: number;
  name: string;
  nameBn?: string;
  code: string;
  type: string;
  description?: string;
  isActive: boolean;
}

// API Endpoints
const ENDPOINTS = {
  distribute: "/api/office-distributions/distribute",
  return: "/api/office-distributions/return",
  officeTransactions: (officeId: number) => `/api/office-distributions/office/${officeId}/transactions`,
  itemHistory: (itemId: number) => `/api/office-distributions/item/${itemId}/history`,
  pendingTransactions: (officeId: number) => `/api/office-distributions/office/${officeId}/pending`,
  childOffices: (parentOfficeId: number) => `/api/office-distributions/office/${parentOfficeId}/children`,
  parentOffice: (childOfficeId: number) => `/api/office-distributions/office/${childOfficeId}/parent`,
  officeInventory: (officeId: number) => `/api/office-distributions/office/${officeId}/inventory`,
  transactionByReference: (referenceNumber: string) => `/api/office-distributions/reference/${referenceNumber}`,
  distributionHistory: (officeId: number) => `/api/office-distributions/office/${officeId}/distributions`,
  returnHistory: (officeId: number) => `/api/office-distributions/office/${officeId}/returns`,
};

// Service Functions

/**
 * Distribute items from parent office to child office
 */
export const distributeToChildOffice = async (
  request: OfficeDistributionRequest
): Promise<OfficeTransaction> => {
  const response = await api.post(ENDPOINTS.distribute, request);
  return response.data;
};

/**
 * Return items from child office to parent office
 */
export const returnToParentOffice = async (
  request: ReturnItemRequest
): Promise<OfficeTransaction> => {
  const response = await api.post(ENDPOINTS.return, request);
  return response.data;
};

/**
 * Get all transactions for a specific office
 */
export const getOfficeTransactions = async (
  officeId: number
): Promise<OfficeTransaction[]> => {
  const response = await api.get(ENDPOINTS.officeTransactions(officeId));
  return response.data;
};

/**
 * Get transaction history for a specific item
 */
export const getItemTransactionHistory = async (
  itemId: number
): Promise<OfficeTransaction[]> => {
  const response = await api.get(ENDPOINTS.itemHistory(itemId));
  return response.data;
};

/**
 * Get pending transactions for an office
 */
export const getPendingTransactions = async (
  officeId: number
): Promise<OfficeTransaction[]> => {
  const response = await api.get(ENDPOINTS.pendingTransactions(officeId));
  return response.data;
};

/**
 * Get child offices available for distribution
 */
export const getChildOfficesForDistribution = async (
  parentOfficeId: number
): Promise<ChildOffice[]> => {
  const response = await api.get(ENDPOINTS.childOffices(parentOfficeId));
  return response.data;
};

/**
 * Get parent office for returns
 */
export const getParentOfficeForReturn = async (
  childOfficeId: number
): Promise<ChildOffice> => {
  const response = await api.get(ENDPOINTS.parentOffice(childOfficeId));
  return response.data;
};

/**
 * Get available inventory for an office
 */
export const getOfficeInventory = async (
  officeId: number
): Promise<OfficeInventory[]> => {
  const response = await api.get(ENDPOINTS.officeInventory(officeId));
  return response.data;
};

/**
 * Get transaction by reference number
 */
export const getTransactionByReference = async (
  referenceNumber: string
): Promise<OfficeTransaction> => {
  const response = await api.get(ENDPOINTS.transactionByReference(referenceNumber));
  return response.data;
};

/**
 * Get distribution history (items sent to child offices)
 */
export const getDistributionHistory = async (
  officeId: number
): Promise<OfficeTransaction[]> => {
  const response = await api.get(ENDPOINTS.distributionHistory(officeId));
  return response.data;
};

/**
 * Get return history (items received back from child offices)
 */
export const getReturnHistory = async (
  officeId: number
): Promise<OfficeTransaction[]> => {
  const response = await api.get(ENDPOINTS.returnHistory(officeId));
  return response.data;
};
