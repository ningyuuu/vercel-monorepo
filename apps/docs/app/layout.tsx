import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Ning Yu",
  description: "Ning Yu - Software Engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const savedTheme = window.localStorage.getItem('theme');
              const theme =
                savedTheme === 'light' || savedTheme === 'dark'
                  ? savedTheme
                  : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
              document.documentElement.classList.toggle('dark', theme === 'dark');
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
