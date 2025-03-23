# Next.js Blog Platform

A modern blog platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 User authentication and role-based access control
- 📝 Full blog post management with rich content
- 🏷️ Categories and tags for content organization
- 💬 Comment system with like functionality
- 🎨 Beautiful UI with Tailwind CSS and Shadcn/UI
- 🚀 API routes for data management
- 🔍 Pagination and filtering for blog posts
- 🌙 Dark/light mode support

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **UI Components**: Shadcn/UI

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- PostgreSQL database

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/my-blog-project.git
   cd my-blog-project
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure your environment

   - Copy `.env.example` to `.env` (or create a new `.env` file)
   - Update the `DATABASE_URL` with your PostgreSQL connection string
   - Set a strong `JWT_SECRET` for authentication

4. Set up the database

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Create database tables
   npm run prisma:migrate

   # Seed the database with initial data
   npm run prisma:seed
   ```

5. Start the development server

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main database models:

- `User`: Manages user accounts and authentication
- `Post`: Contains blog post content and metadata
- `Category`: Organizes posts into categories
- `Tag`: Adds additional metadata to posts
- `Comment`: Stores user comments on posts

## API Routes

The backend is built with Next.js API routes:

- Authentication

  - `POST /api/auth/signup`: Register a new user
  - `POST /api/auth/signin`: Log in a user
  - `GET /api/auth/me`: Get the current user's profile

- Posts

  - `GET /api/auth/posts`: Get all posts with pagination and filtering
  - `POST /api/auth/posts`: Create a new post (requires AUTHOR/ADMIN role)
  - `GET /api/auth/posts/[slug]`: Get a single post by slug
  - `PUT /api/auth/posts/[slug]`: Update a post (requires AUTHOR/ADMIN role)
  - `DELETE /api/auth/posts/[slug]`: Delete a post (requires AUTHOR/ADMIN role)
  - `GET /api/auth/posts/[id]`: Get a single post by ID
  - `PUT /api/auth/posts/[id]`: Update a post by ID (requires AUTHOR/ADMIN role)
  - `DELETE /api/auth/posts/[id]`: Delete a post by ID (requires AUTHOR/ADMIN role)

- Comments

  - `GET /api/auth/posts/[slug]/comments`: Get comments for a post by slug
  - `POST /api/auth/posts/[slug]/comments`: Add a comment to a post by slug (requires authentication)
  - `GET /api/auth/posts/[id]/comments`: Get comments for a post by ID
  - `POST /api/auth/posts/[id]/comments`: Add a comment to a post by ID (requires authentication)

- Categories

  - `GET /api/auth/categories`: Get all categories
  - `POST /api/auth/categories`: Create a category (requires ADMIN role)
  - `GET /api/auth/categories/[slug]`: Get a category by slug
  - `PUT /api/auth/categories/[slug]`: Update a category (requires ADMIN role)
  - `DELETE /api/auth/categories/[slug]`: Delete a category (requires ADMIN role)

- Tags
  - `GET /api/auth/tags`: Get all tags
  - `POST /api/auth/tags`: Create a tag (requires AUTHOR/ADMIN role)
  - `GET /api/auth/tags/[slug]`: Get a tag by slug
  - `PUT /api/auth/tags/[slug]`: Update a tag (requires AUTHOR/ADMIN role)
  - `DELETE /api/auth/tags/[slug]`: Delete a tag (requires ADMIN role)

## User Roles

- **User**: Can read posts and add comments
- **Author**: Can create and edit their own posts
- **Admin**: Has full access to manage all content and users

## Default Users

After seeding the database, you can log in with the following credentials:

- **Admin User**: admin@blog.com / admin123
- **Author User**: author@blog.com / author123
- **Regular User**: user@blog.com / user123

## License

This project is licensed under the MIT License.
