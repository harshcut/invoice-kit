import React from 'react';
import Head from 'next/head';

interface Props {
  pageTitle?: string;
  title?: string;
  children?: React.ReactNode;
}

const MetaHead = ({ pageTitle, title, children }: Props): React.ReactElement => {
  return (
    <Head>
      <title>{title ?? `${pageTitle} — Invoice Kit`}</title>
      {children}
    </Head>
  );
};

export default MetaHead;
