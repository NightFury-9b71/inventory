"use client";

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
import { Purchase } from "@/types/purchase";
import { getPurchases, deletePurchase } from "@/services/purchase_service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Can from "@/components/auth/Can";

export default function PurchaseTablePage() {
  const router = useRouter();
  const columns = [
    { key: "vendorName" as keyof Purchase, label: "Vendor" },
    { key: "totalPrice" as keyof Purchase, label: "Total Price" },
    { key: "purchaseDate" as keyof Purchase, label: "Purchase Date" },
    { key: "invoiceNumber" as keyof Purchase, label: "Invoice Number" },
    { key: "purchasedByName" as keyof Purchase, label: "Purchased By" },
    { key: "isActive" as keyof Purchase, label: "Status" },
  ];

  const filters = [
    {
      key: 'isActive',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
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
    searchableKeys: ['vendorName', 'invoiceNumber', 'purchasedByName'],
    filterableKeys: ['isActive'],
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    crud: {
      basePath: '/purchases',
      getAll: getPurchases,
      delete: async (id: string | number) => {
        try {
          await deletePurchase(Number(id));
          toast.success('Purchase deleted successfully');
        } catch (error) {
          console.error('Error deleting purchase:', error);
          toast.error('Failed to delete purchase');
          throw error;
        }
      },
    },
  });

  // Handle authentication error
  if (error && error.includes('Authentication required')) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access purchase management.</p>
          <Button onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 font-semibold">An error occurred while fetching data.</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader>
        <PageTitle title="Purchase Management" totalCount={totalCount} />
        <PageSubtitle subtitle="Manage all item purchases and their records" />
        <PageToolbar>
          <Can page="/purchases" action="create">
            <Button onClick={() => router.push('/purchases/new')} className="mr-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Purchase
            </Button>
          </Can>
          <PageSearch
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            placeholder="Search purchases..."
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
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No purchases found</p>
          </div>
        ) : (
          <Table
            data={tableData}
            columns={columns}
            page="/purchases"
            actions={actions}
            itemName="purchase"
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