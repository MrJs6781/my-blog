# My Blog Project

A modern, feature-rich blog platform built with Next.js, Tailwind CSS, and shadcn UI components.

## Features

- **Modern Blog Platform**: A responsive, feature-rich blog with a clean UI
- **Dashboard**: Admin dashboard to manage posts, comments, and analytics
- **Authentication**: User authentication and authorization system
- **Post Management**: Create, edit, and delete blog posts with a rich text editor
- **Comment System**: Threaded comments with moderation capabilities
- **Categories & Tags**: Organize posts by categories and tags
- **Search**: Full-text search functionality
- **Analytics**: Track views, engagement, and other metrics
- **Responsive Design**: Fully responsive design that works on all devices

## Technology Stack

- **Frontend**: Next.js 14+ with React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **HTTP Client**: Axios

## Project Structure

```
src/
├── app/                   # Next.js App Router structure
│   ├── (auth)/            # Authentication pages (sign in, sign up)
│   ├── api/               # API routes
│   ├── blog/              # Blog pages (listing, post view)
│   ├── dashboard/         # Admin dashboard
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── blog/              # Blog-specific components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   └── ui/                # UI components from shadcn
├── lib/                   # Utility functions and helpers
└── styles/                # Global styles
```

## API Endpoints

The API follows RESTful conventions and is organized by resource type:

### Posts

- `GET /api/auth/posts` - Get all posts with pagination
- `POST /api/auth/posts` - Create a new post
- `GET /api/auth/posts/[id]` - Get a post by ID
- `PUT /api/auth/posts/[id]` - Update a post
- `DELETE /api/auth/posts/[id]` - Delete a post
- `GET /api/auth/posts/search` - Search posts

### Comments

- `GET /api/auth/comments` - Get all comments with filtering
- `PATCH /api/auth/comments` - Update comment status
- `GET /api/auth/posts/[id]/comments` - Get comments for a post
- `POST /api/auth/posts/[id]/comments` - Add a comment to a post

### Categories & Tags

- `GET /api/auth/categories` - Get all categories
- `POST /api/auth/categories` - Create a new category
- `GET /api/auth/tags` - Get all tags
- `POST /api/auth/tags` - Create a new tag

### Analytics

- `GET /api/auth/analytics` - Get blog analytics data
- `GET /api/auth/posts/stats` - Get post statistics

### User & Profile

- `GET /api/auth/profile` - Get current user profile
- `PATCH /api/auth/profile` - Update user profile

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/my-blog-project.git
cd my-blog-project
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application can be easily deployed on Vercel or any other platform that supports Next.js.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
