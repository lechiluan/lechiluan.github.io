
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const PostPage = async ({ params }: { params: { slug: string } }) => {
  const postsDirectory = path.join(process.cwd(), 'src', 'posts');
  const fullPath = path.join(postsDirectory, `${params.slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="prose lg:prose-xl">
        <h1>{data.title}</h1>
        <p className="text-gray-600">{data.date}</p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  );
};

export default PostPage;
