import { forwardRef, useState, useId } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
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

function ScanDialogContent(props: ScannerProps) {
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

function ScanDialog({
  title,
  onScanSuccess,
  ...props
}: Omit<DialogProps, 'children'> &
  Pick<ScannerProps, 'onScanSuccess'> & { title?: string }) {
  return (
    <Dialog fullScreen TransitionComponent={Transition} {...props}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => props.onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <ScanDialogContent onScanSuccess={onScanSuccess} />
    </Dialog>
  );
}

export interface TextFieldScan {
  label?: TextFieldProps['label'];
  fullWidth?: TextFieldProps['fullWidth'];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

function TextFieldScan({
  label,
  fullWidth,
  value,
  onChange,
  disabled,
}: TextFieldScan) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <FormControl variant="outlined" fullWidth>
      <ScanDialog
        title="Escanear QR"
        open={open}
        onClose={() => setOpen(false)}
        onScanSuccess={(code: string) => {
          onChange(code);
          setOpen(false);
        }}
      />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        disabled={disabled}
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              disabled={disabled}
              onClick={() => setOpen(true)}
              edge="end"
            >
              <QrCodeScannerIcon />
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
}

export default TextFieldScan;
