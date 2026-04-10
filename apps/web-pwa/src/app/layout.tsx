import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Genealogy App | Quản lý Gia Phả Trực Tuyến",
	description: "Hệ thống quản lý thông tin dòng họ, cây gia phả và sự kiện truyền thống.",
	icons: {
		icon: "/favicon.ico",
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="vi" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					geistSans.variable,
					geistMono.variable
				)}
			>
				<QueryProvider>
					{children}
				</QueryProvider>
			</body>
		</html>
	);
}
