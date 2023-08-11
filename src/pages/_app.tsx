import './globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { useSSR } from '@nextui-org/react'

export default function App({ Component, pageProps }: AppProps) {
  const { isBrowser } = useSSR()
  return (
    isBrowser && (
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    )
  );
};
