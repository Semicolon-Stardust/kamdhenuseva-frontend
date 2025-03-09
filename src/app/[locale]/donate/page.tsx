import { useTranslations } from 'next-intl';
import { cows } from '@/data/cows';
import CowCard from '@/components/cows/cow-card';
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

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
          <CowCard key={cow._id} cow={cow} />
        ))}
      </div>
    </section>
  );
}
