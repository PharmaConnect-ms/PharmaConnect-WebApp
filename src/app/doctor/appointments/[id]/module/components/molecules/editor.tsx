/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  MutableRefObject,
} from 'react';

import type QuillType from 'quill';
import type { RangeStatic, Sources } from 'quill';

type DeltaLike = { ops: Array<Record<string, any>> };

type EditorProps = {
  readOnly?: boolean;
  defaultHTML?: string;
  defaultDelta?: DeltaLike;
  placeholder?: string;
  className?: string;
  modules?: Record<string, any>;
  onTextChange?: (payload: {
    html: string;
    source: Sources;
  }) => void;
  onSelectionChange?: (
    range: RangeStatic | null,
    oldRange: RangeStatic | null,
    source: Sources
  ) => void;
};

const Editor = forwardRef<QuillType, EditorProps>(function Editor(
  {
    readOnly = false,
    defaultHTML,
    defaultDelta,
    placeholder = '',
    className = '',
    modules,
    onTextChange,
    onSelectionChange,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<QuillType | null>(null);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  }, [onTextChange, onSelectionChange]);

  // toggle readOnly dynamically
  useEffect(() => {
    if (quillRef.current) quillRef.current.enable(!readOnly);
  }, [readOnly]);

  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: Quill } = await import('quill');
      // ✅ CSS handled globally via globals.css (@import 'quill/dist/quill.snow.css')

      if (!isMounted) return;

      const host = container.appendChild(
        container.ownerDocument.createElement('div')
      );

      const baseModules = {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            [{ align: [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean'],
          ],
          handlers: {
            // Custom handlers can be added here if needed
          }
        },
        clipboard: {
          matchVisual: false,
        },
        ...(modules || {}),
      };

      const quill = new Quill(host, {
        theme: 'snow',
        readOnly,
        placeholder,
        modules: baseModules,
        formats: [
          'header', 'bold', 'italic', 'underline', 'strike',
          'color', 'background', 'list', 'bullet', 'indent',
          'align', 'link', 'blockquote', 'code-block'
        ],
      });

      quillRef.current = quill;
      if (ref && typeof ref !== 'function') {
        (ref as MutableRefObject<QuillType | null>).current = quill;
      }

      // Simple and effective text direction fix
      const editor = quill.root;
      
      // Set fundamental text direction properties
      editor.style.direction = 'ltr';
      editor.style.textAlign = 'left';
      editor.style.unicodeBidi = 'embed';
      editor.style.writingMode = 'horizontal-tb';
      editor.setAttribute('dir', 'ltr');
      
      // Add class for CSS styling
      editor.classList.add('prescription-editor-ltr');
      
      // Simple observer to maintain direction on content changes
      const observer = new MutationObserver(() => {
        if (editor.style.direction !== 'ltr') {
          editor.style.direction = 'ltr';
          editor.style.unicodeBidi = 'embed';
          editor.setAttribute('dir', 'ltr');
        }
      });
      
      observer.observe(editor, { 
        childList: true, 
        subtree: true, 
        attributes: true, 
        attributeFilter: ['dir', 'style'] 
      });
      
      // Ensure proper text input direction
      const ensureTextDirection = () => {
        editor.style.direction = 'ltr';
        editor.style.unicodeBidi = 'embed';
        editor.setAttribute('dir', 'ltr');
      };
      
      editor.addEventListener('focus', ensureTextDirection);
      editor.addEventListener('keydown', ensureTextDirection);

      // seed content
      if (defaultDelta) {
        quill.setContents(defaultDelta as any);
      } else if (defaultHTML) {
        quill.clipboard.dangerouslyPasteHTML(defaultHTML);
      } else {
        quill.setText('\n');
      }

      const handleTextChange = (_delta: any, _old: any, source: Sources) => {
        onTextChangeRef.current?.({
          html: quill.root.innerHTML,
          source,
        });
      };
      const handleSelectionChange = (
        range: RangeStatic | null,
        oldRange: RangeStatic | null,
        source: Sources
      ) => {
        onSelectionChangeRef.current?.(range, oldRange, source);
      };

      quill.on('text-change', handleTextChange);
      quill.on('selection-change', handleSelectionChange);

      cleanup = () => {
        quill.off('text-change', handleTextChange);
        quill.off('selection-change', handleSelectionChange);
        observer?.disconnect();
        editor?.removeEventListener('focus', ensureTextDirection);
        editor?.removeEventListener('keydown', ensureTextDirection);
        if (ref && typeof ref !== 'function') {
          (ref as MutableRefObject<QuillType | null>).current = null;
        }
        if (container) container.innerHTML = '';
        quillRef.current = null;
      };
    })();

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [isClient, modules, placeholder, readOnly, ref, defaultDelta, defaultHTML]);

  return <div ref={containerRef} className={className} />;
});

export default Editor;
