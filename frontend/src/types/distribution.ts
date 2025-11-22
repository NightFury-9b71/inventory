export interface Distribution {
  id: number;
  itemId: number;
  itemName: string;
  fromOfficeId?: number;
  fromOfficeName?: string;
  toOfficeId: number;
  toOfficeName: string;
  userId: number;
  userName: string;
  employeeId?: number;
  employeeName?: string;
  quantity: number;
  dateDistributed: string;
  remarks?: string;
  status: string;
  transferType: 'ALLOCATION' | 'TRANSFER' | 'MOVEMENT' | 'RETURN';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistributionFormData {
  itemId?: number;
  fromOfficeId?: number;
  toOfficeId?: number;
  userId: number;
  employeeId?: number;
  quantity: number;
  dateDistributed: string;
  remarks?: string;
  transferType: 'ALLOCATION' | 'TRANSFER' | 'MOVEMENT' | 'RETURN';
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