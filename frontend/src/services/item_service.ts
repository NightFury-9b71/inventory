import api from "@/lib/api";
import { Item, ItemFormData } from "@/types/item";

export const ENDPOINTS = {
  get_items: "/items",
  item_by_id: (id: number) => `/items/${id}`,
  item_by_code: (code: string) => `/items/code/${code}`,
  search_items: (query: string) => `/items/search?query=${query}`,
  low_stock_items: (threshold: number) => `/items/low-stock?threshold=${threshold}`,
  create_item: "/items",
  update_item: (id: number) => `/items/${id}`,
  delete_item: (id: number) => `/items/${id}`,
};

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get(ENDPOINTS.get_items);
  return response.data;
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await api.get(ENDPOINTS.item_by_id(id));
  return response.data;
};

export const getItemByCode = async (code: string): Promise<Item> => {
  const response = await api.get(ENDPOINTS.item_by_code(code));
  return response.data;
};

export const getItemInstanceByBarcode = async (barcode: string) => {
  const response = await api.get(`/purchases/barcode/${barcode}`);
  return response.data;
};

export const searchItems = async (query: string): Promise<Item[]> => {
  const response = await api.get(ENDPOINTS.search_items(query));
  return response.data;
};

export const getLowStockItems = async (threshold: number = 10): Promise<Item[]> => {
  const response = await api.get(ENDPOINTS.low_stock_items(threshold));
  return response.data;
};

export const createItem = async (item: ItemFormData): Promise<Item> => {
  const response = await api.post(ENDPOINTS.create_item, item);
  return response.data;
};

export const updateItem = async (id: number, item: Partial<ItemFormData>): Promise<Item> => {
  const response = await api.put(ENDPOINTS.update_item(id), item);
  return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
  const response = await api.delete(ENDPOINTS.delete_item(id));
  return response.data;
};
