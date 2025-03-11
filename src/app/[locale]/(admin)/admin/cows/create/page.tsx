/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import {
  useForm,
  useFieldArray,
  Controller,
  SubmitHandler,
} from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

// Define Zod schema for one cow entry
const cowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sicknessStatus: z.boolean(),
  gender: z.enum(['Male', 'Female']).optional(),
  agedStatus: z.boolean(),
  adoptionStatus: z.boolean(),
  images: z.array(z.instanceof(File)).optional(),
});

// Schema for the whole form (an array of cows)
const createCowsSchema = z.object({
  cows: z.array(cowSchema).min(1, 'At least one cow is required'),
});

type CreateCowsFormValues = z.infer<typeof createCowsSchema>;

// A reusable dropzone component for file uploads
const DropzoneField = ({ onChange }: { onChange: (files: File[]) => void }) => {
  const onDrop = (acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  };

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
  } = useForm<CreateCowsFormValues>({
    resolver: zodResolver(createCowsSchema),
    defaultValues: {
      cows: [
        {
          name: '',
          description: '',
          sicknessStatus: false,
          gender: undefined,
          agedStatus: false,
          adoptionStatus: false,
          images: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cows',
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateCowsFormValues) => {
      // For bulk creation, build FormData.
      // Here we send a JSON string for the cows array, and append all files.
      const formData = new FormData();
      // Append files from every cow entry.
      data.cows.forEach((cow) => {
        if (cow.images && cow.images.length > 0) {
          cow.images.forEach((file) => {
            // You can name the file field with the index if needed
            formData.append('images', file);
          });
        }
      });
      // Append the rest of the data as JSON string.
      formData.append('data', JSON.stringify(data.cows));

      await createCow(formData as any);
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/cows`);
    },
  });

  const onSubmit: SubmitHandler<CreateCowsFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-background text-foreground flex min-h-screen items-center justify-center p-8"
    >
      <div className="bg-card mx-auto max-w-3xl overflow-hidden rounded-lg p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Create New Cows</h1>
        {mutation.isError && (
          <div className="text-destructive mb-4">
            Error: {(mutation.error as Error)?.message}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded border p-4">
              <h2 className="mb-2 text-lg font-semibold">Cow {index + 1}</h2>
              {/* Name */}
              <div>
                <Label htmlFor={`cows.${index}.name`}>Name:</Label>
                <Input
                  id={`cows.${index}.name`}
                  type="text"
                  {...register(`cows.${index}.name` as const)}
                />
                {errors.cows?.[index]?.name && (
                  <span className="text-destructive">
                    {errors.cows[index].name?.message}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor={`cows.${index}.description`}>
                  Description:
                </Label>
                <Textarea
                  id={`cows.${index}.description`}
                  {...register(`cows.${index}.description` as const)}
                />
              </div>

              {/* Gender */}
              <div>
                <Label htmlFor={`cows.${index}.gender`}>Gender:</Label>
                <Controller
                  control={control}
                  name={`cows.${index}.gender` as const}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
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
                  name={`cows.${index}.sicknessStatus` as const}
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
                  name={`cows.${index}.agedStatus` as const}
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
                  name={`cows.${index}.adoptionStatus` as const}
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
                  name={`cows.${index}.images` as const}
                  render={({ field: { onChange } }) => (
                    <DropzoneField onChange={onChange} />
                  )}
                />
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-destructive mt-2"
              >
                Remove Cow
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({
                name: '',
                description: '',
                sicknessStatus: false,
                gender: undefined,
                agedStatus: false,
                adoptionStatus: false,
                images: [],
              })
            }
            className="bg-secondary text-secondary-foreground rounded px-4 py-2"
          >
            Add Another Cow
          </button>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-primary text-primary-foreground w-full rounded px-4 py-2"
          >
            {mutation.isPending ? 'Creating...' : 'Create Cows'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
