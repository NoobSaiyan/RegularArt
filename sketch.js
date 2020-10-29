const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');
const random = require('canvas-sketch-util/random');


random.setSeed(1)
let palette = random.pick(palettes);

palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(3, palette.length + 1));

const background = palette.shift();

const settings = {
  dimensions: [ 2048, 2048 ]
};
const sketch = () => {
  const count = 5;

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const position = [ u, v ];
        points.push({
          color: random.pick(palette),
          radius: Math.abs(800 + 1000 * random.noise2D(x, y, frequency = 10, amplitude = 1)),
          position
        });
      }
    }
    return points;
  };
  random.setSeed(9675)
  const points = createGrid().filter(()=>random.value()> 0.05)
  

  return ({ context, width, height }) => {
    const margin = width * 0.0;

    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color
      } = data;
      const x = lerp(margin, width - margin, position[0]);
      const y = lerp(margin, height - margin, position[1]);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI );
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
