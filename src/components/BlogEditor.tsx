'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Checklist from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Warning from '@editorjs/warning';
import CustomCodeTool from './CustomCodeTool';

interface BlogEditorProps {
    value?: OutputData;
    onChange: (content: OutputData) => void;
}

const BlogEditor = ({ value, onChange }: BlogEditorProps) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!editorInstance.current && editorContainerRef.current) {
            const editor = new EditorJS({
                holder: editorContainerRef.current,
                tools: {
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                    header: Header,
                    list: List,
                    quote: Quote,
                    table: Table,
                    embed: Embed,
                    image: {
                        class: Image,
                        config: {
                            endpoints: {
                                byFile: '/api/upload',
                                byUrl: '/api/upload?url=',
                            },
                            field: 'image',
                            types: 'image/*',
                            captionPlaceholder: 'Image caption...',
                            buttonContent: 'Upload image',
                            additionalRequestData: {},
                            additionalRequestHeaders: {},
                        },
                    },
                    code: {
                        class: CustomCodeTool,
                    },
                    checklist: Checklist,
                    delimiter: Delimiter,
                    inlineCode: InlineCode,
                    marker: Marker,
                    warning: Warning,
                },
                data: value,
                placeholder: "Let's write an awesome story!",
                async onChange(api) {
                    const data = await api.saver.save();
                    onChange(data);
                },
            });
            editorInstance.current = editor;
        }

        return () => {
            if (editorInstance.current && editorInstance.current.destroy) {
                editorInstance.current.isReady
                    .then(() => {
                        if (editorInstance.current) {
                            editorInstance.current.destroy();
                            editorInstance.current = null;
                        }
                    })
                    .catch((e) => console.error('Error destroying editor:', e));
            }
        };
    }, []);

    return <div ref={editorContainerRef} className="prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 text-left [&_.ce-editor__nested-scroll]:!max-w-none" />;
};

export default BlogEditor;