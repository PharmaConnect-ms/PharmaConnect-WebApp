'use client';
import React, { useRef, useState } from 'react';
import PrescriptionCanvas, {
    CanvasHandle, DrawingPayload
} from '../molecules/PrescriptionCanvas';
import PrescriptionRichTextEditor, {
    RichTextPayload
} from '../molecules/PrescriptionRichTextEditor';

type Mode = 'type' | 'draw';

type Props = {
    onClose?: () => void;
    onSavePrescription?: (payload: RichTextPayload | DrawingPayload) => Promise<void> | void;
};

const AddPrescriptionModal: React.FC<Props> = ({ onClose, onSavePrescription }) => {
    const [mode, setMode] = useState<Mode>('draw');
    const [noteHtml, setNoteHtml] = useState<string>('');
    const canvasRef = useRef<CanvasHandle | null>(null);

    const exportPNG = () => {
        const png = canvasRef.current?.getPNG();
        if (!png) return;
        const a = document.createElement('a');
        a.href = png;
        a.download = `drawing-${Date.now()}.png`;
        a.click();
    };

    const onSave = async () => {
        if (mode === 'type') {
            const tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = noteHtml || '';
            const plain = tmpDiv.textContent || tmpDiv.innerText || '';

            const payload: RichTextPayload = {
                type: 'text',
                html: (noteHtml || '').trim(),
                plain: plain.trim(),
            };
            console.log('Save payload:', payload);
            await onSavePrescription?.(payload);
        } else {
            const png = canvasRef.current?.getPNG() ?? null;
            const payload: DrawingPayload = { type: 'drawing', dataUrl: png };
            console.log('Save payload:', payload);
            await onSavePrescription?.(payload);
        }
        onClose?.();
    };

    return (
        <div className="p-4 m-4 space-y-4 max-h-full">
            {/* Mode Toggle */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setMode('type')}
                    className={`px-3 py-1 rounded border ${mode === 'type' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    aria-pressed={mode === 'type'}
                >
                    Type
                </button>
                <button
                    type="button"
                    onClick={() => setMode('draw')}
                    className={`px-3 py-1 rounded border ${mode === 'draw' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                    aria-pressed={mode === 'draw'}
                >
                    Draw
                </button>
                {mode === 'draw' && (
                    <button
                        type="button"
                        onClick={exportPNG}
                        className="ml-auto px-3 py-1 rounded border"
                        title="Export PNG"
                    >
                        Export PNG
                    </button>
                )}
            </div>

            {/* TYPE MODE */}
            {mode === 'type' && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Prescription Notes (Rich Text)
                    </label>
                    <PrescriptionRichTextEditor
                        value={noteHtml}
                        onChange={setNoteHtml}
                        className="min-h-[50vh]"
                        placeholder="Type prescription details…"
                    />
                </div>
            )}

            {/* DRAW MODE */}
            {mode === 'draw' && (
                <PrescriptionCanvas ref={canvasRef} />
            )}

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>
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
