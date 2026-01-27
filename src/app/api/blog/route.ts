import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Helper to check if we are on localhost
const isLocal = (req: NextRequest) => {
  const host = req.headers.get('host');
  return host?.includes('localhost') || process.env.NODE_ENV === 'development';
};

export async function POST(req: NextRequest) {
  if (!isLocal(req)) {
    return NextResponse.json({ error: 'Unauthorized. This action is only allowed locally.' }, { status: 403 });
  }

  try {
    const blogData = await req.json();
    const { slug } = blogData;

    if (!slug) {
      return NextResponse.json({ error: 'Missing required fields: slug' }, { status: 400 });
    }

    const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
    if (!fs.existsSync(blogsDirectory)) {
      fs.mkdirSync(blogsDirectory, { recursive: true });
    }

    const filePath = path.join(blogsDirectory, `${slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(blogData, null, 2));

    return NextResponse.json({ message: 'Post saved successfully!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isLocal(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');

  // If no slug, return a list of all posts (local + github)
  if (!slug) {
    try {
      const localFiles = fs.existsSync(blogsDirectory) ? fs.readdirSync(blogsDirectory).map(f => f.replace(/\.(md|mdx|json)$/, '')) : [];
      
      const githubRes = await fetch('https://api.github.com/repos/lechiluan/lechiluan.github.io/contents/src/blogs');
      let githubFiles: string[] = [];
      if (githubRes.ok) {
        const data = await githubRes.json();
        githubFiles = data
          .filter((file: any) => file.name.endsWith('.mdx') || file.name.endsWith('.md') || file.name.endsWith('.json'))
          .map((file: any) => file.name.replace(/\.(md|mdx|json)$/, ''));
      }

      const allSlugs = Array.from(new Set([...localFiles, ...githubFiles]));
      return NextResponse.json({ slugs: allSlugs });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  try {
    const jsonPath = path.join(blogsDirectory, `${slug}.json`);
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(fileContent);
      return NextResponse.json({ ...data, slug });
    }

    const mdxPath = path.join(blogsDirectory, `${slug}.mdx`);
    if (fs.existsSync(mdxPath)) {
      const fileContent = fs.readFileSync(mdxPath, 'utf8');
      const { data, content } = matter(fileContent);
      return NextResponse.json({ ...data, content, slug });
    }

    // Try fetching from GitHub if local file doesn't exist
    const githubUrl = `https://raw.githubusercontent.com/lechiluan/lechiluan.github.io/main/src/blogs/${slug}.json`;
    const githubRes = await fetch(githubUrl);
    
    if (githubRes.ok) {
      const data = await githubRes.json();
      return NextResponse.json({ ...data, slug });
    }

    // Fallback to mdx on github
    const githubMdxUrl = `https://raw.githubusercontent.com/lechiluan/lechiluan.github.io/main/src/blogs/${slug}.mdx`;
    const githubMdxRes = await fetch(githubMdxUrl);
    if(githubMdxRes.ok) {
        const fileContent = await githubMdxRes.text();
        const { data, content } = matter(fileContent);
        return NextResponse.json({ ...data, content, slug });
    }

    return NextResponse.json({ error: 'Post not found locally or on GitHub' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isLocal(req)) {
     return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
  }

  try {
    const { slug } = await req.json();
    const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
    const jsonPath = path.join(blogsDirectory, `${slug}.json`);
    const mdxPath = path.join(blogsDirectory, `${slug}.mdx`);

    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      return NextResponse.json({ message: 'Post deleted successfully!' });
    }

    if (fs.existsSync(mdxPath)) {
      fs.unlinkSync(mdxPath);
      return NextResponse.json({ message: 'Post deleted successfully!' });
    }

    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
