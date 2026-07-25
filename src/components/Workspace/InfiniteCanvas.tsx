import React, { useState, useRef } from 'react';
import type { Screen, FlowConnection, Comment } from '../../types';
import { ScreenRenderer } from '../Screens/ScreenRenderer';
import { 
  Sparkles, GitFork, Code, Copy, Trash2, Move, MousePointer, 
  Square, Edit3, Hand, Image as ImageIcon, Palette, Star, RotateCcw, RotateCw, HelpCircle
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
  comments: _comments,
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
  activeMode: _activeMode,
  onPlayPrototype: _onPlayPrototype,
  isGenerating,
  activeGeneratingScreenId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and Zoom states
  const [zoom, setZoom] = useState<number>(0.55);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 60, y: 60 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Active right tool selection
  const [activeTool, setActiveTool] = useState<'select' | 'frame' | 'edit' | 'hand' | 'image' | 'color' | 'star'>('select');

  // Dragging screen state
  const [draggingScreenId, setDraggingScreenId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing state
  const [resizingScreenId, setResizingScreenId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ width: number; height: number; mouseX: number; mouseY: number }>({
    width: 0, height: 0, mouseX: 0, mouseY: 0
  });

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((prev) => Math.min(Math.max(0.15, prev + zoomDelta), 2.0));
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
    if (isPanning || activeTool === 'hand') {
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

  return (
    <div
      ref={containerRef}
      id="canvas-bg"
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`flex-1 h-full bg-canvas-dots relative overflow-hidden select-none ${
        activeTool === 'hand' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Top Left Floating AI Activity Card (Stitch Style) */}
      <div className="absolute top-4 left-4 z-20 bg-[#1a1b24]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3 w-64">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-white text-black flex items-center justify-center font-bold text-[10px]">
            ••
          </div>
          <span className="text-xs font-semibold text-white">
            {isGenerating ? 'Generating screens...' : 'Prototype created'}
          </span>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-1.5 overflow-x-auto pt-1">
          {screens.map(s => (
            <div key={s.id} className="w-8 h-10 bg-slate-900 border border-white/10 rounded overflow-hidden shrink-0">
              <div className="w-full h-full bg-gradient-to-tr from-violet-600/30 to-cyan-400/20"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Vertical Floating Toolbar (Stitch Style) */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 bg-[#161824]/90 backdrop-blur-xl border border-white/10 rounded-full p-1.5 flex flex-col gap-2 shadow-2xl">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'select' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Select (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('frame')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'frame' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Frame / Screen (F)"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('edit')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'edit' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Pencil Edit"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('hand')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'hand' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Hand Pan (H)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('image')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'image' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Asset Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('color')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'color' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Color System"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('star')}
          className={`p-2.5 rounded-full transition-colors ${
            activeTool === 'star' ? 'bg-white text-black font-bold shadow-md' : 'text-slate-400 hover:text-white'
          }`}
          title="Components & Assets"
        >
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Right Zoom & Controls Bar (Stitch Style) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        <div className="bg-[#141624]/90 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-300 shadow-xl">
          <button onClick={() => setZoom(z => Math.max(0.15, z - 0.05))} className="p-1 hover:text-white">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom(z => Math.min(2.0, z + 0.05))} className="p-1 hover:text-white">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-1">{Math.round(zoom * 100)}%</span>
        </div>

        <button className="w-8 h-8 rounded-full bg-[#141624]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white shadow-xl">
          <HelpCircle className="w-4 h-4" />
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
          {flowConnections.map((conn) => {
            const srcScreen = screens.find((s) => s.id === conn.sourceScreenId);
            const tgtScreen = screens.find((s) => s.id === conn.targetScreenId);

            if (!srcScreen || !tgtScreen) return null;

            const startX = srcScreen.x + srcScreen.width;
            const startY = srcScreen.y + srcScreen.height / 2;
            const endX = tgtScreen.x;
            const endY = tgtScreen.y + tgtScreen.height / 2;

            const controlDist = Math.abs(endX - startX) * 0.5;
            const pathData = `M ${startX} ${startY} C ${startX + controlDist} ${startY}, ${endX - controlDist} ${endY}, ${endX} ${endY}`;

            return (
              <g key={conn.id}>
                <path
                  d={pathData}
                  fill="none"
                  stroke={conn.color || '#8b5cf6'}
                  strokeWidth="2.5"
                  strokeOpacity="0.6"
                  className="flow-line"
                />
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
              {/* Contextual Floating Toolbar (Selected Screen) */}
              {isSelected && (
                <div className="absolute -top-12 left-0 right-0 flex justify-center z-30 pointer-events-auto">
                  <div className="bg-[#141724]/95 backdrop-blur-md border border-violet-500/50 rounded-xl p-1 flex items-center gap-1 shadow-2xl">
                    <button
                      onClick={() => onEditScreenWithAI(screen)}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs flex items-center gap-1 hover:opacity-90"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Edit with AI
                    </button>
                    <button
                      onClick={() => onConnectFlow(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 text-xs flex items-center gap-1"
                    >
                      <GitFork className="w-3.5 h-3.5" /> Flow
                    </button>
                    <button
                      onClick={() => onViewScreenCode(screen)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 text-xs flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" /> Code
                    </button>
                    <button
                      onClick={() => onDuplicateScreen(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteScreen(screen.id)}
                      className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Frame Header Bar */}
              <div
                onMouseDown={(e) => handleScreenMouseDown(e, screen)}
                className="h-8 bg-[#121422] border-b border-white/10 rounded-t-2xl px-3 flex items-center justify-between cursor-move text-xs font-semibold text-slate-300"
              >
                <div className="flex items-center gap-2 truncate">
                  <Move className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{screen.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{screen.width} × {screen.height}</span>
              </div>

              {/* Screen Renderer Component */}
              <div className="flex-1 overflow-hidden bg-[#0a0b10] rounded-b-2xl relative">
                <ScreenRenderer
                  screen={screen}
                  onButtonClick={(tgtType) => {
                    if (onButtonClickInScreen) {
                      onButtonClickInScreen(screen.id, tgtType);
                    }
                  }}
                />
              </div>

              {/* Resize Handle */}
              {isSelected && (
                <div
                  onMouseDown={(e) => handleResizeMouseDown(e, screen)}
                  className="absolute bottom-0 right-0 w-4 h-4 bg-violet-500 rounded-tl-md cursor-se-resize z-30 flex items-center justify-center"
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
