export interface PurchaseItem {
  id?: number;
  itemId: number;
  itemName?: string;
  itemCode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemInstance {
  id: number;
  itemId: number;
  itemName?: string;
  itemCode?: string;
  itemDescription?: string;
  categoryName?: string;
  purchaseId: number;
  barcode: string;
  unitPrice: number;
  status: 'IN_STOCK' | 'DISTRIBUTED' | 'DAMAGED' | 'LOST' | 'RETIRED';
  ownerId?: number;
  ownerName?: string;
  distributedToOfficeId?: number;
  distributedToOfficeName?: string;
  distributedAt?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
  // Purchase details
  vendorName?: string;
  vendorContact?: string;
  purchaseDate?: string;
  invoiceNumber?: string;
  purchasedByName?: string;
}

export interface Purchase {
  id: number;
  purchaseItems: PurchaseItem[];
  totalPrice: number;
  vendorName: string;
  vendorContact?: string;
  purchaseDate: string; // ISO date string
  invoiceNumber?: string;
  remarks?: string;
  purchasedBy: number;
  purchasedByName: string;
  officeId?: number;
  officeName?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseFormData {
  purchaseItems: PurchaseItem[];
  vendorName: string;
  vendorContact?: string;
  purchaseDate: string; // ISO date string
  invoiceNumber?: string;
  remarks?: string;
  purchasedBy: number;
}
