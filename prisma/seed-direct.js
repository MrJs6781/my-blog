// Direct JavaScript seed file to avoid TypeScript issues
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

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
      role: "ADMIN",
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
      role: "AUTHOR",
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
      role: "USER",
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
      `,
      published: true,
      readTime: "6 min read",
      featuredImage: "/images/placeholder-cover.jpg",
      authorId: author.id,
      categoryId: techCategory.id,
    },
  });

  console.log("Posts created:", {
    nextJsPost,
    tailwindPost,
    typescriptPost,
  });

  // Create some tags on posts
  const tagsToAdd = [
    {
      postSlug: "getting-started-with-nextjs-15",
      tagSlugs: ["nextjs", "react", "javascript"],
    },
    {
      postSlug: "mastering-tailwind-css-4",
      tagSlugs: ["tailwind", "css", "design"],
    },
    {
      postSlug: "building-with-typescript-and-express",
      tagSlugs: ["typescript", "api", "javascript"],
    },
  ];

  for (const { postSlug, tagSlugs } of tagsToAdd) {
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true },
    });

    for (const tagSlug of tagSlugs) {
      const tag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
        select: { id: true },
      });

      if (post && tag) {
        await prisma.tagsOnPosts.create({
          data: {
            postId: post.id,
            tagId: tag.id,
          },
        });
      }
    }
  }

  console.log("Tags added to posts");

  // Create some comments
  const commentsData = [
    {
      postSlug: "getting-started-with-nextjs-15",
      authorEmail: "user@blog.com",
      content: "This was really helpful, thanks for sharing!",
    },
    {
      postSlug: "getting-started-with-nextjs-15",
      authorEmail: "author@blog.com",
      content: "Glad you enjoyed it! Let me know if you have any questions.",
    },
    {
      postSlug: "mastering-tailwind-css-4",
      authorEmail: "user@blog.com",
      content: "Tailwind CSS has been a game-changer for my projects.",
    },
  ];

  for (const commentData of commentsData) {
    const post = await prisma.post.findUnique({
      where: { slug: commentData.postSlug },
      select: { id: true },
    });

    const author = await prisma.user.findUnique({
      where: { email: commentData.authorEmail },
      select: { id: true },
    });

    if (post && author) {
      await prisma.comment.create({
        data: {
          content: commentData.content,
          postId: post.id,
          authorId: author.id,
        },
      });
    }
  }

  console.log("Comments created");

  // Create related posts
  const relatedPostsData = [
    {
      postSlug: "getting-started-with-nextjs-15",
      relatedSlug: "mastering-tailwind-css-4",
    },
    {
      postSlug: "mastering-tailwind-css-4",
      relatedSlug: "building-with-typescript-and-express",
    },
    {
      postSlug: "building-with-typescript-and-express",
      relatedSlug: "getting-started-with-nextjs-15",
    },
  ];

  for (const { postSlug, relatedSlug } of relatedPostsData) {
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true },
    });

    const relatedPost = await prisma.post.findUnique({
      where: { slug: relatedSlug },
      select: { id: true },
    });

    if (post && relatedPost) {
      await prisma.relatedPost.create({
        data: {
          postId: post.id,
          relatedToId: relatedPost.id,
        },
      });
    }
  }

  console.log("Related posts created");
  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
