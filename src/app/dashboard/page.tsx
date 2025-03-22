import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  BookOpen,
  FileText,
  MessageSquare,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This would come from your API in a real application
const stats = [
  {
    name: "Total Posts",
    value: "12",
    icon: FileText,
    change: "+2",
    trend: "increase",
  },
  {
    name: "Total Views",
    value: "54.3K",
    icon: BookOpen,
    change: "+12.3%",
    trend: "increase",
  },
  {
    name: "Comments",
    value: "234",
    icon: MessageSquare,
    change: "+24%",
    trend: "increase",
  },
  {
    name: "Likes",
    value: "1.2K",
    icon: ThumbsUp,
    change: "+8.7%",
    trend: "increase",
  },
];

// Sample recent posts data
const recentPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    date: "2 days ago",
    views: 432,
    comments: 23,
    status: "published",
  },
  {
    id: "2",
    title: "The Power of TypeScript in Modern Web Development",
    date: "5 days ago",
    views: 856,
    comments: 41,
    status: "published",
  },
  {
    id: "3",
    title: "Building Responsive UIs with Tailwind CSS 4",
    date: "1 week ago",
    views: 1203,
    comments: 36,
    status: "published",
  },
  {
    id: "4",
    title: "Introduction to Express.js and Prisma",
    date: "2 weeks ago",
    views: 978,
    comments: 18,
    status: "draft",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">New Post</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <div className="rounded-full bg-muted p-2">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-xs font-medium ${
                    stat.trend === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="ml-1 text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b pb-2 text-left font-medium">Post</th>
                  <th className="border-b pb-2 text-left font-medium">Date</th>
                  <th className="border-b pb-2 text-left font-medium">Views</th>
                  <th className="border-b pb-2 text-left font-medium">
                    Comments
                  </th>
                  <th className="border-b pb-2 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id}>
                    <td className="border-b py-3 text-left">
                      <Link
                        href={`/dashboard/posts/${post.id}`}
                        className="font-medium hover:underline"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="border-b py-3 text-left text-muted-foreground">
                      {post.date}
                    </td>
                    <td className="border-b py-3 text-left text-muted-foreground">
                      {post.views}
                    </td>
                    <td className="border-b py-3 text-left text-muted-foreground">
                      {post.comments}
                    </td>
                    <td className="border-b py-3 text-left">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard/posts">View All Posts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-medium">Manage Posts</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                View and edit all your blog posts
              </p>
              <Button variant="ghost" className="mt-4" asChild>
                <Link href="/dashboard/posts">View Posts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <MessageSquare className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-medium">Manage Comments</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Review and moderate comments
              </p>
              <Button variant="ghost" className="mt-4" asChild>
                <Link href="/dashboard/comments">View Comments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <User className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-medium">Edit Profile</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                Update your author profile
              </p>
              <Button variant="ghost" className="mt-4" asChild>
                <Link href="/dashboard/profile">View Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center">
              <BarChart className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-medium">Analytics</h3>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                View your content performance
              </p>
              <Button variant="ghost" className="mt-4" asChild>
                <Link href="/dashboard/analytics">View Stats</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
