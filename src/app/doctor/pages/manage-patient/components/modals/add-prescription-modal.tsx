import React, { useEffect, useRef, useState } from "react";
// import { useManagePatient } from "../../useManagePatient";

type Mode = "type" | "draw";

const AddPrescriptionModal: React.FC = () => {
  // const { savePrescription } = useManagePatient();
  const [mode, setMode] = useState<Mode>("type");
  const [note, setNote] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const [penSize, setPenSize] = useState(3);
  const [penColor, setPenColor] = useState("#111827"); // gray-900

  // Size canvas to container (once and on resize)
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      // Save current drawing, resize, then restore so we don’t wipe the canvas
      const prev = document.createElement("canvas");
      prev.width = canvas.width;
      prev.height = canvas.height;
      const prevCtx = prev.getContext("2d");
      if (prevCtx) prevCtx.drawImage(canvas, 0, 0);

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctxRef.current = ctx;
        // restore previous drawing
        ctx.drawImage(prev, 0, 0, prev.width / dpr, prev.height / dpr);
      }
    };

    resize();
    const obs = new ResizeObserver(resize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [penSize, penColor, mode]);

  // Update pen settings live
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = penSize;
      ctxRef.current.strokeStyle = penColor;
    }
  }, [penSize, penColor]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e && e.touches[0]) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    } else if ("clientX" in e) {
      const me = e as React.MouseEvent;
      return { x: me.clientX - rect.left, y: me.clientY - rect.top };
    }
    return { x: 0, y: 0 };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== "draw") return;
    e.preventDefault();
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current || mode !== "draw") return;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    // Example: download right away
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `drawing-${Date.now()}.png`;
    a.click();
  };

  const onSave = async () => {
    // Gather payload based on mode
    if (mode === "type") {
      const payload = { type: "text", content: note.trim() };
      console.log("Save payload:", payload);
      // await savePrescription(payload);
    } else {
      const canvas = canvasRef.current;
      const png = canvas?.toDataURL("image/png");
      const payload = { type: "drawing", dataUrl: png };
      console.log("Save payload:", payload);
      // await savePrescription(payload);
    }
    // Close modal, toast, etc.
  };

  return (
    <div className="p-4 space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("type")}
          className={`px-3 py-1 rounded border ${
            mode === "type" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          aria-pressed={mode === "type"}
        >
          Type
        </button>
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={`px-3 py-1 rounded border ${
            mode === "draw" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          aria-pressed={mode === "draw"}
        >
          Draw
        </button>
      </div>

      {/* TYPE MODE */}
      {mode === "type" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Prescription Notes</label>
          <textarea
            className="w-full min-h-[50vh] rounded border p-3 outline-none focus:ring"
            placeholder="Type prescription details..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      {/* DRAW MODE */}
      {mode === "draw" && (
        <div className="space-y-3">
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
            <button
              type="button"
              onClick={exportPNG}
              className="px-3 py-1 rounded border"
              title="Export PNG"
            >
              Export PNG
            </button>
          </div>

          {/* Canvas container — half viewport height */}
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
      )}

      {/* Footer actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="px-4 py-2 rounded border">
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
