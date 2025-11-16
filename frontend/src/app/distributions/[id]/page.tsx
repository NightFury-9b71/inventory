"use client";

import React from "react";
import { useItem } from "@/components/table";
import { useParams } from "next/navigation";
import { Distribution } from "@/types/distribution";
import { getDistributionById, deleteDistribution } from "@/services/distribution_service";
import HeaderActions from "./components/HeaderActions";
import DistributionInfoCard from "./components/DistributionInfoCard";
import DistributionDetailsCard from "./components/DistributionDetailsCard";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

export default function DistributionDetailPage() {
  const params = useParams();
  const distributionId = params.id as string;

  const {
    item,
    loading,
    error,
    deleting,
    handleBack,
    handleEdit,
    deleteItem: handleDelete,
  } = useItem<Distribution>({
    id: distributionId,
    crud: {
      basePath: '/distributions',
      getById: (id) => getDistributionById(Number(id)),
      delete: (id) => deleteDistribution(Number(id)),
    },
  });

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error State
  if (error || !item || !item.id) {
    return <ErrorState message={error || undefined} onBack={handleBack} />;
  }

  const fullDistribution = item as Distribution;

  // Main Component Stack
  return (
    <div>
      <HeaderActions
        distributionId={fullDistribution.id}
        itemName={fullDistribution.itemName}
        handleBack={handleBack}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        deleting={deleting}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <DistributionInfoCard distribution={fullDistribution} />
        <DistributionDetailsCard distribution={fullDistribution} />
      </div>
    </div>
  );
}