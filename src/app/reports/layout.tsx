import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";

export default async function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileResult = await getCurrentProfile();
  const profile = profileResult.success ? profileResult.data : null;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      {/* Global Application Header */}
      <Navbar profile={profile} />

      {/* Main Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}
