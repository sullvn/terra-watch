import * as React from 'react'

import startTerra from '../components/Terra'


export default class WatchPage extends React.Component {
  componentDidMount() {
    startTerra()
  }

  render() {
    return <main />
  }
}
