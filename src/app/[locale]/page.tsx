import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <main
      className={cn(
        'flex flex-col gap-5',
        'dark:bg-gray-900/30',
        'text-black dark:text-white',
        'min-h-screen',
      )}
    ></main>
  );
}
