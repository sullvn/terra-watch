import * as React from 'react'
import Head from 'next/head'

import Face from '../components/Face'
import Background from '../components/Background'


export default () => (
  <main>
    <Head>
      <style>{`
        html {
          background-color: rgb(246, 237, 234);
        }
      `}</style>
    </Head>
    <Background />
    <Face />
  </main>
)
