import { Icon } from "@iconify/react";
import { icsystem } from "icones";
import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  addEdge,
  MarkerType,
  Controls,
  Background,
  Position,
  useNodesState,
  Handle,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 } from "uuid";

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const CustomNodeComponent = ({ data }) => {
  return (
    <div className="px-4 backdrop-blur py-2 cursor-pointer text-xs flex opacity justify-center bg-white/5 rounded-full border border-white/5  items-center">
      {/* Handle for incoming edges */}
      <Handle
        type="target"
        position={data.position.y > 0 ? Position.Top : Position.Bottom}
        style={{ background: "#555" }}
        isConnectableStart={true}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={true}
      />
      <div>
        {/* Your node content here, e.g., the node label */}
        {data.label}
      </div>
      {/* Handle for outgoing edges */}
      {/* <Handle
        type="source"
        position="bottom"
        style={{ background: "#555" }}
        isConnectable={true}
      /> */}
    </div>
  );
};
const SourceNodeComponent = ({ data }) => {
  return (
    <div className="px-4 cursor-pointer backdrop-blur py-2 text-xs font-light c4 hover:text-white flex text-center opacity justify-center bg-white/5 rounded-full border border-white/5  items-center">
      {/* Handle for incoming edges */}
      <div className="bg-white/5 backdrop-blur p-2 rounded-full mr-2">
        <Icon icon={data?.icon || icsystem.mission} />
      </div>
      <Handle
        type="source"
        position="top"
        id="a" // Unique ID for the handle
        isConnectable={true}
      />
      <div>
        {/* Your node content here, e.g., the node label */}
        {data.label}
      </div>

      <Handle
        type="source"
        position="bottom"
        id="b" // Unique ID for the handle
        isConnectable={true}
      />
    </div>
  );
};

const nodeTypes = {
  special: CustomNodeComponent,
  source: SourceNodeComponent,
};

export const MyFlowScheme = ({ main, arr }) => {
  const radius = arr?.length ? (arr?.length / 3) * 100 : 200;
  const startAngle = Math.PI / arr?.length;

  const [isOpen, setIsOpen] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (event, node) => {
    console.log("event", event);
    console.log("node", node?.data?.modal);
    if (node?.id !== selectedNode) {
      setSelectedNode(node?.id);
      setIsOpen(node?.data?.modal);
    } else {
      setSelectedNode(null);

      setIsOpen(null);
    }
  };

  const initialNodes = [
    {
      id: "1",
      type: "source",
      target: "top",

      data: { label: main?.title, modal: main?.modal, icon: main?.icon },
      position: { x: 0, y: 0 },
    },
    ...arr.map((el, i) => ({
      id: String(i + 2),

      data: {
        label: el?.title,
        modal: el?.modal,
        position: {
          x: radius * Math.cos(startAngle + (i * 2 * Math.PI) / arr.length),
          y: radius * Math.sin(startAngle + (i * 2 * Math.PI) / arr.length),
        },
      },
      draggable: false,
      type: "special", // This 'type' should match the type you register in ReactFlow

      position: {
        x: radius * Math.cos(startAngle + (i * 2 * Math.PI) / arr.length),
        y: radius * Math.sin(startAngle + (i * 2 * Math.PI) / arr.length),
      },
    })),
    // Generate other nodes based on the positions
    ,
  ];

  const initialEdges = initialNodes
    .filter((node) => node.id !== "1")
    .map((node, i) => {
      // Determine if the node is above or below the 'You' node by comparing the y position
      const isNodeAbove = node.position.y < 0;
      return {
        id: `e1-${node.id}`,
        source: "1",
        target: node.id,
        sourceHandle: node.position.y < 0 ? "a" : "b",

        animated: true,

        style: {
          stroke: "#454443",
          strokeWidth: 1,
        },
      };
    });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={memoizedNodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onInit={onInit}
          fitView
          // attributionPosition="top-right"
        >
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>

      {isOpen && (
        <div className="absolute px-5 c4 overflow-y-auto py-2 top-0 right-0 w-[20vw] h-full backdrop-blur-xl border border-white/5 rounded-lg">
          {isOpen}
        </div>
      )}
    </>
  );
};
