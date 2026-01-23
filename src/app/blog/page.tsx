import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

const Blog = () => {
  const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
  const fileNames = fs.readdirSync(blogsDirectory);

  const blogs = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(md|mdx)$/, '');
    const fullPath = path.join(blogsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description || "Read more about this post...",
      image: data.image || `https://picsum.photos/seed/${slug}/600/400`
    };
  });

  return (
    <main className="min-h-screen bg-background text-foreground py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Our Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, insights, and stories from the world of software engineering and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <p className="text-sm font-semibold text-primary mb-3">
                  {post.date}
                </p>
                <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center text-primary font-bold">
                  <span>Read Article</span>
                  <svg
                    className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Blog;
