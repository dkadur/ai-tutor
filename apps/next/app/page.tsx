import Image from "next/image";
import { redirect } from "next/navigation";
import { isGC } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Award, Check, Goal } from "lucide-react";
import Link from "next/link";
import HomeNavBar from "@/components/layout/Landing";
import Landing from "@/components/layout/Landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wolfie Tutor",
}

export default async function Home() {
    redirect("/dashboard");
}
