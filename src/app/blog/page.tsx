
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const Blog = () => {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog;
