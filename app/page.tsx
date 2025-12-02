'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, getSalesData } from '@/lib/api';
import { SalesFilters, SalesResponse } from '@/lib/types';
import FilterPanel from '@/components/FilterPanel';
import SalesChart from '@/components/SalesChart';
import SalesTable from '@/components/SalesTable';

export default function Home() {
  const [token, setToken] = useState<string>('');
  const [salesData, setSalesData] = useState<SalesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  };

  const [filters, setFilters] = useState<SalesFilters>({
    ...getDefaultDateRange(),
    sortBy: 'date',
    sortOrder: 'asc',
  });

  useEffect(() => {
    async function initAuth() {
      try {
        const authToken = await getAuthToken();
        setToken(authToken);
      } catch (err) {
        setError('Failed to authenticate');
      }
    }
    initAuth();
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const data = await getSalesData(token, filters);
        setSalesData(data);
      } catch (err) {
        setError('Failed to load sales data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, filters]);

  const handleFilterChange = (newFilters: SalesFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (column: 'date' | 'price') => {
    setFilters({
      ...filters,
      sortBy: column,
      sortOrder: filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc',
      after: '',
      before: '',
    });
  };

  const handleNext = () => {
    if (salesData?.pagination.after) {
      setFilters({
        ...filters,
        after: salesData.pagination.after,
        before: '',
      });
    }
  };

  const handlePrevious = () => {
    if (salesData?.pagination.before) {
      setFilters({
        ...filters,
        before: salesData.pagination.before,
        after: '',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Track and analyze your sales performance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && salesData && (
            <>
              <SalesChart data={salesData.results.TotalSales} />
              <SalesTable
                sales={salesData.results.Sales}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={handleSort}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={!!salesData.pagination.before}
                hasNext={!!salesData.pagination.after}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
