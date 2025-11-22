"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DistributionFormData } from "@/types/distribution";
import { createDistribution } from "@/services/distribution_service";
import { useAuth } from "@/contexts/AuthContext";
import NewDistributionForm from "./components/NewDistributionForm";
import NewDistributionHeader from "./components/NewDistributionHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function NewDistributionPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [distribution, setDistribution] = useState<DistributionFormData>({
    itemId: undefined,
    fromOfficeId: undefined, // Will be set when user loads
    toOfficeId: undefined,
    userId: user?.id ? parseInt(user.id) : 0,
    employeeId: undefined,
    quantity: 1,
    dateDistributed: new Date().toISOString().split('T')[0],
    remarks: "",
    transferType: 'TRANSFER', // Always TRANSFER for office-to-office ownership change
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update fromOfficeId when user loads
  useEffect(() => {
    if (user?.officeId) {
      const userOfficeId = parseInt(user.officeId);
      setDistribution(prev => ({
        ...prev,
        fromOfficeId: userOfficeId,
        userId: user?.id ? parseInt(user.id) : prev.userId,
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: unknown) => {
    setDistribution(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await createDistribution(distribution);
      setSuccess(true);
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/distributions');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create distribution');
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/distributions');
  };

  const handleCancel = () => {
    router.push('/distributions');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <NewDistributionHeader onBack={handleBack} />

      {!user?.officeId && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-red-800">No Office Assigned</AlertTitle>
          <AlertDescription className="text-red-700">
            You need to have an office assigned to your account to transfer items. Please contact your administrator.
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Transfer created successfully. Redirecting to transfers list...
          </AlertDescription>
        </Alert>
      )}

      <NewDistributionForm
        distribution={distribution}
        saving={saving}
        error={error}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}