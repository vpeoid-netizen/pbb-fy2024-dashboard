"use client";

import Image from "next/image";
import { useState } from "react";

export function UniversityLogo() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy text-sm font-bold text-white shadow-sm">
        PSU
      </div>
    );
  }

  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
      <Image
        src="/logo.png"
        alt="Partido State University logo"
        fill
        className="object-contain p-1"
        onError={() => setHasError(true)}
        priority
      />
    </div>
  );
}
