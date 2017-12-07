import * as React from 'react'


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
