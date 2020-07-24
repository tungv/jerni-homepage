import "../styles/global.css";

import Router from "next/router";
import React, { useEffect } from "react";
import { pageview } from "../gtag";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return <Component {...pageProps} />;
}
