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
    const { title, author, date, description, image, content, slug } = await req.json();

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const blogsDirectory = path.join(process.cwd(), 'src', 'blogs');
    
    // Ensure directory exists
    if (!fs.existsSync(blogsDirectory)) {
      fs.mkdirSync(blogsDirectory, { recursive: true });
    }

    const filePath = path.join(blogsDirectory, `${slug}.mdx`);

    const fileContent = matter.stringify(content, { title, author, date, description, image });
    fs.writeFileSync(filePath, fileContent);

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
      const localFiles = fs.existsSync(blogsDirectory) ? fs.readdirSync(blogsDirectory).map(f => f.replace(/\.(md|mdx)$/, '')) : [];
      
      const githubRes = await fetch('https://api.github.com/repos/lechiluan/lechiluan.github.io/contents/src/blogs');
      let githubFiles: string[] = [];
      if (githubRes.ok) {
        const data = await githubRes.json();
        githubFiles = data
          .filter((file: any) => file.name.endsWith('.mdx') || file.name.endsWith('.md'))
          .map((file: any) => file.name.replace(/\.(md|mdx)$/, ''));
      }

      const allSlugs = Array.from(new Set([...localFiles, ...githubFiles]));
      return NextResponse.json({ slugs: allSlugs });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  try {
    const filePath = path.join(blogsDirectory, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      return NextResponse.json({ ...data, content, slug });
    }

    // Try fetching from GitHub if local file doesn't exist
    const githubUrl = `https://raw.githubusercontent.com/lechiluan/lechiluan.github.io/main/src/blogs/${slug}.mdx`;
    const githubRes = await fetch(githubUrl);
    
    if (githubRes.ok) {
      const fileContent = await githubRes.text();
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
    const filePath = path.join(blogsDirectory, `${slug}.mdx`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ message: 'Post deleted successfully!' });
    }

    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
