"use client";

import React, { useState, useEffect } from "react";
import { ItemInstance } from "@/types/purchase";
import { getMyOfficeItemInstances } from "@/services/office_inventory_service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Printer, Package } from "lucide-react";

export default function BarcodeDisplay() {
  const [barcodes, setBarcodes] = useState<ItemInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarcodes = async () => {
      try {
        const data = await getMyOfficeItemInstances();
        setBarcodes(data);
      } catch (error) {
        console.error("Failed to fetch barcodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBarcodes();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ["Barcode", "Item Name", "Item Code", "Unit Price", "Status", "Office"],
      ...barcodes.map(b => [
        b.barcode, 
        b.itemName,
        b.itemCode, 
        b.unitPrice, 
        b.status,
        b.distributedToOfficeName || ''
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory_barcodes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 animate-pulse text-blue-600" />
            Loading item barcodes...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group barcodes by item
  const groupedBarcodes = barcodes.reduce((acc, barcode) => {
    const key = barcode.itemName || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(barcode);
    return acc;
  }, {} as Record<string, ItemInstance[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Item Barcodes & Prices</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {barcodes.length} items with individual tracking
            </p>
          </div>
          {barcodes.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedBarcodes).map(([itemName, itemBarcodes]) => (
            <div key={itemName} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">
                {itemName} ({itemBarcodes.length} items)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {itemBarcodes.map((barcode) => (
                  <div
                    key={barcode.id}
                    className="border p-3 rounded bg-white flex flex-col items-center"
                  >
                    <div className="font-mono text-sm font-bold mb-1">
                      {barcode.barcode}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {barcode.itemCode}
                    </div>
                    <div className="text-sm font-semibold text-green-600 mb-1">
                      ${barcode.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status: <span className={`font-medium ${
                        barcode.status === 'IN_STOCK' ? 'text-green-600' :
                        barcode.status === 'DISTRIBUTED' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {barcode.status.replace('_', ' ')}
                      </span>
                    </div>
                    {barcode.distributedToOfficeName && (
                      <div className="text-xs text-blue-600 mt-1">
                        📍 {barcode.distributedToOfficeName}
                      </div>
                    )}
                    <div className="mt-2 w-full h-12 bg-gray-100 flex items-center justify-center">
                      {/* Placeholder for actual barcode image */}
                      <svg className="w-full h-full" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                        {/* Simple barcode representation */}
                        <g>
                          {Array.from({ length: 40 }, (_, i) => (
                            <rect
                              key={i}
                              x={i * 5}
                              y="5"
                              width={Math.random() > 0.5 ? 2 : 3}
                              height="40"
                              fill="black"
                            />
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {barcodes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="font-semibold mb-2">No item barcodes found</p>
            <p className="text-sm">
              Barcodes are generated when items are purchased with individual tracking enabled.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
