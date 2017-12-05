import initRegl from 'regl'


const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

const vec3 black = vec3( 0.0 );

void main() {
  // Unit coordinate, [0, 1]
  vec2 u = gl_FragCoord.xy / resolution;

  // Radius from center
  float r = distance( u, vec2( 0.5 ));

  // Alpha
  float a = 1.0 - step( 0.2, r );

  gl_FragColor = vec4( black, a );
}
`

const vertexShader = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 position;

void main() {
  gl_Position = vec4( position, 0.0, 1.0 );
}
`

const attributes = {
  position: [
    [-1, -1],
    [-1,  1],
    [ 1,  1],

    [-1, -1],
    [ 1,  1],
    [ 1, -1],
  ],
}


const uniforms = {
  resolution( context ) {
    return [ context.viewportWidth, context.viewportHeight ]
  }
}


export default function startTerra() {
  // Calling the regl module with no arguments creates a full screen canvas and
  // WebGL context, and then uses this context to initialize a new REGL instance
  const regl = initRegl()

  const draw = regl({
    frag: fragmentShader,
    vert: vertexShader,
    count: attributes.position.length,
    attributes,
    uniforms,
  })

  regl.frame(({ time }) => {
    // Clear contents of the drawing buffer
    regl.clear({
      color: [ 0, 0, 0, 0 ],
      depth: 1
    })

    // Draw a triangle using the command defined above
    draw()
  })
}
