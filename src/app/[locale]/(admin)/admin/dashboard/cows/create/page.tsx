/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Define Zod schema for cow creation
const cowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  sicknessStatus: z.boolean(),
  gender: z.enum(['Male', 'Female']).optional(),
  agedStatus: z.boolean(),
  adoptionStatus: z.boolean(),
  images: z.array(z.instanceof(File)).optional(),
});

const createCowsSchema = z.object({
  cows: z.array(cowSchema).min(1, 'At least one cow is required'),
});

type CreateCowsFormValues = z.infer<typeof createCowsSchema>;

// A reusable dropzone component for file uploads with present styling
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
      const formData = new FormData();
      data.cows.forEach((cow) => {
        if (cow.images && cow.images.length > 0) {
          cow.images.forEach((file) => {
            formData.append('images', file);
          });
        }
      });
      formData.append('data', JSON.stringify(data.cows));
      await createCow(formData as any);
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/dashboard/cows`);
    },
  });

  const onSubmit: SubmitHandler<CreateCowsFormValues> = (data) => {
    mutation.mutate(data);
  };

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
            <BreadcrumbPage>Create Cows</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="bg-accent text-primary mx-auto max-w-3xl rounded-lg p-6 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">Create New Cows</h1>

        {mutation.isError && (
          <div className="mb-4 text-red-500">
            Error: {(mutation.error as Error)?.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 rounded-lg border p-4">
              <h2 className="mb-2 text-lg font-semibold">Cow {index + 1}</h2>

              {/* Name */}
              <Label htmlFor={`cows.${index}.name`}>Name:</Label>
              <Input
                id={`cows.${index}.name`}
                type="text"
                {...register(`cows.${index}.name` as const)}
              />
              {errors.cows?.[index]?.name && (
                <span className="text-red-500">
                  {errors.cows[index].name?.message}
                </span>
              )}

              {/* Description */}
              <Label htmlFor={`cows.${index}.description`}>Description:</Label>
              <Textarea
                id={`cows.${index}.description`}
                {...register(`cows.${index}.description` as const)}
              />

              {/* Gender */}
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
                      {field.value || 'Select Gender'}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Status Checkboxes */}
              <div className="mt-2 flex items-center space-x-4">
                <Controller
                  control={control}
                  name={`cows.${index}.sicknessStatus` as const}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => onChange(checked)}
                      />
                      <Label>Sick?</Label>
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name={`cows.${index}.agedStatus` as const}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => onChange(checked)}
                      />
                      <Label>Aged?</Label>
                    </>
                  )}
                />

                <Controller
                  control={control}
                  name={`cows.${index}.adoptionStatus` as const}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <Checkbox
                        checked={value}
                        onCheckedChange={(checked) => onChange(checked)}
                      />
                      <Label>Adopted?</Label>
                    </>
                  )}
                />
              </div>

              {/* Image Upload */}
              <Label>Upload Images:</Label>
              <Controller
                control={control}
                name={`cows.${index}.images` as const}
                render={({ field: { onChange } }) => (
                  <DropzoneField onChange={onChange} />
                )}
              />

              {/* Remove Cow Button */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 text-red-500"
              >
                Remove Cow
              </button>
            </div>
          ))}

          {/* Add Another Cow Button */}
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
            className="bg-secondary text-secondary-foreground w-full cursor-pointer rounded px-4 py-2"
          >
            Add Another Cow
          </button>

          <button
            type="submit"
            className="bg-primary w-full cursor-pointer rounded-lg py-2 text-white"
          >
            {mutation.isPending ? 'Creating...' : 'Create Cows'}
          </button>
        </form>
      </div>
    </div>
  );
}
