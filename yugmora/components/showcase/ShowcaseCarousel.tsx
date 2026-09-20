// components/showcase/ShowcaseCarousel.tsx — Generic 3D coverflow carousel with Embla
"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ShowcaseCarouselProps<T> {
  items: T[];
  renderItem: (item: T, isActive: boolean, index: number) => React.ReactNode;
  autoplayInterval?: number;
}

export function ShowcaseCarousel<T>({
  items,
  renderItem,
  autoplayInterval = 5000,
}: ShowcaseCarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay handler with pause on hover/focus
  useEffect(() => {
    if (!emblaApi || isPaused || !autoplayInterval) return;

    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [emblaApi, isPaused, autoplayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext]);

  return (
    <div
      className="relative w-full py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Showcase Carousel"
    >
      {/* Viewport */}
      <div className="overflow-hidden px-4" ref={emblaRef}>
        <div className="flex -ml-4 items-center perspective-[1200px]">
          {items.map((item, index) => {
            const isActive = index === selectedIndex;
            // Calculate distance for coverflow effect
            const distance = Math.abs(index - selectedIndex);
            const isPrev = index < selectedIndex;

            return (
              <div
                key={index}
                className="pl-4 flex-[0_0_88%] sm:flex-[0_0_60%] md:flex-[0_0_45%] lg:flex-[0_0_36%] transition-all duration-500 ease-out"
                style={{
                  transform: isActive
                    ? "scale(1) rotateY(0deg)"
                    : `scale(0.88) ${
                        isPrev ? "rotateY(25deg)" : "rotateY(-25deg)"
                      }`,
                  opacity: isActive ? 1 : Math.max(0.5, 0.85 - distance * 0.15),
                  zIndex: isActive ? 10 : 5 - Math.min(distance, 4),
                }}
              >
                {renderItem(item, isActive, index)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls & Pagination */}
      <div className="flex items-center justify-between mt-8 max-w-sm mx-auto px-4">
        {/* Prev Button */}
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded border border-line bg-surface-1 flex items-center justify-center text-text hover:border-neon-cyan hover:text-neon-cyan transition-colors font-mono"
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-neon-cyan shadow-[0_0_10px_#22e1ff]"
                  : "w-2 bg-line hover:bg-text-muted"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selectedIndex}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded border border-line bg-surface-1 flex items-center justify-center text-text hover:border-neon-cyan hover:text-neon-cyan transition-colors font-mono"
          aria-label="Next slide"
        >
          ›
        </button>
      </div>
    </div>
  );
}
