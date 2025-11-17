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
import { Unit } from "@/types/unit";
import { getUnits, createUnit, updateUnit, deleteUnit } from "@/services/unit_service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Can from "@/components/auth/Can";

export default function UnitTablePage() {
  const columns = [
    { key: "name" as keyof Unit, label: "Name" },
    { key: "nameBn" as keyof Unit, label: "Name (Bengali)" },
    { key: "symbol" as keyof Unit, label: "Symbol" },
    { key: "description" as keyof Unit, label: "Description" },
    { key: "isActive" as keyof Unit, label: "Status" },
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
    searchableKeys: ['name', 'nameBn', 'symbol'],
    filterableKeys: ['isActive'],
    pagination: {
      enabled: true,
      pageSize: 10,
    },
    crud: {
      basePath: '/units',
      getAll: getUnits,
      create: (data) => createUnit(data as any),
      update: (id, data) => updateUnit(Number(id), data as any),
      delete: (id) => deleteUnit(Number(id)),
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
    <div className="p-6">
      {/* Page Header */}
      <PageHeader>
        <PageTitle title="Unit Management" totalCount={totalCount} />
        <PageSubtitle subtitle="Manage measurement units for inventory items" />
        <PageToolbar>
          <PageSearch
            searchTerm={searchTerm}
            setSearchTerm={handleSearch}
            placeholder="Search units..."
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
          <Can page="/units" action="create">
            <Button asChild>
              <Link href="/units/new">Add New Unit</Link>
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
            <p className="text-gray-500">No units found</p>
          </div>
        ) : (
          <Table
            data={tableData}
            columns={columns}
            page="/units"
            actions={actions}
            itemName="unit"
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
