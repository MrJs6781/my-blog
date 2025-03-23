import { NextRequest, NextResponse } from "next/server";

// Mock analytics data - in a real app, this would be calculated from actual data
const analyticsData = {
  overview: {
    totalPosts: 12,
    totalViews: 54300,
    totalComments: 234,
    totalLikes: 1200,
    // Monthly growth percentages
    growth: {
      posts: 20, // 20% more posts than last month
      views: 12.3,
      comments: 24,
      likes: 8.7,
    },
  },
  postsPerformance: [
    {
      id: "1",
      title: "Getting Started with Next.js 15",
      slug: "getting-started-with-nextjs-15",
      views: 12500,
      comments: 43,
      likes: 215,
      conversionRate: 4.2, // percentage
    },
    {
      id: "2",
      title: "Mastering Tailwind CSS 4",
      slug: "mastering-tailwind-css-4",
      views: 8700,
      comments: 31,
      likes: 178,
      conversionRate: 3.8,
    },
    {
      id: "3",
      title: "Building with TypeScript and Express",
      slug: "building-with-typescript-and-express",
      views: 6200,
      comments: 24,
      likes: 103,
      conversionRate: 3.1,
    },
  ],
  traffic: {
    sources: [
      { source: "Direct", percentage: 35 },
      { source: "Search", percentage: 28 },
      { source: "Social", percentage: 22 },
      { source: "Referral", percentage: 15 },
    ],
    devices: [
      { device: "Desktop", percentage: 58 },
      { device: "Mobile", percentage: 36 },
      { device: "Tablet", percentage: 6 },
    ],
  },
  engagement: {
    averageReadTime: "3m 42s",
    bounceRate: 38.5, // percentage
    returnVisitors: 42, // percentage
  },
  // Data for charts
  viewsChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [3200, 4100, 4500, 5200, 4800, 5400],
  },
  commentsChart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    data: [45, 52, 38, 60, 55, 70],
  },
  popularCategories: [
    { name: "Development", count: 5, percentage: 42 },
    { name: "Design", count: 3, percentage: 25 },
    { name: "Backend", count: 2, percentage: 17 },
    { name: "DevOps", count: 1, percentage: 8 },
    { name: "Frontend", count: 1, percentage: 8 },
  ],
  popularTags: [
    { name: "JavaScript", count: 8, percentage: 22 },
    { name: "React", count: 6, percentage: 17 },
    { name: "TypeScript", count: 5, percentage: 14 },
    { name: "Next.js", count: 4, percentage: 11 },
    { name: "CSS", count: 4, percentage: 11 },
  ],
};

// GET analytics data
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const dataType = url.searchParams.get("type") || "all";

    // Return specific subset of data or all data
    if (dataType !== "all" && dataType in analyticsData) {
      return NextResponse.json({
        // @ts-ignore - We're already checking if the key exists
        data: analyticsData[dataType],
      });
    }

    return NextResponse.json({
      data: analyticsData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
