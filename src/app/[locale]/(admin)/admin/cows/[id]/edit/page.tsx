'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
  photo?: string;
  description?: string;
  sicknessStatus: boolean;
  gender?: string;
  agedStatus: boolean;
  adoptionStatus: boolean;
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
        photo: cow.photo || '',
        description: cow.description || '',
        sicknessStatus: cow.sicknessStatus,
        gender: cow.gender || undefined,
        agedStatus: cow.agedStatus,
        adoptionStatus: cow.adoptionStatus,
      });
    }
  }, [cow, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CowFormValues) => {
      if (cowId) {
        await updateCow(cowId, {
          ...data,
          gender: data.gender as 'Male' | 'Female' | undefined,
        });
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

        {/* Photo URL */}
        <div>
          <Label htmlFor="photo">Photo URL:</Label>
          <Input id="photo" type="text" {...register('photo')} />
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
            defaultValue={cow?.gender || ''} // set default value from cow data
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value} // pass field.value directly
              >
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
