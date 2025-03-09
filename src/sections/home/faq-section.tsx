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
    <section className="flex min-h-screen w-full items-center justify-center px-4 text-white transition-colors duration-300">
      <div
        className={`flex w-full max-w-6xl flex-col md:flex-row ${
          reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center gap-12`}
      >
        {/* Image Section */}
        <div className="relative h-[400px] min-h-[400px] w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-300 md:h-[500px] md:min-h-[500px] md:w-1/2">
          <ImageWrapper
            src="https://images.unsplash.com/photo-1475359524104-d101d02a042b"
            alt="FAQs"
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Accordion Section - Equal Height to Image */}
        <div className="bg-primary h-[400px] min-h-[400px] w-full rounded-2xl p-6 shadow-xl transition-all duration-300 md:h-[500px] md:min-h-[500px] md:w-1/2 md:p-10">
          <h2 className="mb-6 text-4xl font-bold text-white">{t('title')}</h2>
          <p className="mb-6 text-gray-200">{t('description')}</p>
          <DynamicAccordion items={accordionItems} />
        </div>
      </div>
    </section>
  );
}
