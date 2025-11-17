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
import { ItemCategory, CategoryFormData } from "@/types/item";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/category_service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Can from "@/components/auth/Can";

export default function CategoryTablePage() {
  const columns = [
    { key: "name" as keyof ItemCategory, label: "Name" },
    { key: "nameBn" as keyof ItemCategory, label: "Name (Bengali)" },
    { key: "code" as keyof ItemCategory, label: "Code" },
    { key: "description" as keyof ItemCategory, label: "Description" },
    { key: "isActive" as keyof ItemCategory, label: "Status" },
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
    searchableKeys: ['name', 'nameBn', 'code', 'description'],
    filterableKeys: ['isActive'],
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    crud: {
      basePath: '/categories',
      getAll: getCategories,
      create: (data) => createCategory(data as CategoryFormData),
      update: (id, data) => updateCategory(Number(id), data as Partial<CategoryFormData>),
      delete: (id) => deleteCategory(Number(id)),
    },
  });

  if (error) {
    return (
      <div>
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
        <PageTitle title="Category Management" totalCount={totalCount} />
        <PageSubtitle subtitle="Manage all inventory categories and their descriptions" />
        <PageToolbar>
          <PageSearch
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            placeholder="Search categories..."
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
          <Can page="/categories" action="create">
            <Button asChild>
              <Link href="/categories/new">Add New Category</Link>
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
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <Table
            data={tableData}
            columns={columns}
            page="/categories"
            actions={actions}
            itemName="category"
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
