import React from 'react';
import ReactDOM from 'react-dom';
import Sketch from 'react-p5';
import './index.css'

class App extends React.Component {
  power = 0
  color
	render() {
		return (
			<div className="App">
				<Sketch
					setup={(p5, parentRef) => {
            p5.colorMode(p5.HSB);
            p5.noStroke();
						p5.createCanvas(p5.windowWidth,p5.windowHeight ).parent(parentRef);
					}}
					draw={p5 => {
            this.power += 1
            this.power = Math.floor(this.power%360)
            
            p5.fill(p5.color(`hsl(${this.power}, 100%, 50%)`));
            if(p5.mouseIsPressed) {
              console.log(this.power)
              p5.clear();
            }
            p5.ellipse(p5.mouseX, p5.mouseY, 50, 50)
					}}
				/>
			</div>
		);
	}
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);