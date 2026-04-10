import { AlertCircle } from "lucide-react";

export function ProfileError() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
			<AlertCircle size={32} strokeWidth={1} />
			<p className="text-sm">Không thể tải thông tin thành viên</p>
		</div>
	);
}