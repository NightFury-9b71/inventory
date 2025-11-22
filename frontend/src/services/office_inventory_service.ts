import api from "@/lib/api";
import { OfficeInventory } from "@/types/distribution";
import { ItemInstance } from "@/types/purchase";

export const ENDPOINTS = {
  get_my_office_inventory: "/office-inventory/my-office",
  get_my_office_item_instances: "/office-inventory/my-office/item-instances",
  get_inventory_by_office: (officeId: number) => `/office-inventory/office/${officeId}`,
  get_office_item_instances: (officeId: number) => `/office-inventory/office/${officeId}/item-instances`,
  get_inventory_by_item: (itemId: number) => `/office-inventory/item/${itemId}`,
  get_available_items_by_office: (officeId: number) => `/office-inventory/office/${officeId}/available`,
  get_total_quantity_by_item: (itemId: number) => `/office-inventory/item/${itemId}/total-quantity`,
  transfer_items: "/office-inventory/transfer",
  adjust_inventory: "/office-inventory/adjust",
  check_stock: "/office-inventory/check-stock",
};

export const getMyOfficeInventory = async (): Promise<OfficeInventory[]> => {
  const response = await api.get(ENDPOINTS.get_my_office_inventory);
  return response.data;
};

export const getInventoryByOffice = async (officeId: number): Promise<OfficeInventory[]> => {
  const response = await api.get(ENDPOINTS.get_inventory_by_office(officeId));
  return response.data;
};

export const getInventoryByItem = async (itemId: number): Promise<OfficeInventory[]> => {
  const response = await api.get(ENDPOINTS.get_inventory_by_item(itemId));
  return response.data;
};

export const getAvailableItemsByOffice = async (officeId: number): Promise<OfficeInventory[]> => {
  const response = await api.get(ENDPOINTS.get_available_items_by_office(officeId));
  return response.data;
};

export const getTotalQuantityByItem = async (itemId: number): Promise<number> => {
  const response = await api.get(ENDPOINTS.get_total_quantity_by_item(itemId));
  return response.data;
};

export const transferItems = async (
  fromOfficeId: number,
  toOfficeId: number,
  itemId: number,
  quantity: number
): Promise<void> => {
  await api.post(ENDPOINTS.transfer_items, null, {
    params: { fromOfficeId, toOfficeId, itemId, quantity }
  });
};

export const adjustInventory = async (
  officeId: number,
  itemId: number,
  quantityChange: number
): Promise<void> => {
  await api.post(ENDPOINTS.adjust_inventory, null, {
    params: { officeId, itemId, quantityChange }
  });
};

export const checkStock = async (
  officeId: number,
  itemId: number,
  requiredQuantity: number
): Promise<boolean> => {
  const response = await api.get(ENDPOINTS.check_stock, {
    params: { officeId, itemId, requiredQuantity }
  });
  return response.data;
};
export const getMyOfficeItemInstances = async (): Promise<ItemInstance[]> => {
  const response = await api.get(ENDPOINTS.get_my_office_item_instances);
  return response.data;
};

export const getOfficeItemInstances = async (officeId: number): Promise<ItemInstance[]> => {
  const response = await api.get(ENDPOINTS.get_office_item_instances(officeId));
  return response.data;
};
