export function ProfileSkeleton() {
	return (
		<div className="flex flex-col h-full animate-pulse">
			<div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
				<div className="flex items-start gap-4">
					<div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
					<div className="flex-1 space-y-2 pt-1">
						<div className="h-5 bg-slate-200 rounded w-40" />
						<div className="h-3 bg-slate-100 rounded w-24" />
						<div className="flex gap-2 mt-2">
							<div className="h-4 bg-slate-200 rounded w-14" />
							<div className="h-4 bg-slate-100 rounded w-10" />
						</div>
					</div>
				</div>
				<div className="mt-4 flex gap-3">
					<div className="flex-1 h-12 bg-slate-200 rounded-lg" />
				</div>
			</div>
			<div className="px-6 py-4 space-y-4">
				{[80, 60, 90].map((w, i) => (
					<div key={i} className="space-y-1.5">
						<div className="h-3 bg-slate-200 rounded w-20" />
						<div className={`h-12 bg-slate-100 rounded-lg`} style={{ width: `${w}%` }} />
					</div>
				))}
			</div>
		</div>
	);
}
