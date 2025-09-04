import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import data from "../data/data.json";

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground p-8 mt-16 border-t border-border">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <p className="text-lg mb-4 md:mb-0">&copy; {new Date().getFullYear()} {data.hero.name}. All rights reserved.</p>
        <div className="flex space-x-6">
          <a
            href={data.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-card-foreground hover:text-primary transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-3xl" />
          </a>
          <a
            href={data.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-card-foreground hover:text-primary transition-colors duration-300"
            aria-label="GitHub"
          >
            <FaGithub className="text-3xl" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;