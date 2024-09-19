import createEmotionCache from "@/utils/createEmotionCache";
import { EmotionCache } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { AppType } from "next/app";
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from "next/document";

type DocumentProps = {
  emotionStyleTags: React.JSX.Element[];
};

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & DocumentProps> {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const server = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (
          App: AppType | React.ComponentType<{ emotionCache: EmotionCache }>
        ) =>
          function EnhanceApp(props) {
            return <App emotionCache={cache} {...props} />;
          }
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = server.extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {this.props.emotionStyleTags}
          <link rel="manifest" href="/site.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
