import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen bg-slate-50/50">
			<aside className="hidden lg:flex w-64 border-r bg-white shrink-0 h-full">
				<Sidebar className="w-full" />
			</aside>

			<div className="flex flex-col flex-1 min-w-0">
				<Header />
				<main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}