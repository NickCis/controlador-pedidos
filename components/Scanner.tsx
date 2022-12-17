import { useId, useEffect, useRef } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import type { Html5QrcodeFullConfig } from 'html5-qrcode/html5-qrcode';
import type { Html5QrcodeResult } from 'html5-qrcode/core';
import isEqual from 'lodash-es/isEqual';

export {
  Html5QrcodeFullConfig,
  Html5QrcodeResult,
  Html5QrcodeSupportedFormats,
};

export interface ScannerProps extends BoxProps {
  onScanSuccess: (decoded: string, result: Html5QrcodeResult) => void;
  config?: Partial<Html5QrcodeFullConfig>;
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

// formatsToSupport
function Scanner({ onScanSuccess, config: _config, ...props }: ScannerProps) {
  const id = useId();
  const callbacks = useRef<CallbacksRef | null>();
  const scannerRef = useRef<ScannerRef | null>(null);
  const configRef = useRef<ScannerProps['config'] | null>(null);

  callbacks.current = {
    onScanSuccess,
  };

  if (!isEqual(configRef.current, _config)) configRef.current = _config;
  const config = configRef.current;

  useEffect(() => {
    if (scannerRef.current?.id === id) return;

    const scanner = new Html5QrcodeScanner(
      id,
      {
        ...DefaultConfig,
        ...config,
      },
      false,
    );
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
  }, [id, config]);

  return <Box {...props} id={id} />;
}

export default Scanner;
