import React, { useState, useRef } from 'react';
import type { Screen, FlowConnection, Comment } from '../../types';
import { ScreenRenderer } from '../Screens/ScreenRenderer';
import { 
  ZoomIn, ZoomOut, Maximize2, Play, MessageSquare, 
  Sparkles, GitFork, Code, Copy, Trash2, Move
} from 'lucide-react';

interface InfiniteCanvasProps {
  screens: Screen[];
  flowConnections: FlowConnection[];
  comments: Comment[];
  selectedScreenId: string | null;
  onSelectScreen: (screenId: string | null) => void;
  onMoveScreen: (screenId: string, x: number, y: number) => void;
  onResizeScreen: (screenId: string, width: number, height: number) => void;
  onButtonClickInScreen?: (sourceScreenId: string, targetScreenType?: string) => void;
  onDuplicateScreen: (screenId: string) => void;
  onDeleteScreen: (screenId: string) => void;
  onEditScreenWithAI: (screen: Screen) => void;
  onViewScreenCode: (screen: Screen) => void;
  onConnectFlow: (sourceScreenId: string) => void;
  activeMode: 'design' | 'prototype' | 'tokens';
  onPlayPrototype: () => void;
  isGenerating: boolean;
  activeGeneratingScreenId?: string | null;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({
  screens,
  flowConnections,
  comments,
  selectedScreenId,
  onSelectScreen,
  onMoveScreen,
  onResizeScreen,
  onButtonClickInScreen,
  onDuplicateScreen,
  onDeleteScreen,
  onEditScreenWithAI,
  onViewScreenCode,
  onConnectFlow,
  activeMode,
  onPlayPrototype,
  isGenerating,
  activeGeneratingScreenId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom states
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 40 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Dragging screen state
  const [draggingScreenId, setDraggingScreenId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing state
  const [resizingScreenId, setResizingScreenId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ width: number; height: number; mouseX: number; mouseY: number }>({
    width: 0, height: 0, mouseX: 0, mouseY: 0
  });

  // Comments overlay toggle
  const [showComments, setShowComments] = useState<boolean>(true);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((prev) => Math.min(Math.max(0.3, prev + zoomDelta), 2.0));
    } else {
      setPan((prev) => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8
      }));
    }
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-bg')) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectScreen(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    } else if (draggingScreenId) {
      const newX = Math.round((e.clientX - pan.x - dragOffset.x) / zoom);
      const newY = Math.round((e.clientY - pan.y - dragOffset.y) / zoom);
      onMoveScreen(draggingScreenId, Math.max(0, newX), Math.max(0, newY));
    } else if (resizingScreenId) {
      const deltaX = (e.clientX - resizeStart.mouseX) / zoom;
      const deltaY = (e.clientY - resizeStart.mouseY) / zoom;
      const newW = Math.max(300, Math.round(resizeStart.width + deltaX));
      const newH = Math.max(300, Math.round(resizeStart.height + deltaY));
      onResizeScreen(resizingScreenId, newW, newH);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingScreenId(null);
    setResizingScreenId(null);
  };

  // Drag Screen Header
  const handleScreenMouseDown = (e: React.MouseEvent, screen: Screen) => {
    e.stopPropagation();
    onSelectScreen(screen.id);
    setDraggingScreenId(screen.id);
    const screenScaledX = screen.x * zoom + pan.x;
    const screenScaledY = screen.y * zoom + pan.y;
    setDragOffset({
      x: e.clientX - screenScaledX,
      y: e.clientY - screenScaledY
    });
  };

  // Resize Handle Mouse Down
  const handleResizeMouseDown = (e: React.MouseEvent, screen: Screen) => {
    e.stopPropagation();
    setResizingScreenId(screen.id);
    setResizeStart({
      width: screen.width,
      height: screen.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  // Center fit view
  const fitToScreen = () => {
    setZoom(0.75);
    setPan({ x: 60, y: 60 });
  };

  return (
    <div
      ref={containerRef}
      id="canvas-bg"
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex-1 h-full bg-canvas-dots relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Floating Canvas Toolbar */}
      <div className="absolute top-4 right-4 z-20 bg-[#121420]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 shadow-xl">
        <button
          onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <span className="text-xs font-mono font-semibold text-slate-300 px-2 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-800 my-auto mx-1"></div>

        <button
          onClick={fitToScreen}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowComments((prev) => !prev)}
          className={`p-2 rounded-xl transition-colors ${
            showComments ? 'bg-violet-600/30 text-violet-400 border border-violet-500/30' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Comments"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-800 my-auto mx-1"></div>

        <button
          onClick={onPlayPrototype}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 hover:opacity-90 flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Preview</span>
        </button>
      </div>

      {/* Canvas Transform Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isPanning || draggingScreenId || resizingScreenId ? 'none' : 'transform 0.15s ease-out'
        }}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {/* SVG Flow Connections Overlay */}
        <svg className="absolute top-0 left-0 w-[5000px] h-[5000px] pointer-events-none z-10 overflow-visible">
          <defs>
            <marker
              id="arrowhead-violet"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
            </marker>
            <marker
              id="arrowhead-cyan"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
            </marker>
          </defs>

          {flowConnections.map((conn) => {
            const srcScreen = screens.find((s) => s.id === conn.sourceScreenId);
            const tgtScreen = screens.find((s) => s.id === conn.targetScreenId);

            if (!srcScreen || !tgtScreen) return null;

            // Compute connection points
            const startX = srcScreen.x + srcScreen.width;
            const startY = srcScreen.y + srcScreen.height / 2;
            const endX = tgtScreen.x;
            const endY = tgtScreen.y + tgtScreen.height / 2;

            const controlDist = Math.abs(endX - startX) * 0.5;
            const pathData = `M ${startX} ${startY} C ${startX + controlDist} ${startY}, ${endX - controlDist} ${endY}, ${endX} ${endY}`;

            const isPrototypeMode = activeMode === 'prototype';

            return (
              <g key={conn.id}>
                {/* Glow backdrop line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={conn.color || '#8b5cf6'}
                  strokeWidth={isPrototypeMode ? "4" : "2.5"}
                  strokeOpacity={isPrototypeMode ? "0.9" : "0.5"}
                  markerEnd="url(#arrowhead-violet)"
                  className={isPrototypeMode ? "flow-line" : ""}
                />
                {/* Connection Label Pill */}
                <foreignObject
                  x={(startX + endX) / 2 - 60}
                  y={(startY + endY) / 2 - 14}
                  width="120"
                  height="28"
                  className="overflow-visible"
                >
                  <div className="bg-[#121424] border border-violet-500/40 text-violet-300 text-[10px] font-semibold px-2 py-1 rounded-full shadow-lg text-center truncate">
                    {conn.sourceLabel} ➔
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* UI Screens on Canvas */}
        {screens.map((screen) => {
          const isSelected = selectedScreenId === screen.id;
          const isGeneratingThis = isGenerating && activeGeneratingScreenId === screen.id;

          return (
            <div
              key={screen.id}
              style={{
                left: `${screen.x}px`,
                top: `${screen.y}px`,
                width: `${screen.width}px`,
                height: `${screen.height}px`
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectScreen(screen.id);
              }}
              className={`absolute pointer-events-auto flex flex-col rounded-2xl transition-shadow ${
                isSelected
                  ? 'ring-2 ring-violet-500 glow-violet z-20'
                  : 'hover:ring-1 hover:ring-slate-700 z-10'
              } ${isGeneratingThis ? 'animate-ai-pulse ring-2 ring-cyan-400' : ''}`}
            >
              {/* Contextual Floating Toolbar (Only on Selected Screen) */}
              {isSelected && (
                <div className="absolute -top-12 left-0 right-0 flex justify-center z-30 pointer-events-auto">
                  <div className="bg-[#141724]/95 backdrop-blur-md border border-violet-500/50 rounded-xl p-1 flex items-center gap-1 shadow-2xl">
                    <button
                      onClick={() => onEditScreenWithAI(screen)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs flex items-center gap-1 hover:opacity-90"
                      title="Ask AI to revise this screen"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Edit with AI
                    </button>

                    <button
                      onClick={() => onConnectFlow(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 hover:bg-slate-800 text-xs flex items-center gap-1"
                      title="Connect flow path"
                    >
                      <GitFork className="w-3.5 h-3.5" /> Flow
                    </button>

                    <button
                      onClick={() => onViewScreenCode(screen)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1"
                      title="Inspect React + Tailwind Code"
                    >
                      <Code className="w-3.5 h-3.5" /> Code
                    </button>

                    <button
                      onClick={() => onDuplicateScreen(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800"
                      title="Duplicate screen"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteScreen(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:bg-red-950/40"
                      title="Delete screen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Frame Header Bar (Draggable) */}
              <div
                onMouseDown={(e) => handleScreenMouseDown(e, screen)}
                className="h-9 bg-[#121422] border-b border-slate-800/90 rounded-t-2xl px-3 flex items-center justify-between cursor-move text-xs font-semibold text-slate-300"
              >
                <div className="flex items-center gap-2 truncate">
                  <Move className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{screen.title}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-normal uppercase">
                    {screen.device}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  {screen.width} × {screen.height}
                </div>
              </div>

              {/* Live Rendered Screen Component */}
              <div className="flex-1 overflow-hidden bg-[#0a0b10] rounded-b-2xl relative">
                <ScreenRenderer
                  screen={screen}
                  onButtonClick={(tgtType) => {
                    if (onButtonClickInScreen) {
                      onButtonClickInScreen(screen.id, tgtType);
                    }
                  }}
                />

                {/* Comment Pins Overlay */}
                {showComments && comments.filter(c => c.screenId === screen.id).map(comment => (
                  <div 
                    key={comment.id} 
                    style={{ left: `${comment.x}px`, top: `${comment.y}px` }} 
                    className="absolute z-20 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-violet-600 border-2 border-white shadow-lg flex items-center justify-center font-bold text-[10px] text-white cursor-pointer transform hover:scale-110 transition-transform">
                      💬
                    </div>
                    <div className="hidden group-hover:block absolute left-7 top-0 w-52 bg-[#121424] border border-violet-500/40 p-2.5 rounded-xl shadow-2xl text-xs z-30">
                      <div className="font-semibold text-white">{comment.author}</div>
                      <p className="text-slate-300 text-[11px] mt-1">{comment.text}</p>
                      <span className="text-[9px] text-slate-500 mt-1 block">{comment.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resize Handle (Bottom-Right Corner) */}
              {isSelected && (
                <div
                  onMouseDown={(e) => handleResizeMouseDown(e, screen)}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-violet-500 rounded-tl-md cursor-se-resize z-30 flex items-center justify-center"
                  title="Drag to resize screen"
                >
                  <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
