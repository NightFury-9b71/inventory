'use client';

import { Card } from '@/components/ui/card';
import { BarChart3, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // Mock stats data
  const stats = {
    totalItems: 150,
    totalStock: 2500,
    lowStockItems: 5,
    totalPurchaseValue: 50000,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to JUST Inventory Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Items */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Total Items</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalItems || 0}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Stock */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Total Stock</p>
              <p className="text-3xl font-bold text-slate-900">{stats?.totalStock || 0}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Low Stock Items</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.lowStockItems || 0}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </Card>

        {/* Total Purchase Value */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Purchase Value (৳)</p>
              <p className="text-3xl font-bold text-slate-900">
                ৳{(stats?.totalPurchaseValue/1000 || 0).toFixed(2)}K
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <Link href="/items">
              <Button variant="outline" className="w-full justify-center h-auto py-4">
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Items</p>
                </div>
              </Button>
            </Link>

            <Link href="/purchases">
              <Button variant="outline" className="w-full justify-center h-auto py-4">
                <div className="text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Purchases</p>
                </div>
              </Button>
            </Link>

            <Link href="/distributions">
              <Button variant="outline" className="w-full justify-center h-auto py-4">
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Distributions</p>
                </div>
              </Button>
            </Link>

            <Link href="/analytics">
              <Button variant="outline" className="w-full justify-center h-auto py-4">
                <div className="text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Analytics</p>
                </div>
              </Button>
            </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Inventory Status</p>
              <p className="text-sm text-slate-600">All inventory items are accounted for</p>
            </div>
            <div className="text-2xl font-bold text-blue-600">✓</div>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div>
              <p className="font-medium text-slate-900">Stock Alerts</p>
              <p className="text-sm text-slate-600">
                {stats?.lowStockItems || 0} items below minimum threshold
              </p>
            </div>
            <div className="text-2xl font-bold text-orange-600">!</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
