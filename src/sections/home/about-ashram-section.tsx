import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function AboutAshramSection() {
  const t = useTranslations('HomePage.aboutAshram');

  return (
    <section className="max-w-8xl mx-auto mt-10 flex flex-col-reverse items-center justify-center gap-8 px-6 py-16 text-black sm:px-12 md:flex-row">
      {/* Content */}
      <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
        <h2 className="text-3xl font-bold text-black sm:text-4xl">
          {t('heading')}
        </h2>
        <p className="mt-4">{t('description')}</p>
      </div>

      {/* Image */}
      <div className="relative flex w-full flex-col items-center md:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1485134532658-d720895a3b5e"
          alt={t('heading')}
          width={800}
          height={500}
          className="rounded-lg object-cover shadow-lg"
        />
        <p className="mt-4 text-center text-lg italic">{t('subtitle')}</p>
      </div>
    </section>
  );
}
