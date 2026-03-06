import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono, Inter, DM_Sans, Source_Serif_4 } from "next/font/google";
import { ThemeProvider } from "@/lib/ThemeContext";
import "./globals.css";

const cabinetGrotesk = localFont({
  src: [
    { path: "../../public/fonts/CabinetGrotesk-Bold.woff2", weight: "700" },
    { path: "../../public/fonts/CabinetGrotesk-Black.woff2", weight: "900" },
  ],
  variable: "--font-cabinet",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lab — Amir Hussain",
  description: "Experimental projects and case studies",
};

const themeScript = `
(function(){
  var t = localStorage.getItem('lab-theme');
  if (t === 'light') document.documentElement.setAttribute('data-theme','light');
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
        lang="en"
        className={`${cabinetGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${dmSans.variable} ${sourceSerif.variable}`}
        suppressHydrationWarning
      >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
