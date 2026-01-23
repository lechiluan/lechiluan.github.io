import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.(md|mdx)$/, ''),
  }));
}

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  let fullPath = path.join(postsDirectory, `${params.slug}.mdx`);

  // Fallback to .md if .mdx doesn't exist
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${params.slug}.md`);
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <header className="mb-8 not-prose">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">
              {data.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {data.date}
            </p>
            <hr className="mt-8 border-border" />
          </header>

          <div className="mt-8">
            <MDXRemote source={content} />
          </div>
        </article>
      </div>
    </main>
  );
};

export default PostPage;