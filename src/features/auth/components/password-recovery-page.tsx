import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function PasswordRecoveryPage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA] text-[#2A1B17]">
      <Navbar profile={null} />
      <main className="flex flex-1 items-center justify-center p-4 py-10 sm:p-8">
        <section className="w-full max-w-lg rounded-2xl border border-brand-border bg-white p-6 sm:p-10">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}
