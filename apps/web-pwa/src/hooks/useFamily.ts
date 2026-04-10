import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { personService } from '@/services/family';

/**
 * Hook retrieves the list of members
 */
export const useFamilyMembers = (treeId: string) => {
	return useQuery({
		queryKey: ['members', treeId],
		queryFn: () => personService.getFamilyMembers(treeId),
		enabled: !!treeId,
		staleTime: 5 * 60 * 1000,
		select: (response) => response.data || []
	});
};

/**
 * Hook retrieves details of a member
 */
export const usePersonDetail = (treeId: string, personId: string) => {
	return useQuery({
		queryKey: ['members', treeId, personId],
		queryFn: () => personService.getPersonDetail(treeId, personId),
		enabled: !!treeId && !!personId,
		placeholderData: keepPreviousData,
		select: (response) => response.data || [],
	});
};