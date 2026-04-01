import Link from 'next/link';
import { MoveLeft, Home, AlertCircle } from 'lucide-react';
import { Metadata } from 'next';
import { BackButton } from '@/components/ui/back-button';

export const metadata: Metadata = {
    title: '404 - Không tìm thấy trang',
    description: 'Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.',
};

export default function NotFound() {
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                {/* Icon & Error Code */}
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-red-50 p-4 ring-8 ring-red-50/50">
                        <AlertCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
                    </div>
                </div>

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                    Error 404
                </p>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Trang không tồn tại
                </h1>

                <p className="mt-6 text-base leading-7 text-slate-600 max-w-lg mx-auto">
                    Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang yêu cầu.
                    Có thể địa chỉ URL bị sai hoặc trang đã được chuyển sang mục khác.
                </p>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
                    >
                        <Home className="h-4 w-4" />
                        Về trang chủ
                    </Link>

                    <BackButton
                        label="Quay lại"
                        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                    />
                </div>
            </div>

            {/* Footer decoration (Optional) */}
            <div className="mt-16 text-slate-400 text-sm italic">
                &copy; {new Date().getFullYear()} Family Tree Management System
            </div>
        </main>
    );
}