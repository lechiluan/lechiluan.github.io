import Image from "next/image";
import data from "../data/data.json";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-background text-foreground">
      {/* Hero Section */}
      <section id="hero" className="w-full max-w-5xl text-center py-20">
        <div className="flex flex-col items-center">
          <Image
            src={data.hero.profileImage}
            alt="My Picture"
            width={180}
            height={180}
            className="rounded-full border-4 border-blue-500 shadow-lg"
          />
          <h1 className="text-5xl font-extrabold mt-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {data.hero.name}
          </h1>
          <p className="text-2xl mt-3 font-light text-muted-foreground">
            {data.hero.title}
          </p>
            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground text-justify">
            {data.hero.bio}
            </p>
          <div className="mt-10 flex space-x-6">
            <a
              href="#projects"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-semibold hover:bg-primary/90 transition duration-300 transform hover:scale-105 shadow-lg"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border border-primary text-primary rounded-full text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">About Me</h2>
        <div className="text-lg leading-relaxed text-card-foreground space-y-6">
          <p>
            {data.about.description}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
          {data.skills.map((skill, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg shadow-md hover:bg-muted transition duration-300">
              <h3 className="text-xl font-semibold text-secondary-foreground">{skill}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.projects.map((project, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
              <Image
                src={project.image}
                alt={project.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">{project.name}</h3>
                <p className="text-muted-foreground text-base mb-4">
                  {project.description}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    className="inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition duration-300"
                    target="_blank" rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-background rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300">
              <Image
                src={`https://picsum.photos/seed/${post.slug}/500/300`}
                alt={post.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-foreground mb-2">{post.title}</h3>
                <p className="text-muted-foreground text-base mb-4">
                  {post.date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Experience</h2>
        <div className="space-y-8 text-lg text-card-foreground">
          {data.experience.map((exp, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-foreground">{exp.title} - {exp.company}</h3>
              <p className="text-muted-foreground">{exp.duration}</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {exp.responsibilities.map((responsibility, i) => (
                  <li key={i}>{responsibility}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Education</h2>
        <div className="space-y-8 text-lg text-card-foreground">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-foreground">{edu.degree}</h3>
              <p className="text-muted-foreground">{edu.institution} - {edu.duration}</p>
              <p className="mt-2">{edu.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-5xl mt-20 py-16 bg-card rounded-lg shadow-xl px-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Contact Me</h2>
        <div className="text-center text-lg text-card-foreground space-y-4">
          <p>I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
          <p>Email: <a href={`mailto:${data.contact.email}`} className="text-primary hover:underline">{data.contact.email}</a></p>
          <p>LinkedIn: <a href={data.contact.linkedin} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{data.contact.linkedin}</a></p>
          <p>GitHub: <a href={data.contact.github} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{data.contact.github}</a></p>
        </div>
      </section>
    </main>
  );
}
