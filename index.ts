const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
const minRatio = 3/4;
let unit = 0;

class Vector {
	
	public x: number;
	public y: number;
	
	constructor(x?: number, y?: number) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	}

	public add(vector2: Vector): Vector {
		return new Vector(this.x + vector2.x, this.y + vector2.y);
	}

	public sub(vector2: Vector): Vector {
		return new Vector(this.x - vector2.x, this.y - vector2.y);
	}

	public mult(factor: number): Vector {
		return new Vector(this.x * factor, this.y * factor);
	}

	public div(divisor: number): Vector {
		return new Vector(this.x / divisor, this.y / divisor);
	}

	public sqrMagnitude(): number {
		return (this.x * this.x) + (this.y * this.y);
	}

	public magnitude(): number {
		return Math.sqrt(this.sqrMagnitude());
	}

	public normalized(): Vector {
		return this.div(this.magnitude());
	}

}

class Ball {

	public position: Vector;
	public velocity: Vector;
	public radius: number;
	public isMoving = false;

	constructor(radius: number) {
		this.radius = radius;
	}

	public resetPosition() {		
		this.position = new Vector(0.5,(canvas.height/unit)-this.radius);
	}

}

const ball = new Ball(0.5/3);

function updateCanvasSize() {

	let w = document.body.clientWidth;
	let h = document.body.clientHeight;

	canvas.height = h;
	if (w/h > minRatio) {
		canvas.width = h * minRatio;
	}
	else {
		canvas.width = w;
	}

	unit = canvas.width;

	if (!ball.isMoving) {
		ball.resetPosition();
	}

	draw();

}

function handleClick(pos: Vector) {

	if (pos.sub(ball.position).sqrMagnitude() < (ball.radius * ball.radius)) {
		
	}

}

function getCursorPosition(event: MouseEvent): Vector {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	return new Vector(x/unit, y/unit);
}

function draw() {

	context.fillStyle = "white";
	context.fillRect(0,0, canvas.width, canvas.height);

	context.fillStyle = "blue";
	context.beginPath();
	context.arc(ball.position.x * unit,ball.position.y * unit,ball.radius * unit,0,2*Math.PI)
	context.closePath();
	context.fill();

}

function update(deltaTime: number) {	
	draw();
}

function start() {

	updateCanvasSize();
	
	let last = undefined;
	const frame = (timeStamp: DOMHighResTimeStamp) => {
		let curr = timeStamp;
		update(last ? (curr-last)/1000 : 1/60);
		last = curr;
		window.requestAnimationFrame(frame);
	}

	window.requestAnimationFrame(frame);

}

window.addEventListener("resize", updateCanvasSize);

canvas.addEventListener('mousedown', function(e) {
    handleClick(getCursorPosition(e));
});

start();