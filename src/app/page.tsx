import Image from "next/image";
import data from "../data/data.json";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { calculateDuration, formatDateRange } from '../utils/dateUtils';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

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

      {/* Education Section */}
      <section id="education" className="w-full max-w-5xl mt-10 p-8 bg-card rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Education</h2>
        <div className="space-y-6">
          {data.education.map((edu, index) => (
            <div key={index} className="flex gap-4 p-6 bg-background rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/5 hover:shadow-lg transition-all duration-300">
              {/* School Logo */}
              <div className="flex-shrink-0">
                <Image
                  src={edu.logo}
                  alt={edu.institution}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border border-border"
                />
              </div>

              {/* Education Details */}
              <div className="flex-grow">
                {/* Degree */}
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {edu.degree}
                </h3>

                {/* Institution Name */}
                <p className="text-lg text-foreground mb-2">
                  {edu.institution}
                </p>

                {/* Duration */}
                <div className="text-sm text-muted-foreground mb-2">
                  {edu.duration}
                </div>

                {/* Notes/Honors */}
                <p className="text-base text-card-foreground">
                  {edu.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Experience</h2>
        <div className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={index} className="flex gap-4 p-6 bg-background rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/5 hover:shadow-lg transition-all duration-300">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <Image
                  src={exp.image}
                  alt={exp.company}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover border border-border"
                />
              </div>

              {/* Experience Details */}
              <div className="flex-grow">
                {/* Job Title */}
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {exp.title}
                </h3>

                {/* Company Name */}
                <p className="text-lg text-foreground mb-2">
                  {exp.company}
                </p>

                {/* Date Range and Duration */}
                <div className="text-sm text-muted-foreground mb-1">
                  {formatDateRange(exp.startDate, exp.endDate)} · {calculateDuration(exp.startDate, exp.endDate)}
                </div>

                {/* Location and Employment Type */}
                <div className="text-sm text-muted-foreground mb-3">
                  {exp.location} · {exp.employmentType}
                </div>

                {/* Responsibilities */}
                <ul className="space-y-2 text-base text-card-foreground">
                  {exp.responsibilities.map((responsibility, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center">
          {data.skills.map((skill, index) => (
            <div key={index} className="p-4 bg-secondary rounded-lg border border-transparent hover:border-primary/50 hover:bg-accent/10 shadow-md transition duration-300">
              <h3 className="text-xl font-semibold text-secondary-foreground">{skill}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.projects.map((project, index) => (
            <div key={index} className="bg-background rounded-lg border border-transparent hover:border-primary/50 shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300">
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
      <section id="blog" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-background rounded-lg border border-transparent hover:border-primary/50 shadow-md overflow-hidden transform hover:scale-[1.02] transition duration-300">
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

      {/* About Me Section */}
      <section id="about" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-center mb-10 text-primary">About Me</h2>
        <div className="text-lg leading-relaxed text-card-foreground space-y-6">
          <p>
            {data.about.description}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full max-w-5xl mt-10 bg-card rounded-lg shadow-xl p-8 mb-20">
        <h2 className="text-4xl font-bold text-center mb-6 text-primary">Contact Me</h2>
        <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
          I am always open to new opportunities and collaborations. Feel free to reach out through any of the platforms below!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Email Card */}
          <a
            href={`mailto:${data.contact.email}`}
            className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <FaEnvelope className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-muted-foreground text-center break-all">{data.contact.email}</p>
          </a>

          {/* LinkedIn Card */}
          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <FaLinkedin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">LinkedIn</h3>
            <p className="text-muted-foreground text-center">Let&apos;s Connect</p>
          </a>

          {/* GitHub Card */}
          <a
            href={data.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="p-4 bg-primary/10 rounded-full mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <FaGithub className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">GitHub</h3>
            <p className="text-muted-foreground text-center">Check My Code</p>
          </a>
        </div>
      </section>
    </main>
  );
}
