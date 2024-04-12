import { type PropsWithChildren } from 'react';
import { type Metadata, type Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';

import Providers from './Providers';

export const metadata: Metadata = {
  title: 'CotoDigital',
  description: 'Controlador de pedidos de cotodigial',
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  themeColor: '#556cd6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
