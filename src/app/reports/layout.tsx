import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      {/* Global Application Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}
