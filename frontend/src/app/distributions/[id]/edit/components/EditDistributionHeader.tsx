"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
};

export default function EditDistributionHeader({ onBack }: Props) {
  return (
    <div className="mb-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Distribution Details
      </Button>
    </div>
  );
}