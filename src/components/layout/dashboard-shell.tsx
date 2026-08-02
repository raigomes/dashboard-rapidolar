"use client";

import { useState } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ProfileInfo } from "@/types/profile";

export function DashboardShell({
  profile,
  children,
}: Readonly<{
  profile: ProfileInfo;
  children: React.ReactNode;
}>) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const closeSheet = () => setSheetOpen(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <div className="flex min-h-dvh bg-background">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border lg:block">
          <Sidebar cargo={profile.cargo} onNavigate={closeSheet} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <Header nome={profile.nome} email={profile.email} />
          <main className="flex-1 px-4 py-8 md:px-6">{children}</main>
        </div>
      </div>
      <SheetContent side="left" className="data-[side=left]:w-64 p-0">
        <Sidebar cargo={profile.cargo} onNavigate={closeSheet} />
      </SheetContent>
    </Sheet>
  );
}
