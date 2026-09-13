"use client";

import type { UserProfileDTO } from "@/types/profile.types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Bell, Clock } from "lucide-react";
import {
  ProfileInfoTab,
  ProfileSecurityTab,
  ProfileNotificationsTab,
  ProfileActivityTab,
} from "./tabs";

interface ProfileFormProps {
  profile: UserProfileDTO;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <Tabs defaultValue="info" variant="underline">
      <TabsList>
        <TabsTrigger value="info" icon={<User className="h-4 w-4" />}>
          Thông tin cá nhân
        </TabsTrigger>
        <TabsTrigger value="security" icon={<Shield className="h-4 w-4" />}>
          Bảo mật
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Bell className="h-4 w-4" />}>
          Thông báo
        </TabsTrigger>
        <TabsTrigger value="activity" icon={<Clock className="h-4 w-4" />}>
          Lịch sử hoạt động
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <ProfileInfoTab profile={profile} />
      </TabsContent>

      <TabsContent value="security">
        <ProfileSecurityTab email={profile.email} />
      </TabsContent>

      <TabsContent value="notifications">
        <ProfileNotificationsTab />
      </TabsContent>

      <TabsContent value="activity">
        <ProfileActivityTab />
      </TabsContent>
    </Tabs>
  );
}
