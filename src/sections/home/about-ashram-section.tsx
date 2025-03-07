import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function AboutAshramSection() {
  const t = useTranslations('HomePage.aboutAshram');

  return (
    <section className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-center gap-10 px-6 py-12 text-black sm:px-12 md:flex-row">
      {/* Content */}
      <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-start md:text-left">
        <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
          {t('heading')}
        </h2>
        <p className="mt-4 text-justify text-sm whitespace-pre-line sm:text-base md:text-lg">
          {t('description')}
        </p>
      </div>

      {/* Image */}
      <div className="relative flex w-full flex-col items-center sm:w-[80%] md:w-1/2">
        <Image
          src="https://images.unsplash.com/photo-1485134532658-d720895a3b5e"
          alt={t('heading')}
          width={800}
          height={500}
          className="aspect-[16/10] rounded-lg object-cover shadow-lg"
        />
        <p className="mt-4 text-center text-base italic sm:text-lg">
          {t('subtitle')}
        </p>
      </div>
    </section>
  );
}
