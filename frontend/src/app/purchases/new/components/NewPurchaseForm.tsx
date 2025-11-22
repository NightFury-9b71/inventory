"use client";

import React, { useState, useEffect } from "react";
import { PurchaseFormData, PurchaseItem } from "@/types/purchase";
import { Item } from "@/types/item";
import { getItems } from "@/services/item_service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, AlertCircle, Plus, Trash2 } from "lucide-react";

type Props = {
  purchase: PurchaseFormData;
  saving: boolean;
  error?: string | null;
  onInputChange: (field: string, value: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function NewPurchaseForm({
  purchase,
  saving,
  error,
  onInputChange,
  onSubmit,
  onCancel,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await getItems();
        setItems(fetchedItems.filter(item => item.isActive));
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);

  const addNewItem = () => {
    const newItem: PurchaseItem = {
      itemId: 0,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    onInputChange("purchaseItems", [...purchase.purchaseItems, newItem]);
  };

  const removeItem = (index: number) => {
    const updatedItems = purchase.purchaseItems.filter((_, i) => i !== index);
    onInputChange("purchaseItems", updatedItems);
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: unknown) => {
    const updatedItems = [...purchase.purchaseItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === "quantity" || field === "unitPrice") {
      const quantity = field === "quantity" ? (value as number) : updatedItems[index].quantity;
      const unitPrice = field === "unitPrice" ? (value as number) : updatedItems[index].unitPrice;
      updatedItems[index].totalPrice = quantity * unitPrice;
    }
    
    if (field === "itemId") {
      const selectedItem = items.find(item => item.id === (value as number));
      if (selectedItem) {
        updatedItems[index].itemName = selectedItem.name;
        updatedItems[index].itemCode = selectedItem.code;
      }
    }
    
    onInputChange("purchaseItems", updatedItems);
  };

  const calculateGrandTotal = () => {
    return purchase.purchaseItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2);
  };

  const isFormValid = () => {
    if (purchase.purchaseItems.length === 0) {
      return false;
    }
    
    // Check all items have valid data
    const allItemsValid = purchase.purchaseItems.every(item => 
      item.itemId > 0 && 
      item.quantity > 0 && 
      item.unitPrice > 0
    );
    
    // Check required purchase fields
    const purchaseFieldsValid = 
      purchase.vendorName.trim() !== "" &&
      purchase.purchaseDate !== "";
    
    return allItemsValid && purchaseFieldsValid;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-semibold">Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addNewItem} disabled={loadingItems}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {purchase.purchaseItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No items added yet. Click "Add Item" to start.
              </div>
            )}

            {purchase.purchaseItems.map((item, index) => (
              <Card key={index} className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor={`item-${index}`}>
                      Item <span className="text-red-500">*</span>
                    </Label>
                    <Select value={item.itemId > 0 ? item.itemId.toString() : ""} onValueChange={(value) => updateItem(index, "itemId", parseInt(value))} disabled={loadingItems}>
                      <SelectTrigger>
                        <SelectValue placeholder={loadingItems ? "Loading..." : "Select an item"} />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map((availableItem) => (
                          <SelectItem key={availableItem.id} value={availableItem.id.toString()}>
                            {availableItem.name} ({availableItem.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`quantity-${index}`}>
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input id={`quantity-${index}`} type="number" min="1" value={item.quantity || ""} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)} placeholder="Qty" required />
                  </div>

                  <div>
                    <Label htmlFor={`unitPrice-${index}`}>
                      Unit Price <span className="text-red-500">*</span>
                    </Label>
                    <Input id={`unitPrice-${index}`} type="number" min="0" step="0.01" value={item.unitPrice || ""} onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)} placeholder="Price" required />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Total Price</Label>
                    <Input value={item.totalPrice.toFixed(2)} readOnly className="bg-gray-100" />
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItem(index)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {purchase.purchaseItems.length > 0 && (
              <div className="flex justify-end">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <Label className="text-lg">Grand Total:</Label>
                  <p className="text-2xl font-bold">৳{calculateGrandTotal()}</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <Label className="text-lg font-semibold mb-4 block">Purchase Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="vendorName">
                  Vendor Name <span className="text-red-500">*</span>
                </Label>
                <Input id="vendorName" value={purchase.vendorName} onChange={(e) => onInputChange("vendorName", e.target.value)} placeholder="Enter vendor name" required />
              </div>

              <div>
                <Label htmlFor="vendorContact">Vendor Contact</Label>
                <Input id="vendorContact" value={purchase.vendorContact || ""} onChange={(e) => onInputChange("vendorContact", e.target.value)} placeholder="Enter vendor contact (optional)" />
              </div>

              <div>
                <Label htmlFor="purchaseDate">
                  Purchase Date <span className="text-red-500">*</span>
                </Label>
                <Input id="purchaseDate" type="date" value={purchase.purchaseDate} onChange={(e) => onInputChange("purchaseDate", e.target.value)} required />
              </div>

              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" value={purchase.invoiceNumber || ""} onChange={(e) => onInputChange("invoiceNumber", e.target.value)} placeholder="Enter invoice number (optional)" />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" value={purchase.remarks || ""} onChange={(e) => onInputChange("remarks", e.target.value)} placeholder="Enter any remarks (optional)" rows={3} className="resize-none" />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={saving || !isFormValid()}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Adding..." : "Add Purchase"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
