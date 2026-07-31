import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getCurrentProfile();
  
  // Protect all workspace routes
  if (!result.success || !result.data) {
    redirect("/login");
  }
  
  const profile = result.data;

  return (
    <WorkspaceShell profile={profile}>
      {children}
    </WorkspaceShell>
  );
}
