"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart,
  BookOpen,
  Edit,
  FileText,
  MessageSquare,
  PenTool,
  Plus,
  Settings,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/context/auth-context";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  totalCategories: number;
  totalTags: number;
  recentViews: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    totalCategories: 0,
    totalTags: 0,
    recentViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

    // Simulate fetching dashboard stats
    setTimeout(() => {
      // Mock data - in a real app, this would be API calls
      setStats({
        totalPosts: 5,
        publishedPosts: 3,
        draftPosts: 2,
        totalComments: 12,
        totalCategories: 4,
        totalTags: 8,
        recentViews: 423,
      });
      setIsLoading(false);
    }, 500);
  }, [user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.publishedPosts} published, {stats.draftPosts} drafts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComments}</div>
                <p className="text-xs text-muted-foreground">
                  Across all your posts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalCategories}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalTags} tags
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentViews}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks for managing your blog
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/posts/new">
                    <PenTool className="mr-2 h-4 w-4" />
                    Write New Post
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/posts">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Posts
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/comments">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Moderate Comments
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your blog</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Edit className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Post Updated
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You updated "Getting Started with Next.js"
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New Comment
                    </p>
                    <p className="text-sm text-muted-foreground">
                      John Smith commented on "React Best Practices"
                    </p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Traffic Spike
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your blog saw 200+ visits today
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/analytics">View All Activity</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Popular Content</CardTitle>
                <CardDescription>Your most viewed articles</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        10 Tips for Better React Code
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Published 2 weeks ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">145</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Getting Started with TypeScript
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Published 1 month ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">98</span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Why Next.js is the Future
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Published 3 weeks ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">76</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/analytics">View Analytics</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>
                Your blog traffic for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Analytics charts coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and activities on your blog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Mock activity feed */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {
                            [
                              "Post published",
                              "New comment",
                              "Profile updated",
                              "Category added",
                              "Settings changed",
                            ][i % 5]
                          }
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {
                            [
                              "2 hours ago",
                              "5 hours ago",
                              "Yesterday",
                              "2 days ago",
                              "1 week ago",
                            ][i % 5]
                          }
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {
                          [
                            'You published "Getting Started with Next.js"',
                            'John Smith commented on "React Best Practices"',
                            "You updated your profile picture",
                            'You added a new category "TypeScript"',
                            "You changed your blog settings",
                          ][i % 5]
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
