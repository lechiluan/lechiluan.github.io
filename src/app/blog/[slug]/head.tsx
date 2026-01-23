import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PostHead = async ({ params }: { params: { slug: string } }) => {
  const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
  const fullPath = path.join(blogsDirectory, `${params.slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data } = matter(fileContents);

  return (
    <Head>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
    </Head>
  );
};

export default PostHead;