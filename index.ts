const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
const minRatio = 3/4;
const fixedDeltaTime = 20;
const gravity = 0.8;
const kickSpeed = 20;
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
		this.reset();
	}

	public reset() {
		this.isMoving = false;
		this.resetPosition();
		this.velocity = new Vector(0,0);
	}

	public resetPosition() {		
		this.position = new Vector(0.5,(canvas.height/unit)-this.radius);
	}

	public updatePosition() {
		this.position = this.position.add(this.velocity);
		if (this.position.x - this.radius <= 0) {
			this.position.x = this.radius;
			this.velocity.x *= -1;
		}
		if (this.position.x + this.radius >= 1) {
			this.position.x = 1-this.radius;
			this.velocity.x *= -1;
		}
		if (this.position.y - (2*this.radius) > (canvas.height/unit)) {
			this.reset();
		}
	}

	public kick(pos: Vector) {

		let offset = pos.sub(this.position);
		offset.y = -Math.abs(offset.y);
		offset.y -= this.radius/3;
		offset.x *= -1;
		
		this.velocity = offset.normalized().mult((kickSpeed)/1000);

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

function onClick(pos: Vector) {

	if (pos.sub(ball.position).sqrMagnitude() < (ball.radius * ball.radius)) {
		ball.isMoving = true;
		ball.kick(pos);
	}

}

function getCursorPosition(event: MouseEvent|TouchEvent): Vector {

	const clientX = event instanceof MouseEvent? event.clientX : event.touches[0].clientX;
	const clientY = event instanceof MouseEvent? event.clientY : event.touches[0].clientY;

	const rect = canvas.getBoundingClientRect();
	const x = clientX - rect.left;
	const y = clientY - rect.top;
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

	setInterval(() => {
		
		if (ball.isMoving) {
			ball.velocity.y += gravity/1000;
			ball.updatePosition();
		}

	}, 20);

}

window.addEventListener("resize", updateCanvasSize);

canvas.addEventListener("touchstart", function(e) {
	onClick(getCursorPosition(e));	
	e.preventDefault();
});

canvas.addEventListener("mousedown", function(e) {
	onClick(getCursorPosition(e));	
	e.preventDefault();
});

start();