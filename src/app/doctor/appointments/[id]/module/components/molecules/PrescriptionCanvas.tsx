'use client';
import React, {
  useEffect, useRef, useImperativeHandle, forwardRef, useState
} from 'react';

export type DrawingPayload = {
  type: 'drawing';
  dataUrl: string | null;
};

export type CanvasHandle = {
  getPNG: () => string | null;
  clear: () => void;
  setPenColor: (c: string) => void;
  setPenSize: (n: number) => void;
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

  const [penSize, setPenSize] = useState(initialPenSize);
  const [penColor, setPenColor] = useState(initialPenColor);

  // Expose API to parent
  useImperativeHandle(ref, () => ({
    getPNG: () => canvasRef.current?.toDataURL('image/png') ?? null,
    clear: () => clearCanvas(),
    setPenColor: (c: string) => setPenColor(c),
    setPenSize: (n: number) => setPenSize(n),
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
      ctxRef.current.strokeStyle = penColor;
    }
  }, [penSize, penColor]);

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

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <label className="text-sm">Pen</label>
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
          aria-label="Pen color"
        />
        <input
          type="range"
          min={1}
          max={20}
          value={penSize}
          onChange={(e) => setPenSize(parseInt(e.target.value, 10))}
          aria-label="Pen size"
        />
        <span className="text-sm tabular-nums w-10 text-center">{penSize}px</span>
        <button
          type="button"
          onClick={clearCanvas}
          className="ml-auto px-3 py-1 rounded border"
          title="Clear canvas"
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full min-h-[50vh] border rounded relative touch-none"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </div>
    </div>
  );
});

export default PrescriptionCanvas;
