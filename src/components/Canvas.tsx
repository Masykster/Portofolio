import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import type { BentoItem, Breakpoint } from '../store/useStore';
import { Trash2, Move, User, BarChart3, Activity, Plus, GripVertical } from 'lucide-react';

// Hex to RGBA helper
function hexToRgba(hex: string, alpha: number): string {
  let r = 255, g = 255, b = 255;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Canvas() {
  const {
    // Glass
    blur,
    bgOpacity,
    borderOpacity,
    borderRadius,
    borderWidth,
    borderColor,
    bgColor,
    textColor,
    insetShadowOpacity,
    noiseOverlay,

    // Bg
    bgType,
    bgSolidColor,
    bgGradient,
    bgImage,

    // Grid
    cols,
    gap,
    items,
    selectedItemId,
    breakpoint,
    selectItem,
    removeItem,
    updateItem,
    reorderItems,
    addItem
  } = useStore();

  const gridRef = useRef<HTMLDivElement>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [resizePreview, setResizePreview] = useState<{ colSpan: number; rowSpan: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Resize tracking parameters — store item ID here too (ref is sync, no closure staleness)
  const resizeStartRef = useRef<{
    itemId: string;
    startX: number;
    startY: number;
    startColSpan: number;
    startRowSpan: number;
    colWidth: number;
    rowHeight: number;
    direction: 'width' | 'height' | 'both';
  } | null>(null);

  // Calculate actual columns to render
  const renderCols = breakpoint === 'mobile' ? 1 : breakpoint === 'tablet' ? 2 : cols;
  const rowHeight = 70; // Height per unit row span in px

  // Start resize drag handler
  const handleResizeStart = (e: React.MouseEvent, item: BentoItem, direction: 'width' | 'height' | 'both') => {
    e.preventDefault();
    e.stopPropagation();

    if (!gridRef.current) return;

    selectItem(item.id);

    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = (gridRect.width - (renderCols - 1) * gap) / renderCols;

    resizeStartRef.current = {
      itemId: item.id,
      startX: e.clientX,
      startY: e.clientY,
      startColSpan: item.colSpan,
      startRowSpan: item.rowSpan,
      colWidth,
      rowHeight,
      direction
    };

    setResizingId(item.id);
    setResizePreview({ colSpan: item.colSpan, rowSpan: item.rowSpan });

    // Track last computed spans to avoid redundant state updates
    let lastColSpan = item.colSpan;
    let lastRowSpan = item.rowSpan;

    const onMove = (ev: MouseEvent) => {
      // Cancel any pending rAF to coalesce moves
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const ref = resizeStartRef.current;
        if (!ref) return;

        const deltaX = ev.clientX - ref.startX;
        const deltaY = ev.clientY - ref.startY;

        const colDelta = Math.round(deltaX / (ref.colWidth + gap));
        const rowDelta = Math.round(deltaY / (ref.rowHeight + gap));

        let newCol = ref.startColSpan;
        let newRow = ref.startRowSpan;

        if (ref.direction === 'width' || ref.direction === 'both') {
          newCol = Math.max(1, Math.min(renderCols, ref.startColSpan + colDelta));
        }
        if (ref.direction === 'height' || ref.direction === 'both') {
          newRow = Math.max(1, ref.startRowSpan + rowDelta);
        }

        // Only update if spans actually changed
        if (newCol !== lastColSpan || newRow !== lastRowSpan) {
          lastColSpan = newCol;
          lastRowSpan = newRow;
          updateItem(ref.itemId, { colSpan: newCol, rowSpan: newRow });
          setResizePreview({ colSpan: newCol, rowSpan: newRow });
        }
      });
    };

    const onUp = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setResizingId(null);
      setResizePreview(null);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, item: BentoItem) => {
    setDraggedId(item.id);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const sourceIndex = items.findIndex(item => item.id === draggedId);
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      const newItems = [...items];
      const [draggedItem] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      reorderItems(newItems);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedId(null);
  };

  // Card background styles
  const glassStyle: React.CSSProperties = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: hexToRgba(bgColor, bgOpacity),
    borderColor: hexToRgba(borderColor, borderOpacity),
    borderWidth: `${borderWidth}px`,
    borderRadius: `${borderRadius}px`,
    boxShadow: insetShadowOpacity > 0 
      ? `inset 0 1px 0 0 rgba(255, 255, 255, ${insetShadowOpacity}), 0 4px 30px rgba(0, 0, 0, 0.1)`
      : '0 4px 30px rgba(0, 0, 0, 0.1)',
  };

  // Preview container background
  const containerStyle: React.CSSProperties = {
    background: bgType === 'solid' 
      ? bgSolidColor 
      : bgType === 'gradient' 
      ? bgGradient 
      : `url(${bgImage}) center/cover no-repeat`
  };

  // Width classes matching active breakpoint
  const getBreakpointWidth = (bp: Breakpoint) => {
    switch (bp) {
      case 'mobile':
        return 'max-w-[360px] w-full border-2 border-dashed border-gray-700/80';
      case 'tablet':
        return 'max-w-[680px] w-full border-2 border-dashed border-gray-700/80';
      case 'desktop':
      default:
        return 'w-full max-w-[1000px]';
    }
  };

  // Content preview renderer
  const renderItemContent = (type: string, title: string) => {
    const isDark = textColor === 'dark';
    const fillClass = isDark ? 'text-gray-800' : 'text-white/80';
    const subtextClass = isDark ? 'text-gray-600' : 'text-white/50';

    switch (type) {
      case 'profile':
        return (
          <div className="h-full flex flex-col justify-between p-3 select-none">
            <div className="flex items-center space-x-2.5">
              <div className={`p-1.5 rounded-lg ${isDark ? 'bg-gray-800/10' : 'bg-white/10'}`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-2xs font-bold leading-none">{title}</h4>
                <span className={`text-3xs ${subtextClass} font-medium mt-0.5 block`}>Lead Designer</span>
              </div>
            </div>
            <div className={`text-2xs ${subtextClass} leading-snug font-medium mt-2`}>
              Specialized in crafting premium glassmorphism layouts and responsive bento grid components.
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="h-full flex flex-col justify-between p-3 select-none">
            <div className="flex justify-between items-start">
              <span className={`text-3xs ${subtextClass} font-bold uppercase tracking-wider`}>Activity</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs font-extrabold block tracking-tight">4,821 hrs</span>
              <span className={`text-3xs ${subtextClass} font-semibold`}>System uptime</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Activity className="w-3.5 h-3.5 text-green-400" />
              <span className="text-3xs font-bold text-green-400">99.9% health</span>
            </div>
          </div>
        );
      case 'socials':
        return (
          <div className="h-full flex flex-col justify-between p-3 select-none">
            <div className="space-y-1">
              <span className={`text-3xs ${subtextClass} font-bold uppercase tracking-wider`}>Subscribers</span>
              <h4 className="text-sm font-extrabold leading-none tracking-tight">124.9k</h4>
            </div>
            <div className="space-y-1">
              <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-gray-800/15' : 'bg-white/15'} overflow-hidden`}>
                <div className="bg-indigo-500 h-full w-[78%] rounded-full"></div>
              </div>
              <div className="flex justify-between text-3xs font-semibold">
                <span className={subtextClass}>Goal: 150k</span>
                <span className="text-indigo-400">78%</span>
              </div>
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className="h-full flex flex-col justify-between p-3 select-none">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-3xs ${subtextClass} font-bold uppercase tracking-wider block`}>Monthly Views</span>
                <h4 className="text-xs font-bold leading-none mt-0.5">{title}</h4>
              </div>
              <BarChart3 className="w-4 h-4 text-indigo-400 opacity-80" />
            </div>
            {/* Fake SVG Chart */}
            <div className="flex items-end space-x-1.5 h-10 mt-2">
              {[30, 45, 25, 60, 40, 75, 50, 90, 65, 80].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    i === 7 
                      ? 'bg-indigo-500 shadow-md shadow-indigo-500/35' 
                      : isDark 
                      ? 'bg-gray-800/30' 
                      : 'bg-white/20'
                  }`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'actions':
        return (
          <div className="h-full flex flex-col justify-between p-3 select-none">
            <span className={`text-3xs ${subtextClass} font-bold uppercase tracking-wider`}>Integrations</span>
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {['Vite', 'Astro', 'NextJS'].map((item) => (
                <div 
                  key={item} 
                  className={`py-1 text-center rounded-md text-3xs font-bold border ${
                    isDark 
                      ? 'bg-gray-800/5 border-gray-800/15 text-gray-700' 
                      : 'bg-white/5 border-white/10 text-white/90'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      case 'text':
      default:
        return (
          <div className="h-full p-3 flex flex-col justify-between select-none">
            <div>
              <span className={`text-3xs ${subtextClass} font-bold uppercase tracking-wider block`}>General Card</span>
              <h4 className="text-xs font-bold leading-tight mt-1">{title}</h4>
            </div>
            <div className={`text-3xs ${subtextClass} leading-normal font-medium mt-1`}>
              Simple card element customizable to fit any bento layout.
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative rounded-2xl transition-all duration-300 p-8 flex items-center justify-center min-h-[500px] shadow-2xl ${getBreakpointWidth(breakpoint)}`}
      style={containerStyle}
    >
      {/* Optional Mesh Gradient blobs */}
      {bgType === 'gradient' && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="mesh-blob mesh-blob-1"></div>
          <div className="mesh-blob mesh-blob-2"></div>
          <div className="mesh-blob mesh-blob-3"></div>
        </div>
      )}

      {/* Grid Canvas */}
      <div 
        ref={gridRef}
        className={`w-full relative z-10 ${resizingId ? 'is-resizing' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${renderCols}, minmax(0, 1fr))`,
          gridAutoRows: `${rowHeight}px`,
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => {
          // Adjust span based on current active columns
          const actualColSpan = Math.min(item.colSpan, renderCols);
          const isSelected = selectedItemId === item.id;
          const isDragged = item.id === draggedId;

          if (isDragged) {
            return (
              <div
                key={item.id}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                style={{
                  gridColumn: `span ${actualColSpan}`,
                  gridRow: `span ${item.rowSpan}`,
                  borderRadius: `${borderRadius}px`,
                  borderWidth: '2px',
                  borderStyle: 'dashed',
                  borderColor: 'rgba(99, 102, 241, 0.55)',
                  backgroundColor: 'rgba(99, 102, 241, 0.04)',
                  backdropFilter: 'blur(2px)',
                  height: '100%',
                }}
                className="relative flex flex-col items-center justify-center p-4 rounded-2xl select-none transition-all duration-200"
              >
                <div className="p-2 rounded-full border border-dashed border-indigo-400/40 bg-indigo-500/10 mb-1 pointer-events-none">
                  <Move className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <span className="text-3xs font-extrabold uppercase tracking-wider text-indigo-300 pointer-events-none">
                  Place Here
                </span>
                <span className="text-4xs text-indigo-300/50 font-semibold mt-0.5 truncate max-w-[90%] pointer-events-none">
                  {item.title}
                </span>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              onClick={() => selectItem(item.id)}
              draggable={resizingId === null}
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              style={{
                gridColumn: `span ${actualColSpan}`,
                gridRow: `span ${item.rowSpan}`,
                ...glassStyle,
              }}
              className={`glass-panel border group cursor-pointer relative flex flex-col justify-between ${
                textColor === 'light' ? 'text-white' : 'text-gray-950'
              } ${
                isSelected 
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-950 scale-[0.99] z-20' 
                  : 'hover:scale-[1.01] hover:border-white/30 z-10'
              }`}
            >
              {/* Optional Noise filter overlay */}
              {noiseOverlay && <div className="noise-overlay"></div>}

              {/* Drag Handle indicator */}
              {resizingId === null && (
                <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-60 transition-opacity flex items-center space-x-1 cursor-grab active:cursor-grabbing text-current z-30">
                  <GripVertical className="w-3 h-3" />
                </div>
              )}

              {/* Card content rendering */}
              <div className="flex-1 overflow-hidden">
                {renderItemContent(item.content, item.title)}
              </div>

              {/* Selection / Editing Overlay */}
              {isSelected && (
                <div className="absolute top-1 right-1 flex items-center space-x-1 bg-gray-950/70 backdrop-blur-md rounded-md p-1 border border-white/10 z-30 opacity-100 transition-opacity">
                  {/* Select Content Template */}
                  <select
                    value={item.content}
                    onChange={(e) => updateItem(item.id, { content: e.target.value })}
                    className="text-3xs bg-transparent border-0 font-bold focus:outline-none focus:ring-0 cursor-pointer text-gray-300 pr-4 py-0"
                  >
                    <option value="text" className="bg-gray-950 text-gray-300">Text Layout</option>
                    <option value="profile" className="bg-gray-950 text-gray-300">Profile</option>
                    <option value="activity" className="bg-gray-950 text-gray-300">Activity</option>
                    <option value="socials" className="bg-gray-950 text-gray-300">Socials</option>
                    <option value="chart" className="bg-gray-950 text-gray-300">Chart</option>
                    <option value="actions" className="bg-gray-950 text-gray-300">Actions</option>
                  </select>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-0.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Title edit overlay on card double click / select */}
              {isSelected && (
                <div className="absolute bottom-1 left-1 bg-gray-950/80 backdrop-blur-md border border-white/10 rounded px-1.5 py-0.5 flex items-center z-30">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    className="bg-transparent border-0 p-0 text-3xs font-semibold focus:outline-none focus:ring-0 text-gray-200 w-24"
                    placeholder="Edit label"
                  />
                </div>
              )}

              {/* Live size badge during resize */}
              {resizingId === item.id && resizePreview && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg z-50 pointer-events-none border border-indigo-400/40 shadow-lg shadow-indigo-500/20">
                  {resizePreview.colSpan} × {resizePreview.rowSpan}
                </div>
              )}

              {/* Resize Handles */}
              {breakpoint === 'desktop' && (
                <>
                  {/* Right Edge (Col Span only) */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item, 'width')}
                    className="absolute top-0 right-0 bottom-3 w-1.5 cursor-e-resize opacity-0 group-hover:opacity-100 hover:bg-indigo-500/30 transition-all duration-200 z-30 flex items-center justify-center"
                    title="Drag left/right to change Column Span"
                  >
                    <div className="w-[2px] h-4 bg-indigo-400 rounded-full"></div>
                  </div>

                  {/* Bottom Edge (Row Span only) */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item, 'height')}
                    className="absolute bottom-0 left-0 right-3 h-1.5 cursor-s-resize opacity-0 group-hover:opacity-100 hover:bg-indigo-500/30 transition-all duration-200 z-30 flex items-center justify-center"
                    title="Drag up/down to change Row Span"
                  >
                    <div className="h-[2px] w-4 bg-indigo-400 rounded-full"></div>
                  </div>

                  {/* Bottom-Right Corner (Both) */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, item, 'both')}
                    className="absolute bottom-1 right-1 w-3.5 h-3.5 cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40 bg-indigo-500/85 hover:bg-indigo-600 rounded-[4px] border border-white/20 shadow-sm"
                    title="Drag to change both Column and Row Span"
                  >
                    <Move className="w-2 h-2 text-white" />
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Ghost Add Card Slot at the end */}
        <button
          onClick={addItem}
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            borderRadius: `${borderRadius}px`,
            borderWidth: `${borderWidth}px`,
            borderStyle: 'dashed',
            borderColor: 'rgba(99, 102, 241, 0.4)',
            backgroundColor: 'rgba(99, 102, 241, 0.03)',
            height: '100%',
            minHeight: '140px'
          }}
          className="hover:border-indigo-500 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col items-center justify-center transition-all duration-300 group cursor-pointer"
        >
          <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-3xs text-indigo-300 font-bold uppercase tracking-wider mt-1.5">Add Card</span>
        </button>
      </div>
    </div>
  );
}
