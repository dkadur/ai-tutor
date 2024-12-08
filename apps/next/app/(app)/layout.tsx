import React from "react";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Wolfie Tutor",
  description: "Wolfie Tutor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="p-12">
      {children}
    </div>
  );
}
