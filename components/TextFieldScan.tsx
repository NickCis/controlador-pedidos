import { useState, useId } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import ScannerDialog from './ScannerDialog';

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
      <ScannerDialog
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
