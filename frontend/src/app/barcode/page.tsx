'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  QrCode, Camera, Search, Package, MapPin, Calendar, Clock, AlertCircle,
  DollarSign, FileText, User, Building2, Truck, Tag, FolderOpen, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getItemInstanceByBarcode } from '@/services/purchase_service';
import { ItemInstance } from '@/types/purchase';

export default function BarcodePage() {
  const [barcode, setBarcode] = useState('');
  const [itemInstance, setItemInstance] = useState<ItemInstance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!barcode.trim()) return;

    setLoading(true);
    setError('');
    setItemInstance(null);

    try {
      const result = await getItemInstanceByBarcode(barcode.trim());
      setItemInstance(result);
    } catch (_err) {
      setError('Item not found. Please check the barcode and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-green-100 text-green-800';
      case 'DISTRIBUTED': return 'bg-blue-100 text-blue-800';
      case 'DAMAGED': return 'bg-red-100 text-red-800';
      case 'LOST': return 'bg-gray-100 text-gray-800';
      case 'RETIRED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Barcode Scanner</h1>
        <p className="text-slate-600 mt-1">Scan or search items by barcode to track their current location and status</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-8 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Scan Barcode
          </h2>
          <p className="text-slate-600 mb-6">
            Use your device camera to scan item barcodes
          </p>
          <Button className="w-full" disabled>
            <Camera className="h-4 w-4 mr-2" />
            Coming Soon
          </Button>
        </Card>

        <Card className="p-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">
            Search by Code
          </h2>
          <p className="text-slate-600 mb-6 text-center">
            Enter barcode manually to search for items
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Search Results */}
      {loading && (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Searching for item...</p>
        </Card>
      )}

      {error && (
        <Card className="p-8 text-center border-red-200">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Item Not Found</p>
          <p className="text-slate-600 mt-2">{error}</p>
        </Card>
      )}

      {itemInstance && (
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{itemInstance.itemName}</h3>
                <p className="text-slate-600">Barcode: {itemInstance.barcode}</p>
              </div>
              <Badge className={getStatusColor(itemInstance.status)}>
                {itemInstance.status.replace('_', ' ')}
              </Badge>
            </div>
          </Card>

          {/* Item Information */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Item Information
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Item Code</label>
                <p className="text-base font-mono">{itemInstance.itemCode || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p className="text-base">{itemInstance.categoryName || 'N/A'}</p>
              </div>
              {itemInstance.itemDescription && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="text-base text-slate-700">{itemInstance.itemDescription}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Purchase Information */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase Information
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  Unit Price
                </label>
                <p className="text-lg font-semibold text-green-600">
                  ৳{itemInstance.unitPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Purchase Date
                </label>
                <p className="text-base">
                  {itemInstance.purchaseDate 
                    ? new Date(itemInstance.purchaseDate).toLocaleDateString()
                    : itemInstance.createdAt 
                    ? new Date(itemInstance.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Vendor
                </label>
                <p className="text-base">{itemInstance.vendorName || 'N/A'}</p>
                {itemInstance.vendorContact && (
                  <p className="text-sm text-slate-600">{itemInstance.vendorContact}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Invoice Number
                </label>
                <p className="text-base font-mono">{itemInstance.invoiceNumber || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Purchased By
                </label>
                <p className="text-base">{itemInstance.purchasedByName || 'N/A'}</p>
              </div>
            </div>
          </Card>

          {/* Current Status & Location */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Status & Location
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Owner</label>
                <p className="text-base font-semibold">
                  {itemInstance.ownerName || 'Unassigned'}
                </p>
              </div>
              {itemInstance.distributedToOfficeName && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Current Location
                  </label>
                  <p className="text-base font-semibold">
                    {itemInstance.distributedToOfficeName}
                  </p>
                </div>
              )}
              {itemInstance.distributedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Distributed Date
                  </label>
                  <p className="text-base">
                    {new Date(itemInstance.distributedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Additional Details */}
          {itemInstance.remarks && (
            <Card className="p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Remarks
              </h4>
              <p className="text-slate-700 whitespace-pre-line">{itemInstance.remarks}</p>
            </Card>
          )}

          {/* Timeline */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </h4>
            <div className="space-y-3">
              {itemInstance.createdAt && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Item Registered</p>
                    <p className="text-xs text-slate-600">
                      {new Date(itemInstance.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {itemInstance.distributedAt && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Distributed to {itemInstance.distributedToOfficeName}</p>
                    <p className="text-xs text-slate-600">
                      {new Date(itemInstance.distributedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {itemInstance.updatedAt && itemInstance.updatedAt !== itemInstance.createdAt && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-xs text-slate-600">
                      {new Date(itemInstance.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline"
                onClick={() => window.open(`/purchases/${itemInstance.purchaseId}`, '_blank')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                View Purchase Details
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(`/items/${itemInstance.itemId}`, '_blank')}
              >
                <Package className="h-4 w-4 mr-2" />
                View Item Details
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-12 text-center">
        <QrCode className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          How Barcode Tracking Works
        </h3>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Each item in the inventory has a unique barcode. Scan the barcode to instantly view item details,
          current location, stock levels, purchase history, and distribution records. Track items from
          purchase to distribution and beyond.
        </p>
      </Card>
    </div>
  );
}
