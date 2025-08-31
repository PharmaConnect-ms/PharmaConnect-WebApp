'use client';
import React, { useRef, useState } from 'react';
import { FileText, Palette, Save, Download } from 'lucide-react';
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
    const [isSaving, setIsSaving] = useState(false);
    const canvasRef = useRef<CanvasHandle | null>(null);

    const exportPNG = () => {
        const png = canvasRef.current?.getPNG();
        if (!png) return;
        const a = document.createElement('a');
        a.href = png;
        a.download = `prescription-drawing-${Date.now()}.png`;
        a.click();
    };

    const onSave = async () => {
        setIsSaving(true);
        try {
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
        } catch (error) {
            console.error('Error saving prescription:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const hasContent = mode === 'type' ? noteHtml.trim() !== '' : true;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {mode === 'type' ? (
                            <FileText size={24} />
                        ) : (
                            <Palette size={24} />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">
                                {mode === 'type' ? 'Create Text Prescription' : 'Draw Prescription'}
                            </h2>
                            <p className="text-blue-100 text-sm">
                                {mode === 'type' 
                                    ? 'Use rich text editor to write prescription details'
                                    : 'Use drawing tools to create handwritten prescription'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setMode('type')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                                mode === 'type' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                            }`}
                            aria-pressed={mode === 'type'}
                        >
                            <FileText size={16} />
                            Rich Text Editor
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('draw')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                                mode === 'draw' 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                            }`}
                            aria-pressed={mode === 'draw'}
                        >
                            <Palette size={16} />
                            Drawing Canvas
                        </button>
                    </div>
                    
                    {mode === 'draw' && (
                        <button
                            type="button"
                            onClick={exportPNG}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                            title="Export as PNG"
                        >
                            <Download size={16} />
                            Export PNG
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
                {/* TYPE MODE */}
                {mode === 'type' && (
                    <div className="space-y-4">
                        <PrescriptionRichTextEditor
                            value={noteHtml}
                            onChange={setNoteHtml}
                            className="min-h-[60vh]"
                            placeholder="Type prescription details, medication instructions, dosage, and other important information..."
                            showWordCount={true}
                            onSave={(html) => {
                                setNoteHtml(html);
                                console.log('Rich text saved:', html);
                            }}
                        />
                    </div>
                )}

                {/* DRAW MODE */}
                {mode === 'draw' && (
                    <div className="space-y-4">
                        <PrescriptionCanvas ref={canvasRef} className="min-h-[60vh]" />
                    </div>
                )}
            </div>

            {/* Enhanced Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full ${hasContent ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {hasContent ? 'Content ready' : 'No content yet'}
                </div>
                
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors font-medium" 
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!hasContent || isSaving}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Prescription
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPrescriptionModal;
