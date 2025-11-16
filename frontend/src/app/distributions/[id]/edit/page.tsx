"use client";

import React from "react";
import { useItem } from "@/components/table";
import { useParams } from "next/navigation";
import { Distribution } from "@/types/distribution";
import { getDistributionById, updateDistribution, deleteDistribution } from "@/services/distribution_service";
import EditDistributionHeader from "./components/EditDistributionHeader";
import EditDistributionForm from "./components/EditDistributionForm";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function EditDistributionPage() {
  const params = useParams();
  const distributionId = params.id as string;

  const {
    item: distribution,
    loading,
    error,
    saving,
    handleInputChange,
    handleUpdateSubmit,
    handleBack,
    handleCancel,
  } = useItem<Distribution>({
    id: distributionId,
    crud: {
      basePath: '/distributions',
      getById: (id) => getDistributionById(Number(id)),
      update: (id, data) => updateDistribution(Number(id), data),
      delete: (id) => deleteDistribution(Number(id)),
    },
  });

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error || !distribution || !distribution.id) {
    return <ErrorState message={error || undefined} onBack={handleBack} />;
  }

  // Main Component Stack
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <EditDistributionHeader onBack={handleBack} />

      <EditDistributionForm
        distribution={distribution as Distribution}
        saving={saving}
        error={error}
        onInputChange={handleInputChange}
        onSubmit={handleUpdateSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}