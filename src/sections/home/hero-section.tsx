'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { CarouselDots } from '@/components/ui/carousel-dots';
import { type CarouselApi } from '@/components/ui/carousel';

export default function Hero() {
  const t = useTranslations('HomePage.heroSection.carousel');
  const slideKeys = ['1', '2', '3'];
  const carouselData = slideKeys.map((key) => ({
    image: t(`${key}.image`),
    altText: t(`${key}.altText`),
    heading: t(`${key}.heading`),
    paragraph: t(`${key}.paragraph`),
  }));
  const [api, setApi] = useState<CarouselApi>();

  return (
    <section className="relative h-screen w-full select-none">
      <Carousel
        opts={{ align: 'start', loop: true }}
        className="h-full w-full"
        plugins={[Autoplay({ delay: 5000 })]}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {carouselData.map((item, index) => (
            <CarouselItem key={index} className="relative min-h-screen w-full">
              <Image
                src={item.image}
                alt={item.altText}
                fill
                style={{ objectFit: 'cover' }}
                priority
                loading="eager"
              />
              <div className="absolute inset-0 z-0 min-h-screen w-full bg-black/40"></div>
              <div className="absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center px-5 text-center text-white">
                <h1 className="mb-2 text-4xl font-bold tracking-tight drop-shadow-lg md:text-left md:text-6xl">
                  {item.heading}
                </h1>
                <p className="text-md mb-4 pt-5 font-medium tracking-wide md:text-left md:text-2xl">
                  {item.paragraph}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots numberOfSlides={carouselData.length} api={api} />
      </Carousel>
    </section>
  );
}
