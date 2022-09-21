import { AppProps } from "next/app";
import Head from "next/head";

import { MantineProvider, MantineTheme, MantineThemeOverride } from "@mantine/core";

export default function App(props: AppProps) {
  const { Component, pageProps } = props

  const theme: MantineThemeOverride = {
    colorScheme: 'dark',
    fontFamily: 'Open Sans, sans-serif',
    headings: { fontFamily: 'Bungee Shade, cursive' },
    colors: {
      gialloMotti: [
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
        '#f9d71c',
      ],
    },
  }

  return (
    <>
      <Head>
        <title>Orbit Whales</title>
        <meta name="description" content="Check out the top whales!" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  )
}
