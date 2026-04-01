import { FamilyMember } from '@/types/genealogy';
import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFamilyMembers = async (treeId: string): Promise<FamilyMember[]> => {
    if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    }
    const response = await fetch(`${API_BASE_URL}/trees/${treeId}/persons`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi hệ thống: ${response.status}`);
    }

    const result: ApiResponse<FamilyMember[]> = await response.json();

    return result.data;
};