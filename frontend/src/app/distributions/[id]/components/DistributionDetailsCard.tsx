"use client";

import React from "react";
import { Distribution } from "@/types/distribution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Info, Calendar, Clock } from "lucide-react";

type Props = {
  distribution: Distribution;
};

export default function DistributionDetailsCard({ distribution }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Distribution Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Distribution ID */}
        <div>
          <label className="text-sm font-medium text-gray-500">Distribution ID</label>
          <p className="text-sm">{distribution.id}</p>
        </div>

        {/* Status and Active Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <p className={`text-sm font-medium ${distribution.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {distribution.status}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Active</label>
            <p className={`text-sm font-medium ${distribution.isActive ? 'text-green-600' : 'text-red-600'}`}>
              {distribution.isActive ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div>
          <label className="text-sm font-medium text-gray-500">Distribution Summary</label>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Item ID</span>
              <span className="text-sm font-medium">{distribution.itemId}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Office ID</span>
              <span className="text-sm font-medium">{distribution.officeId}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Distributed By (ID)</span>
              <span className="text-sm font-medium">{distribution.userId}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Quantity Distributed</span>
              <span className="text-sm font-medium">{distribution.quantity} units</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Distribution Date</span>
              <span className="text-sm font-medium">
                {new Date(distribution.dateDistributed).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Remarks
          </label>
          {distribution.remarks ? (
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
              {distribution.remarks}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic mt-2">No remarks provided</p>
          )}
        </div>

        {/* Timestamps */}
        {(distribution.createdAt || distribution.updatedAt) && (
          <div className="border-t pt-4 mt-4">
            {distribution.createdAt && (
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created: {new Date(distribution.createdAt).toLocaleString()}
              </div>
            )}
            {distribution.updatedAt && (
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last Updated: {new Date(distribution.updatedAt).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}