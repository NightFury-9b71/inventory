"use client";

import React from "react";
import { Distribution } from "@/types/distribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Building, User, Hash, CheckCircle, XCircle } from "lucide-react";

type Props = {
  distribution: Distribution;
};

export default function DistributionInfoCard({ distribution }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Distribution Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Item and Quantity side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Item</label>
            <p className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {distribution.itemName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Quantity</label>
            <p className="text-lg font-semibold">
              {distribution.quantity}
            </p>
          </div>
        </div>

        {/* Office and Distributed By side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Office</label>
            <p className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              {distribution.officeName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Distributed By</label>
            <p className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {distribution.userName}
            </p>
          </div>
        </div>

        {/* Date Distributed and Status side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Date Distributed</label>
            <p className="text-lg">
              {new Date(distribution.dateDistributed).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className="flex items-center gap-2">
              {distribution.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">{distribution.status}</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">{distribution.status}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Remarks if available */}
        {distribution.remarks && (
          <div>
            <label className="text-sm font-medium text-gray-500">Remarks</label>
            <p className="text-sm text-gray-700 mt-1">{distribution.remarks}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}