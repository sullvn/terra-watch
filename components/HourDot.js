import * as React from 'react'


const DOT_SPACING = 0.5 - 0.03


/**
 * HourDot
 *
 * An hour dot on the watch. Takes the position
 * in radians and a size.
 */
const HourDot = ({ rad, size }) => {
  const x = Math.cos( rad ) * DOT_SPACING + 0.5
  const y = Math.sin( rad ) * DOT_SPACING + 0.5

  return (
    <circle
      cx={ x } cy={ y } r={ size }
      style={ dotStyle }
    />
  )
}

const dotStyle = {
  color: 'black',
  opacity: 0.6,
}

export default HourDot
