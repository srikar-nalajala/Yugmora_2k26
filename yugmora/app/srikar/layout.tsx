// app/srikar/layout.tsx — Secret Admin Console Layout
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YUGMORA // SRIKAR COMMAND CENTER",
  description: "Administrative operational console for YUGMORA.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SrikarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#030611] text-[#e2e8f0] font-body relative selection:bg-neon-cyan selection:text-black">
      {children}
    </div>
  );
}
