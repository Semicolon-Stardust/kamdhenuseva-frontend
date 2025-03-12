import Image from 'next/image';
import { Link } from '@/i18n/routing';

import { Cow } from '@/stores/authStore';

interface CowCardProps {
  cow: Cow;
  link: string;
}

export default function CowCard({ cow, link }: CowCardProps) {
  return (
    <Link href={`${link}`} className="block">
      <div className="h-64 cursor-pointer overflow-hidden rounded-lg border border-gray-200 shadow-md transition-all duration-300 hover:opacity-90 sm:h-72 md:h-80">
        {/* Image (Top Half) */}
        <div className="h-2/3 w-full">
          {cow.photos && cow.photos.length > 0 ? (
            <Image
              src={cow.photos[0]}
              alt={cow.name}
              width={400}
              height={220}
              className="object-fit h-[220px] w-[400px]"
            />
          ) : (
            <Image
              src={'/assets/donate/placeholder.jpg'}
              alt={cow.name}
              width={400}
              height={220}
              className="object-fit h-[220px] w-[400px]"
            />
          )}
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
