// components/ui/searchbar.tsx
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  placeholder,
}: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-48 rounded-lg border border-gray-500 px-3 py-2 pl-10 sm:w-64 md:w-100"
      />
      <Search className="absolute top-3 left-3 h-5 w-5 text-gray-500" />
    </div>
  );
}
