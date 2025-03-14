'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Plus } from 'lucide-react'; // Lucide icons
import Loader from '@/components/ui/loader';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AdminCowList() {
  const params = useParams();
  const locale = params.locale || 'en';
  const fetchCows = useAuthStore((state) => state.fetchCows);

  const {
    data: cows,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminCows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = useMemo(
    () => (cows ? Math.ceil(cows.length / pageSize) : 0),
    [cows],
  );

  const paginatedCows = useMemo(() => {
    if (!cows) return [];
    const start = (currentPage - 1) * pageSize;
    return cows.slice(start, start + pageSize);
  }, [cows, currentPage]);

  // Handle page change
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-background text-foreground mx-auto max-w-7xl px-4 md:mt-14">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/admin`}>Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/admin/dashboard`}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manage Cows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Manage Cows Heading */}
      <h1 className="text-primary mb-6 text-3xl font-bold">Manage Cows</h1>

      {/* Quick Action Cards */}
      <div className="mb-10 grid grid-cols-1">
        {/* Create Cows Card */}
        <Link href={`/admin/dashboard/cows/create`}>
          <div className="bg-primary text-primary-foreground hover:bg-primary-dark flex cursor-pointer items-center justify-between rounded-lg p-6 shadow transition">
            <div>
              <h2 className="text-xl font-semibold">Create Cows</h2>
              <p className="text-sm opacity-90">Add a new cow to the system.</p>
            </div>
            <Plus className="h-10 w-10 text-white" />
          </div>
        </Link>
      </div>

      {/* Cow List Table */}
      {isLoading && <Loader />}

      {error && (
        <div className="text-destructive text-center">
          Error: {error instanceof Error ? error.message : error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCows.length > 0 ? (
                paginatedCows.map((cow) => (
                  <TableRow key={cow._id}>
                    <TableCell>{cow.name}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/dashboard/cows/${cow._id}`}>
                        <button className="bg-primary text-primary-foreground hover:bg-primary-dark rounded px-2 py-1 transition-colors">
                          Edit
                        </button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="py-4 text-center">
                    No cows found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="my-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrevious();
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageClick(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
