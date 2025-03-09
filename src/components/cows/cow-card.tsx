import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Cow } from '@/data/cows';

interface CowCardProps {
  cow: Cow;
}

export default function CowCard({ cow }: CowCardProps) {
  const locale = useLocale();

  return (
    <Link href={`/${locale}/donate/${cow._id}`} className="block">
      <div className="h-64 cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-md transition-all duration-300 hover:opacity-90 sm:h-72 md:h-80">
        {/* Image (Top Half) */}
        <div className="h-2/3 w-full">
          <Image
            src={cow.photo}
            alt={cow.name}
            width={400}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Name & Description (Bottom Half) */}
        <div className="flex h-1/3 flex-col items-center justify-center bg-gray-100 px-4 text-center">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
            {cow.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {cow.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
