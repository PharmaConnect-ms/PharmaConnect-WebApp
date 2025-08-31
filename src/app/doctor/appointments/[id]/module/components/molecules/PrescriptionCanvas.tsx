'use client';
import React, {
  useEffect, useRef, useImperativeHandle, forwardRef, useState
} from 'react';
import { Palette, Brush, Eraser, Download, RotateCcw } from 'lucide-react';

export type DrawingPayload = {
  type: 'drawing';
  dataUrl: string | null;
};

export type CanvasHandle = {
  getPNG: () => string | null;
  clear: () => void;
  setPenColor: (c: string) => void;
  setPenSize: (n: number) => void;
  undo: () => void;
  downloadCanvas: () => void;
};

type Props = {
  initialPenSize?: number;
  initialPenColor?: string;
  className?: string;
};

const PrescriptionCanvas = forwardRef<CanvasHandle, Props>(function Canvas(
  { initialPenSize = 3, initialPenColor = '#111827', className = '' },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const undoStackRef = useRef<ImageData[]>([]);

  const [penSize, setPenSize] = useState(initialPenSize);
  const [penColor, setPenColor] = useState(initialPenColor);
  const [isErasing, setIsErasing] = useState(false);

  // Save canvas state for undo functionality
  const saveState = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(imageData);
      if (undoStackRef.current.length > 10) {
        undoStackRef.current.shift(); // Keep only last 10 states
      }
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `prescription-drawing-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const undoLastAction = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx && undoStackRef.current.length > 0) {
      const lastState = undoStackRef.current.pop();
      if (lastState) {
        ctx.putImageData(lastState, 0, 0);
      }
    }
  };

  // Expose API to parent
  useImperativeHandle(ref, () => ({
    getPNG: () => canvasRef.current?.toDataURL('image/png') ?? null,
    clear: () => clearCanvas(),
    setPenColor: (c: string) => setPenColor(c),
    setPenSize: (n: number) => setPenSize(n),
    undo: () => undoLastAction(),
    downloadCanvas: () => downloadCanvas(),
  }));

  // Size canvas to container (retain drawing on resize)
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();

      // preserve
      const prev = document.createElement('canvas');
      prev.width = canvas.width;
      prev.height = canvas.height;
      const prevCtx = prev.getContext('2d');
      if (prevCtx) prevCtx.drawImage(canvas, 0, 0);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctxRef.current = ctx;
        // restore scaled
        ctx.drawImage(prev, 0, 0, prev.width / dpr, prev.height / dpr);
      }
    };

    resize();
    const obs = new ResizeObserver(resize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [penSize, penColor]);

  // live pen settings
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = penSize;
      ctxRef.current.strokeStyle = isErasing ? '#FFFFFF' : penColor;
      ctxRef.current.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
    }
  }, [penSize, penColor, isErasing]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches[0]) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    } else if ('clientX' in e) {
      const me = e as React.MouseEvent;
      return { x: me.clientX - rect.left, y: me.clientY - rect.top };
    }
    return { x: 0, y: 0 };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    saveState(); // Save state before starting new drawing
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
    ctxRef.current?.stroke();
  };

  const endDraw = (e?: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e?.preventDefault();
    drawingRef.current = false;
    ctxRef.current?.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      // clear in CSS pixel space; convert to device pixel via scale
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const predefinedColors = [
    '#000000', '#1F2937', '#DC2626', '#EA580C', 
    '#D97706', '#65A30D', '#059669', '#0891B2',
    '#3B82F6', '#7C3AED', '#C026D3', '#E11D48'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Enhanced Toolbar */}
      <div className="bg-gray-50 rounded-lg p-4 border shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Drawing Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsErasing(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                !isErasing 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
              title="Draw mode"
            >
              <Brush size={16} />
              <span className="text-sm font-medium">Draw</span>
            </button>
            <button
              type="button"
              onClick={() => setIsErasing(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                isErasing 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
              title="Erase mode"
            >
              <Eraser size={16} />
              <span className="text-sm font-medium">Erase</span>
            </button>
          </div>

          {/* Color Selection */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Color:</span>
            </div>
            
            {/* Predefined Colors */}
            <div className="flex gap-1">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setPenColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                    penColor === color ? 'border-gray-800 shadow-md' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={`Select ${color}`}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                title="Custom color picker"
                aria-label="Custom color picker"
              />
            </div>
          </div>

          {/* Pen Size */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Size:</span>
            <input
              type="range"
              min={1}
              max={20}
              value={penSize}
              onChange={(e) => setPenSize(parseInt(e.target.value, 10))}
              className="w-24 accent-blue-600"
              aria-label="Pen size"
            />
            <span className="text-sm font-mono text-gray-600 w-10 text-center bg-white px-2 py-1 rounded border">
              {penSize}px
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={undoLastAction}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 transition-colors"
              title="Undo last action"
              disabled={undoStackRef.current.length === 0}
            >
              <RotateCcw size={16} />
              Undo
            </button>
            
            <button
              type="button"
              onClick={downloadCanvas}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 transition-colors"
              title="Download drawing"
            >
              <Download size={16} />
              Download
            </button>
            
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
              title="Clear canvas"
            >
              <RotateCcw size={16} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Canvas */}
      <div
        ref={containerRef}
        className="w-full min-h-[50vh] bg-white border-2 border-dashed border-gray-300 rounded-lg relative touch-none shadow-inner overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${
            isErasing ? 'cursor-crosshair' : 'cursor-crosshair'
          } transition-all`}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        
        {/* Canvas Overlay for Empty State */}
        {!ctxRef.current && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <Brush size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start drawing your prescription</p>
              <p className="text-xs mt-1">Use the toolbar above to customize your pen</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PrescriptionCanvas;
