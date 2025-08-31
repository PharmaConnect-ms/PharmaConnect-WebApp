'use client';

import React, { useMemo, useRef } from 'react';
import type Quill from 'quill';
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
};

const PrescriptionRichTextEditor: React.FC<Props> = ({
    value,
    onChange,
    className = '',
    placeholder = 'Type prescription details…',
    readOnly = false,
}) => {
    const quillRef = useRef<Quill | null>(null);

    // Seed once on mount; subsequent edits flow via onChange
    const initialHTML = useMemo(() => value || '', [value]);

    return (
        <div className={`bg-white rounded border p-2 ${className}`}>
            <Editor
                ref={quillRef}
                readOnly={readOnly}
                placeholder={placeholder}
                className="min-h-[50vh]"
                defaultHTML={initialHTML}
                onTextChange={({ html }) => {
                    const cleaned = html.replace(/<p><br><\/p>/g, '').trim();
                    onChange(cleaned);
                }}
            />
        </div>
    );
};

export default PrescriptionRichTextEditor;
