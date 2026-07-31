import React from "react";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md", className, alt = "FoundMatch Logo", ...props }: LogoProps) {
  const heightMap = {
    sm: "h-9 sm:h-11",
    md: "h-12 sm:h-14",
    lg: "h-16 sm:h-20",
  };

  return (
    <div className="flex items-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/icons/logo.png"
        alt={alt}
        className={`${heightMap[size]} w-auto max-w-none object-contain ${className || ""}`}
        {...props}
      />
    </div>
  );
}
