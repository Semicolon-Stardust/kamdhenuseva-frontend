import { use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cows } from '@/data/cows';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function DonateCowPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = use(props.params);
  const t = useTranslations('DonateCowPage');
  const locale = useLocale();
  const cow = cows.find((c) => c.id.toString() === params.id);

  if (!cow) return notFound();

  return (
    <section className="mx-auto mt-14 max-w-7xl px-6 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/donate`}>Donate</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cow.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {t('heading', { name: cow.name })}
      </h1>

      <div className="mt-6 flex flex-col items-center justify-center">
        {/* Cow Image */}
        <Image
          src={cow.image}
          alt={cow.name}
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />

        {/* Cow Details */}
        <div className="mt-6 w-full text-center">
          <p className="text-lg font-semibold">
            {t('gender')}: {cow.gender}
          </p>
          <p className="text-lg font-semibold">
            {t('isAged')}: {cow.isAged ? t('yes') : t('no')}
          </p>
          <p className="text-lg font-semibold">
            {t('isSick')}: {cow.isSick ? t('yes') : t('no')}
          </p>
        </div>

        {/* Donate Button */}
        <Button
          variant="default"
          effect="shineHover"
          className="mt-6 px-6 py-3 text-lg sm:px-8 sm:py-4"
        >
          {t('donateNow')}
        </Button>
      </div>
    </section>
  );
}
