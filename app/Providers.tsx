'use client';

import { type PropsWithChildren } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { TourProvider } from '@reactour/tour';

import theme from '@/src/theme';

// fix-vim-highlight = }

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TourProvider steps={[]} disableInteraction>
          {children}
        </TourProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
