import { FamilyMember } from './genealogy';

export interface SpouseDetail {
	person: FamilyMember;
	marriage_order: number;
	marriage_date?: string;
	divorce_date?: string;
	note?: string;
}

export interface PersonDetail extends Omit<FamilyMember, 'spouses'> {
	branch_id?: string;
	child_type: string;
	longevity_info?: string;
	father?: FamilyMember;
	mother?: FamilyMember;
	spouses: SpouseDetail[];
	children: FamilyMember[];
	siblings: FamilyMember[];
}