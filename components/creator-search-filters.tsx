'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Creator } from '@/services/feed';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { City } from 'country-state-city';

type GenderValue = 'ALL' | 'M' | 'F' | 'O';
type FilterType = 'city' | 'gender' | 'niche' | null;

const COMBINED_NICHE_OPTIONS = [
  'fitness',
  'music',
  'comedy',
  'education',
  'lifestyle',
  'gaming',
  'fashion',
  'food',
  'travel',
  'art',
  'tech',
  'sports',
  'other',
  'Yoga Line',
  'New Launch',
  'Supplements',
  'Running Gear',
  'Wellness',
];

interface CreatorSearchFiltersProps {
  creators: Creator[] | undefined;
  onFilteredCreatorsChange: (creators: Creator[]) => void;
}

function normalize(value: string | null | undefined): string {
  return (value || '').trim().toLowerCase();
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatGenderLabel(gender: GenderValue): string {
  if (gender === 'M') return 'Male';
  if (gender === 'F') return 'Female';
  if (gender === 'O') return 'Other';
  return 'All';
}

export function CreatorSearchFilters({
  creators,
  onFilteredCreatorsChange,
}: CreatorSearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [nicheSearchQuery, setNicheSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedGender, setSelectedGender] = useState<GenderValue>('ALL');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [openFilter, setOpenFilter] = useState<FilterType>(null);

  const cityOptions = useMemo(() => {
    const indiaCities = (City.getCitiesOfCountry('IN') || [])
      .map((city) => city.name.trim())
      .filter((city) => city.length > 0);

    const creatorCities = (creators || [])
      .map((creator) => (creator as Creator & { city?: string | null }).city)
      .filter((city): city is string => Boolean(city && city.trim()))
      .map((city) => city.trim());

    return Array.from(new Set([...indiaCities, ...creatorCities])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [creators]);

  const filteredCityOptions = useMemo(() => {
    const cityQuery = normalize(citySearchQuery);
    if (!cityQuery) return cityOptions;
    return cityOptions.filter((city) => normalize(city).includes(cityQuery));
  }, [cityOptions, citySearchQuery]);

  const nicheOptions = useMemo(() => {
    const values = (creators || [])
      .map((creator) => creator.niche)
      .filter((niche): niche is string => Boolean(niche && niche.trim()))
      .map((niche) => niche.trim());

    return Array.from(new Set([...COMBINED_NICHE_OPTIONS, ...values])).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [creators]);

  const filteredNicheOptions = useMemo(() => {
    const nicheQuery = normalize(nicheSearchQuery);
    if (!nicheQuery) return nicheOptions;
    return nicheOptions.filter((niche) => normalize(niche).includes(nicheQuery));
  }, [nicheOptions, nicheSearchQuery]);

  const genderOptions: Exclude<GenderValue, 'ALL'>[] = ['M', 'F', 'O'];

  const filteredCreators = useMemo(() => {
    const query = normalize(searchQuery);

    return (creators || []).filter((creator) => {
      const creatorCity = (creator as Creator & { city?: string | null }).city;
      const creatorGender = (creator as Creator & { gender?: string | null }).gender;

      const matchQuery =
        query.length === 0 ||
        normalize(creator.name).includes(query) ||
        normalize(creator.username).includes(query) ||
        normalize(creator.niche).includes(query);

      const matchCity =
        selectedCity === 'all' || normalize(creatorCity) === normalize(selectedCity);

      const matchGender =
        selectedGender === 'ALL' ||
        normalize(creatorGender) === selectedGender.toLowerCase();

      const matchNiche =
        selectedNiche === 'all' || normalize(creator.niche) === normalize(selectedNiche);

      return matchQuery && matchCity && matchGender && matchNiche;
    });
  }, [creators, searchQuery, selectedCity, selectedGender, selectedNiche]);

  useEffect(() => {
    onFilteredCreatorsChange(filteredCreators);
  }, [filteredCreators, onFilteredCreatorsChange]);

  useEffect(() => {
    if (openFilter !== 'city') {
      setCitySearchQuery('');
    }
    if (openFilter !== 'niche') {
      setNicheSearchQuery('');
    }
  }, [openFilter]);

  const activeFiltersCount =
    Number(selectedCity !== 'all') +
    Number(selectedGender !== 'ALL') +
    Number(selectedNiche !== 'all');

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators..."
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="justify-between" onClick={() => setOpenFilter('city')}>
          <span className="truncate text-xs sm:text-sm">City ({selectedCity === 'all' ? 'All' : selectedCity})</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
        <Button variant="outline" className="justify-between" onClick={() => setOpenFilter('gender')}>
          <span className="truncate text-xs sm:text-sm">Gender ({formatGenderLabel(selectedGender)})</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
        <Button variant="outline" className="justify-between" onClick={() => setOpenFilter('niche')}>
          <span className="truncate text-xs sm:text-sm">
            Niche ({selectedNiche === 'all' ? 'All' : toTitleCase(selectedNiche)})
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredCreators.length} creator{filteredCreators.length === 1 ? '' : 's'}
        {activeFiltersCount > 0 ? ` · ${activeFiltersCount} filter${activeFiltersCount === 1 ? '' : 's'} active` : ''}
      </p>

      {openFilter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenFilter(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-semibold capitalize">{openFilter}</h3>
              <Button variant="ghost" size="icon" onClick={() => setOpenFilter(null)} aria-label="Close filter">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-72 overflow-y-auto p-2">
              {openFilter === 'city' && (
                <>
                  <div className="sticky top-0 z-10 bg-background p-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        placeholder="Search city..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                  {['all', ...filteredCityOptions].map((city) => (
                    <button
                      key={city}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
                        selectedCity === city && 'bg-accent'
                      )}
                      onClick={() => {
                        setSelectedCity(city);
                        setOpenFilter(null);
                      }}
                    >
                      <span>{city === 'all' ? 'All' : city}</span>
                      {selectedCity === city && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </>
              )}

              {openFilter === 'gender' && (
                <>
                  {(['ALL', ...genderOptions] as GenderValue[]).map((gender) => (
                    <button
                      key={gender}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
                        selectedGender === gender && 'bg-accent'
                      )}
                      onClick={() => {
                        setSelectedGender(gender);
                        setOpenFilter(null);
                      }}
                    >
                      <span>{formatGenderLabel(gender)}</span>
                      {selectedGender === gender && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </>
              )}

              {openFilter === 'niche' && (
                <>
                  <div className="sticky top-0 z-10 bg-background p-2">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={nicheSearchQuery}
                        onChange={(e) => setNicheSearchQuery(e.target.value)}
                        placeholder="Search niche..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                  {['all', ...filteredNicheOptions].map((niche) => (
                    <button
                      key={niche}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent',
                        selectedNiche === niche && 'bg-accent'
                      )}
                      onClick={() => {
                        setSelectedNiche(niche);
                        setOpenFilter(null);
                      }}
                    >
                      <span>{niche === 'all' ? 'All' : toTitleCase(niche)}</span>
                      {selectedNiche === niche && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
