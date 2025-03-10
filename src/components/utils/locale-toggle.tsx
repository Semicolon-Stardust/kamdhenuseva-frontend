import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from '@/components/ui/locale-select';
import { cn } from '@/lib/utils'; // Make sure this utility is available for combining classNames

interface LocaleSwitcherProps {
  className?: string;
  iconClassName?: string;
}

export default function LocaleSwitcher({
  className,
  iconClassName
}: LocaleSwitcherProps = {}) {
  const locale = useLocale();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className={cn("text-muted-foreground h-4 w-4 text-white", iconClassName)} />
      <LocaleSwitcherSelect defaultValue={locale} label="Select a locale">
        {routing.locales.map((cur) => (
          <option key={cur} value={cur}>
            {cur}
          </option>
        ))}
      </LocaleSwitcherSelect>
    </div>
  );
}
