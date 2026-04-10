"use client";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Network, Users, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
	{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ name: 'Cây Gia Phả', href: '/family-tree', icon: Network },
	{ name: 'Thành viên', href: '/members', icon: Users },
	{ name: 'Sự kiện', href: '/events', icon: Calendar },
];

export function Sidebar({ className }: { className?: string }) {
	const pathname = usePathname();

	return (
		<div className={cn("flex flex-col h-full bg-white", className)}>
			<div className="p-6">
				<div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
					<Network className="w-8 h-8" />
					<span>GIA TỘC</span>
				</div>
			</div>

			<nav className="flex-1 px-4 space-y-1 overflow-y-auto">
				{navigation.map((item) => {
					const isActive = pathname.startsWith(item.href);
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
								isActive
									? "bg-primary text-primary-foreground shadow-sm"
									: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
							)}
						>
							<item.icon className="w-5 h-5" />
							{item.name}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-slate-200 mt-auto">
				<button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
					<LogOut className="w-5 h-5" />
					Đăng xuất
				</button>
			</div>
		</div>
	);
}