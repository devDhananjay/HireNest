"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HOME_MEDIA } from "@/lib/home-media";

/** Silent looping micro-video behind the hero veil. Falls back to still on reduced-motion or error. */
export function HeroMedia() {
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    if (reduce || narrow) {
      setUseVideo(false);
      return;
    }
    setUseVideo(true);
  }, []);

  return (
    <>
      <Image
        src={HOME_MEDIA.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-media object-cover object-[60%_30%] sm:object-center"
      />
      {useVideo ? (
        <video
          className="hero-media absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HOME_MEDIA.hero}
          aria-hidden
          onError={() => setUseVideo(false)}
        >
          <source src={HOME_MEDIA.heroVideo} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
