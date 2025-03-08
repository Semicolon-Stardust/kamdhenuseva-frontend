import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { cows } from '@/data/cows';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CowsPage() {
  const t = useTranslations('CowsPage');
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('breadcrumb')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {t('heading')}
      </h1>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>

      {/* Grid layout for cows */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cows.map((cow) => (
          <Link
            key={cow.id}
            href={`/${locale}/donate/${cow.id}`}
            className="block"
          >
            <div className="h-56 overflow-hidden rounded-lg border border-gray-200 shadow-lg transition-transform hover:scale-105 sm:h-64 md:h-72">
              {/* Image (Top Half) */}
              <div className="h-2/3 w-full">
                <Image
                  src={cow.image}
                  alt={cow.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name (Bottom Half) */}
              <div className="flex h-1/3 items-center justify-center bg-gray-100 px-4">
                <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                  {cow.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
