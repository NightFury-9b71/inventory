"use client";

import React, { useState, useEffect } from "react";
import { Distribution, DistributionFormData } from "@/types/distribution";
import { Item } from "@/types/item";
import { Office } from "@/types/office";
import { getItems } from "@/services/item_service";
import { getOffices } from "@/services/office_service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, AlertCircle } from "lucide-react";
import Can from "@/components/auth/Can";

type Props = {
  distribution: Distribution;
  saving: boolean;
  error?: string | null;
  onInputChange: (field: keyof Distribution, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export default function EditDistributionForm({
  distribution,
  saving,
  error,
  onInputChange,
  onSubmit,
  onCancel,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingOffices, setLoadingOffices] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedItems, fetchedOffices] = await Promise.all([
          getItems(),
          getOffices()
        ]);
        setItems(fetchedItems.filter(item => item.isActive));
        setOffices(fetchedOffices.filter(office => office.isActive));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingItems(false);
        setLoadingOffices(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Distribution</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Selection */}
            <div>
              <Label htmlFor="itemId">
                Item <span className="text-red-500">*</span>
              </Label>
              <Select
                value={distribution.itemId.toString()}
                onValueChange={(value) => onInputChange("itemId", parseInt(value))}
                disabled={loadingItems}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingItems ? "Loading items..." : "Select an item"} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} ({item.code}) - Available: {item.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Office Selection */}
            <div>
              <Label htmlFor="officeId">
                Office <span className="text-red-500">*</span>
              </Label>
              <Select
                value={distribution.officeId.toString()}
                onValueChange={(value) => onInputChange("officeId", parseInt(value))}
                disabled={loadingOffices}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingOffices ? "Loading offices..." : "Select an office"} />
                </SelectTrigger>
                <SelectContent>
                  {offices.map((office) => (
                    <SelectItem key={office.id} value={office.id.toString()}>
                      {office.name} ({office.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                value={distribution.quantity || ""}
                onChange={(e) => onInputChange("quantity", parseInt(e.target.value) || 0)}
                placeholder="Enter quantity to distribute"
                required
              />
            </div>

            {/* Distribution Date */}
            <div>
              <Label htmlFor="dateDistributed">
                Distribution Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateDistributed"
                type="date"
                value={distribution.dateDistributed ? new Date(distribution.dateDistributed).toISOString().split('T')[0] : ''}
                onChange={(e) => onInputChange("dateDistributed", e.target.value)}
                required
              />
            </div>

            {/* Status - Read only for now */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={distribution.status}
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">Status is managed automatically</p>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={!!distribution.isActive}
                onCheckedChange={(v) => onInputChange('isActive', v)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
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
            <Can page="/distributions" action="edit">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Can>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}