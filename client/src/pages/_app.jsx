'use client'

import ToasterProvider from '@/components/ToastProvider'
import { persistor, store } from '@/context/store'
import '@/styles/globals.css'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <title>Whatsapp</title>
          <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <ToasterProvider />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}
