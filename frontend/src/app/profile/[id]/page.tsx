"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditProfileDialog } from "../components/EditProfileDialog";
import { ChangePasswordDialog } from "../components/ChangePasswordDialog";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Building2, 
  Shield, 
  Edit,
  Key,
  Settings,
  LogOut
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  // Get role color and display name
  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { 
      label: string,
      className: string 
    }> = {
      SUPER_ADMIN: { 
        label: "Super Admin",
        className: "bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      ADMIN: { 
        label: "Admin",
        className: "bg-gradient-to-r from-red-600 to-red-700 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      PROCUREMENT_MANAGER: {
        label: "Procurement Manager",
        className: "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      DEPARTMENT_HEAD: {
        label: "Department Head",
        className: "bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      FACULTY_ADMIN: { 
        label: "Faculty Admin",
        className: "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      FACULTY_MEMBER: {
        label: "Faculty Member",
        className: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      DEPARTMENT_ADMIN: { 
        label: "Department Admin",
        className: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      OFFICE_MANAGER: { 
        label: "Office Manager",
        className: "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      STAFF: {
        label: "Staff",
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white border-0 font-semibold px-4 py-1.5 text-sm shadow-sm"
      },
      STUDENT: {
        label: "Student",
        className: "bg-slate-100 text-slate-700 border-slate-300 font-semibold px-4 py-1.5 text-sm"
      },
      VIEWER: { 
        label: "Viewer",
        className: "bg-slate-100 text-slate-700 border-slate-300 font-semibold px-4 py-1.5 text-sm"
      },
      USER: { 
        label: "User",
        className: "bg-slate-100 text-slate-700 border-slate-300 font-semibold px-4 py-1.5 text-sm"
      },
    };
    
    const config = roleConfig[role] || { 
      label: role,
      className: "bg-slate-100 text-slate-700 border-slate-300 font-semibold px-4 py-1.5 text-sm"
    };
    
    return (
      <Badge className={config.className}>
        <Shield className="h-3.5 w-3.5 mr-1.5" />
        {config.label}
      </Badge>
    );
  };

  // Get user initials for avatar
  const getInitials = (name?: string, username?: string) => {
    const displayName = name || username || "U";
    return displayName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-red-600 font-semibold">Error loading profile</p>
            <p className="text-slate-600 mt-2">User information not available</p>
            <Button onClick={() => router.push("/login")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your account information and settings</p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-slate-100">
                  <AvatarImage src="" alt={user.name || user.username} />
                  <AvatarFallback>
                    {getInitials(user.name, user.username)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                  {user.name || user.username}
                </h2>
                <p className="text-sm text-slate-600 mb-3">@{user.username}</p>
                {getRoleBadge(user.role)}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
                    Full Name
                  </label>
                  <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md">
                    {user.name || "Not provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
                    Username
                  </label>
                  <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md">
                    {user.username}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-slate-500" />
                  Email Address
                </label>
                <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md">
                  {user.email || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your role and permissions in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-slate-500" />
                    Role
                  </label>
                  <div className="bg-slate-50 px-3 py-2 rounded-md">
                    {/* {getRoleBadge(user.role)} */}
                    {user.role}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-slate-500" />
                    Office
                  </label>
                  <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md">
                    {user.officeName || "Not assigned"}
                  </p>
                </div>
              </div>

              {user.permissions && user.permissions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-slate-500" />
                    Permissions
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Additional account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">User ID</label>
                  <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md font-mono text-sm">
                    {user.id}
                  </p>
                </div>
                {user.officeId && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Office ID</label>
                    <p className="text-base text-slate-900 bg-slate-50 px-3 py-2 rounded-md font-mono text-sm">
                      {user.officeId}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {user && (
        <>
          <EditProfileDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            user={user}
          />
          <ChangePasswordDialog 
            open={passwordDialogOpen} 
            onOpenChange={setPasswordDialogOpen}
          />
        </>
      )}
    </div>
  );
}