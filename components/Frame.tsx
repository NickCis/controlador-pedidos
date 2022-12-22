import type { ReactNode } from 'react';
import Head from 'next/head';
import Box, { BoxProps } from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export interface FrameProps extends BoxProps {
  header?: ReactNode;
}

function Frame({ sx, header, children, ...props }: FrameProps) {
  return (
    <Box display="flex">
      <Head>
        <title>Coto Digital</title>
        <meta name="description" content="Controla las compras :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="absolute">
        <Toolbar sx={{ pr: 1 }}>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            Coto Digital
          </Typography>
          {header ? (
            <>
              <Box sx={{ flex: 1 }} />
              <Box>{header}</Box>
            </>
          ) : null}
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        {...props}
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          ...sx,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Frame;
