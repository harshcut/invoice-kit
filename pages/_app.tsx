import type { AppProps } from 'next/app';
import { initializeIcons, ThemeProvider } from '@fluentui/react';

initializeIcons(undefined, { disableWarnings: true });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
