import "@/styles/globals.css";
import createEmotionCache from "@/utils/createEmotionCache";
import { CacheProvider, EmotionCache } from "@emotion/react";
import type { AppProps } from "next/app";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps }
}: MyAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Component {...pageProps} />
    </CacheProvider>
  );
}
