import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenSans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const frauncesDisplay = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innoquest",
  description: "Innoquest app",
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
      <body
        className={`${hankenSans.variable} ${frauncesDisplay.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
