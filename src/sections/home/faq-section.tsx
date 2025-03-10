'use client';

import DynamicAccordion from '@/components/utils/dynamic-accordion';
import ImageWrapper from '@/components/utils/image-wrapper';
import { useTranslations } from 'next-intl';

interface FAQProps {
  reverse?: boolean;
}

export default function FAQSection({ reverse = false }: FAQProps) {
  const t = useTranslations('HomePage.faq');

  const accordionKeys = ['1', '2', '3'];
  const accordionItems = accordionKeys.map((key) => ({
    id: `questions.item-${key}`,
    title: t(`questions.${key}.question`),
    content: t(`questions.${key}.answer`),
  }));

  return (
    <section className="my-4 flex w-full items-center justify-center px-4 text-white transition-colors duration-300">
      <div
        className={`flex w-full max-w-6xl flex-col-reverse md:flex-row ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center gap-12`}
      >
        {/* Image Section - Hidden on Mobile */}
        <div className="relative hidden h-[500px] w-1/2 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 md:block">
          <ImageWrapper
            src="https://images.unsplash.com/photo-1475359524104-d101d02a042b"
            alt="FAQs"
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Accordion Section - Full Width on Mobile, Half on Desktop */}
        <div className="bg-primary h-auto w-full rounded-2xl p-6 shadow-xl transition-all duration-300 md:h-[500px] md:w-1/2 md:p-10">
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mb-2 text-gray-200">{t('description')}</p>
          <DynamicAccordion items={accordionItems} />
        </div>
      </div>
    </section>
  );
}
