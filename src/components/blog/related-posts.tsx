import { FC } from "react";
import { PostCard, PostCardProps } from "./post-card";

interface RelatedPostsProps {
  currentPostId: string;
  posts: PostCardProps["post"][];
  title?: string;
  limit?: number;
}

export const RelatedPosts: FC<RelatedPostsProps> = ({
  currentPostId,
  posts,
  title = "Related Posts",
  limit = 3,
}) => {
  // Filter out the current post and limit the number of related posts
  const relatedPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};
