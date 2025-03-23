"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  ThumbsUp,
  Users,
} from "lucide-react";
import axios from "axios";

// Types for analytics data
interface AnalyticsData {
  overview: {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    totalLikes: number;
    growth: {
      posts: number;
      views: number;
      comments: number;
      likes: number;
    };
  };
  postsPerformance: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
    comments: number;
    likes: number;
    conversionRate: number;
  }>;
  traffic: {
    sources: Array<{ source: string; percentage: number }>;
    devices: Array<{ device: string; percentage: number }>;
  };
  engagement: {
    averageReadTime: string;
    bounceRate: number;
    returnVisitors: number;
  };
  viewsChart: {
    labels: string[];
    data: number[];
  };
  commentsChart: {
    labels: string[];
    data: number[];
  };
  popularCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  popularTags: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/auth/analytics");
        setAnalyticsData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error || "Could not load analytics data"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Stats */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Views"
              value={analyticsData.overview.totalViews.toLocaleString()}
              icon={<Eye className="h-5 w-5" />}
              change={`${analyticsData.overview.growth.views > 0 ? "+" : ""}${
                analyticsData.overview.growth.views
              }%`}
              trend={analyticsData.overview.growth.views >= 0 ? "up" : "down"}
            />
            <StatsCard
              title="Comments"
              value={analyticsData.overview.totalComments.toLocaleString()}
              icon={<MessageSquare className="h-5 w-5" />}
              change={`${
                analyticsData.overview.growth.comments > 0 ? "+" : ""
              }${analyticsData.overview.growth.comments}%`}
              trend={
                analyticsData.overview.growth.comments >= 0 ? "up" : "down"
              }
            />
            <StatsCard
              title="Likes"
              value={analyticsData.overview.totalLikes.toLocaleString()}
              icon={<ThumbsUp className="h-5 w-5" />}
              change={`${analyticsData.overview.growth.likes > 0 ? "+" : ""}${
                analyticsData.overview.growth.likes
              }%`}
              trend={analyticsData.overview.growth.likes >= 0 ? "up" : "down"}
            />
            <StatsCard
              title="Posts"
              value={analyticsData.overview.totalPosts.toString()}
              icon={<BarChartIcon className="h-5 w-5" />}
              change={`${analyticsData.overview.growth.posts > 0 ? "+" : ""}${
                analyticsData.overview.growth.posts
              }%`}
              trend={analyticsData.overview.growth.posts >= 0 ? "up" : "down"}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* In a real app, render a chart library here */}
                  <div className="flex h-full flex-col items-center justify-center">
                    <LineChartIcon className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Chart visualization would be rendered here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comments Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {/* In a real app, render a chart library here */}
                  <div className="flex h-full flex-col items-center justify-center">
                    <BarChart className="h-16 w-16 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Chart visualization would be rendered here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-medium">By Source</h3>
                  <div className="space-y-4">
                    {analyticsData.traffic.sources.map((source) => (
                      <div key={source.source}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm">{source.source}</span>
                          <span className="text-sm font-medium">
                            {source.percentage}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-medium">By Device</h3>
                  <div className="flex h-[200px] items-center justify-center">
                    {/* In a real app, render a pie chart here */}
                    <div className="flex flex-col items-center">
                      <PieChartIcon className="h-16 w-16 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Pie chart visualization would be rendered here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b pb-2 text-left font-medium">
                        Post
                      </th>
                      <th className="border-b pb-2 text-right font-medium">
                        Views
                      </th>
                      <th className="border-b pb-2 text-right font-medium">
                        Comments
                      </th>
                      <th className="border-b pb-2 text-right font-medium">
                        Likes
                      </th>
                      <th className="border-b pb-2 text-right font-medium">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.postsPerformance.map((post) => (
                      <tr key={post.id}>
                        <td className="border-b py-3 text-left font-medium">
                          {post.title}
                        </td>
                        <td className="border-b py-3 text-right">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="border-b py-3 text-right">
                          {post.comments}
                        </td>
                        <td className="border-b py-3 text-right">
                          {post.likes}
                        </td>
                        <td className="border-b py-3 text-right">
                          {post.conversionRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularCategories.map((category) => (
                    <div key={category.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm">{category.name}</span>
                        <span className="text-sm font-medium">
                          {category.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularTags.map((tag) => (
                    <div key={tag.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm">{tag.name}</span>
                        <span className="text-sm font-medium">
                          {tag.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${tag.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-muted-foreground">
                  Audience data visualization would be rendered here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Read Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.engagement.averageReadTime}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.engagement.bounceRate}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Return Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.engagement.returnVisitors}%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stats card component
function StatsCard({
  title,
  value,
  icon,
  change,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  trend: "up" | "down";
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
          <div className="rounded-full bg-muted p-2">{icon}</div>
        </div>
        <div className="mt-4">
          <span
            className={`flex items-center text-xs font-medium ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {change}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
