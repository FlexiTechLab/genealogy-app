
interface FilterProps {
	selectedType: string;
	onTypeChange: (type: string) => void;
}

const EVENT_LABELS: Record<string, string> = {
	all: 'Tất cả',
	reunion: 'Họp mặt',
	ceremony: 'Lễ hội',
	death_anniversary: 'Ngày giỗ',
	wedding: 'Đám cưới',
};

export const EventFilter = ({ selectedType, onTypeChange }: FilterProps) => {
	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
			{Object.entries(EVENT_LABELS).map(([value, label]) => (
				<button
					key={value}
					onClick={() => onTypeChange(value === 'all' ? '' : value)}
					className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${(selectedType || 'all') === value
						? 'bg-gray-800 text-white border-gray-800'
						: 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
						}`}
				>
					{label}
				</button>
			))}
		</div>
	);
};