import { NextRequest, NextResponse } from "next/server";

// Mock database - in a real app, this would be replaced with your database connection
export const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    content: `
    <h2 id="introduction">Introduction</h2>
    <p>Next.js 15 brings significant improvements to the React framework, making it even more powerful for building modern web applications. In this article, we'll explore the new features and how to leverage them in your projects.</p>
    
    <h2 id="installation">Installation</h2>
    <p>Getting started with Next.js 15 is straightforward. You can create a new project using the following command:</p>
    <pre><code>npx create-next-app@latest my-app</code></pre>
    <p>This will set up a new Next.js project with all the latest features and configurations.</p>
    
    <h2 id="key-features">Key Features</h2>
    <p>Next.js 15 introduces several exciting features that improve developer experience and application performance:</p>
    
    <h3 id="improved-routing">Improved Routing</h3>
    <p>The App Router has been refined with better error handling and improved nested routing capabilities. This makes creating complex application structures more intuitive than ever.</p>
    
    <h3 id="server-components">Server Components</h3>
    <p>React Server Components are now fully integrated into Next.js, allowing you to build applications that combine the interactivity of client-side apps with the performance benefits of server rendering.</p>
    
    <h3 id="turbopack">Turbopack Improvements</h3>
    <p>The new version includes significant improvements to Turbopack, making development even faster with quicker refresh times and optimized builds.</p>
    
    <h2 id="performance-optimization">Performance Optimization</h2>
    <p>Next.js 15 places a strong emphasis on performance optimization. Here are some techniques you can use to ensure your application runs smoothly:</p>
    
    <h3 id="image-optimization">Image Optimization</h3>
    <p>The Image component has been enhanced to provide better performance with improved loading strategies and optimization algorithms.</p>
    
    <h3 id="code-splitting">Code Splitting</h3>
    <p>Next.js automatically splits your code to ensure that only the necessary JavaScript is loaded for each page, significantly improving load times.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Next.js 15 represents a significant step forward in the evolution of the framework. With its focus on developer experience, performance, and seamless integration with the React ecosystem, it's an excellent choice for building modern web applications.</p>
    `,
    excerpt:
      "Learn how to build modern web applications with Next.js 15 and its new features.",
    date: "March 15, 2025",
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
      bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Development",
    tags: ["Next.js", "React", "JavaScript"],
    readTime: "5 min read",
    relatedPosts: [
      {
        id: "2",
        title: "Mastering Tailwind CSS 4",
        slug: "mastering-tailwind-css-4",
        excerpt:
          "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
        coverImage: "/images/placeholder-cover.jpg",
      },
      {
        id: "3",
        title: "Building with TypeScript and Express",
        slug: "building-with-typescript-and-express",
        excerpt:
          "How to create a robust backend API using TypeScript and Express.js.",
        coverImage: "/images/placeholder-cover.jpg",
      },
    ],
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS 4",
    slug: "mastering-tailwind-css-4",
    content: `
    <h2 id="introduction">Introduction</h2>
    <p>Tailwind CSS 4 introduces a host of new features that make it even more powerful for styling your web applications. This article explores the major improvements and how to use them effectively.</p>
    
    <h2 id="getting-started">Getting Started</h2>
    <p>To upgrade to Tailwind CSS 4, you can update your dependencies with npm:</p>
    <pre><code>npm install tailwindcss@latest</code></pre>
    
    <h2 id="key-features">Key Features</h2>
    <p>Tailwind CSS 4 comes with several exciting new features:</p>
    
    <h3 id="enhanced-customization">Enhanced Customization</h3>
    <p>The new version offers even more flexibility in customizing your design system, with improved theme configuration options.</p>
    
    <h3 id="performance-improvements">Performance Improvements</h3>
    <p>Build times have been significantly reduced, making development more efficient.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Tailwind CSS 4 continues to improve the developer experience for styling web applications, making it an excellent choice for modern projects.</p>
    `,
    excerpt:
      "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
    date: "March 10, 2025",
    author: {
      id: "2",
      name: "Jane Smith",
      avatar: "/images/placeholder-avatar.jpg",
      bio: "UI/UX Designer specializing in modern web interfaces and design systems.",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Design",
    tags: ["Tailwind CSS", "CSS", "Design"],
    readTime: "4 min read",
    relatedPosts: [
      {
        id: "1",
        title: "Getting Started with Next.js 15",
        slug: "getting-started-with-nextjs-15",
        excerpt:
          "Learn how to build modern web applications with Next.js 15 and its new features.",
        coverImage: "/images/placeholder-cover.jpg",
      },
      {
        id: "5",
        title: "Modern Animation with Framer Motion",
        slug: "modern-animation-with-framer-motion",
        excerpt:
          "Create stunning animations in your React applications with Framer Motion.",
        coverImage: "/images/placeholder-cover.jpg",
      },
    ],
  },
  {
    id: "3",
    title: "Building with TypeScript and Express",
    slug: "building-with-typescript-and-express",
    content: `
    <h2 id="introduction">Introduction</h2>
    <p>TypeScript and Express make a powerful combination for building robust backend APIs. This article will guide you through setting up and structuring an Express.js API with TypeScript.</p>
    
    <h2 id="setup">Project Setup</h2>
    <p>Let's start by setting up our project:</p>
    <pre><code>npm init -y
npm install express
npm install -D typescript @types/express ts-node</code></pre>
    
    <h2 id="configuration">TypeScript Configuration</h2>
    <p>Create a tsconfig.json file with the necessary configuration for your Express app.</p>
    
    <h2 id="creating-routes">Creating Routes</h2>
    <p>With TypeScript, you can define strongly-typed request and response objects, making your API more reliable.</p>
    
    <h2 id="conclusion">Conclusion</h2>
    <p>Using TypeScript with Express provides type safety and improved developer experience when building backend services.</p>
    `,
    excerpt:
      "How to create a robust backend API using TypeScript and Express.js.",
    date: "March 5, 2025",
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
      bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Backend",
    tags: ["TypeScript", "Express", "API"],
    readTime: "6 min read",
    relatedPosts: [
      {
        id: "6",
        title: "Database Design with PostgreSQL",
        slug: "database-design-with-postgresql",
        excerpt:
          "Best practices for designing efficient and scalable databases with PostgreSQL.",
        coverImage: "/images/placeholder-cover.jpg",
      },
      {
        id: "4",
        title: "State Management with React Context",
        slug: "state-management-with-react-context",
        excerpt:
          "Learn how to manage application state effectively using React Context.",
        coverImage: "/images/placeholder-cover.jpg",
      },
    ],
  },
];

// GET all posts
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const category = url.searchParams.get("category");

    // Filter and paginate posts
    let filteredPosts = [...posts];

    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === category
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - create a new post
export async function POST(request: NextRequest) {
  try {
    // In a real app, you would validate authentication here

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create a new post (mock implementation)
    const newPost = {
      id: (posts.length + 1).toString(),
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: {
        id: "1",
        name: "John Doe",
        avatar: "/images/placeholder-avatar.jpg",
        bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
      },
      readTime: `${Math.ceil(body.content.length / 1000)} min read`,
      relatedPosts: [],
      ...body,
    };

    // In a real app, you would save to database here
    posts.push(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
