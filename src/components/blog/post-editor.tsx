"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// You would typically use a rich text editor library like TipTap, CKEditor, etc.
// This is a simplified version for demonstration purposes

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface PostEditorProps {
  initialData?: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    categoryId?: string;
    tags?: string[];
    published?: boolean;
  };
  categories: Category[];
  tags: Tag[];
  onSave: (data: any) => void;
  onPreview?: () => void;
  isSubmitting?: boolean;
}

export const PostEditor: FC<PostEditorProps> = ({
  initialData = {},
  categories,
  tags,
  onSave,
  onPreview,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
  const [coverImage, setCoverImage] = useState(initialData.coverImage || "");
  const [categoryId, setCategoryId] = useState(initialData.categoryId || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData.tags || []
  );
  const [isPublished, setIsPublished] = useState(
    initialData.published || false
  );
  const [activeTab, setActiveTab] = useState<string>("write");

  const handleSaveDraft = () => {
    onSave({
      title,
      content,
      excerpt,
      coverImage,
      categoryId,
      tags: selectedTags,
      published: false,
    });
  };

  const handlePublish = () => {
    onSave({
      title,
      content,
      excerpt,
      coverImage,
      categoryId,
      tags: selectedTags,
      published: true,
    });
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-base font-semibold">
          Post Title
        </Label>
        <Input
          id="title"
          className="mt-1 text-lg"
          placeholder="Enter post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <Tabs defaultValue="write" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview" disabled={!content}>
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-4">
          <Label htmlFor="content" className="text-base font-semibold">
            Content
          </Label>
          <Textarea
            id="content"
            className="mt-1 min-h-[400px] font-mono"
            placeholder="Write your post content here (supports Markdown)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-4">
          {activeTab === "preview" && (
            <div className="prose prose-lg max-w-none rounded-md border border-border p-4 dark:prose-invert">
              <h1>{title}</h1>
              {/* In a real app, you would render the Markdown preview here */}
              <div
                dangerouslySetInnerHTML={{
                  __html: content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="excerpt" className="text-base font-semibold">
            Excerpt
          </Label>
          <Textarea
            id="excerpt"
            className="mt-1"
            placeholder="Brief summary of your post..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="coverImage" className="text-base font-semibold">
            Cover Image URL
          </Label>
          <Input
            id="coverImage"
            className="mt-1"
            placeholder="https://example.com/image.jpg"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          {coverImage && (
            <div className="mt-2 aspect-video max-h-36 overflow-hidden rounded-md border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Cover preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/placeholder-cover.jpg";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="category" className="text-base font-semibold">
            Category
          </Label>
          <Select
            value={categoryId}
            onValueChange={(value) => setCategoryId(value)}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-semibold">Tags</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                type="button"
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting || !title}
        >
          Save Draft
        </Button>
        <Button
          variant="secondary"
          onClick={onPreview}
          disabled={isSubmitting || !title || !content}
        >
          Preview
        </Button>
        <Button
          onClick={handlePublish}
          disabled={isSubmitting || !title || !content}
        >
          {isPublished ? "Update" : "Publish"}
        </Button>
      </div>
    </div>
  );
};
