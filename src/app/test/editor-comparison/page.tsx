"use client";

import React, { useState } from 'react';
import Editor from '../../doctor/appointments/[id]/module/components/molecules/editor';
import FallbackTextEditor from '../../../components/FallbackTextEditor';

export default function EditorComparisonPage() {
  const [quillContent, setQuillContent] = useState('');
  const [fallbackContent, setFallbackContent] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Text Editor Comparison Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quill Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quill Rich Text Editor
            </h2>
            <div className="mb-4">
              <Editor
                defaultHTML={quillContent}
                onTextChange={({ html }) => setQuillContent(html)}
                placeholder="Type in the Quill editor..."
              />
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Raw Content:</h3>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                {quillContent}
              </pre>
            </div>
          </div>

          {/* Fallback Editor */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Fallback Text Editor
            </h2>
            <div className="mb-4">
              <FallbackTextEditor
                value={fallbackContent}
                onChange={setFallbackContent}
                placeholder="Type in the fallback editor..."
              />
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Raw Content:</h3>
              <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                {fallbackContent}
              </pre>
            </div>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Testing Instructions</h3>
          <div className="space-y-2 text-blue-800">
            <p><strong>1.</strong> Type &quot;abc&quot; in both editors</p>
            <p><strong>2.</strong> Check if the text appears correctly (not reversed as &quot;cba&quot;)</p>
            <p><strong>3.</strong> Try typing numbers: &quot;123&quot;</p>
            <p><strong>4.</strong> Try typing special characters: &quot;!@#&quot;</p>
            <p><strong>5.</strong> Compare the raw content shown below each editor</p>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Character Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Quill Content Length:</strong> {quillContent.length}</p>
                <p><strong>Character Codes:</strong> {quillContent.split('').map(c => c.charCodeAt(0)).join(', ')}</p>
              </div>
              <div>
                <p><strong>Fallback Content Length:</strong> {fallbackContent.length}</p>
                <p><strong>Character Codes:</strong> {fallbackContent.split('').map(c => c.charCodeAt(0)).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
