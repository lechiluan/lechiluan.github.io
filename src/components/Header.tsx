"use client";

import Link from 'next/link';
import { ModeToggle } from "./ModeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/#education", label: "Education" },
  { href: "/#experience", label: "Experience" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 px-4 py-3 text-foreground shadow-lg backdrop-blur sm:px-6">
      <nav className="container relative mx-auto flex items-center justify-between md:justify-center">
        <Link href="/" className="text-base font-bold text-primary md:absolute md:left-0" onClick={() => setIsOpen(false)}>
          Le Chi Luan
        </Link>

        <ul className="hidden items-center gap-7 text-base font-medium lg:gap-8 lg:text-lg md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-primary transition duration-300">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:absolute md:right-0 md:block">
          <ModeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-accent"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] rounded-lg border border-border bg-card p-3 shadow-2xl md:hidden">
            <ul className="grid gap-1 text-base font-medium">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 transition hover:bg-accent hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
