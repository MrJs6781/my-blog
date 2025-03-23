import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import { Role } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create users
  const adminPassword = await hashPassword("admin123");
  const authorPassword = await hashPassword("author123");
  const userPassword = await hashPassword("user123");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      email: "admin@blog.com",
      name: "Admin User",
      password: adminPassword,
      role: Role.ADMIN,
      bio: "Blog Administrator",
      avatar: "/images/placeholder-avatar.jpg",
    },
  });

  // Create author user
  const author = await prisma.user.upsert({
    where: { email: "author@blog.com" },
    update: {},
    create: {
      email: "author@blog.com",
      name: "John Doe",
      password: authorPassword,
      role: Role.AUTHOR,
      bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
      avatar: "/images/placeholder-avatar.jpg",
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: "user@blog.com" },
    update: {},
    create: {
      email: "user@blog.com",
      name: "Jane Smith",
      password: userPassword,
      role: Role.USER,
      bio: "Enthusiast reader",
      avatar: "/images/placeholder-avatar.jpg",
    },
  });

  console.log("Users created:", { admin, author, user });

  // Create categories
  const devCategory = await prisma.category.upsert({
    where: { slug: "development" },
    update: {},
    create: {
      name: "Development",
      slug: "development",
    },
  });

  const designCategory = await prisma.category.upsert({
    where: { slug: "design" },
    update: {},
    create: {
      name: "Design",
      slug: "design",
    },
  });

  const techCategory = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: {
      name: "Technology",
      slug: "technology",
    },
  });

  console.log("Categories created:", {
    devCategory,
    designCategory,
    techCategory,
  });

  // Create tags
  const tags = [
    { name: "Next.js", slug: "nextjs" },
    { name: "React", slug: "react" },
    { name: "JavaScript", slug: "javascript" },
    { name: "Tailwind", slug: "tailwind" },
    { name: "CSS", slug: "css" },
    { name: "TypeScript", slug: "typescript" },
    { name: "API", slug: "api" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log("Tags created");

  // Create posts
  const nextJsPost = await prisma.post.upsert({
    where: { slug: "getting-started-with-nextjs-15" },
    update: {},
    create: {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-with-nextjs-15",
      excerpt:
        "Learn how to build modern web applications with Next.js 15 and its new features.",
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
      published: true,
      readTime: "5 min read",
      featuredImage: "/images/placeholder-cover.jpg",
      authorId: author.id,
      categoryId: devCategory.id,
    },
  });

  const tailwindPost = await prisma.post.upsert({
    where: { slug: "mastering-tailwind-css-4" },
    update: {},
    create: {
      title: "Mastering Tailwind CSS 4",
      slug: "mastering-tailwind-css-4",
      excerpt:
        "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
      content: `
      <h2 id="introduction">Introduction</h2>
      <p>Tailwind CSS 4 introduces a range of new features and improvements that make it even more powerful for creating beautiful user interfaces. In this guide, we'll explore these new features and show you how to use them effectively in your projects.</p>
      
      <h2 id="installation">Installation</h2>
      <p>To get started with Tailwind CSS 4, you can install it via npm:</p>
      <pre><code>npm install tailwindcss@latest</code></pre>
      <p>Then, create a configuration file:</p>
      <pre><code>npx tailwindcss init</code></pre>
      
      <h2 id="new-features">New Features</h2>
      <p>Tailwind CSS 4 brings several exciting new features to the table:</p>
      
      <h3 id="improved-performance">Improved Performance</h3>
      <p>The build process has been optimized, resulting in faster compilation times and smaller CSS bundle sizes.</p>
      
      <h3 id="enhanced-customization">Enhanced Customization</h3>
      <p>The theme system has been expanded to provide even more flexibility when customizing your design system.</p>
      
      <h3 id="new-utilities">New Utilities</h3>
      <p>A host of new utility classes have been added, covering areas like animations, filters, and more complex layout capabilities.</p>
      
      <h2 id="practical-examples">Practical Examples</h2>
      <p>Let's look at some practical examples of how you can use these new features in your projects.</p>
      
      <h3 id="responsive-design">Responsive Design</h3>
      <p>Tailwind's responsive design capabilities have been enhanced, making it easier than ever to create interfaces that look great on any device.</p>
      
      <h3 id="dark-mode">Dark Mode</h3>
      <p>The dark mode support has been improved, with new utilities specifically designed for creating beautiful dark mode experiences.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Tailwind CSS 4 represents a significant step forward for the framework, offering improved performance, enhanced customization, and a range of new utilities. By mastering these new features, you can create more beautiful and efficient user interfaces with less effort.</p>
      `,
      published: true,
      readTime: "4 min read",
      featuredImage: "/images/placeholder-cover.jpg",
      authorId: author.id,
      categoryId: designCategory.id,
    },
  });

  const typescriptPost = await prisma.post.upsert({
    where: { slug: "building-with-typescript-and-express" },
    update: {},
    create: {
      title: "Building with TypeScript and Express",
      slug: "building-with-typescript-and-express",
      excerpt:
        "How to create a robust backend API using TypeScript and Express.js.",
      content: `
      <h2 id="introduction">Introduction</h2>
      <p>TypeScript and Express make a powerful combination for building robust backend APIs. In this tutorial, we'll explore how to set up a project using these technologies and implement common patterns for building scalable applications.</p>
      
      <h2 id="setup">Project Setup</h2>
      <p>Let's start by setting up a new TypeScript project with Express:</p>
      <pre><code>npm init -y
npm install express
npm install --save-dev typescript @types/express @types/node
npx tsc --init</code></pre>
      
      <h2 id="basic-structure">Basic Project Structure</h2>
      <p>A well-organized project structure is essential for maintainability. Here's a recommended approach:</p>
      
      <h3 id="folder-structure">Folder Structure</h3>
      <p>Create the following directory structure:</p>
      <pre><code>src/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
└── app.ts</code></pre>
      
      <h3 id="type-safety">Leveraging Type Safety</h3>
      <p>One of the key benefits of TypeScript is its strong typing system. Let's see how we can use it to make our Express application more robust.</p>
      
      <h2 id="implementing-routes">Implementing Routes</h2>
      <p>Routes in Express can be better organized and type-safe with TypeScript.</p>
      
      <h3 id="controller-pattern">Controller Pattern</h3>
      <p>Using the controller pattern helps separate business logic from routing concerns, making your code more maintainable.</p>
      
      <h3 id="middleware">Middleware</h3>
      <p>TypeScript can help ensure your middleware functions are correctly typed, preventing runtime errors.</p>
      
      <h2 id="database-integration">Database Integration</h2>
      <p>Let's look at how to integrate a database with our TypeScript and Express application.</p>
      
      <h3 id="orm-usage">ORM Usage</h3>
      <p>Using an ORM like Prisma or TypeORM with TypeScript provides excellent type safety for your database operations.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>TypeScript and Express together provide a solid foundation for building robust, maintainable backend applications. By leveraging TypeScript's type system, you can catch errors earlier in the development process and create more reliable APIs.</p>
      `,
      published: true,
      readTime: "6 min read",
      featuredImage: "/images/placeholder-cover.jpg",
      authorId: author.id,
      categoryId: devCategory.id,
    },
  });

  console.log("Posts created");

  // Add tags to posts
  const tagData = [
    { postId: nextJsPost.id, tags: ["nextjs", "react", "javascript"] },
    { postId: tailwindPost.id, tags: ["tailwind", "css", "design"] },
    { postId: typescriptPost.id, tags: ["typescript", "javascript", "api"] },
  ];

  for (const { postId, tags } of tagData) {
    for (const tagSlug of tags) {
      const tag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
      });

      if (tag) {
        await prisma.tagsOnPosts.create({
          data: {
            postId,
            tagId: tag.id,
          },
        });
      }
    }
  }

  console.log("Tags connected to posts");

  // Create related posts
  const relatedPostsData = [
    { postId: nextJsPost.id, relatedToId: tailwindPost.id },
    { postId: nextJsPost.id, relatedToId: typescriptPost.id },
    { postId: tailwindPost.id, relatedToId: nextJsPost.id },
    { postId: typescriptPost.id, relatedToId: nextJsPost.id },
  ];

  for (const { postId, relatedToId } of relatedPostsData) {
    await prisma.relatedPost.upsert({
      where: {
        postId_relatedToId: {
          postId,
          relatedToId,
        },
      },
      update: {},
      create: {
        postId,
        relatedToId,
      },
    });
  }

  console.log("Related posts set up");

  // Create comments
  const comments = [
    {
      postId: nextJsPost.id,
      authorId: user.id,
      content: "This was really helpful, thanks for sharing!",
      likes: 5,
    },
    {
      postId: nextJsPost.id,
      authorId: admin.id,
      content:
        "I've been looking for a clear explanation of Next.js 15 features. Great article!",
      likes: 3,
    },
    {
      postId: tailwindPost.id,
      authorId: user.id,
      content: "Tailwind CSS has been a game-changer for my projects.",
      likes: 7,
    },
  ];

  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  console.log("Comments created");
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
