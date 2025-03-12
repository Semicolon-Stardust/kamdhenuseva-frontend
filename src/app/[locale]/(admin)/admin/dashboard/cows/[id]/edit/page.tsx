'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams, useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface CowFormValues {
  name: string;
  description?: string;
  sicknessStatus: boolean;
  gender?: 'Male' | 'Female';
  agedStatus: boolean;
  adoptionStatus: boolean;
  images?: File[];
}

export default function AdminCowEdit() {
  const { id, locale } = useParams();
  const cowId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const fetchCowById = useAuthStore((state) => state.fetchCowById);
  const updateCow = useAuthStore((state) => state.updateCow);

  const {
    data: cow,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cow', cowId],
    queryFn: async () => {
      if (cowId) return await fetchCowById(cowId);
      return null;
    },
    enabled: Boolean(cowId),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CowFormValues>();

  useEffect(() => {
    if (cow) {
      reset({
        name: cow.name,
        description: cow.description || '',
        sicknessStatus: cow.sicknessStatus,
        gender: cow.gender || undefined,
        agedStatus: cow.agedStatus,
        adoptionStatus: cow.adoptionStatus,
      });
    }
  }, [cow, reset]);

  // Dropzone component for file upload
  const DropzoneField = ({
    onChange,
  }: {
    onChange: (files: File[]) => void;
  }) => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        onChange(acceptedFiles);
      },
      [onChange],
    );

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
      useDropzone({
        onDrop,
        accept: { 'image/*': [] },
      });

    return (
      <div
        {...getRootProps()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-white p-4 text-center text-gray-600 transition hover:border-gray-500"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop images here, or click to select</p>
        )}
        {acceptedFiles.length > 0 && (
          <ul className="mt-2 text-gray-800">
            {acceptedFiles.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const mutation = useMutation({
    mutationFn: async (data: CowFormValues) => {
      if (cowId) {
        await updateCow(cowId, data);
      }
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/dashboard/cows`);
    },
  });

  const onSubmit: SubmitHandler<CowFormValues> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">
        Error: {error instanceof Error ? error.message : error}
      </div>
    );
  if (!cow) return <div className="text-center">No cow found</div>;

  return (
    <div className="bg-background min-h-screen p-8">
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
            <BreadcrumbLink href={`/${locale}/admin/dashboard/cows`}>
              Manage Cows
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Cow</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-accent text-primary mx-auto max-w-3xl rounded-lg p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Edit Cow</h1>

        {mutation.isError && (
          <div className="mb-4 text-red-500">
            Error: {(mutation.error as Error)?.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <Label htmlFor="name">Name:</Label>
          <Input id="name" type="text" {...register('name')} />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}

          {/* Description */}
          <Label htmlFor="description">Description:</Label>
          <Textarea id="description" {...register('description')} />

          {/* Gender Select */}
          <Label htmlFor="gender">Gender:</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger>
                  <SelectValue>{field.value || 'Select Gender'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {/* Status Checkboxes */}
          <div className="flex flex-wrap gap-4">
            <Controller
              control={control}
              name="sicknessStatus"
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onCheckedChange={onChange} />
              )}
            />
            <Label>Sick?</Label>

            <Controller
              control={control}
              name="agedStatus"
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onCheckedChange={onChange} />
              )}
            />
            <Label>Aged?</Label>

            <Controller
              control={control}
              name="adoptionStatus"
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} onCheckedChange={onChange} />
              )}
            />
            <Label>Adopted?</Label>
          </div>

          {/* Image Upload */}
          <Label>Upload Images:</Label>
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange } }) => (
              <DropzoneField onChange={onChange} />
            )}
          />

          <button
            type="submit"
            className="bg-primary w-full rounded-lg py-2 text-white"
          >
            {mutation.isPending ? 'Updating...' : 'Update Cow'}
          </button>
        </form>
      </div>
    </div>
  );
}
