import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fenster-Konfigurator | Hotz Fenster & Türen",
  description:
    "Konfigurieren Sie Ihre Fenster, Balkontüren oder Hebeschiebetüren in wenigen Schritten und fordern Sie ein unverbindliches Angebot an.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <header className="border-b border-[var(--border)] bg-white">
          <div className="mx-auto flex max-w-3xl items-center px-5 py-3">
            <a href="https://www.fensterhotz.com">
              <Image
                src="/logo.png"
                alt="Hotz Fenster & Türen"
                width={1990}
                height={720}
                priority
                className="h-9 w-auto"
              />
            </a>
          </div>
        </header>
        <main className="flex flex-1 flex-col">{children}</main>
        <footer className="border-t border-[var(--border)] py-4">
          <div className="mx-auto max-w-3xl px-5 text-center text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Hotz Fenster &amp; Türen — Ihre Konfiguration ist
            unverbindlich.
          </div>
        </footer>
      </body>
    </html>
  );
}
