'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    FiEdit,
    FiEye,
    FiSave,
    FiPlus,
    FiCalendar,
    FiUser,
    FiLink,
    FiImage,
    FiMessageSquare,
    FiChevronLeft,
    FiLoader,
    FiDownloadCloud
} from 'react-icons/fi';

const BlogEditor = dynamic(() => import('@/components/BlogEditor'), {
    ssr: false,
    loading: () => (
        <div className="h-[500px] w-full bg-secondary/30 animate-pulse rounded-xl border border-border flex flex-col items-center justify-center gap-3">
            <FiLoader className="w-8 h-8 animate-spin text-primary" />
            <span className="text-muted-foreground font-medium">Initializing Workspace...</span>
        </div>
    )
});

export default function BlogAdmin() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: 'Le Chi Luan',
        date: new Date().toISOString().split('T')[0],
        description: '',
        image: '',
        content: '',
        slug: ''
    });

    const [availableSlugs, setAvailableSlugs] = useState<string[]>([]);
    const [searchSlug, setSearchSlug] = useState('');

    useEffect(() => {
        const loadSlugs = async () => {
            try {
                const res = await fetch('/api/blog');
                const data = await res.json();
                if (res.ok && data.slugs) {
                    setAvailableSlugs(data.slugs);
                }
            } catch (e) {
                console.error('Failed to load slugs');
            }
        };
        loadSlugs();
    }, []);

    const handleLoadPost = async (slugToLoad?: string) => {
        const slug = slugToLoad || searchSlug;
        if (!slug) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/blog?slug=${slug}`);
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    ...data,
                    author: data.author || 'Le Chi Luan'
                });
                setIsEditing(true);
            } else {
                alert('Post not found');
            }
        } catch (e) {
            alert('Error loading post');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'title' && !isEditing) {
            const generatedSlug = value
                .toLowerCase()
                .trim()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (res.ok) {
                alert('Blog saved successfully!');
                if (!isEditing) {
                    setFormData({
                        title: '',
                        author: 'Le Chi Luan',
                        date: new Date().toISOString().split('T')[0],
                        description: '',
                        image: '',
                        content: '',
                        slug: ''
                    });
                }
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            alert('Failed to save blog.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground py-12 pb-32">
            <div className="container mx-auto px-4 max-w-[1600px]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2 flex items-center gap-3">
                            <span className="bg-primary/10 p-2 rounded-lg text-primary"><FiEdit className="w-8 h-8" /></span>
                            Blog Central
                        </h1>
                        <p className="text-muted-foreground font-medium">Create and refine your stories for the world.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${showPreview
                                ? 'bg-background border-border text-foreground hover:bg-secondary'
                                : 'bg-secondary/20 border-border text-foreground hover:bg-secondary'
                                }`}
                        >
                            {showPreview ? <><FiEdit className="w-5 h-5" /> Editor Mode</> : <><FiEye className="w-5 h-5" /> Full Preview</>}
                        </button>

                        {!showPreview && (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiSave className="w-5 h-5" />}
                                {isEditing ? 'UPDATE STORY' : 'PUBLISH STORY'}
                            </button>
                        )}
                    </div>
                </div>

                {showPreview ? (
                    /* High Fidelity Preview */
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
                            {formData.image && (
                                <div className="h-[40vh] w-full overflow-hidden">
                                    <img src={formData.image} alt="Hero" className="w-full h-full object-cover scale-105" />
                                </div>
                            )}
                            <div className="max-w-4xl mx-auto px-6 py-16">
                                <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight leading-tight">
                                    {formData.title || 'Your Title Goes Here'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y border-border py-6 mb-12">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {formData.author?.charAt(0)}
                                        </div>
                                        <span className="text-foreground font-bold">{formData.author}</span>
                                    </div>
                                    <span className="opacity-30">|</span>
                                    <div className="flex items-center gap-2">
                                        <FiCalendar /> {formData.date}
                                    </div>
                                </div>
                                <div
                                    className="prose dark:prose-invert prose-xl max-w-none ck-content"
                                    dangerouslySetInnerHTML={{ __html: formData.content }}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Sidebar: Metadata & Controls */}
                        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
                            {/* Management Card */}
                            <div className="bg-card border border-border p-6 rounded-2xl shadow-xl">
                                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                    <FiLoader className="text-primary" /> Quick Load
                                </h3>
                                <div className="space-y-4">
                                    <select
                                        className="w-full px-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all cursor-pointer"
                                        onChange={(e) => setSearchSlug(e.target.value)}
                                        value={searchSlug}
                                    >
                                        <option value="">-- Choose a post --</option>
                                        {availableSlugs.map(slug => (
                                            <option key={slug} value={slug}>{slug}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleLoadPost()}
                                        className="w-full py-3 bg-secondary/50 text-foreground rounded-xl font-bold hover:bg-secondary transition-all flex items-center justify-center gap-2 border border-border"
                                    >
                                        <FiDownloadCloud className="w-5 h-5 text-primary" /> Fetch Blog Content
                                    </button>
                                </div>
                            </div>

                            {/* Settings Card */}
                            <div className="bg-card border border-border p-6 rounded-2xl shadow-xl space-y-6">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <FiLink className="text-primary" /> Meta Info
                                </h3>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Post Author</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">Publish Date</label>
                                    <div className="relative">
                                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 block">URL Slug</label>
                                    <div className="relative">
                                        <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            disabled={isEditing}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground disabled:opacity-40 disabled:bg-muted font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Editor Section */}
                        <div className="lg:col-span-9 space-y-8 order-1 lg:order-2">
                            <div className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-8">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">Story Headline</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-6 py-4 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-2xl font-bold placeholder:opacity-50"
                                        placeholder="Enter Catchy Title..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">Hero Image Address</label>
                                    <div className="relative">
                                        <FiImage className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            className="w-full pl-14 pr-6 py-4 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:opacity-50"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 block">SEO Summary</label>
                                    <div className="relative font-mono">
                                        <FiMessageSquare className="absolute left-6 top-5 text-muted-foreground" />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full pl-14 pr-6 py-4 bg-background border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                                            placeholder="Write a short teaser for the blog card..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 block">Manuscript</label>
                                    <div className="rounded-2xl overflow-hidden border border-border bg-background shadow-xl">
                                        <BlogEditor
                                            value={formData.content}
                                            onChange={(html: string) => setFormData(prev => ({ ...prev, content: html }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
