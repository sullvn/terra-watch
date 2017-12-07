import * as React from 'react'


const MARGIN = '120px'


/**
 * Background
 *
 * Just a rectangle to contrast with the watch.
 */
export default () => (
  <div style={ backgroundStyle } />
)


const backgroundStyle = {
  backgroundColor: 'rgb(194, 180, 175)',

  position: 'absolute',
  top: MARGIN,
  right: MARGIN,
  bottom: MARGIN,
  left: MARGIN,
}
