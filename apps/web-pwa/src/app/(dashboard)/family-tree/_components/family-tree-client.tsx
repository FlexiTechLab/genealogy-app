"use client";

import React, { useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
} from '@xyflow/react';
import * as d3 from 'd3-hierarchy';
import '@xyflow/react/dist/style.css';

import { MemberNode } from "@/components/family/member-node";
import { FamilyNode, FamilyEdge } from '@/types/genealogy';
import { getFamilyMembers } from '@/services/family';
import { useQuery } from '@tanstack/react-query';

const nodeTypes = { familyMember: MemberNode };

export default function FamilyTreePage() {
    const treeId = "019d2848-5228-7551-934d-934dae4131fa";

    const { data: rawData = [], isLoading, isError } = useQuery({
        queryKey: [treeId],
        queryFn: () => getFamilyMembers(treeId),
        enabled: !!treeId, // Run only when `treeId` is available.
        retry: 1,
    });

    const { initialNodes, initialEdges } = useMemo(() => {
        if (!rawData.length) return { initialNodes: [], initialEdges: [] };

        try {
            const realRoots = rawData.filter(m => !m.parent_id);

            const VIRTUAL_ROOT_ID = 'virtual-root';
            const dataWithVirtualRoot: any[] = [
                { id: VIRTUAL_ROOT_ID, full_name: 'Virtual Root', parent_id: null },
                ...rawData.map(m => ({
                    ...m,
                    // Nếu là root thật, gán cha nó là virtual root
                    parent_id: m.parent_id || VIRTUAL_ROOT_ID
                }))
            ];

            const stratify = d3.stratify<any>()
                .id(d => d.id)
                .parentId(d => d.parent_id);

            const hierarchy = stratify(dataWithVirtualRoot);
            const root = d3.tree<any>().nodeSize([250, 200])(hierarchy);

            const nodes: FamilyNode[] = root.descendants()
                .filter(d => {
                    // Chỉ hiện node nếu là Virtual Root (để tính toán) 
                    // Hoặc là người có dòng máu chính (không phải chỉ là vợ/chồng đi kèm)
                    if (d.data.id === VIRTUAL_ROOT_ID) return false;

                    // Logic lọc: Nếu là nữ và không có parent_id trong DB, thường là vợ được add vào
                    const isSpouseOnly = !rawData.find(m => m.id === d.data.id)?.parent_id && d.data.gender === 0;
                    return !isSpouseOnly;
                })
                .map(d => ({
                    id: d.data.id,
                    type: 'familyMember' as const, // Fix type literal
                    position: { x: d.x, y: d.y },
                    data: d.data,
                }));

            const edges: FamilyEdge[] = root.links()
                .filter(l => l.source.data.id !== VIRTUAL_ROOT_ID)
                .map(l => ({
                    id: `e${l.source.data.id}-${l.target.data.id}`,
                    source: l.source.data.id,
                    target: l.target.data.id,
                    type: ConnectionLineType.SmoothStep,
                    animated: true,
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                }));

            return { initialNodes: nodes, initialEdges: edges };
        } catch (error) {
            console.error("D3 Stratify Error: Hệ thống phân cấp dữ liệu bị lỗi (vòng lặp hoặc thiếu node cha).", error);
            return { initialNodes: [], initialEdges: [] };
        }
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
                nodeTypes={nodeTypes}
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