"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  ThumbsUp,
  Users,
  ArrowRight,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data - in a real app this would come from your API
const stats = [
  { name: "Total Posts", value: 12, icon: FileText },
  { name: "Total Comments", value: 83, icon: MessageSquare },
  { name: "Total Likes", value: 245, icon: ThumbsUp },
  { name: "Total Views", value: 1247, icon: Eye },
];

const recentPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    views: 423,
    likes: 27,
    comments: 8,
    status: "published",
    date: "2025-03-15",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS 4",
    views: 318,
    likes: 19,
    comments: 12,
    status: "published",
    date: "2025-03-10",
  },
  {
    id: "3",
    title: "Building with TypeScript and Express",
    views: 156,
    likes: 14,
    comments: 4,
    status: "draft",
    date: "2025-03-05",
  },
];

const recentActivity = [
  {
    text: "New comment on 'Getting Started with Next.js 15'",
    time: "10 minutes ago",
  },
  { text: "New subscriber joined your blog", time: "1 hour ago" },
  {
    text: "Your post 'Mastering Tailwind CSS 4' was featured",
    time: "2 hours ago",
  },
  {
    text: "3 new likes on 'Building with TypeScript and Express'",
    time: "4 hours ago",
  },
  { text: "New comment on 'Mastering Tailwind CSS 4'", time: "5 hours ago" },
];

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">Create New Post</Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="flex flex-row items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div>
                  <StatIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Growth cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.2%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.3%</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-3.4%</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs section for posts and activity */}
      {/* <Tabs defaultValue="recent-posts" className="w-full">
        <TabsList>
          <TabsTrigger value="recent-posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent-posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>
                Your most recent blog posts and their performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                      <th className="whitespace-nowrap px-4 py-3">Title</th>
                      <th className */}
    </div>
  );
}
