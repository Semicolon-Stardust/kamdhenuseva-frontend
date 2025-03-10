import { ArrowUpDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface SortOptionsProps {
  sortField: string;
  setSortField: (field: string) => void;
  labels: { asc: string; desc: string };
}

export default function SortOptions({
  sortField,
  setSortField,
  labels,
}: SortOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border border-gray-500 px-4 py-2"
        >
          <ArrowUpDown className="h-5 w-5 text-gray-500" />
          <span>{sortField === 'name-asc' ? labels.asc : labels.desc}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 border border-gray-500">
        <DropdownMenuItem
          onClick={() => setSortField('name-asc')}
          className="flex items-center justify-between"
        >
          {labels.asc}
          {sortField === 'name-asc' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setSortField('name-desc')}
          className="flex items-center justify-between"
        >
          {labels.desc}
          {sortField === 'name-desc' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
