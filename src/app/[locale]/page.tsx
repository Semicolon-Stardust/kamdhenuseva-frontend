import Footer from '@/components/ui/footer/footer';
import AuthHeaderWrapper from '@/components/ui/header/AuthHeaderWrapper';
import { cn } from '@/lib/utils';
import { AboutAshramSection } from '@/sections/home/about-ashram-section';
import { AdoptACowCTASection } from '@/sections/home/adopt-cta-section';
import { CowCarouselSection } from '@/sections/home/cow-carousel-section';
import FAQSection from '@/sections/home/faq-section';
import Hero from '@/sections/home/hero-section';

export default function HomePage() {
  return (
    <main>
      <AuthHeaderWrapper />
      <div
        className={cn(
          'flex flex-col gap-5',
          'dark:bg-gray-900/30',
          'text-black dark:text-white',
          'min-h-screen',
        )}
      >
        <Hero />
        <AboutAshramSection />
        <AdoptACowCTASection />
        <CowCarouselSection />
        <FAQSection />
      </div>
      <Footer />
    </main>
  );
}
