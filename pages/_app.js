import "../styles/globals.css";

import { CacheProvider } from "@emotion/react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Alert, Snackbar } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { RecoilRoot, useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { Common__notiSnackBarAtom, useSsrComplectedState } from "../states";
import Head from "next/head";
import PropTypes from "prop-types";
import * as React from "react";
import createEmotionCache from "../src/createEmotionCache";
import theme from "../src/theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const colorKeys = [
  "background",
  "common",
  "error",
  "grey",
  "info",
  "primary",
  "secondary",
  "success",
  "text",
  "warning",
];

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  React.useEffect(() => {
    const r = window.document.querySelector(":root");

    colorKeys.forEach((color) => {
      const themeColorObj = theme.palette[color];
      for (const key in themeColorObj) {
        if (Object.hasOwnProperty.call(themeColorObj, key)) {
          const colorVal = themeColorObj[key];
          r.style.setProperty(`--mui-color-${color}-${key}`, colorVal);
        }
      }
    });
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <RecoilRoot>
            <MyAppInner>
              <Component {...pageProps} />
            </MyAppInner>
          </RecoilRoot>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

function MyAppInner({ children }) {
  const router = useRouter();

  const [notiSnackBar, setNotiSnackBar] = useRecoilState(
    Common__notiSnackBarAtom
  );

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (router.isReady) {
      setLoading(false);
    }
  }, [router.isReady]);

  if (loading) {
    return <>?????????...</>;
  }

  return (
    <>
      <Snackbar
        open={notiSnackBar.open}
        autoHideDuration={6000}
        onClose={() => setNotiSnackBar({ ...notiSnackBar, open: false })}
      >
        <Alert
          color='primary'
          variant='filled'
          severity={notiSnackBar.severity}
          sx={{ width: "100%" }}
        >
          {notiSnackBar.msg}
        </Alert>
      </Snackbar>
      {children}
    </>
  );
}
