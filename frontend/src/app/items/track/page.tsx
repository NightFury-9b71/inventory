'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getItemByCode, getItemInstanceByBarcode } from '@/services/item_service';
import { getMovements } from '@/services/movement_service';
import { getDistributions } from '@/services/distribution_service';
import { Item } from '@/types/item';
import { Movement } from '@/types/movement';
import { Distribution } from '@/types/distribution';

export default function TrackItemPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const barcode = searchParams.get('barcode');

  const [item, setItem] = useState<Item | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movementsFetched, setMovementsFetched] = useState(false);
  const [distributionsFetched, setDistributionsFetched] = useState(false);

  useEffect(() => {
    if (barcode) {
      fetchItemData(barcode);
    }
  }, [barcode]);

  const fetchItemData = async (barcodeValue: string) => {
    try {
      setLoading(true);
      setError(null);

      let itemData: Item;
      let itemId: number;

      // First try to get item instance by barcode
      try {
        const itemInstance = await getItemInstanceByBarcode(barcodeValue);
        // Create an item-like object from the item instance data
        itemData = {
          id: itemInstance.itemId,
          name: itemInstance.itemName,
          code: itemInstance.itemCode,
          description: itemInstance.itemDescription,
          categoryId: 0, // Not available in item instance
          categoryName: itemInstance.categoryName,
          unitId: undefined,
          unitName: '', // Not available in item instance
          quantity: 0, // Will be calculated from inventory
          isActive: true,
          createdAt: itemInstance.createdAt,
          updatedAt: itemInstance.updatedAt
        };
        itemId = itemInstance.itemId;
      } catch (barcodeError) {
        // If barcode lookup fails, try treating it as an item code
        console.log('Barcode lookup failed, trying as item code:', barcodeError);
        itemData = await getItemByCode(barcodeValue);
        itemId = itemData.id;
      }

      setItem(itemData);

      // Get all movements and filter by itemId (only if user is authenticated)
      try {
        const allMovements = await getMovements();
        const itemMovements = allMovements.filter(m => m.itemId === itemId);
        setMovements(itemMovements);
        setMovementsFetched(true);
      } catch (movementError) {
        console.log('Could not fetch movements (may require authentication):', movementError);
        setMovements([]);
        setMovementsFetched(true);
      }

      // Get all distributions and filter by itemId (only if user is authenticated)
      try {
        const allDistributions = await getDistributions();
        const itemDistributions = allDistributions.filter(d => d.itemId === itemId);
        setDistributions(itemDistributions);
        setDistributionsFetched(true);
      } catch (distributionError) {
        console.log('Could not fetch distributions (may require authentication):', distributionError);
        setDistributions([]);
        setDistributionsFetched(true);
      }

    } catch (err) {
      setError('Item not found or barcode/code is invalid');
      console.error('Error fetching item data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Tracking item...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Item Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'No item found with this barcode.'}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Item Tracking</h1>
          <p className="text-gray-600 mt-2">Scanned: {barcode}</p>
        </div>

        {/* Item Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Item Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Item Name</label>
                <p className="text-lg font-semibold">{item.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Item Code</label>
                <p className="text-lg">{item.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <p>{item.categoryName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Unit</label>
                <p>{item.unitName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Current Quantity</label>
                <p className="text-lg font-semibold">{item.quantity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge className={getStatusColor(item.isActive ? 'Active' : 'Inactive')}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Recent Movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movements.length === 0 && movementsFetched ? (
              <p className="text-gray-500 text-center py-4">
                {movements.length === 0 ? "No movements recorded for this item." : "Login required to view movement history"}
              </p>
            ) : !movementsFetched ? (
              <p className="text-gray-500 text-center py-4">Loading movements...</p>
            ) : (
              <div className="space-y-4">
                {movements.slice(0, 10).map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Movement</p>
                        <p className="text-sm text-gray-600">
                          From: {movement.fromOfficeName} → To: {movement.toOfficeName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Qty: {movement.quantity}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(movement.dateMoved).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Distributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Recent Distributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {distributions.length === 0 && distributionsFetched ? (
              <p className="text-gray-500 text-center py-4">
                {distributions.length === 0 ? "No distributions recorded for this item." : "Login required to view distribution history"}
              </p>
            ) : !distributionsFetched ? (
              <p className="text-gray-500 text-center py-4">Loading distributions...</p>
            ) : (
              <div className="space-y-4">
                {distributions.slice(0, 10).map((distribution) => (
                  <div key={distribution.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(distribution.status)}>
                        {distribution.status}
                      </Badge>
                      <div>
                        <p className="font-medium">To: {distribution.officeName}</p>
                        <p className="text-sm text-gray-600">
                          Distributed by: {distribution.userName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Qty: {distribution.quantity}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(distribution.dateDistributed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}