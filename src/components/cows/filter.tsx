// components/ui/filter.tsx
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface FilterOptionsProps {
  selectedFilter: { sick: boolean; aged: boolean; adopted: boolean };
  setSelectedFilter: (filter: {
    sick: boolean;
    aged: boolean;
    adopted: boolean;
  }) => void;
  labels: {
    sick: string;
    aged: string;
    adopted: string;
  };
}

export default function FilterOptions({
  selectedFilter,
  setSelectedFilter,
  labels,
}: FilterOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg border border-gray-500 px-3 py-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span>Filter</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border border-gray-500">
        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={selectedFilter.sick}
          onCheckedChange={(checked) =>
            setSelectedFilter({ ...selectedFilter, sick: checked })
          }
        >
          {labels.sick}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedFilter.aged}
          onCheckedChange={(checked) =>
            setSelectedFilter({ ...selectedFilter, aged: checked })
          }
        >
          {labels.aged}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={selectedFilter.adopted}
          onCheckedChange={(checked) =>
            setSelectedFilter({ ...selectedFilter, adopted: checked })
          }
        >
          {labels.adopted}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
