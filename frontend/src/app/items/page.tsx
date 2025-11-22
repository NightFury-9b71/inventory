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
import { Item, ItemFormData } from "@/types/item";
import { getItems, createItem, updateItem, deleteItem } from "@/services/item_service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Can from "@/components/auth/Can";

export default function ItemTablePage() {
  const columns = [
    { key: "name" as keyof Item, label: "Name" },
    { key: "nameBn" as keyof Item, label: "Name (Bengali)" },
    { key: "code" as keyof Item, label: "Code" },
    { key: "categoryName" as keyof Item, label: "Category" },
    { key: "unitName" as keyof Item, label: "Unit" },
    { key: "isActive" as keyof Item, label: "Status" },
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
    searchableKeys: ['name', 'nameBn', 'code', 'categoryName', 'unitName'],
    filterableKeys: ['isActive'],
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    crud: {
      basePath: '/items',
      getAll: getItems,
      create: (data) => createItem(data as ItemFormData),
      update: (id, data) => updateItem(Number(id), data as Partial<ItemFormData>),
      delete: (id) => deleteItem(Number(id)),
    },
  });

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
    <div>
      {/* Page Header */}
      <PageHeader>
        <PageTitle title="Item Management" totalCount={totalCount} />
        <PageSubtitle subtitle="Manage all inventory items and their descriptions" />
        <PageToolbar>
          <PageSearch
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            placeholder="Search items..."
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
          <Can page="/items" action="create">
            <Button asChild>
              <Link href="/items/new">Add New Item</Link>
            </Button>
          </Can>
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
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <Table
            data={tableData}
            columns={columns}
            page="/items"
            actions={actions}
            itemName="item"
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
