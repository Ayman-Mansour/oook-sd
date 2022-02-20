import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import theme from "../theme";
import * as gtag from "../utils/analytics";


function MyApp({ Component, pageProps }: any) {
  useEffect(() => {
    document.body.classList?.remove('loading');
}, []);

const router = useRouter();

useEffect(() => {
    const handleRouteChange = (url: URL) => {
        gtag.pageview(url);
    };
    router.events.on(
        'routeChangeComplete',
        handleRouteChange
    );
    return () => {
        router.events.off(
            'routeChangeComplete',
            handleRouteChange
        );
    };
}, [router.events]);
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
    
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
