"use client";
import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
			<div className="flex items-center gap-4">
				{/* Mobile menu button (currently not in use) */}
				<Button variant="ghost" size="icon" className="lg:hidden">
					<Menu size={20} />
				</Button>
				<span className="text-sm font-medium text-slate-500 italic">Hệ thống quản lý gia tộc</span>
			</div>

			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" className="rounded-full">
					<Bell size={18} className="text-slate-600" />
				</Button>
				<div className="flex items-center gap-2 pl-2 border-l">
					<div className="text-right hidden sm:block">
						<p className="text-xs font-bold">Admin</p>
						<p className="text-[10px] text-slate-400">admin@family.com</p>
					</div>
					<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
						<User size={18} />
					</div>
				</div>
			</div>
		</header>
	);
}