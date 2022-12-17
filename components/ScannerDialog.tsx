import { forwardRef, ReactNode } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import type { TransitionProps } from '@mui/material/transitions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Scanner, { ScannerProps } from './Scanner';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ScannerDialogContent(props: ScannerProps) {
  return (
    <Scanner
      sx={{
        width: '100%',
        height: '100%',
      }}
      {...props}
    />
  );
}

export type ScannerDialogProps = Omit<DialogProps, 'children'> &
  Pick<ScannerProps, 'onScanSuccess' | 'config'> & {
    title?: string;
    actions?: ReactNode;
  };

function ScannerDialog({
  title,
  onScanSuccess,
  actions,
  ...props
}: ScannerDialogProps) {
  const { onClose } = props;
  return (
    <Dialog fullScreen TransitionComponent={Transition} {...props}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose ? (e) => onClose(e, 'escapeKeyDown') : undefined}
          >
            <CloseIcon />
          </IconButton>
          {!!title && (
            <Typography sx={{ ml: 2 }} variant="h6" component="div">
              {title}
            </Typography>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {actions && <Box>{actions}</Box>}
        </Toolbar>
      </AppBar>
      <ScannerDialogContent onScanSuccess={onScanSuccess} />
    </Dialog>
  );
}

export default ScannerDialog;
