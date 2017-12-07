import initRegl from 'regl'


const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

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

float offset( in float amp, in float freq, in vec2 unitVector, in float time ) {
  return amp * noise( freq * (unitVector + time ));
}


bool isShadow( in vec2 uv, in float r ) {
  float a = atan( uv.y, uv.x );

  // Only include top-left third slice of clock
  if ( a < -2.3 || 0.7 < a ) {
    return false;
  }
  if ( 0.098 < r && r < 0.10 ) {
    return true;
  }
  if ( 0.178 < r && r < 0.18 ) {
    return true;
  }
  if ( 0.228 < r && r < 0.23 ) {
    return true;
  }
  if ( 0.298 < r && r < 0.30 ) {
    return true;
  }
  if ( 0.348 < r && r < 0.35 ) {
    return true;
  }
  if ( 0.378 < r && r < 0.38 ) {
    return true;
  }
}


vec4 color( in vec2 uv, in float r ) {
  vec3 c;

  if ( r < 0.10 ) {
    c = vec3( 104., 123., 133. );
  }
  if ( 0.10 < r && r < 0.18 ) {
    c = vec3( 135., 152., 160. );
  }
  if ( 0.18 < r && r < 0.23 ) {
    c = vec3( 140., 158., 166. );
  }
  if ( 0.23 < r && r < 0.30 ) {
    c = vec3( 160., 180., 188. );
  }
  if ( 0.30 < r && r < 0.35 ) {
    c = vec3( 170., 186., 189. );
  }
  if ( 0.35 < r && r < 0.38 ) {
    c = vec3( 170., 186., 189. );
  }
  if ( 0.38 < r ) {
    return vec4( 0. );
  }

  if ( isShadow( uv, r )) {
    c *= 0.9;
  }
  
  return vec4( c / 255., 1. );
}


void main() {
  // Unit coordinate, [0, 1]
  vec2 u = gl_FragCoord.xy / resolution;

  // Vector from center
  vec2 v = center - u;

  // Radius from center
  float r = length( v );

  // Unit vector
  vec2 uv = v / r;

  // Ring offset
  float o = offset( 0.6 * r, 2.0,  uv + vec2( 0., r * 1.5 ), time       ) +
            offset( 0.1 * r, 10.0, uv,                       time / 3.0 );

  // Noisey radius
  float nr = r + o;

  gl_FragColor = color( uv, nr );
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
  },
  time({ tick }) {
    return tick * 0.002
  },
}


export default function startPattern( ctx ) {
  // Calling the regl module with no arguments creates a full screen canvas and
  // WebGL context, and then uses this context to initialize a new REGL instance
  const regl = initRegl( ctx )

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
