import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";
import { ProfileForm } from "@/features/profiles/components/profile-form";
import { ProfileHeaderCard } from "@/features/profiles/components/profile-header-card";
import { ProfileStatsRow } from "@/features/profiles/components/profile-stats-row";
import { ProfileSidebar } from "@/features/profiles/components/profile-sidebar";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const result = await getCurrentProfile();

  if (!result.success || !result.data) {
    redirect("/login?next=/profile");
  }

  const profile = result.data;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-48 space-y-6">
      {/* Breadcrumb & Title */}
        <div className="space-y-1">
          <div className="text-[13px] text-brand-muted font-semibold flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-plum transition-colors">Trang chủ</Link>
            <span>&gt;</span>
            <span className="text-brand-heading">Hồ sơ cá nhân</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-heading pt-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-sm text-brand-muted font-medium">
            Quản lý thông tin cá nhân, bảo mật, thông báo và theo dõi hoạt động của bạn trên FoundMatch.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="space-y-6">
          
          {/* Profile Overview (Header + Stats) */}
          <Card className="p-5 sm:p-6 space-y-6">
            <ProfileHeaderCard profile={profile} />
            <ProfileStatsRow />
          </Card>
          
          {/* Profile Tabs & Forms */}
          <div className="w-full">
            <ProfileForm profile={profile} />
          </div>

        </div>
    </div>
  );
}
