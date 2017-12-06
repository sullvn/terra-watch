import * as React from 'react'

import pattern from './pattern'


const DOT_SPACING = 0.5 - 0.03
const LARGE_DOTS = [ 0, 3, 6, 9 ]
const SMALL_DOTS = [ 1, 2, 4, 5, 7, 8, 10, 11 ]


export default class Watch extends React.Component {
  state = {
    time: new Date(),
  }

  componentWillMount() {
    this.interval = setInterval(
      () => {
        this.setState({ time: new Date() })
      },
      10 * 1000,
    )
  }

  componentWillUnmount() {
    clearInterval( this.interval )
  }

  render() {
    const { time } = this.state

    return (
      <div style={ containerStyle }>
        <svg
          viewBox="0 0 1 1"
          style={ svgStyle }
        >
          <circle cx="0.5" cy="0.5" r="0.01" style={{ fill: handStyle.fill }} />
          <Hand
            progress={ time.getMinutes() / 60 }
            length={ 0.4 }
          />
          <Hand
            progress={ time.getHours() / 12 }
            length={ 0.25 }
          />

          { LARGE_DOTS.map( i => (
              <HourDot rad={ i / 12 * 2 * Math.PI } size="0.01" key={ i } />
          ))}
          { SMALL_DOTS.map( i => (
              <HourDot rad={ i / 12 * 2 * Math.PI } size="0.005" key={ i } />
          ))}
        </svg>
        <canvas
          width={ 800 } height={ 800 }
          style={ canvasStyle }
          ref={ pattern }
        />
      </div>
    )
  }
}


const containerStyle = {
  position: 'relative',
  width: '400px',
  height: '400px',

  background: 'rgb(192, 211, 218)',
  border: '15px solid rgb(141, 150, 154)',
  borderRadius: '50%',
  boxShadow: '2px 2px 13px rgba(0, 0, 0, 0.5)',
  overflow: 'hidden',
}


const svgStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 2,
}

const canvasStyle = {
  ...svgStyle,
  zIndex: 1,

  height: '100%',
  width: '100%',
}


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



const Hand = ({ progress, length }) => (
  <polygon
    points={ `
      0.5,0.5 0.49,${ 0.55 - length } 0.5,${ 0.5 - length } 0.51,${ 0.55 - length }
    ` }
    style={ handStyle }
    transform={ `rotate(${ progress * 360 } 0.5 0.5)` }
  />
)

const handStyle = {
  fill: 'rgb(74, 93, 103)',
}
