import { useId, useEffect, useRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Html5QrcodeScanner } from 'html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/core';

export interface ScannerProps extends BoxProps {
  onScanSuccess: (decoded: string, result: Html5QrcodeResult) => void;
}

interface CallbacksRef {
  onScanSuccess: ScannerProps['onScanSuccess'];
}

interface ScannerRef {
  id: string;
  scanner: Html5QrcodeScanner;
}

const DefaultConfig = {
  fps: 10,
  qrbox: 250,
  showTorchButtonIfSupported: true,
};

function Scanner({ onScanSuccess, ...props }: ScannerProps) {
  const id = useId();
  const callbacks = useRef<CallbacksRef | null>();
  const scannerRef = useRef<ScannerRef | null>(null);

  callbacks.current = {
    onScanSuccess,
  };

  useEffect(() => {
    if (scannerRef.current?.id === id) return;

    const scanner = new Html5QrcodeScanner(id, DefaultConfig, false);
    scanner.render(
      (...args) => callbacks.current?.onScanSuccess(...args),
      () => {},
    );
    scannerRef.current = {
      id,
      scanner,
    };

    return () => {
      scanner.clear();
      scannerRef.current = null;
    };
  }, [id]);

  return <Box {...props} id={id} />;
}

export default Scanner;
