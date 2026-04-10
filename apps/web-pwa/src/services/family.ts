import axiosClient from '@/lib/axios';
import { FamilyMember } from '@/types/genealogy';
import { ApiResponse } from '@/types/api';
import { PersonDetail } from '@/types/person-detail';

export const personService = {
	/**
	 * Get a list of family members.
	 */
	getFamilyMembers: (treeId: string): Promise<ApiResponse<FamilyMember[]>> => {
		return axiosClient.get(`/trees/${treeId}/persons`);
	},

	/**
	 * Obtaining a person's details
	 */
	getPersonDetail: (treeId: string, personId: string): Promise<ApiResponse<PersonDetail>> => {
		return axiosClient.get(`/trees/${treeId}/persons/${personId}`);
	}
};