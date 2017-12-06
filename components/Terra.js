import initRegl from 'regl'


const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

const vec3 black = vec3( 0.0 );
const vec2 center = vec2( 0.5 );

vec2 random2( vec2 st ){
  st = vec2( dot( st, vec2( 127.1, 311.7 )),
             dot( st, vec2( 269.5, 183.3 )));

  return -1.0 + 2.0 * fract( sin( st ) * 43758.5453123 );
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise( in vec2 st ) {
  vec2 i = floor( st );
  vec2 f = fract( st );

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix( mix( dot( random2( i + vec2( 0.0, 0.0 )), f - vec2( 0.0, 0.0 )),
                   dot( random2( i + vec2( 1.0, 0.0 )), f - vec2( 1.0, 0.0 )), u.x),
              mix( dot( random2( i + vec2( 0.0, 1.0 )), f - vec2( 0.0, 1.0 )),
                   dot( random2( i + vec2( 1.0, 1.0 )), f - vec2( 1.0, 1.0 )), u.x), u.y);
}

float offset( in float amp, in float freq, in float angle, in float time ) {
  return amp * noise( freq * vec2( angle, time ));
}

void main() {
  // Unit coordinate, [0, 1]
  vec2 u = gl_FragCoord.xy / resolution;

  // Radius from center
  float r = distance( u, center );

  // Angle in radians
  vec2 manhattan = center - u;
  float a = atan( manhattan.y, manhattan.x );

  // Ring offset
  float o = offset( 0.2, 2.0, a, 1.0 ) + offset( 0.02, 10.0, a, 1.0 );

  // Alpha
  float alpha = 1.0 - step( 0.2, r + o );

  gl_FragColor = vec4( black, alpha );
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
