'use client';

import React, { useState, useEffect } from 'react';
import { OutputData, OutputBlockData } from '@editorjs/editorjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface BlogRendererProps {
    data: OutputData;
}

const CodeBlock = ({ code, blockId, language }: { code: string; blockId?: string; language?: string }) => {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState(code);

    useEffect(() => {
        try {
            if (language && hljs.getLanguage(language)) {
                const result = hljs.highlight(code, { language, ignoreIllegals: true });
                setHighlightedCode(result.value);
            } else {
                const result = hljs.highlightAuto(code);
                setHighlightedCode(result.value);
            }
        } catch (err) {
            console.error('Highlighting error:', err);
            setHighlightedCode(code);
        }
    }, [code, language]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const detectLanguage = () => {
        if (language) return language;
        try {
            const detected = hljs.highlightAuto(code);
            return detected.language || 'plaintext';
        } catch {
            return 'plaintext';
        }
    };

    const detectedLang = detectLanguage();

    return (
        <div className="my-6 relative group">
            <div className="flex items-center justify-between absolute top-2 right-2 z-10 gap-2">
                <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-700/70 text-gray-200 border border-gray-600">
                    {detectedLang}
                </span>
                <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-xs font-semibold rounded transition-all border
                    dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white dark:border-blue-600
                    bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
                >
                    {copied ? '✓ Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 bg-[#282c34] rounded-lg overflow-x-auto border border-gray-700 pr-40 text-sm leading-relaxed">
                <code
                    className="hljs font-mono whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
            </pre>
        </div>
    );
};

const BlogRenderer = ({ data }: BlogRendererProps) => {
    if (!data || !data.blocks || data.blocks.length === 0) {
        return <p>No content available.</p>;
    }

    const renderBlock = (block: OutputBlockData) => {
        const blockData = block.data as any;

        switch (block.type) {
            case 'header':
                const level = blockData.level || 2;
                const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
                return (
                    <HeaderTag key={block.id} className="mt-6 mb-4 font-bold">
                        {blockData.text}
                    </HeaderTag>
                );

            case 'paragraph':
                return (
                    <p
                        key={block.id}
                        className="my-4 leading-7"
                        dangerouslySetInnerHTML={{ __html: blockData.text }}
                    />
                );

            case 'code':
                return (
                    <CodeBlock key={block.id} code={blockData.code} blockId={block.id} language={blockData.language} />
                );

            case 'list':
                const ListTag = blockData.style === 'ordered' ? 'ol' : 'ul';
                return (
                    <ListTag key={block.id} className={`my-4 pl-6 space-y-2 ${blockData.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                        {blockData.items?.map((item: string, idx: number) => (
                            <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                        ))}
                    </ListTag>
                );

            case 'quote':
                return (
                    <blockquote key={block.id} className="my-6 pl-4 border-l-4 border-primary italic text-muted-foreground">
                        <p className="mb-2">{blockData.text}</p>
                        {blockData.caption && <cite className="text-sm">— {blockData.caption}</cite>}
                    </blockquote>
                );

            case 'table':
                return (
                    <div key={block.id} className="my-6 overflow-x-auto border border-border rounded-lg">
                        <table className="w-full border-collapse">
                            <tbody>
                                {blockData.content?.map((row: string[], rowIdx: number) => (
                                    <tr key={rowIdx} className={rowIdx === 0 ? 'bg-muted' : ''}>
                                        {row.map((cell: string, cellIdx: number) => (
                                            <td
                                                key={cellIdx}
                                                className="border border-border p-3 text-sm"
                                                dangerouslySetInnerHTML={{ __html: cell }}
                                            />
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'image':
                return (
                    <figure key={block.id} className="my-8">
                        <img
                            src={blockData.file?.url || blockData.url}
                            alt={blockData.caption || 'Image'}
                            className="w-full h-auto rounded-lg border border-border"
                            loading="lazy"
                        />
                        {blockData.caption && (
                            <figcaption className="text-center text-sm mt-3 text-muted-foreground">
                                {blockData.caption}
                            </figcaption>
                        )}
                    </figure>
                );

            case 'embed':
                return (
                    <div key={block.id} className="my-8 w-full aspect-video rounded-lg overflow-hidden border border-border">
                        <iframe
                            src={blockData.embed}
                            width={blockData.width}
                            height={blockData.height}
                            frameBorder="0"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                );

            case 'delimiter':
                return <hr key={block.id} className="my-8 border-border" />;

            case 'checklist':
                return (
                    <div key={block.id} className="my-4 space-y-2">
                        {blockData.items?.map((item: any, idx: number) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={item.checked || false}
                                    readOnly
                                    className="rounded"
                                />
                                <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                                    {item.text}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case 'warning':
                return (
                    <div key={block.id} className="my-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                        {blockData.title && <h4 className="font-bold mb-2">{blockData.title}</h4>}
                        <p dangerouslySetInnerHTML={{ __html: blockData.message }} />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="prose dark:prose-invert max-w-none">
            {data.blocks.map(renderBlock)}
        </div>
    );
};

export default BlogRenderer;
