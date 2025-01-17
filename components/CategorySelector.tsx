'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Category } from '@/sanity/types';
import { useRouter } from 'next/navigation';

export function CategorySelector({ categories }: { categories: Category[] }) {
  const [open, setOpen] = React.useState(false);
  const [slug, setSlug] = React.useState('');
  const router = useRouter();

  React.useEffect(() => {
    if (!slug) return;
    router.push(`/categories/${slug}`);
  }, [slug]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {slug
            ? categories.find((category) => category.slug?.current === slug)
                ?.title
            : 'Select category...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.slug?.current}
                  onSelect={(currentValue) => {
                    setSlug(currentValue === slug ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      slug === category.slug?.current
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {category.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
