"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Share2,
  Users,
  Lock,
  FileText,
  Image,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    // Show success notification if needed
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Settings</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="blogName">Blog Name</Label>
                    <Input
                      id="blogName"
                      defaultValue="My Blog"
                      placeholder="Enter your blog name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="blogDescription">Blog Description</Label>
                    <Textarea
                      id="blogDescription"
                      defaultValue="A blog about web development and technology."
                      placeholder="Enter your blog description"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="siteUrl"
                        defaultValue="https://myblog.com"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="postsPerPage">Posts Per Page</Label>
                    <Select defaultValue="10">
                      <SelectTrigger id="postsPerPage">
                        <SelectValue placeholder="Select number of posts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="dateFormat">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                        <SelectItem value="textual">Month Day, Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="metaTitle">Default Meta Title</Label>
                    <Input
                      id="metaTitle"
                      defaultValue="My Blog - Web Development and Technology"
                      placeholder="Enter default meta title"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="metaDescription">
                      Default Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      defaultValue="A blog about web development, technology, and coding tutorials."
                      placeholder="Enter default meta description"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="robotsIndex">
                        Allow Search Engines to Index Site
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        (Recommended)
                      </span>
                    </div>
                    <Switch id="robotsIndex" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="canonicalUrls">Use Canonical URLs</Label>
                    </div>
                    <Switch id="canonicalUrls" defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="socialImage">Default Social Image</Label>
                    <div className="flex items-center">
                      <Image className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="socialImage"
                        defaultValue="/images/default-social.jpg"
                        placeholder="Path to default social image"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Settings */}
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableComments">Enable Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to comment on posts
                      </p>
                    </div>
                    <Switch id="enableComments" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="moderateComments">
                        Moderate Comments
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Review comments before publishing
                      </p>
                    </div>
                    <Switch id="moderateComments" defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="commentModeration">
                      Comment Moderation
                    </Label>
                    <Select defaultValue="manual">
                      <SelectTrigger id="commentModeration">
                        <SelectValue placeholder="Select moderation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No moderation</SelectItem>
                        <SelectItem value="manual">Manual approval</SelectItem>
                        <SelectItem value="automatic">
                          Automatic with spam filter
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="commentsOrder">
                      Comments Display Order
                    </Label>
                    <Select defaultValue="newest">
                      <SelectTrigger id="commentsOrder">
                        <SelectValue placeholder="Select display order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="popular">
                          Most popular first
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="nestedComments">
                        Allow Nested Comments
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable replies to comments
                      </p>
                    </div>
                    <Switch id="nestedComments" defaultChecked />
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Publishing Settings */}
        <TabsContent value="publishing">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="defaultCategory">Default Category</Label>
                    </div>
                    <Select defaultValue="general">
                      <SelectTrigger id="defaultCategory" className="w-[200px]">
                        <SelectValue placeholder="Select default category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoPublish">
                        Auto-Publish Scheduled Posts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically publish posts at scheduled time
                      </p>
                    </div>
                    <Switch id="autoPublish" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="featuredImage">
                        Require Featured Image
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Require posts to have a featured image
                      </p>
                    </div>
                    <Switch id="featuredImage" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="excerptGeneration">
                        Auto-Generate Excerpts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate excerpts from post content
                      </p>
                    </div>
                    <Switch id="excerptGeneration" defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="excerptLength">
                      Excerpt Length (words)
                    </Label>
                    <Input
                      id="excerptLength"
                      type="number"
                      defaultValue="55"
                      min="10"
                      max="200"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Settings */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnailSize">Thumbnail Size</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="thumbnailWidth"
                        type="number"
                        defaultValue="150"
                        min="50"
                        max="500"
                        placeholder="Width"
                      />
                      <Input
                        id="thumbnailHeight"
                        type="number"
                        defaultValue="150"
                        min="50"
                        max="500"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="mediumSize">Medium Size</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="mediumWidth"
                        type="number"
                        defaultValue="300"
                        min="100"
                        max="1000"
                        placeholder="Width"
                      />
                      <Input
                        id="mediumHeight"
                        type="number"
                        defaultValue="300"
                        min="100"
                        max="1000"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="largeSize">Large Size</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="largeWidth"
                        type="number"
                        defaultValue="1024"
                        min="500"
                        max="2000"
                        placeholder="Width"
                      />
                      <Input
                        id="largeHeight"
                        type="number"
                        defaultValue="1024"
                        min="500"
                        max="2000"
                        placeholder="Height"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="imageOptimization">
                        Image Optimization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically optimize uploaded images
                      </p>
                    </div>
                    <Switch id="imageOptimization" defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      defaultValue="jpg, jpeg, png, gif, svg, webp"
                      placeholder="Comma-separated file extensions"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminEmail"
                        type="email"
                        defaultValue="admin@myblog.com"
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newCommentNotification">
                        New Comment Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone comments on your posts
                      </p>
                    </div>
                    <Switch id="newCommentNotification" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newPostNotification">
                        New Post Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notify subscribers when new posts are published
                      </p>
                    </div>
                    <Switch id="newPostNotification" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weeklyDigest">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">
                        Send weekly digest of blog activity
                      </p>
                    </div>
                    <Switch id="weeklyDigest" />
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
