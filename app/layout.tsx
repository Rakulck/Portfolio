import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakul CK — AI Product Engineer",
  description: "Portfolio of Rakul CK, an AI product engineer building consumer AI, mobile products and agentic systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
