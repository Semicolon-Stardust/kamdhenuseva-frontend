import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  const locale = useLocale();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
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

      {/* Hero Section */}
      <header className="relative mx-auto w-full max-w-7xl">
        <Image
          src="/assets/about/hero.jpg"
          alt="About Sri Devraha Baba Ashram"
          width={1200}
          height={600}
          className="object-fit h-64 w-full rounded-lg shadow-lg sm:h-96"
        />
      </header>

      {/* Introduction */}
      <section className="mt-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{t('heading')}</h1>
        <p className="mt-4 text-gray-600 sm:text-lg">{t('subheading')}</p>
      </section>

      {/* Hinduism and Cows Section */}
      <section className="mt-10">
        <article className="text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t('hinduTitle')}
          </h2>
          <p className="mt-4 text-gray-700 sm:text-lg">
            {t('hinduDescription')}
          </p>
        </article>

        {/* Wide Full-Width Image Section */}
        <div className="mx-auto mt-8 w-full max-w-7xl">
          <Image
            src="/assets/about/image-1.jpg"
            alt="Hindu Beliefs About Cows"
            width={1200}
            height={500}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Guardian of Cows Section */}
      <section className="mt-10 flex flex-col-reverse items-center gap-8 md:flex-row">
        <article className="md:w-1/2">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t('guardianTitle')}
          </h2>
          <p className="mt-4 text-gray-700 sm:text-lg">
            {t('guardianDescription')}
          </p>
        </article>
        <div className="md:w-1/2">
          <Image
            src="/assets/about/image-2.jpg"
            alt="Goshala Cows"
            width={800}
            height={400}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Nutrition Section */}
      <section className="mt-10 flex flex-col items-center gap-8 md:flex-row">
        <div className="md:w-1/2">
          <Image
            src="/assets/about/image-2.jpg"
            alt="Goshala Nutrition"
            width={600}
            height={400}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <article className="md:w-1/2">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t('nutritionTitle')}
          </h2>
          <p className="mt-4 text-gray-700 sm:text-lg">
            {t('nutritionDescription')}
          </p>
        </article>
      </section>

      {/* Importance of Cows Section */}
      <section className="mt-10 flex flex-col-reverse items-center gap-8 md:flex-row">
        <article className="md:w-1/2">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            {t('cowImportanceTitle')}
          </h2>
          <p className="mt-4 text-gray-700 sm:text-lg">
            {t('cowImportanceDescription')}
          </p>
        </article>
        <div className="md:w-1/2">
          <Image
            src="/assets/about/image-2.jpg"
            alt="Sacred Cows"
            width={800}
            height={400}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Preservation Section */}
      <section className="mt-8 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {t('preservationTitle')}
        </h2>
        <p className="mt-4 text-gray-700 sm:text-lg">
          {t('preservationDescription')}
        </p>
      </section>
    </main>
  );
}
