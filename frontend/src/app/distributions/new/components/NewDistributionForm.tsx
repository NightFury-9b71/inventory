"use client";

import React, { useState, useEffect } from "react";
import { DistributionFormData, OfficeInventory } from "@/types/distribution";
import { Office } from "@/types/office";
import { getMyOfficeInventory } from "@/services/office_inventory_service";
import { getAllOffices } from "@/services/office_service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, AlertCircle, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  distribution: DistributionFormData;
  saving: boolean;
  error?: string | null;
  onInputChange: (field: string, value: unknown) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function NewDistributionForm({
  distribution,
  saving,
  error,
  onInputChange,
  onSubmit,
  onCancel,
}: Props) {
  const { user } = useAuth();
  const [officeInventory, setOfficeInventory] = useState<OfficeInventory[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [officesError, setOfficesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedInventory, fetchedOffices] = await Promise.all([
          getMyOfficeInventory(),
          getAllOffices()
        ]);
        
        // Ensure we have arrays before filtering
        const inventoryArray = Array.isArray(fetchedInventory) ? fetchedInventory : [];
        const officesArray = Array.isArray(fetchedOffices) ? fetchedOffices : [];
        
        setOfficeInventory(inventoryArray.filter(inv => inv.quantity > 0));
        setOffices(officesArray.filter(office => office.isActive));
        setInventoryError(null);
        setOfficesError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setInventoryError(errorMessage);
        setOfficesError(errorMessage);
      } finally {
        setLoadingInventory(false);
        setLoadingOffices(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Item to Another Office</CardTitle>
        <p className="text-sm text-gray-600">
          Transfer items from your office inventory to another office. This will change the ownership of the items.
        </p>
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

        {/* Display User's Office */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Transferring From</p>
            <p className="text-sm text-blue-700">
              {user?.officeName || 'Your Office'} (Your assigned office)
            </p>
          </div>
        </div>

        {/* No Inventory Warning */}
        {!loadingInventory && !inventoryError && officeInventory.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">No Inventory Available</p>
              <p className="text-sm text-amber-700">
                Your office doesn't have any items in inventory. Items must be in your office inventory before they can be transferred.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Selection */}
            <div>
              <Label htmlFor="itemId">
                Item <span className="text-red-500">*</span>
              </Label>
              <Select
                value={distribution.itemId?.toString() || ""}
                onValueChange={(value) => onInputChange("itemId", parseInt(value))}
                disabled={loadingInventory || !!inventoryError}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingInventory ? "Loading inventory..." : 
                    inventoryError ? "Failed to load inventory" : 
                    "Select an item from your office inventory"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {officeInventory.map((inv) => (
                    <SelectItem key={inv.itemId} value={inv.itemId.toString()}>
                      {inv.itemName} ({inv.itemCode}) - Available: {inv.quantity} {inv.unitName || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {inventoryError && (
                <p className="text-sm text-red-600 mt-1">{inventoryError}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Select item from your office's inventory
              </p>
            </div>

            {/* To Office */}
            <div>
              <Label htmlFor="toOfficeId">
                Transfer To Office <span className="text-red-500">*</span>
              </Label>
              <Select
                value={distribution.toOfficeId?.toString() || ""}
                onValueChange={(value) => onInputChange("toOfficeId", parseInt(value))}
                disabled={loadingOffices || !!officesError}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingOffices ? "Loading offices..." : 
                    officesError ? "Failed to load offices" : 
                    "Select destination office"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {offices
                    .filter(office => !distribution.fromOfficeId || office.id !== distribution.fromOfficeId)
                    .map((office) => (
                      <SelectItem key={office.id} value={office.id.toString()}>
                        {office.name} ({office.code})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {officesError && (
                <p className="text-sm text-red-600 mt-1">{officesError}</p>
              )}
              {distribution.fromOfficeId && distribution.toOfficeId === distribution.fromOfficeId && (
                <p className="text-sm text-amber-600 mt-1">
                  Cannot transfer to your own office
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Select which office will receive the items
              </p>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={
                  distribution.itemId 
                    ? officeInventory.find(inv => inv.itemId === distribution.itemId)?.quantity 
                    : undefined
                }
                value={distribution.quantity || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  onInputChange("quantity", isNaN(value) ? 0 : value);
                }}
                placeholder="Enter quantity"
                required
              />
              {distribution.itemId && officeInventory.find(inv => inv.itemId === distribution.itemId) && (
                <p className="text-sm text-gray-500 mt-1">
                  Available: {officeInventory.find(inv => inv.itemId === distribution.itemId)?.quantity || 0}
                </p>
              )}
              {distribution.itemId && distribution.quantity > 0 && 
                officeInventory.find(inv => inv.itemId === distribution.itemId) &&
                distribution.quantity > (officeInventory.find(inv => inv.itemId === distribution.itemId)?.quantity || 0) && (
                <p className="text-sm text-red-600 mt-1">
                  Quantity exceeds available inventory
                </p>
              )}
            </div>

            {/* Transfer Date */}
            <div>
              <Label htmlFor="dateDistributed">
                Transfer Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateDistributed"
                type="date"
                value={distribution.dateDistributed}
                onChange={(e) => onInputChange("dateDistributed", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={distribution.remarks || ""}
              onChange={(e) => onInputChange("remarks", e.target.value)}
              placeholder="Enter any remarks (optional)"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={
                saving || 
                !distribution.itemId || 
                !distribution.fromOfficeId || // User must have an assigned office
                !distribution.toOfficeId || 
                !distribution.quantity ||
                distribution.quantity < 1 ||
                !distribution.dateDistributed ||
                // Prevent same office transfer
                (!!distribution.fromOfficeId && !!distribution.toOfficeId && 
                  distribution.fromOfficeId === distribution.toOfficeId) ||
                // Check if quantity exceeds available inventory
                (!!distribution.itemId && 
                  distribution.quantity > (officeInventory.find(inv => inv.itemId === distribution.itemId)?.quantity || 0))
              }
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Transferring..." : "Transfer Items"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}