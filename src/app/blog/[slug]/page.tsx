import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const BlogRenderer = dynamic(() => import('@/components/BlogRenderer'), {
  ssr: false,
  loading: () => <p>Loading content...</p>,
});

export async function generateStaticParams() {
  const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
  if (!fs.existsSync(blogsDirectory)) return [];
  const filenames = fs.readdirSync(blogsDirectory);

  const params = filenames.map((filename) => ({
    slug: filename.replace(/\.(md|mdx|json)$/, ''),
  }));
  return params;
}

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');

  let postData;
  let postContent;
  let isJson = false;

  const jsonPath = path.join(blogsDirectory, `${params.slug}.json`);
  if (fs.existsSync(jsonPath)) {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContents);
    postData = data;
    postContent = data.content;
    isJson = true;
  } else {
    let fullPath = path.join(blogsDirectory, `${params.slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(blogsDirectory, `${params.slug}.md`);
    }

    if (!fs.existsSync(fullPath)) {
      return (
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      );
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    postData = data;
    postContent = content;
  }

  const isHtml = typeof postContent === 'string' && postContent.trim().startsWith('<') && postContent.trim().includes('>');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <header className="mb-12 not-prose">
            <Link href="/blog" className="text-primary hover:underline mb-8 inline-block font-medium">
              ← Back to Blog
            </Link>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-primary tracking-tight">
              {postData.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm md:text-base border-y border-border py-4">
              <span className="font-bold text-foreground">By {postData.author || 'Le Chi Luan'}</span>
              <span>•</span>
              <time>{postData.date}</time>
            </div>
          </header>

          <div className="mt-8">
            {isJson ? (
              <BlogRenderer data={postContent} />
            ) : isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: postContent }} />
            ) : (
              <MDXRemote source={postContent} />
            )}
          </div>
        </article>
      </div>
    </main>
  );
};

export default PostPage;