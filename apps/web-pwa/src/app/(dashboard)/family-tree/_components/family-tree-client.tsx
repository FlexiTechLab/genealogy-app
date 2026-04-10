"use client";

import { useEffect, useMemo } from 'react';
import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	useNodesState,
	useEdgesState,
} from '@xyflow/react';
import * as d3 from 'd3-hierarchy';
import '@xyflow/react/dist/style.css';

import { MemberNode } from "@/components/family/member-node";
import { FamilyNode, FamilyEdge, SpouseShortInfo, FamilyMember } from '@/types/genealogy';
import SpouseEdge from '@/components/family/spouse-edge';
import { useFamilyMembers } from '@/hooks/useFamily';

const nodeTypes = { familyMember: MemberNode };

const edgeTypes = {
	spouse: SpouseEdge,
};

const TREE_ID = "019d2848-5228-7551-934d-934dae4131fa";

export default function FamilyTreePage() {
	const { data: rawData = [], isLoading, isError } = useFamilyMembers(TREE_ID);

	const { initialNodes, initialEdges } = useMemo(() => {
		if (!rawData.length) return { initialNodes: [], initialEdges: [] };

		const nodes: FamilyNode[] = [];
		const edges: FamilyEdge[] = [];
		const addedNodeIds = new Set<string>();
		const VIRTUAL_ROOT_ID = 'virtual-root';
		const allIds = new Set(rawData.map(p => p.id));

		// Bloodline Classification
		// Having a parent in the tree, OR being a first-generation (original ancestor)
		const bloodlineData = rawData.filter(p => {
			const hasFather = p.father_id && allIds.has(p.father_id);
			const hasMother = p.mother_id && allIds.has(p.mother_id);
			if (hasFather || hasMother)
				return true;
			if (p.generation_number === 1)
				return p.gender === 1;
			return false;
		});

		const bloodlineIds = new Set(bloodlineData.map(b => b.id));

		// All people who are NOT related by blood (daughters-in-law/sons-in-law)
		const spousesMap = new Map(
			rawData
				.filter(p => !bloodlineIds.has(p.id))
				.map(p => [p.id, p])
		);

		// D3 Stratify 
		// Priority: father_id (if bloodline) -> mother_id (if bloodline) -> VIRTUAL_ROOT
		const dataWithVirtualRoot = [
			{ id: VIRTUAL_ROOT_ID, parentId: null },
			...bloodlineData.map(m => {
				const fatherIsBloodline = m.father_id && bloodlineIds.has(m.father_id);
				const motherIsBloodline = m.mother_id && bloodlineIds.has(m.mother_id);
				const parentId = fatherIsBloodline
					? m.father_id
					: motherIsBloodline
						? m.mother_id
						: VIRTUAL_ROOT_ID;
				return { ...m, parentId };
			}),
		];

		try {
			const stratify = d3.stratify<any>().id(d => d.id).parentId(d => d.parentId);
			const hierarchy = stratify(dataWithVirtualRoot);
			const root = d3.tree<any>().nodeSize([500, 250])(hierarchy);

			// Pass 1: Create a node + blood relationship edge + marriage node/edge
			root.descendants().forEach((d) => {
				if (d.id === VIRTUAL_ROOT_ID) return;
				const person = d.data as FamilyMember;

				// Bloodline node
				nodes.push({
					id: person.id,
					type: 'familyMember',
					position: { x: d.x, y: d.y },
					data: { ...person, is_bloodline: true, is_spouse: false },
				});
				addedNodeIds.add(person.id);

				// Vertical edge: parent -> child
				if (d.parent && d.parent.id !== VIRTUAL_ROOT_ID) {
					edges.push({
						id: `ev-${d.parent.id}-${person.id}`,
						source: String(d.parent.id),
						target: String(person.id),
						sourceHandle: 'bottom',
						targetHandle: 'top',
						type: 'step',
						style: { stroke: '#94a3b8', strokeWidth: 1.5 },
					});
				}

				// Node + edge (daughter/son-in-law)
				if (person.spouses) {
					person.spouses.forEach((sRef: SpouseShortInfo, idx: number) => {
						const spouseData = spousesMap.get(sRef.id);
						if (!spouseData || addedNodeIds.has(spouseData.id)) return;

						const isMale = person.gender === 1;
						const offsetX = isMale ? 270 : -270;

						nodes.push({
							id: spouseData.id,
							type: 'familyMember',
							position: { x: d.x + offsetX * (idx + 1), y: d.y },
							data: {
								...spouseData,
								is_bloodline: false,
								is_spouse: true,
							} as any,
						});
						addedNodeIds.add(spouseData.id);

						// Edge of marriage: using custom type 'spouse' to render labels
						const husbandId = isMale ? person.id : spouseData.id;
						const wifeId = isMale ? spouseData.id : person.id;
						edges.push({
							id: `eh-${husbandId}-${wifeId}`,
							source: husbandId,
							target: wifeId,
							sourceHandle: 'right',
							targetHandle: 'left',
							type: 'spouse',
							data: { label: 'Vợ chồng' },
							animated: false,
							style: { stroke: '#fb7185', strokeWidth: 2, strokeDasharray: '5 5' },
						});
					});
				}
			});

			// Pass 2: Parent-Child Edge (runs AFTER all nodes have been created)
			// For cases where D3 already uses father as parentId
			// but we still want to draw the line from mother to child (optional)
			bloodlineData.forEach(person => {
				const fatherIsBloodline = person.father_id && bloodlineIds.has(person.father_id);
				// Only draw the mother-child edge when the father is NOT the bloodline.
				if (
					person.mother_id &&
					bloodlineIds.has(person.mother_id) &&
					!fatherIsBloodline
				) {
					edges.push({
						id: `em-${person.mother_id}-${person.id}`,
						source: String(person.mother_id),
						target: String(person.id),
						sourceHandle: 'bottom',
						targetHandle: 'top',
						type: 'smoothstep',
						style: { stroke: '#94a3b8', strokeWidth: 1.5 },
					});
				}
			});

		} catch (e) {
			console.error(e);
		}

		return { initialNodes: nodes, initialEdges: edges };
	}, [rawData]);

	const [nodes, setNodes, onNodesChange] = useNodesState<FamilyNode>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<FamilyEdge>([]);

	useEffect(() => {
		if (initialNodes.length > 0) {
			setNodes(initialNodes);
			setEdges(initialEdges);
		}
	}, [initialNodes, initialEdges]);

	if (isLoading) return <div className="flex h-full items-center justify-center">Đang tải sơ đồ...</div>;
	if (isError) return <div className="text-red-500">Lỗi khi lấy dữ liệu gia phả.</div>;

	return (
		<div className="h-[100%] w-full bg-slate-50">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				nodeTypes={nodeTypes}
				edgeTypes={edgeTypes}
				fitView
				onlyRenderVisibleElements
				aria-label="Family Tree Graph"
			>
				<Background color="#cbd5e1" gap={20} />
				<Controls />
				<MiniMap
					nodeColor={n => (n.data?.gender === 1 ? '#3b82f6' : '#ec4899')}
					zoomable
					pannable
				/>
			</ReactFlow>
		</div>
	);
}