// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');
const glslify = require('glslify')

const settings = {
  dimensions:[1024,1024],
  // Make the loop animated
  animate: true,
  // attributes:{antialias:true},
  // Get a WebGL canvas rather than 2D
  context: "webgl"
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("black", 1);

  // Setup a camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100);
  camera.position.set(0, 0, -4);
  camera.lookAt(new THREE.Vector3());

  // Setup camera controller
  const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry
  const geometry = new THREE.ConeGeometry( 12,2, 6 );

  const fragmentShader = glslify`
  precision highp float;

  uniform float time;
  varying vec2 vUv;

  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb');
  #pragma glslify: noise = require('glsl-noise/simplex/3d');
  void main () {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float n = noise(vec3(center * 2.5,time*0.05));
    vec3 color = hsl2rgb(
      0.6 + n * 0.2,
      0.8 ,
      0.5
    );
    gl_FragColor = vec4(color, 1);
  }
  `
  const vertexShader = glslify`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }`

  // Setup a material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { type: "f", value: 0 }
    },
    fragmentShader,
    vertexShader
  })

  // Setup a mesh with geometry + material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = 3.14 /0.65
  scene.add(mesh);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      mesh.material.uniforms.time.value += Math.sin(0.1);
      mesh.rotation.y = time / 8
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
