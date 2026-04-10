import { BaseEdge, EdgeLabelRenderer, getStraightPath, type EdgeProps } from '@xyflow/react';

export default function SpouseEdge({
	id,
	sourceX, sourceY,
	targetX, targetY,
	style,
	data,
	markerEnd,
}: EdgeProps) {
	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX, sourceY,
		targetX, targetY,
	});

	return (
		<>
			<BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
			{data?.label && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: 'absolute',
							transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
							pointerEvents: 'all',
						}}
						className="nodrag nopan bg-white border border-rose-300 rounded px-1.5 py-0.5 text-[9px] font-bold text-rose-500 shadow-sm"
					>
						{data.label as string}
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
}