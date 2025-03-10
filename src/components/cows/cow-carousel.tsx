'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { useLocale } from 'next-intl';
import type { Cow } from '@/stores/authStore';

interface CowCarouselProps {
  cows: Cow[];
  limit?: number;
}

export function CowCarousel({ cows, limit = cows.length }: CowCarouselProps) {
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
    <div className="relative mt-8">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="gap-6">
          {cows.slice(0, limit).map((cow) => (
            <CarouselItem
              key={cow._id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Link href={`/${locale}/donate/${cow._id}`} className="block">
                <Card className="group relative overflow-hidden rounded-lg shadow-lg transition-transform hover:opacity-90">
                  {/* Cow Image */}
                  <Image
                    src={cow.photo || ''}
                    alt={cow.name}
                    width={600}
                    height={400}
                    className="h-64 w-full object-cover"
                  />
                  {/* Name Overlay (always visible) */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                    <h3 className="text-lg font-semibold text-white">
                      {cow.name}
                    </h3>
                  </div>
                  {/* Description Overlay (shown on hover) */}
                  <div className="bg-opacity-70 absolute inset-0 flex items-center justify-center bg-black px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-center text-sm text-white">
                      {cow.description}
                    </p>
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
        {cows.slice(0, limit).map((_, index) => (
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
  );
}
