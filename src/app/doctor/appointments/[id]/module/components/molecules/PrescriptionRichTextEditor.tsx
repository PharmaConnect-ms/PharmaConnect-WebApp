'use client';

import React, { useRef, useState } from 'react';
import type Quill from 'quill';
import { FileText, Save, Eye, EyeOff } from 'lucide-react';
import Editor from './editor';

export type RichTextPayload = {
    type: 'text';
    html: string;
    plain?: string;
};

type Props = {
    value: string;                        
    onChange: (html: string) => void;    
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    onSave?: (html: string) => void;
    showWordCount?: boolean;
};

const PrescriptionRichTextEditor: React.FC<Props> = ({
    value,
    onChange,
    className = '',
    placeholder = 'Type prescription details…',
    readOnly = false,
    onSave,
    showWordCount = true,
}) => {
    const quillRef = useRef<Quill | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Seed once on mount; subsequent edits flow via onChange
    // Capture the initial HTML only once so we don't re-seed the editor
    // when the `value` prop updates from typing (which causes cursor jumps).
    const initialHTMLRef = useRef<string | null>(null);
    if (initialHTMLRef.current === null) {
        initialHTMLRef.current = value || '';
    }
    const initialHTML = initialHTMLRef.current;

    // Fix text direction issues by applying CSS overrides
    React.useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.root;
            
            // Force consistent LTR behavior
            editor.style.direction = 'ltr';
            editor.style.textAlign = 'left';
            editor.style.unicodeBidi = 'embed';
            editor.style.writingMode = 'horizontal-tb';
            editor.setAttribute('dir', 'ltr');
            
            // Add CSS class for additional styling
            editor.classList.add('prescription-editor-ltr');
        }
    });

    // Initialize counts on mount and when value changes
    React.useEffect(() => {
        updateCounts(value);
    }, [value]);

    // Count words and characters
    const updateCounts = (html: string) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        
        setCharCount(text.length);
        setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    };

    const handleTextChange = (html: string) => {
        const cleaned = html.replace(/<p><br><\/p>/g, '').trim();
        onChange(cleaned);
        updateCounts(cleaned);
    };

    const handleSave = () => {
        if (onSave && quillRef.current) {
            const html = quillRef.current.root.innerHTML;
            onSave(html);
        }
    };

    return (
        <div className={`bg-white rounded-lg border shadow-sm ${className}`} style={{ direction: 'ltr', textAlign: 'left' }}>
            {/* Enhanced Toolbar */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Prescription Details</h3>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Preview Toggle */}
                    <button
                        type="button"
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            isPreviewMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border hover:bg-gray-50'
                        }`}
                        title={isPreviewMode ? 'Switch to edit mode' : 'Preview mode'}
                    >
                        {isPreviewMode ? <Eye size={16} /> : <EyeOff size={16} />}
                        {isPreviewMode ? 'Preview' : 'Edit'}
                    </button>

                    {/* Save Button */}
                    {onSave && (
                        <button
                            type="button"
                            onClick={handleSave}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                            title="Save prescription"
                        >
                            <Save size={16} />
                            Save
                        </button>
                    )}
                </div>
            </div>

            {/* Editor Content */}
            <div className="p-4">
                {isPreviewMode ? (
                    <div 
                        className="min-h-[50vh] p-4 bg-gray-50 rounded-md border prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500">No content to preview</p>' }}
                    />
                ) : (
                    <div style={{ direction: 'ltr', textAlign: 'left' }}>
                        <Editor
                            ref={quillRef}
                            readOnly={readOnly}
                            placeholder={placeholder}
                            className="min-h-[50vh] bg-white border rounded-md"
                            defaultHTML={initialHTML}
                            onTextChange={({ html }) => handleTextChange(html)}
                        />
                    </div>
                )}
            </div>

            {/* Footer with Stats */}
            <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 rounded-b-lg text-sm text-gray-600">
                <div className="flex items-center gap-4">
                    {showWordCount && (
                        <>
                            <span>Words: {wordCount}</span>
                            <span>Characters: {charCount}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${readOnly ? 'bg-gray-400' : 'bg-green-400'}`} />
                    <span className="text-xs">{readOnly ? 'Read-only' : 'Editable'}</span>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionRichTextEditor;
