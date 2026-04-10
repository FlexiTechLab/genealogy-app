import { Search, Filter, Leaf, X } from 'lucide-react';
import { FamilyMember } from '@/types/genealogy';
import { MemberRow } from './MemberRow';
import { useMembersFilter } from '../hooks/useMembersFilter';

interface MemberListPanelProps {
    rawData: FamilyMember[];
    memberMap: Map<string, FamilyMember>;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
}

export function MemberListPanel({ rawData, memberMap, selectedId, onSelect }: MemberListPanelProps) {
    const {
        search, setSearch,
        filterGen, setFilterGen,
        filterAlive, setFilterAlive,
        filterGender, setFilterGender,
        clearFilters, hasFilters,
        filtered, generations,
    } = useMembersFilter(rawData);

    // Group filtered list theo đời
    const grouped = filtered.reduce<Record<number, FamilyMember[]>>((acc, m) => {
        (acc[m.generation_number] ??= []).push(m);
        return acc;
    }, {});

    return (
        <div className="w-80 shrink-0 flex flex-col border-r border-slate-100 bg-slate-50/50 h-full overflow-hidden">

            {/* Search */}
            <div className="p-3 border-b border-slate-100">
                <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm tên, tên thường gọi..."
                        className="w-full pl-7 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg
                                   outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300
                                   placeholder:text-slate-300"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="px-3 py-2 border-b border-slate-100 space-y-2">
                {/* Thế hệ */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Filter size={10} className="text-slate-400 shrink-0" />
                    {generations.map(g => (
                        <button
                            key={g}
                            onClick={() => setFilterGen(filterGen === g ? null : g)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all
                                ${filterGen === g
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            Đời {g}
                        </button>
                    ))}
                </div>

                {/* Giới tính & trạng thái */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {([
                        { label: '♂ Nam', val: 1, key: 'gender' },
                        { label: '♀ Nữ', val: 0, key: 'gender' },
                        { label: '✦ Còn sống', val: true, key: 'alive' },
                        { label: '✝ Đã mất', val: false, key: 'alive' },
                    ] as const).map(f => {
                        const isActive = f.key === 'gender'
                            ? filterGender === f.val
                            : filterAlive === f.val;
                        return (
                            <button
                                key={f.label}
                                onClick={() => {
                                    if (f.key === 'gender')
                                        setFilterGender(isActive ? null : f.val as number);
                                    else
                                        setFilterAlive(isActive ? null : f.val as boolean);
                                }}
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all
                                    ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                    {hasFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-400 hover:bg-red-100"
                        >
                            Xoá lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Count */}
            <div className="px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-100">
                {filtered.length} / {rawData.length} thành viên
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-10">
                        Không tìm thấy thành viên
                    </div>
                ) : (
                    Object.entries(grouped)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([gen, members]) => (
                            <div key={gen}>
                                {/* Sticky generation header */}
                                <div className="sticky top-0 z-10 px-3 py-1 bg-slate-100/90 backdrop-blur-sm
                                                border-y border-slate-200 flex items-center gap-1.5">
                                    <Leaf size={10} className="text-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Đời {gen}
                                    </span>
                                    <span className="ml-auto text-[10px] text-slate-400">
                                        {members.length} người
                                    </span>
                                </div>
                                <div className="p-2 space-y-0.5">
                                    {members.map(m => (
                                        <MemberRow
                                            key={m.id}
                                            member={m}
                                            isSelected={m.id === selectedId}
                                            onClick={() => onSelect(m.id === selectedId ? null : m.id)}
                                            memberMap={memberMap}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}