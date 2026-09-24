"use client";

import { useState } from "react";
import Image from "next/image";
import { VialIcon } from "@/components/icons";

export function ProductThumbnail({
  imageUrl,
  alt,
  priority,
}: {
  imageUrl: string | null;
  alt: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-forest/40">
        <VialIcon className="h-10 w-10" />
        <span className="text-xs font-medium tracking-wide text-forest/50">
          画像準備中
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-contain p-4"
      preload={priority}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
