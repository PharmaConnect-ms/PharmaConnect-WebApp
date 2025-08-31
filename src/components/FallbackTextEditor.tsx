"use client";

import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, Type, Eye, EyeOff } from 'lucide-react';

interface FallbackTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const FallbackTextEditor: React.FC<FallbackTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Type your prescription here...",
  minHeight = 300
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatText = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `__${selectedText}__`;
          break;
        case 'bullet':
          formattedText = `• ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }
      
      const newValue = 
        textarea.value.substring(0, start) + 
        formattedText + 
        textarea.value.substring(end);
      
      onChange(newValue);
      
      // Reset focus and selection
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + formattedText.length, 
          start + formattedText.length
        );
      }, 0);
    }
  };

  const insertBulletPoint = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeCursor = textarea.value.substring(0, start);
    const afterCursor = textarea.value.substring(start);
    
    // Add bullet point at cursor
    const bulletText = (beforeCursor.endsWith('\n') || beforeCursor === '') ? '• ' : '\n• ';
    const newValue = beforeCursor + bulletText + afterCursor;
    
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + bulletText.length, 
        start + bulletText.length
      );
    }, 0);
  };

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\n/g, '<br />');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Debugging: Log each character as it's typed
    console.log('Input value:', newValue);
    console.log('Character codes:', newValue.split('').map(c => c.charCodeAt(0)));
    
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow normal keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
      }
    }
    
    // Auto bullet point on Enter
    if (e.key === 'Enter') {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const beforeCursor = textarea.value.substring(0, start);
      const currentLine = beforeCursor.split('\n').pop() || '';
      
      if (currentLine.trim().startsWith('•')) {
        e.preventDefault();
        insertBulletPoint();
      }
    }
  };

  const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <button
            type="button"
            onClick={insertBulletPoint}
            className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
            title="Bullet Point"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {wordCount} words
          </span>
          
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors duration-200"
          >
            {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 prose max-w-none"
            style={{ minHeight: `${minHeight}px` }}
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-4 border-0 resize-none focus:outline-none focus:ring-0"
            style={{ 
              minHeight: `${minHeight}px`,
              direction: 'ltr',
              textAlign: 'left',
              unicodeBidi: 'normal',
              writingMode: 'horizontal-tb'
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Use **bold**, *italic*, __underline__ for formatting</span>
        </div>
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4" />
          <span>Plain Text with Markdown</span>
        </div>
      </div>
    </div>
  );
};

export default FallbackTextEditor;
