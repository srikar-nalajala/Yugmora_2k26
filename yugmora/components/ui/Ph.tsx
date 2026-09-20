// components/ui/Ph.tsx — Renders bracketed placeholders with subtle dashed underline in development
import React from "react";

interface PhProps {
  children: React.ReactNode;
  className?: string;
}

export function Ph({ children, className = "" }: PhProps) {
  const isDev = process.env.NODE_ENV !== "production";
  return (
    <span className={`${isDev ? "ph-marker" : ""} ${className}`}>
      {children}
    </span>
  );
}
