import { type ReactNode } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

export interface FrameProps extends BoxProps {
  header?: ReactNode;
}

function Frame({ sx, header, children, ...props }: FrameProps) {
  return (
    <Box display="flex">
      <AppBar position="absolute">
        <Toolbar sx={{ pr: 1 }}>
          <ProductionQuantityLimitsIcon sx={{ mr: 1 }} />
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
