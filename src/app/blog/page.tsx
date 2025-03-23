"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    excerpt:
      "Learn how to build modern web applications with Next.js 15 and its new features.",
    date: "2025-03-15",
    author: {
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Development",
    tags: ["Next.js", "React", "JavaScript"],
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS 4",
    slug: "mastering-tailwind-css-4",
    excerpt:
      "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
    date: "2025-03-10",
    author: {
      name: "Jane Smith",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Design",
    tags: ["CSS", "Tailwind", "Design"],
  },
  {
    id: "3",
    title: "Building with TypeScript and Express",
    slug: "building-with-typescript-and-express",
    excerpt:
      "How to create a robust backend API using TypeScript and Express.js.",
    date: "2025-03-05",
    author: {
      name: "Mike Johnson",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Backend",
    tags: ["TypeScript", "Express", "API"],
  },
  {
    id: "4",
    title: "State Management with React Context",
    slug: "state-management-with-react-context",
    excerpt:
      "Learn how to manage application state effectively using React Context.",
    date: "2025-02-28",
    author: {
      name: "Sarah Williams",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Development",
    tags: ["React", "Context API", "State Management"],
  },
  {
    id: "5",
    title: "Modern Animation with Framer Motion",
    slug: "modern-animation-with-framer-motion",
    excerpt:
      "Create stunning animations in your React applications with Framer Motion.",
    date: "2025-02-20",
    author: {
      name: "Alex Thompson",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Design",
    tags: ["Animation", "Framer Motion", "React"],
  },
  {
    id: "6",
    title: "Database Design with PostgreSQL",
    slug: "database-design-with-postgresql",
    excerpt:
      "Best practices for designing efficient and scalable databases with PostgreSQL.",
    date: "2025-02-15",
    author: {
      name: "Chris Davis",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Backend",
    tags: ["Database", "PostgreSQL", "SQL"],
  },
];

// Categories and tags for filtering
const categories = ["All", "Development", "Design", "Backend"];
const tags = [
  "React",
  "Next.js",
  "TypeScript",
  "CSS",
  "Tailwind",
  "Express",
  "API",
  "Animation",
  "Database",
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts based on search, category, and tags
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Explore articles on web development, design, and technology
        </p>
      </div>

      {/* Search and filter section */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {selectedTags.length > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {selectedTags.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Articles</SheetTitle>
                <SheetDescription>
                  Filter articles by tags to find exactly what you're looking
                  for.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Tags</h3>
                <div className="space-y-3">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="font-normal">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setSelectedTags([])}>
                    Clear All
                  </Button>
                  <Button
                    onClick={() =>
                      document.dispatchEvent(new Event("close-sheet"))
                    }
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Articles grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">No articles found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedTags([]);
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8"
            aria-current="page"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            3
          </Button>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
