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
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import {
  distributeToChildOffice,
  getChildOfficesForDistribution,
  getOfficeInventory,
  type OfficeDistributionRequest,
  type ChildOffice,
  type OfficeInventory,
} from "@/services/office_distribution_service";

export default function DistributeItemsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [childOffices, setChildOffices] = useState<ChildOffice[]>([]);
  const [inventory, setInventory] = useState<OfficeInventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OfficeDistributionRequest>({
    itemId: 0,
    fromOfficeId: user?.officeId ? parseInt(user.officeId) : 0,
    toOfficeId: 0,
    quantity: 1,
    remarks: "",
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
      const [offices, items] = await Promise.all([
        getChildOfficesForDistribution(officeId),
        getOfficeInventory(officeId),
      ]);
      setChildOffices(offices);
      setInventory(items);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
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
    
    if (!formData.itemId || !formData.toOfficeId || !formData.quantity) {
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
      const result = await distributeToChildOffice(formData);
      toast.success(`Distribution successful! Reference: ${result.referenceNumber}`);
      router.push("/office-distributions");
    } catch (error: any) {
      console.error("Error distributing items:", error);
      toast.error(error.response?.data?.error || "Failed to distribute items");
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
        <h1 className="text-3xl font-bold">Distribute Items to Child Office</h1>
        <p className="text-muted-foreground mt-2">
          Transfer item ownership to a child office
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribution Form</CardTitle>
          <CardDescription>
            Select an item and child office to distribute items
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
                  <SelectValue placeholder="Select an item" />
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
                  No items available in your office inventory
                </p>
              )}
            </div>

            {/* Child Office Selection */}
            <div className="space-y-2">
              <Label htmlFor="childOffice">Child Office *</Label>
              <Select
                value={formData.toOfficeId.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, toOfficeId: parseInt(value) })
                }
                disabled={loading || childOffices.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a child office" />
                </SelectTrigger>
                <SelectContent>
                  {childOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id.toString()}>
                      {office.name} ({office.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {childOffices.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">
                  No child offices available for distribution
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

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Enter any additional notes..."
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({ ...formData, remarks: e.target.value })
                }
                rows={4}
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
                disabled={submitting || loading || !selectedItem || !formData.toOfficeId}
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Distributing..." : "Distribute Items"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
