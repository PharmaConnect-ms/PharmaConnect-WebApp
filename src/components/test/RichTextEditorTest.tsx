'use client';
import React, { useState } from 'react';
import PrescriptionRichTextEditor from '../../app/doctor/appointments/[id]/module/components/molecules/PrescriptionRichTextEditor';

const RichTextEditorTest: React.FC = () => {
    const [content, setContent] = useState('<p>Test your typing here to see if the text appears normally (not mirrored)...</p>');

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Rich Text Editor - Mirror Fix Test
            </h1>
            
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Type some text in the editor below</li>
                    <li>Check if the text appears normally (left-to-right)</li>
                    <li>Try different formatting options</li>
                    <li>Switch between edit and preview modes</li>
                </ul>
            </div>

            <PrescriptionRichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Type here to test if the mirrored text issue is fixed..."
                showWordCount={true}
                className="mb-6"
            />

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Current Content (Raw HTML):</h3>
                <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                    {content}
                </pre>
            </div>
        </div>
    );
};

export default RichTextEditorTest;
