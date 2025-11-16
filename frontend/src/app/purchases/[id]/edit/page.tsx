"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Purchase, PurchaseFormData } from "@/types/purchase";
import { getPurchaseById, updatePurchase } from "@/services/purchase_service";
import { useAuth } from "@/contexts/AuthContext";
import EditPurchaseHeader from "./components/EditPurchaseHeader";
import EditPurchaseForm from "./components/EditPurchaseForm";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { toast } from "sonner";

export default function EditPurchasePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const purchaseId = params.id as string;

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchase = async () => {
      try {
        const fetchedPurchase = await getPurchaseById(Number(purchaseId));
        setPurchase(fetchedPurchase);
      } catch (err: any) {
        const errorMsg = err.message || 'Failed to load purchase';
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchase();
  }, [purchaseId]);

  const handleInputChange = (field: string, value: any) => {
    setPurchase(prev => prev ? { ...prev, [field]: value } : null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!purchase || !user?.id) {
      setError('Purchase data or user not available');
      setSaving(false);
      return;
    }

    try {
      // Prepare the data for update
      const updateData: Partial<PurchaseFormData> = {
        vendorName: purchase.vendorName,
        vendorContact: purchase.vendorContact,
        purchaseDate: purchase.purchaseDate,
        invoiceNumber: purchase.invoiceNumber,
        remarks: purchase.remarks,
        purchasedBy: purchase.purchasedBy,
        purchaseItems: purchase.purchaseItems,
      };

      await updatePurchase(Number(purchaseId), updateData);
      toast.success('Purchase updated successfully');
      router.push(`/purchases/${purchaseId}`);
    } catch (err: any) {
      console.log('Error updating purchase:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data 
        || err.message 
        || 'Failed to update purchase. Please check all required fields.';
      const errorString = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
      setError(errorString);
      toast.error(errorString);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/purchases/${purchaseId}`);
  };

  const handleCancel = () => {
    router.push(`/purchases/${purchaseId}`);
  };

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error && !purchase) {
    return <ErrorState message={error} onBack={handleBack} />;
  }

  if (!purchase) {
    return <ErrorState message="Purchase not found" onBack={handleBack} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <EditPurchaseHeader onBack={handleBack} />

      <EditPurchaseForm
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