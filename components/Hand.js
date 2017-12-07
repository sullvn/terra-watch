import * as React from 'react'


/**
 * Hand
 *
 * Just an SVG watch hand that rotates around the center.
 *
 * Progress is within [ 0, 1 ].
 */
const Hand = ({ progress, length }) => (
  <polygon
    points={ `
      0.5,0.5 0.49,${ 0.55 - length } 0.5,${ 0.5 - length } 0.51,${ 0.55 - length }
    ` }
    style={ handStyle }
    transform={ `rotate(${ progress * 360 } 0.5 0.5)` }
  />
)

export const handStyle = {
  fill: 'rgb(74, 93, 103)',
}


export default Hand
