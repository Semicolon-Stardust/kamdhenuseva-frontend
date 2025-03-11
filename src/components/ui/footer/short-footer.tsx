import React from 'react';
import { Link } from '@/i18n/routing';
import LocaleToggle from '@/components/utils/locale-toggle';
import { Separator } from '@/components/ui/separator';

export default function ShortFooter() {
  return (
    <footer className="flex flex-col items-center">
      <div className="my-4 text-xs text-white">
        <div className="flex justify-center gap-2">
          <Link className="underline-gray-500 hover:underline" href={'/about'}>
            About Us
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            className="underline-gray-500 hover:underline"
            href={'/contact'}
          >
            Contact Us
          </Link>
          <div>
            <Separator orientation="vertical" />
          </div>
          <Link
            className="underline-gray-500 hover:underline"
            href={'/privacy-policy'}
          >
            Privacy Policy
          </Link>
        </div>
        <div className="my-4">
          <Separator orientation="horizontal" />
        </div>
        <div className="text-center">
          DAYA Devraha &copy; {new Date().getFullYear()}
        </div>
      </div>
      <LocaleToggle className="text-gray-500" iconClassName="text-gray-500" />
    </footer>
  );
}
