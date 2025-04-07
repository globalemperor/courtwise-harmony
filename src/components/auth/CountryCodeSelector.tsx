
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countries } from "@/data/countries";

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: any) => void;
}

export const CountryCodeSelector = ({ value, onChange, onCountryChange }: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(countries.find(country => country.dial_code === value) || countries[0]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSelect = (country: any) => {
    setSelectedCountry(country);
    onChange(country.dial_code);
    if (onCountryChange) {
      onCountryChange(country);
    }
    setOpen(false);
    setSearchQuery("");
  };

  const filteredCountries = searchQuery
    ? countries.filter(
        country =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.dial_code.includes(searchQuery) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          role="combobox"
          aria-expanded={open}
          className="flex items-center h-10 w-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <img
            src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
            alt={selectedCountry.name}
            className="h-4 w-6 mr-2 object-contain"
          />
          <span className="flex-1">{selectedCountry.dial_code}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              ref={searchInputRef}
              placeholder="Search country..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-9 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchQuery && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.dial_code}`}
                  onSelect={() => handleSelect(country)}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.name}
                    className="h-4 w-6 mr-2 object-contain"
                  />
                  <span>{country.name}</span>
                  <span className="ml-auto text-muted-foreground">{country.dial_code}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
