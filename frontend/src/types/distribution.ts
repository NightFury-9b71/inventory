export interface Distribution {
  id: number;
  itemId: number;
  itemName: string;
  officeId: number;
  officeName: string;
  userId: number;
  userName: string;
  quantity: number;
  dateDistributed: string;
  remarks?: string;
  status: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistributionFormData {
  itemId: number;
  officeId: number;
  userId: number;
  quantity: number;
  dateDistributed: string;
  remarks?: string;
}

export interface OfficeInventory {
  officeId: number;
  officeName: string;
  itemId: number;
  itemName: string;
  itemCode: string;
  quantity: number;
  unitName?: string;
}