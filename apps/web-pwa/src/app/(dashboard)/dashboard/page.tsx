import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, CalendarDays, MapPin } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Tổng quan dòng họ</h2>
                <p className="text-muted-foreground">Thống kê dữ liệu gia phả chi họ Nguyễn.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Thành viên" value="142" icon={<Users className="w-4 h-4" />} />
                <StatCard title="Trưởng tộc" value="Cụ Nguyễn Văn A" icon={<Crown className="w-4 h-4" />} />
                <StatCard title="Giỗ chạp sắp tới" value="12/04" icon={<CalendarDays className="w-4 h-4" />} />
                <StatCard title="Địa điểm tập trung" value="Hà Nội" icon={<MapPin className="w-4 h-4" />} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader><CardTitle>Sự kiện gần đây</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground italic">Chưa có hoạt động mới...</p></CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: any) {
    return (
        <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold tracking-tight">{value}</div>
            </CardContent>
        </Card>
    );
}