import { Node, Edge } from '@xyflow/react';

export type SpouseShortInfo = {
    id: string;
    full_name: string;
    gender: number;
};

export type FamilyMember = {
    id: string;
    full_name: string;
    parent_id: string | null;
    spouses?: SpouseShortInfo[];
    nick_name?: string;
    gender: number; // 0: Female, 1: Male
    generation_number: number;
    birth_order: number;
    date_of_birth?: string;
    date_of_death?: string;
    is_alive: boolean;
};

// Định nghĩa Custom Node cho XYFlow
// Generic 1: Dữ liệu bên trong node
// Generic 2: String literal định danh loại node
export type FamilyNode = Node<FamilyMember, 'familyMember'>;
export type FamilyEdge = Edge;