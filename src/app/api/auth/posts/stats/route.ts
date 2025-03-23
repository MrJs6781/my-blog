import { NextRequest, NextResponse } from "next/server";
import { posts } from "../route";

// Define types for our stats
interface PostViewsData {
  [key: string]: number;
}

interface PostCommentsData {
  [key: string]: number;
}

interface PostLikesData {
  [key: string]: number;
}

interface ViewDataPoint {
  date: string;
  count: number;
}

interface PostViewsTimeSeriesData {
  [key: string]: ViewDataPoint[];
}

// Mock post statistics that would be calculated from real data
const postStats = {
  // Post views by ID
  viewsById: {
    "1": 12500,
    "2": 8700,
    "3": 6200,
  } as PostViewsData,
  // Comments count by post ID
  commentsById: {
    "1": 43,
    "2": 31,
    "3": 24,
  } as PostCommentsData,
  // Likes count by post ID
  likesById: {
    "1": 215,
    "2": 178,
    "3": 103,
  } as PostLikesData,
  // Mock time-series data for views (last 30 days)
  viewsTimeSeries: {
    "1": [
      { date: "2025-02-14", count: 320 },
      { date: "2025-02-15", count: 450 },
      { date: "2025-02-16", count: 380 },
      // ... more data points
    ],
    "2": [
      { date: "2025-02-14", count: 215 },
      { date: "2025-02-15", count: 290 },
      { date: "2025-02-16", count: 245 },
      // ... more data points
    ],
    "3": [
      { date: "2025-02-14", count: 180 },
      { date: "2025-02-15", count: 205 },
      { date: "2025-02-16", count: 175 },
      // ... more data points
    ],
  } as PostViewsTimeSeriesData,
};

// GET stats for all posts or a specific post
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("id");

    // If a post ID is provided, return stats for that post only
    if (postId) {
      const post = posts.find((p) => p.id === postId);

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({
        stats: {
          post: {
            id: post.id,
            title: post.title,
            slug: post.slug,
          },
          views: postStats.viewsById[postId] || 0,
          comments: postStats.commentsById[postId] || 0,
          likes: postStats.likesById[postId] || 0,
          viewsTimeSeries: postStats.viewsTimeSeries[postId] || [],
        },
      });
    }

    // If no post ID is provided, return aggregated stats for all posts
    const allPostStats = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      views: postStats.viewsById[post.id] || 0,
      comments: postStats.commentsById[post.id] || 0,
      likes: postStats.likesById[post.id] || 0,
    }));

    // Sort by views (descending)
    allPostStats.sort((a, b) => b.views - a.views);

    return NextResponse.json({
      stats: {
        posts: allPostStats,
        totalViews: Object.values(postStats.viewsById).reduce(
          (sum, count) => sum + count,
          0
        ),
        totalComments: Object.values(postStats.commentsById).reduce(
          (sum, count) => sum + count,
          0
        ),
        totalLikes: Object.values(postStats.likesById).reduce(
          (sum, count) => sum + count,
          0
        ),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post statistics" },
      { status: 500 }
    );
  }
}
