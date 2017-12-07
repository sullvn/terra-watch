import initRegl from 'regl'


/**
 * Pattern fragment shader
 *
 * A 2.5d-esque terrain created in a fragment shader. It does not rely
 * on any triangles or other geometry.
 *
 * The only inputs are:
 *
 * - monotonically increasing time
 * - viewport resolution
 *
 * Noise is created with gradient noise from 
 */
const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const vec3 black = vec3( 0.0 );
const vec2 center = vec2( 0.5 );


// Random and noise
//
// Gradient noise implementation as featured in:
//
//    https://thebookofshaders.com/edit.php#11/2d-gnoise.frag
//
vec2 random2( vec2 st ){
  st = vec2( dot( st, vec2( 127.1, 311.7 )),
             dot( st, vec2( 269.5, 183.3 )));

  return -1.0 + 2.0 * fract( sin( st ) * 43758.5453123 );
}


// 2D noise space
//
// Uses gradient noise.
//
float noise( in vec2 st ) {
  vec2 i = floor( st );
  vec2 f = fract( st );

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix( mix( dot( random2( i + vec2( 0.0, 0.0 )), f - vec2( 0.0, 0.0 )),
                   dot( random2( i + vec2( 1.0, 0.0 )), f - vec2( 1.0, 0.0 )), u.x),
              mix( dot( random2( i + vec2( 0.0, 1.0 )), f - vec2( 0.0, 1.0 )),
                   dot( random2( i + vec2( 1.0, 1.0 )), f - vec2( 1.0, 1.0 )), u.x), u.y);
}


// Offset a point from the center
//
// For fun times, it depends on:
//
// * Unit vector from the center
// * Time
//
// Ability to tweak:
//
// * Max amplitude (offset distance)
// * Frequency
//
float offset( in float amp, in float freq, in vec2 unitVector, in float time ) {
  return amp * noise( freq * (unitVector + time ));
}


bool isShadow( in vec2 uv, in float r ) {
  float a = atan( uv.y, uv.x );

  // Only include top-left third slice of clock
  if ( a < -3.2 || 1.3 < a ) {
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

// vertexShader
//
// Meant to draw a quad covering the screenspace. In
// other words, let the fragment shader do it all.
//
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
  // Screen quad
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
  // Have animation time accumulate with time and mouse location
  time({ tick }, { mouseX, mouseY }) {
    return tick * 0.001 + (mouseX + mouseY) * 0.001
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

  // Mouse position listening
  const mouse = { x: 0, y: 0 }
  window.addEventListener( 'mousemove', ({ screenX, screenY }) => {
    mouse.x = screenX
    mouse.y = screenY
  })

  regl.frame(({ time }) => {
    // Clear contents of the drawing buffer
    regl.clear({
      color: [ 0, 0, 0, 0 ],
      depth: 1
    })

    // Draw a triangle using the command defined above
    draw({
      mouseX: mouse.x,
      mouseY: mouse.y,
    })
  })
}
