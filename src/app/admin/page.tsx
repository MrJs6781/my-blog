"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";

export default function AdminPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/signin");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Fetch users (in a real app)
  useEffect(() => {
    if (user?.role === "ADMIN") {
      setLoading(true);
      // This is a simulated API call since we don't have a real endpoint
      setTimeout(() => {
        // Simulated user data
        setUsers([
          {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "ADMIN",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "John Doe",
            email: "john@example.com",
            role: "USER",
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "USER",
            createdAt: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [user]);

  if (isLoading || loading || !user || user.role !== "ADMIN") {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-8 w-48 rounded bg-muted animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 w-full rounded bg-muted animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{users.length}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {users.filter((u) => u.role === "ADMIN").length}
              </CardTitle>
              <CardDescription>Admins</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {users.filter((u) => u.role === "USER").length}
              </CardTitle>
              <CardDescription>Regular Users</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left font-medium">Name</th>
                    <th className="py-3 text-left font-medium">Email</th>
                    <th className="py-3 text-left font-medium">Role</th>
                    <th className="py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} users
            </p>
            <Button variant="outline" size="sm">
              Add User
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
