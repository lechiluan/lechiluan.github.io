"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type GalleryCertification = {
  name: string;
  issuer: string;
  certificateImage: string;
  credentialUrl?: string;
};

type CertificationGalleryProps = {
  certifications: GalleryCertification[];
};

export default function CertificationGallery({ certifications }: CertificationGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(Math.max(certifications.length - 1, 0));

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const updateVisibleSlides = () => {
      const slide = track.querySelector<HTMLElement>("[data-certification-slide]");

      if (!slide) {
        return;
      }

      const distance = slide.offsetWidth + 16;
      const visibleSlides = Math.max(1, Math.floor((track.clientWidth + 16) / distance));
      const nextMaxIndex = Math.max(certifications.length - visibleSlides, 0);

      setMaxIndex(nextMaxIndex);
      setActiveIndex((current) => Math.min(current, nextMaxIndex));
    };

    updateVisibleSlides();
    const resizeObserver = new ResizeObserver(updateVisibleSlides);
    resizeObserver.observe(track);

    return () => resizeObserver.disconnect();
  }, [certifications.length]);

  const moveSlide = (direction: -1 | 1) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), maxIndex);
    const slide = track.querySelector<HTMLElement>("[data-certification-slide]");
    const distance = (slide?.offsetWidth ?? track.clientWidth) + 16;

    track.scrollBy({ left: direction * distance, behavior: "smooth" });
    setActiveIndex(nextIndex);
  };

  const moveToSlide = (index: number) => {
    const track = trackRef.current;
    const slides = track?.querySelectorAll<HTMLElement>("[data-certification-slide]");
    const target = slides?.[index];

    if (!track || !target) {
      return;
    }

    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slide = track.querySelector<HTMLElement>("[data-certification-slide]");
    const distance = (slide?.offsetWidth ?? track.clientWidth) + 16;
    const nextIndex = Math.min(
      Math.max(Math.round(track.scrollLeft / distance), 0),
      maxIndex,
    );

    setActiveIndex(nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSlide(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSlide(1);
    }
  };

  return (
    <div className="mb-8 md:mb-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
            Verified learning
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Featured credentials
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">A closer look at my latest certificates.</p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="mr-1 hidden min-w-14 justify-center rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground sm:inline-flex">
            {activeIndex + 1} / {maxIndex + 1}
          </span>
          <button
            type="button"
            onClick={() => moveSlide(-1)}
            disabled={activeIndex === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:bg-background disabled:hover:shadow-sm sm:h-10 sm:w-10"
            aria-label="Show previous certificate"
            aria-controls="certification-gallery-track"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => moveSlide(1)}
            disabled={activeIndex === maxIndex}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:border-border disabled:hover:bg-background disabled:hover:shadow-sm sm:h-10 sm:w-10"
            aria-label="Show next certificate"
            aria-controls="certification-gallery-track"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="certification-gallery-track"
        ref={trackRef}
        role="region"
        aria-label="Certificate image slideshow"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-0.5 pb-5 pr-5 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card sm:pr-0"
      >
        {certifications.map((certification, index) => (
          <figure
            key={`${certification.issuer}-${certification.name}`}
            data-certification-slide
            className="group w-[88%] flex-none snap-start overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[0_8px_28px_-20px_hsl(var(--foreground)/0.45)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_38px_-22px_hsl(var(--foreground)/0.5)] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-muted/70 via-background to-primary/5">
              <Image
                src={certification.certificateImage}
                alt={`${certification.name} certificate`}
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 320px"
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.015]"
                priority={index === 0}
              />

              {certification.credentialUrl && (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-foreground/5 transition duration-300 sm:bg-foreground/0 sm:group-hover:bg-foreground/15 sm:group-focus-within:bg-foreground/15" />
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/70 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg backdrop-blur transition duration-300 hover:scale-[1.03] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:pointer-events-none sm:bottom-1/2 sm:right-1/2 sm:translate-x-1/2 sm:translate-y-[calc(50%+0.5rem)] sm:opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:translate-y-1/2 sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:translate-y-1/2 sm:group-focus-within:opacity-100"
                    aria-label={`Verify ${certification.name} credential`}
                  >
                    Verify credential
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </>
              )}
            </div>

            <div className="flex min-h-28 flex-col px-4 pb-4 pt-2">
              <figcaption className="line-clamp-2 text-base font-semibold leading-snug text-foreground sm:text-lg">
                {certification.name}
              </figcaption>
              <div className="mt-auto flex items-center gap-3 pt-3">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-primary" aria-hidden="true" />
                <p className="min-w-0 truncate text-sm text-muted-foreground">{certification.issuer}</p>
              </div>
            </div>
          </figure>
        ))}
      </div>

      <div className="flex items-center justify-center" aria-label="Choose certificate slide">
        <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-1.5 py-1 shadow-inner">
          {certifications.slice(0, maxIndex + 1).map((certification, index) => (
            <button
              key={`${certification.name}-indicator`}
              type="button"
              onClick={() => moveToSlide(index)}
              className="inline-flex h-7 min-w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Go to certificate ${index + 1}: ${certification.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
            >
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted-foreground/30 hover:bg-primary/50"
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
