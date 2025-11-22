'use client';

import {
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageToolbar,
  PageBody,
  PageFooter,
  PageSearch,
  PageFilter,
  Table,
  useTable
} from "@/components/table";
import { Distribution } from "@/types/distribution";
import { getDistributions } from "@/services/distribution_service";
import { Button } from "@/components/ui/button";
import { Plus, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Can from "@/components/auth/Can";
import { Badge } from "@/components/ui/badge";

export default function DistributionsPage() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const columns = [
    { key: "itemName" as keyof Distribution, label: "Item" },
    { key: "quantity" as keyof Distribution, label: "Quantity" },
    { key: "fromOfficeCode" as keyof Distribution, label: "From Office" },
    { key: "toOfficeCode" as keyof Distribution, label: "To Office" },
    { key: "transferType" as keyof Distribution, label: "Type" },
    { key: "userName" as keyof Distribution, label: "Initiated By" },
    { key: "employeeName" as keyof Distribution, label: "Employee" },
    { key: "dateDistributed" as keyof Distribution, label: "Date" },
    { 
      key: "status" as keyof Distribution, 
      label: "Status",
      render: (value: any) => (
        <Badge className={getStatusColor(value as string)}>
          {value}
        </Badge>
      )
    },
  ];

  const filters = [
    {
      key: 'transferType',
      label: 'Transfer Type',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'ALLOCATION', label: 'Allocation' },
        { value: 'TRANSFER', label: 'Transfer' },
        { value: 'MOVEMENT', label: 'Movement' },
        { value: 'RETURN', label: 'Return' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
      ],
    },
    {
      key: 'isActive',
      label: 'Active',
      options: [
        { value: 'all', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const {
    data: tableData,
    totalCount,
    isLoading,
    error,
    searchTerm,
    filters: tableFilters,
    handleSearch,
    handleFilter,
    clearFilters,
    currentPage,
    totalPages,
    handlePageChange,
    hasPagination,
    actions,
  } = useTable({
    data: [],
    columns,
    searchableKeys: ['itemName', 'fromOfficeCode', 'toOfficeCode', 'userName', 'employeeName'],
    filterableKeys: ['transferType', 'status', 'isActive'],
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    crud: {
      basePath: '/distributions',
      getAll: getDistributions,
    },
  });

  // Handle authentication error
  if (error && error.includes('Authentication required')) {
    return (
      <div>
        <div className="text-center py-8">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access distribution management.</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-red-600 font-semibold">An error occurred while fetching data.</div>
        <div className="text-gray-600 mt-2">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <PageHeader>
        <PageTitle title="Item Transfers" totalCount={totalCount} />
        <PageSubtitle subtitle="Track and manage all item transfers, allocations, and movements between offices" />
        <PageToolbar>
          <Can page="/distributions" action="create">
            <Button onClick={() => router.push('/distributions/new')} className="mr-4">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </Can>
          <PageSearch
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            placeholder="Search transfers..."
          />
          {filters.map((filter) => (
            <PageFilter
              key={filter.key}
              label={filter.label}
              value={tableFilters[filter.key] || ""}
              options={filter.options}
              onChange={(value) => handleFilter(filter.key, value)}
            />
          ))}
          {(searchTerm || Object.values(tableFilters).some(v => v)) && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </PageToolbar>
      </PageHeader>

      {/* Page Body */}
      <PageBody>
        {isLoading ? (
          <div className="text-center py-8">
            <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Loading transfers...</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="text-center py-8">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transfers found</h3>
            <p className="text-gray-600 mb-4">Start by creating your first item transfer.</p>
            <Can page="/distributions" action="create">
              <Button onClick={() => router.push('/distributions/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Transfer
              </Button>
            </Can>
          </div>
        ) : (
          <Table
            data={tableData}
            columns={columns}
            page="/distributions"
            actions={actions}
            itemName="distribution"
            confirmationText="delete"
          />
        )}
      </PageBody>

      {/* Page Footer */}
      <PageFooter
        hasPagination={hasPagination}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalCount={totalCount}
      />
    </div>
  );
}
