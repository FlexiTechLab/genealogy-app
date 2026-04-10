import { useState, useMemo } from 'react';
import { FamilyMember } from '@/types/genealogy';

interface Filters {
    search: string;
    filterGen: number | null;
    filterAlive: boolean | null;
    filterGender: number | null;
}

interface UseMembersFilterReturn extends Filters {
    setSearch: (v: string) => void;
    setFilterGen: (v: number | null) => void;
    setFilterAlive: (v: boolean | null) => void;
    setFilterGender: (v: number | null) => void;
    clearFilters: () => void;
    hasFilters: boolean;
    filtered: FamilyMember[];
    generations: number[];
}

export function useMembersFilter(rawData: FamilyMember[]): UseMembersFilterReturn {
    const [search, setSearch] = useState('');
    const [filterGen, setFilterGen] = useState<number | null>(null);
    const [filterAlive, setFilterAlive] = useState<boolean | null>(null);
    const [filterGender, setFilterGender] = useState<number | null>(null);

    const generations = useMemo(
        () => [...new Set(rawData.map(m => m.generation_number))].sort((a, b) => a - b),
        [rawData]
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return rawData
            .filter(m => {
                if (q && !m.full_name.toLowerCase().includes(q) &&
                    !(m.nick_name?.toLowerCase().includes(q))) return false;
                if (filterGen !== null && m.generation_number !== filterGen) return false;
                if (filterAlive !== null && m.is_alive !== filterAlive) return false;
                if (filterGender !== null && m.gender !== filterGender) return false;
                return true;
            })
            .sort((a, b) =>
                a.generation_number !== b.generation_number
                    ? a.generation_number - b.generation_number
                    : a.birth_order - b.birth_order
            );
    }, [rawData, search, filterGen, filterAlive, filterGender]);

    const clearFilters = () => {
        setFilterGen(null);
        setFilterAlive(null);
        setFilterGender(null);
    };

    const hasFilters = filterGen !== null || filterAlive !== null || filterGender !== null;

    return {
        search, setSearch,
        filterGen, setFilterGen,
        filterAlive, setFilterAlive,
        filterGender, setFilterGender,
        clearFilters,
        hasFilters,
        filtered,
        generations,
    };
}