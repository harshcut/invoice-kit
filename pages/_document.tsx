import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { Stylesheet, resetIds } from '@fluentui/react';

const stylesheet = Stylesheet.getInstance();

class MyDocument extends Document<{ styleTags: string; serializedStylesheet: string }> {
  static getInitialProps = async (ctx: DocumentContext) => {
    resetIds();
    // eslint-disable-next-line react/display-name
    const page = ctx.renderPage((App) => (props) => <App {...props} />);
    return {
      ...page,
      styleTags: stylesheet.getRules(true),
      serializedStylesheet: stylesheet.serialize(),
    };
  };

  render() {
    return (
      <Html lang="en">
        <Head>
          <style type="text/css" dangerouslySetInnerHTML={{ __html: this.props.styleTags }} />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
            window.FabricConfig = window.FabricConfig || {};
            window.FabricConfig.serializedStylesheet = ${this.props.serializedStylesheet};
          `,
            }}
          />
        </Head>
        <body style={{ margin: 0, overflow: 'hidden' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
