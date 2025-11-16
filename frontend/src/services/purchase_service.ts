import api from "@/lib/api";
import { Purchase, PurchaseFormData, ItemInstance, PurchaseItem } from "@/types/purchase";

export const ENDPOINTS = {
  get_purchases: "/purchases",
  purchase_by_id: (id: number) => `/purchases/${id}`,
  purchase_barcodes: (id: number) => `/purchases/${id}/barcodes`,
  barcode_search: (barcode: string) => `/purchases/barcode/${barcode}`,
  create_purchase: "/purchases",
  recent_purchases: "/purchases/recent",
  purchases_by_date_range: "/purchases/date-range",
};

export const getPurchases = async (): Promise<Purchase[]> => {
  const response = await api.get(ENDPOINTS.get_purchases);
  return response.data;
};

export const getPurchaseById = async (id: number): Promise<Purchase> => {
  const response = await api.get(ENDPOINTS.purchase_by_id(id));
  return response.data;
};

export const createPurchase = async (purchase: PurchaseFormData): Promise<Purchase> => {
  // Format the data to ensure proper types for backend
  const formattedPurchase = {
    items: purchase.purchaseItems.map(item => ({
      itemId: Number(item.itemId),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
    vendorName: purchase.vendorName,
    vendorContact: purchase.vendorContact,
    purchaseDate: purchase.purchaseDate,
    invoiceNumber: purchase.invoiceNumber,
    remarks: purchase.remarks,
    purchasedById: Number(purchase.purchasedBy),
  };
  
  const response = await api.post(ENDPOINTS.create_purchase, formattedPurchase);
  return response.data;
};

export const updatePurchase = async (id: number, purchase: Partial<PurchaseFormData>): Promise<Purchase> => {
  const response = await api.put(ENDPOINTS.purchase_by_id(id), purchase);
  return response.data;
};

export const deletePurchase = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.purchase_by_id(id));
};

export const getRecentPurchases = async (): Promise<Purchase[]> => {
  const response = await api.get(ENDPOINTS.recent_purchases);
  return response.data;
};

export const getPurchasesByDateRange = async (startDate: string, endDate: string): Promise<Purchase[]> => {
  const response = await api.get(ENDPOINTS.purchases_by_date_range, {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getPurchaseBarcodes = async (id: number): Promise<ItemInstance[]> => {
  const response = await api.get(ENDPOINTS.purchase_barcodes(id));
  return response.data;
};

export const getItemInstanceByBarcode = async (barcode: string): Promise<ItemInstance> => {
  const response = await api.get(ENDPOINTS.barcode_search(barcode));
  return response.data;
};
