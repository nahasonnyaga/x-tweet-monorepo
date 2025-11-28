import { useState } from 'react';
import { useRouter } from 'next/router';
import { HeroIcon } from '@components/ui/hero-icon';

interface SearchBarProps {
  placeholder?: string;
  small?: boolean;
}

export const SearchBar = ({ placeholder = "Search...", small }: SearchBarProps) => {
  const [term, setTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term.trim())}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 rounded-full bg-light-line-reply dark:bg-dark-line-reply px-3 ${
        small ? 'py-1.5' : 'py-2.5'
      } shadow-sm`}
    >
      <HeroIcon iconName="MagnifyingGlassIcon" className={`${small ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500`} />
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
      />
    </form>
  );
};
