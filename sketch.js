const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const palettes = require('nice-color-palettes/1000.json');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 2048, 2048 ]
};

random.setSeed(880)
let palette = random.pick(palettes);

palette = random.shuffle(palette);
palette = palette.slice(0, random.rangeFloor(3, palette.length + 1));
const background = palette.shift();

const sketch = () => {
  const count = 60;

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const position = [ u, v ];
        points.push({
          color: random.pick(palette),
          radius: Math.abs(50 + 60 * random.noise2D(u,v)),
          position
        });
      }
    }
    return points;
  };
  random.setSeed(420)
  const points = createGrid().filter(()=>random.value()< 0.55)


  return ({ context, width, height }) => {
    
    context.save();
    context.beginPath();
    context.arc(width/2, height/2, 1000, 0, 2 * Math.PI);
    context.clip();
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color
      } = data;
      const x = lerp(0, width - 0, position[0]);
      const y = lerp(0, height - 0, position[1]);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
