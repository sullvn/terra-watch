import * as React from 'react'

import pattern from './pattern'


export default () => (
  <canvas
    width={ 800 } height={ 800 }
    style={ style }
    ref={ pattern }
  />
)


const style = {
  width: '400px',
  height: '400px',
  background: 'rgb(192, 211, 218)',
  borderRadius: '50%',
}
