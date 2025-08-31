'use client';
import React, { useState } from 'react';

const SimpleTextTest: React.FC = () => {
    const [value, setValue] = useState('');

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Simple Text Input Test
            </h1>
            
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Test different input methods:</h2>
            </div>

            <div className="space-y-6">
                {/* Regular input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Regular Input Field:</label>
                    <input 
                        type="text" 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Type 'abc' and see if it shows 'abc' or 'cba'"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                    />
                </div>

                {/* Textarea */}
                <div>
                    <label className="block text-sm font-medium mb-2">Textarea:</label>
                    <textarea 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-3 border rounded-lg h-20"
                        placeholder="Type 'abc' here too"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                    />
                </div>

                {/* ContentEditable div */}
                <div>
                    <label className="block text-sm font-medium mb-2">ContentEditable Div:</label>
                    <div 
                        contentEditable
                        className="w-full p-3 border rounded-lg min-h-[80px] bg-white"
                        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'normal' }}
                        onInput={(e) => {
                            const target = e.target as HTMLDivElement;
                            setValue(target.textContent || '');
                        }}
                    >
                        {value || 'Type abc here...'}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Current Value:</h3>
                    <p className="font-mono bg-white p-2 rounded border">&quot;{value}&quot;</p>
                    <p className="text-sm text-gray-600 mt-2">
                        If you type &quot;abc&quot; and see &quot;cba&quot; in any field above, the issue is system-wide.
                        If only the rich text editor shows reversed text, the issue is Quill-specific.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimpleTextTest;
