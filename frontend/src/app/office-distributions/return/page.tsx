'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Undo2 } from "lucide-react";
import { toast } from "sonner";
import {
  returnToParentOffice,
  getParentOfficeForReturn,
  getOfficeInventory,
  type ReturnItemRequest,
  type ChildOffice,
  type OfficeInventory,
} from "@/services/office_distribution_service";

export default function ReturnItemsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [parentOffice, setParentOffice] = useState<ChildOffice | null>(null);
  const [inventory, setInventory] = useState<OfficeInventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ReturnItemRequest>({
    itemId: 0,
    fromOfficeId: user?.officeId ? parseInt(user.officeId) : 0,
    toOfficeId: 0,
    quantity: 1,
    remarks: "",
    returnReason: "",
    initiatedByUserId: user?.id ? (typeof user.id === 'string' ? parseInt(user.id) : user.id) : 0,
  });

  const [selectedItem, setSelectedItem] = useState<OfficeInventory | null>(null);

  useEffect(() => {
    if (user?.officeId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.officeId) return;
    
    setLoading(true);
    try {
      const officeId = parseInt(user.officeId);
      const [parent, items] = await Promise.all([
        getParentOfficeForReturn(officeId),
        getOfficeInventory(officeId),
      ]);
      setParentOffice(parent);
      setInventory(items);
      setFormData(prev => ({ ...prev, toOfficeId: parent.id }));
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast.error(error.response?.data?.error || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (itemId: string) => {
    const item = inventory.find(i => i.itemId === parseInt(itemId));
    setSelectedItem(item || null);
    setFormData({ ...formData, itemId: parseInt(itemId) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemId || !formData.toOfficeId || !formData.quantity || !formData.returnReason) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedItem) {
      toast.error("Please select an item");
      return;
    }

    if (formData.quantity > selectedItem.quantity) {
      toast.error(`Insufficient quantity. Available: ${selectedItem.quantity}`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await returnToParentOffice(formData);
      toast.success(`Return successful! Reference: ${result.referenceNumber}`);
      router.push("/office-distributions");
    } catch (error: any) {
      console.error("Error returning items:", error);
      toast.error(error.response?.data?.error || "Failed to return items");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Return Items to Parent Office</h1>
        <p className="text-muted-foreground mt-2">
          Return items that are no longer needed to the parent office
        </p>
      </div>

      {!parentOffice && !loading && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">
              This office has no parent office. Items cannot be returned.
            </p>
          </CardContent>
        </Card>
      )}

      {parentOffice && (
        <Card>
          <CardHeader>
            <CardTitle>Return Form</CardTitle>
            <CardDescription>
              Returning items to: <strong>{parentOffice.name}</strong> ({parentOffice.code})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div className="space-y-2">
                <Label htmlFor="item">Item *</Label>
                <Select
                  value={formData.itemId.toString()}
                  onValueChange={handleItemChange}
                  disabled={loading || inventory.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item to return" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventory.map((item) => (
                      <SelectItem key={item.itemId} value={item.itemId.toString()}>
                        {item.itemName} ({item.itemCode}) - Available: {item.quantity} {item.unitName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {inventory.length === 0 && !loading && (
                  <p className="text-sm text-muted-foreground">
                    No items available in your office to return
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedItem?.quantity || 999999}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                  }
                  required
                />
                {selectedItem && (
                  <p className="text-sm text-muted-foreground">
                    Available: {selectedItem.quantity} {selectedItem.unitName}
                  </p>
                )}
              </div>

              {/* Return Reason */}
              <div className="space-y-2">
                <Label htmlFor="returnReason">Return Reason *</Label>
                <Textarea
                  id="returnReason"
                  placeholder="Enter reason for returning these items..."
                  value={formData.returnReason}
                  onChange={(e) =>
                    setFormData({ ...formData, returnReason: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter any additional notes..."
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || loading || !selectedItem || !formData.returnReason}
                >
                  <Undo2 className="mr-2 h-4 w-4" />
                  {submitting ? "Processing..." : "Return Items"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
