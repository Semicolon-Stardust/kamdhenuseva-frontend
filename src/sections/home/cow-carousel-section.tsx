'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cows } from '@/data/cows';

export function CowCarouselSection() {
  const t = useTranslations('HomePage.cowCarousel');
  const locale = useLocale();
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t('heading')}
      </h2>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>

      {/* Carousel */}
      <div className="relative mt-8">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent className="gap-6">
            {cows.map((cow) => (
              <CarouselItem
                key={cow.id}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link href={`/${locale}/donate/${cow.id}`} className="block">
                  <Card className="relative overflow-hidden rounded-lg shadow-lg transition-transform">
                    {/* Cow Image */}
                    <Image
                      src={cow.image}
                      alt={cow.name}
                      width={600}
                      height={400}
                      className="h-64 w-full object-cover"
                    />
                    {/* Name Overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                      <h3 className="text-lg font-semibold text-white">
                        {cow.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Hide navigation buttons on small screens */}
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>

        {/* Carousel Navigation Dots */}
        <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {cows.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-3 w-3 rounded-full transition-all',
                current === index ? 'bg-black' : 'bg-gray-400',
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
