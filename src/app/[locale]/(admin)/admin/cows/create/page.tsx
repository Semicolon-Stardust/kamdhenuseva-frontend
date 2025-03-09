'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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

export default function AdminCowCreate() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const createCow = useAuthStore((state) => state.createCow);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CowFormValues>({
    defaultValues: {
      sicknessStatus: false,
      agedStatus: false,
      adoptionStatus: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CowFormValues) => {
      await createCow(data);
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/cows`);
    },
  });

  const onSubmit: SubmitHandler<CowFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex items-center justify-center min-h-screen p-8 bg-background text-foreground"
    >
      <div className="max-w-md mx-auto overflow-hidden rounded-lg shadow-lg bg-card">
        <div className="p-6">
          <h1 className="mb-4 text-2xl font-bold text-center">
            Create New Cow
          </h1>
          {mutation.isError && (
            <div className="mb-4 text-destructive">
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
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger>
                      {field.value ? field.value : 'Select Gender'}
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
              className="w-full px-4 py-2 transition-colors rounded bg-primary text-primary-foreground hover:bg-primary-dark"
            >
              {mutation.isPending ? 'Creating...' : 'Create Cow'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
