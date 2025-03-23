"use client";

import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export const TableOfContents: FC<TableOfContentsProps> = ({ className }) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const pathname = usePathname();

  // Extract headings from the page
  useEffect(() => {
    const extractHeadings = () => {
      const headingElements = Array.from(
        document.querySelectorAll("h2, h3, h4")
      ).filter((element) => element.id);

      const items: TocItem[] = headingElements.map((element) => ({
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1)),
      }));

      setHeadings(items);
    };

    // Run after a small delay to ensure the content is rendered
    const timer = setTimeout(extractHeadings, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Track active heading based on scroll position
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -80% 0px",
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("w-full", className)}>
      <h3 className="mb-4 text-lg font-semibold">Table of Contents</h3>
      <nav className="min-w-[200px]">
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "transition-colors",
                heading.level === 2
                  ? "font-medium"
                  : "pl-4 text-muted-foreground",
                heading.level === 4 ? "pl-8" : "",
                activeId === heading.id
                  ? "text-primary"
                  : "hover:text-foreground"
              )}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
