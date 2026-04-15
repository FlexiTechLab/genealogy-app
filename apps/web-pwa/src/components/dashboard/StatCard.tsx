import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: ReactNode;
	description?: string;
	trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, icon, description }: StatCardProps) {
	return (
		<Card className="shadow-sm border-slate-200/60 transition-all hover:shadow-md">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
					{title}
				</CardTitle>
				<div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
				{description && (
					<p className="text-xs text-muted-foreground mt-1 font-medium truncate">
						{description}
					</p>
				)}
			</CardContent>
		</Card>
	);
}