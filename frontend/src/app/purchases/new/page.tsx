"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PurchaseFormData } from "@/types/purchase";
import { createPurchase } from "@/services/purchase_service";
import { useAuth } from "@/contexts/AuthContext";
import NewPurchaseHeader from "./components/NewPurchaseHeader";
import NewPurchaseForm from "./components/NewPurchaseForm";
import { toast } from "sonner";

export default function NewPurchasePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [purchase, setPurchase] = useState<PurchaseFormData>({
    purchaseItems: [{
      itemId: 0,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    }],
    vendorName: "",
    vendorContact: "",
    purchaseDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    invoiceNumber: "",
    remarks: "",
    purchasedBy: user?.id ? parseInt(user.id) : 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: unknown) => {
    setPurchase(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate user authentication
      if (!user?.id) {
        throw new Error('User not authenticated. Please log in again.');
      }

      // Ensure purchasedBy is set to current user
      const purchaseData = {
        ...purchase,
        purchasedBy: parseInt(user.id),
      };

      // Additional validation
      if (purchaseData.purchaseItems.length === 0) {
        throw new Error('Please add at least one item to the purchase.');
      }

      const invalidItems = purchaseData.purchaseItems.filter(
        item => !item.itemId || item.quantity <= 0 || item.unitPrice <= 0
      );
      
      if (invalidItems.length > 0) {
        throw new Error('All items must have a valid item selected, quantity greater than 0, and unit price greater than 0.');
      }

      if (!purchaseData.vendorName || purchaseData.vendorName.trim() === '') {
        throw new Error('Vendor name is required.');
      }

      if (!purchaseData.purchaseDate) {
        throw new Error('Purchase date is required.');
      }

      console.error('Sending purchase data:', purchaseData);
      await createPurchase(purchaseData);
      toast.success('Purchase created successfully');
      router.push('/purchases');
    } catch (err: unknown) {
      console.error('Error creating purchase:', err);
      let errorMessage = 'Failed to create purchase. Please check all required fields.';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || 'Failed to create purchase';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/purchases');
  };

  const handleCancel = () => {
    router.push('/purchases');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <NewPurchaseHeader onBack={handleBack} />

      <NewPurchaseForm
        purchase={purchase}
        saving={saving}
        error={error}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}