import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music Receipt",
  description: "Share and view you and your friends' recent top songs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} w-full min-h-screen h-fit m-0 py-10 px-4 bg-inherit bg-slate-800 flex justify-start items-center flex-col gap-5`}>{children}</body>
    </html>
  );
}
