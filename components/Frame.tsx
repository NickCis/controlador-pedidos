import Head from 'next/head';
import Box, { BoxProps } from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Frame({ sx, children, ...props }: BoxProps) {
  return (
    <Box display="flex">
      <Head>
        <title>Coto Digital</title>
        <meta name="description" content="Controla las compras :)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar position="absolute">
        <Toolbar>
          <ShoppingCartIcon
            sx={{ mr: 1 }}
          />
          <Typography component="h1" variant="h6" color="inherit" noWrap>
            Coto Digital
          </Typography>
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
