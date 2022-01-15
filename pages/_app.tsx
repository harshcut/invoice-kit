import type { AppProps } from 'next/app';
import { initializeIcons, ThemeProvider } from '@fluentui/react';
import { InterfaceGrid } from 'components';

initializeIcons(undefined, { disableWarnings: true });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <InterfaceGrid>
        <Component {...pageProps} />
      </InterfaceGrid>
    </ThemeProvider>
  );
};

export default MyApp;
