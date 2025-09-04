import Link from 'next/link';
import { ModeToggle } from "./ModeToggle";

const Header = () => {
  return (
    <header className="bg-background text-foreground py-4 px-6 sticky top-0 z-50 shadow-lg">
      <nav className="container mx-auto flex justify-center items-center relative">
        <ul className="flex space-x-8 text-lg font-medium">
          <li>
            <Link href="/#about" className="hover:text-primary transition duration-300">
              About
            </Link>
          </li>
          <li>
            <Link href="/#skills" className="hover:text-primary transition duration-300">
              Skills
            </Link>
          </li>
          <li>
            <Link href="/#projects" className="hover:text-primary transition duration-300">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-primary transition duration-300">
              Post
            </Link>
          </li>
          <li>
            <Link href="/#experience" className="hover:text-primary transition duration-300">
              Experience
            </Link>
          </li>
          <li>
            <Link href="/#education" className="hover:text-primary transition duration-300">
              Education
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="hover:text-primary transition duration-300">
              Contact
            </Link>
          </li>
        </ul>
        <div className="absolute right-0">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
