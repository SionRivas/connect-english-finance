import '@/styles/globals.css';
import { ViewTransitions } from 'next-view-transitions';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';
import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/color.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html suppressHydrationWarning lang="es">
        <head>
          <meta name="theme-color" content="black" />
        </head>
        <body
          className={clsx(
            'min-h-screen font-sans antialiased',
            fontSans.variable,
            'relative flex h-screen flex-col',
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
            <div className="fixed z-[-1] h-screen w-full bg-gradient-to-b from-background to-default-50" />

            {children}
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
