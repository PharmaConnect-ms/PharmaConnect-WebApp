/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import html2canvas from 'html2canvas';
import type { RichTextPayload } from '../components/molecules/PrescriptionRichTextEditor';

type PngResult = {
  file: File;                 // ← use this in FormData to upload
  dataUrl: string;            // base64 (if you need inline)
  objectUrl: string;          // blob: URL for previewing
  revoke: () => void;         // call when you're done with objectUrl
  width: number;
  height: number;
  filename: string;
};

export async function savePrescription(payload: RichTextPayload): Promise<PngResult | undefined> {
  if (payload.type !== 'text') return;

  // 1) Off-screen iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-99999px';
  iframe.style.top = '0';
  iframe.width = '0';
  iframe.height = '0';
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            html, body { margin:0; padding:0; background:#fff; color:#000; }
            .wrap { width:800px; padding:24px; font-size:18px; line-height:1.5; }
          </style>
        </head>
        <body>
          <div class="wrap">${payload.html || ''}</div>
        </body>
      </html>
    `);
    doc.close();

    // Wait for layout & fonts
    await new Promise(requestAnimationFrame);
    if ((doc as any).fonts?.ready) await (doc as any).fonts.ready;

    const target = doc.querySelector('.wrap') as HTMLElement;
    const width = target.scrollWidth || 800;
    const height = target.scrollHeight || 200;

    // 2) Render
    const canvas = await html2canvas(target, {
      backgroundColor: '#ffffff',
      scale: 2,
      width,
      height,
      useCORS: true,
      removeContainer: true,
    });

    // 3) Canvas -> Blob -> File
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png')
    );
    const filename = `prescription-${Date.now()}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    // 4) Links
    const objectUrl = URL.createObjectURL(blob);
    const dataUrl = canvas.toDataURL('image/png');

    return {
      file,
      dataUrl,
      objectUrl,
      revoke: () => URL.revokeObjectURL(objectUrl),
      width,
      height,
      filename,
    };
  } finally {
    document.body.removeChild(iframe);
  }
}
