import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sentinel AU Dashboard',
  description:
    'Transparent, open-source family safety controls for Australian families.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <header className="border-b border-brand-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div>
              <span className="text-lg font-semibold text-brand-700">
                Sentinel AU
              </span>
              <p className="text-sm text-brand-500">
                Transparent family safety for Australia
              </p>
            </div>
            <nav className="flex gap-4 text-sm text-brand-600">
              <a href="/" className="hover:text-brand-800">
                Dashboard
              </a>
              <a href="/policies" className="hover:text-brand-800">
                Policies
              </a>
              <a href="/alerts" className="hover:text-brand-800">
                Alerts
              </a>
              <a href="/reports" className="hover:text-brand-800">
                Reports
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-5xl px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-brand-100 bg-white/90 py-4 text-center text-xs text-brand-500">
          <div className="flex flex-col items-center gap-2">
            <p>
              Built in accordance with the Australian Privacy Principles and
              eSafety guidance.
            </p>
            <a
              href="/operators"
              className="text-brand-600 underline hover:text-brand-800"
            >
              Operator console
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
