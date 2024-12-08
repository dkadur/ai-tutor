import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-8xl font-bold mb-4">Oops! </h1>
      <p className="text-xl mb-8 mt-4">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="text-blue-500 text-xl hover:underline"
      >
        Let&apos;s go back home.
      </Link>
    </div>
  );
}
