"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileAuthTabs } from "@/components/ui/mobile-auth-tabs";

export default function HomePage() {
  // Show mobile auth tabs if in native app
  return <MobileAuthTabs />;
}
