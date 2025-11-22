"use client";

import React from "react";
import { Purchase } from "@/types/purchase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Hash, Phone, User, Calendar } from "lucide-react";

type Props = {
  purchase: Purchase;
};

export default function PurchaseDetailsCard({ purchase }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Purchase Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Purchase ID */}
        <div>
          <label className="text-sm font-medium text-gray-500">Purchase ID</label>
          <p className="text-sm">#{purchase.id}</p>
        </div>

        {/* Invoice Number */}
        {purchase.invoiceNumber && (
          <div>
            <label className="text-sm font-medium text-gray-500">Invoice Number</label>
            <p className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="text-sm font-mono">{purchase.invoiceNumber}</span>
            </p>
          </div>
        )}

        {/* Vendor Contact */}
        {purchase.vendorContact && (
          <div>
            <label className="text-sm font-medium text-gray-500">Vendor Contact</label>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{purchase.vendorContact}</span>
            </p>
          </div>
        )}

        {/* Purchased By */}
        <div>
          <label className="text-sm font-medium text-gray-500">Purchased By</label>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{purchase.purchasedByName}</span>
          </p>
        </div>

        {/* Remarks */}
        {purchase.remarks && (
          <div>
            <label className="text-sm font-medium text-gray-500">Remarks</label>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
              {purchase.remarks}
            </p>
          </div>
        )}

        {/* Key Information */}
        <div>
          <label className="text-sm font-medium text-gray-500">Key Information</label>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-sm font-medium font-mono">{purchase.totalPrice?.toFixed(2)} ৳</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${purchase.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {purchase.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="text-sm text-gray-600">Number of Items</span>
              <span className="text-sm font-medium">{purchase.items.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}