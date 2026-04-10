import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-screen overflow-hidden">
			<aside className="hidden lg:flex w-64 border-r bg-white shrink-0">
				<Sidebar className="h-full w-full" />
			</aside>

			<div className="flex flex-col flex-1 overflow-hidden">
				<Header />
				<main className="flex-1 p-4 overflow-hidden">
					{children}
				</main>
			</div>
		</div>
	);
}