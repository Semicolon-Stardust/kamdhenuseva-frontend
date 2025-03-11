'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
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

interface CowFormValues {
  name: string;
  description?: string;
  sicknessStatus: boolean;
  gender?: 'Male' | 'Female';
  agedStatus: boolean;
  adoptionStatus: boolean;
  // New field for file uploads (array of File objects)
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
        className="cursor-pointer rounded border-2 border-dashed p-4"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop some images here, or click to select files</p>
        )}
        {acceptedFiles.length > 0 && (
          <ul className="mt-2">
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
        // updateCow should be updated to support FormData if images are provided
        await updateCow(cowId, data);
      }
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/cows`);
    },
  });

  const onSubmit: SubmitHandler<CowFormValues> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error instanceof Error ? error.message : error}</div>;
  if (!cow) return <div>No cow found</div>;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-background text-foreground min-h-screen p-40"
    >
      <h1 className="mb-4 text-2xl font-bold">Edit Cow</h1>
      {mutation.isError && (
        <div className="text-destructive mb-4">
          Error: {(mutation.error as Error)?.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name:</Label>
          <Input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <span className="text-destructive">{errors.name.message}</span>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description:</Label>
          <Textarea id="description" {...register('description')} />
        </div>

        {/* Gender Select */}
        <div>
          <Label htmlFor="gender">Gender:</Label>
          <Controller
            control={control}
            name="gender"
            defaultValue={cow?.gender || ''}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue>
                    {field.value ? field.value : 'Select Gender'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Sickness Status */}
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="sicknessStatus"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onCheckedChange={(checked) => onChange(checked)}
              />
            )}
          />
          <Label>Sick?</Label>
        </div>

        {/* Aged Status */}
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="agedStatus"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onCheckedChange={(checked) => onChange(checked)}
              />
            )}
          />
          <Label>Aged?</Label>
        </div>

        {/* Adoption Status */}
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="adoptionStatus"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                checked={value}
                onCheckedChange={(checked) => onChange(checked)}
              />
            )}
          />
          <Label>Adopted?</Label>
        </div>

        {/* Image Upload via Dropzone */}
        <div>
          <Label>Upload Images:</Label>
          <Controller
            control={control}
            name="images"
            render={({ field: { onChange } }) => (
              <DropzoneField onChange={onChange} />
            )}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-primary text-primary-foreground rounded px-4 py-2"
        >
          {mutation.isPending ? 'Updating...' : 'Update Cow'}
        </button>
      </form>
    </motion.div>
  );
}
