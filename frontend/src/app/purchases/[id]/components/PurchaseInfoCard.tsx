"use client";

import React from "react";
import { Purchase } from "@/types/purchase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, User, CheckCircle, XCircle, Calendar } from "lucide-react";

type Props = {
  purchase: Purchase;
};

export default function PurchaseInfoCard({ purchase }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Purchase Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vendor Name */}
        <div>
          <label className="text-sm font-medium text-gray-500">Vendor</label>
          <p className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-lg">{purchase.vendorName}</span>
          </p>
        </div>

        {/* Total Price */}
        <div>
          <label className="text-sm font-medium text-gray-500">Total Price</label>
          <p className="flex items-center gap-2">
            <span className="text-lg">৳</span>
            <span className="font-mono text-lg font-semibold">{purchase.totalPrice?.toFixed(2)}</span>
          </p>
        </div>

        {/* Purchase Date */}
        <div>
          <label className="text-sm font-medium text-gray-500">Purchase Date</label>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-lg">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <p className="flex items-center gap-2">
            {purchase.isActive ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Active</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Inactive</span>
              </>
            )}
          </p>
        </div>

        {/* Items */}
        <div>
          <label className="text-sm font-medium text-gray-500">Items Purchased</label>
          <div className="mt-2 space-y-2">
            {purchase.purchaseItems && purchase.purchaseItems.length > 0 ? (
              purchase.purchaseItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm font-medium">{item.itemName}</span>
                    <span className="text-xs text-gray-500 ml-2">({item.itemCode})</span>
                  </div>
                  <div className="text-sm">
                    Qty: {item.quantity} × {item.unitPrice.toFixed(2)} = {item.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No items found for this purchase.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}