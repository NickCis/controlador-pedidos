import { forwardRef, useImperativeHandle, useState, useId } from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

import ScannerDialog from './ScannerDialog';

export interface TextFieldScanProps {
  label?: TextFieldProps['label'];
  fullWidth?: TextFieldProps['fullWidth'];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  iconButtonId?: string;
}

export interface TextFieldHandle {
  open: () => void;
  close: () => void;
}

const TextFieldScan = forwardRef<TextFieldHandle, TextFieldScanProps>(
  function TextFieldScan(
    {
      label,
      fullWidth,
      value,
      onChange,
      disabled,
      iconButtonId,
    }: TextFieldScanProps,
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const id = useId();

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      [setOpen],
    );

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
                id={iconButtonId}
              >
                <QrCodeScannerIcon />
              </IconButton>
            </InputAdornment>
          }
          label={label}
        />
      </FormControl>
    );
  },
);

export default TextFieldScan;
