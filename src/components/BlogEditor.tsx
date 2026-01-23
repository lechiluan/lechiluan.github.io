'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface BlogEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const BlogEditor = ({ value, onChange }: BlogEditorProps) => {
    return (
        <div className="ck-editor-container light-theme-force">
            <style jsx global>{`
        /* Force Light Theme for CKEditor regardless of system/app mode */
        .light-theme-force .ck.ck-editor__editable_inline {
          min-height: 600px;
          padding: 3rem 3rem !important;
          background-color: #ffffff !important;
          color: #1a1a1a !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Fixed Toolbar Styling - Seamless with parent container */
        .light-theme-force .ck.ck-toolbar {
          background-color: #f8fafc !important; 
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important; 
          padding: 0.6rem 1.2rem !important;
          border-radius: 0 !important;
        }

        /* Remove the sticky floating behavior that breaks the layout */
        .light-theme-force .ck-sticky-panel .ck-sticky-panel__content {
          position: static !important;
          border: none !important;
          box-shadow: none !important;
        }

        .light-theme-force .ck.ck-editor__main>.ck-editor__editable {
          border: none !important;
          border-radius: 0 !important;
        }

        .light-theme-force .ck.ck-button {
          color: #475569 !important;
          border-radius: 0.4rem !important;
          transition: all 0.2s ease !important;
        }
        
        .light-theme-force .ck.ck-button:hover {
          background-color: #f1f5f9 !important;
        }

        .light-theme-force .ck.ck-button.ck-on {
          background-color: #e2e8f0 !important;
          color: #0f172a !important;
        }

        .light-theme-force .ck.ck-toolbar__separator {
          background-color: #cbd5e1 !important;
          height: 20px !important;
          align-self: center !important;
        }

        /* Fixed Dropdowns for Light Mode */
        .light-theme-force .ck.ck-dropdown__panel {
          background-color: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        }

        /* Typography */
        .light-theme-force .ck-content h2 { 
          font-weight: 800; font-size: 2.25rem; margin-top: 2rem; margin-bottom: 1rem; color: #000 !important;
        }
        .light-theme-force .ck-content h3 { 
          font-weight: 700; font-size: 1.75rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #000 !important;
        }
        .light-theme-force .ck-content p { margin-bottom: 1.25rem; line-height: 1.8; color: #1a1a1a !important; }
        
        /* Focus state */
        .light-theme-force .ck.ck-editor__editable.ck-focused:not(.ck-editor__nested-editable) {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>

            <CKEditor
                editor={ClassicEditor}
                data={value}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data);
                }}
                config={{
                    placeholder: 'Start writing your story in distraction-free light mode...',
                    toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        '|',
                        'undo',
                        'redo'
                    ]
                }}
            />
        </div>
    );
};

export default BlogEditor;
