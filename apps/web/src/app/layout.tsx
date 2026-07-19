import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';

import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'FoneBox | Secure Government ICT Solutions',
  description: 'FoneBox delivers trusted ICT solutions for governments and corporations, specializing in secure identity, fintech systems, and cybersecurity integration worldwide.',
  keywords: 'e-passport, e-visa, secure bank cards, cybersecurity, identity management, fintech infrastructure, government ICT',
  openGraph: {
    title: 'FoneBox | Secure Government ICT Solutions',
    description: 'FoneBox delivers trusted ICT solutions for governments and corporations.',
    type: 'website',
  },
  icons: {
    icon: '/FoneBox_favicon.png',
  },
  manifest: '/manifest.json', // Placeholder
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>

    </html>
  );
}
