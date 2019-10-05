import Ball from "ball";
import Vector from "vector";
import { minRatio, gravity, fixedDeltaTime } from "constants";

export default class Game {
	
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private unit = 0;
	private ball: Ball;

	constructor(canvas: HTMLCanvasElement) {
		
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.ball = new Ball(0.5 * 0.3, this)

		window.addEventListener("resize", this.handleResizeEvent);
		this.canvas.addEventListener("touchstart", this.handleClickEvent);
		this.canvas.addEventListener("mousedown", this.handleClickEvent);

	}

	private handleResizeEvent = () => {

		let w = document.body.clientWidth;
		let h = document.body.clientHeight;
	
		this.canvas.height = h;
		if (w/h > minRatio) {
			this.canvas.width = h * minRatio;
		}
		else {
			this.canvas.width = w;
		}
	
		let oldHeight = this.getWorldHeight();

		this.unit = this.canvas.width;
	
		if (!this.ball.isMoving) {
			this.ball.resetPosition();
		}
		else {
			this.ball.position.y = (this.ball.position.y / oldHeight) * this.getWorldHeight();
		}
	
		this.draw();
	
	}

	private handleClickEvent = (event: MouseEvent|TouchEvent) => {
		this.onClick(this.getCursorPosition(event));	
		event.preventDefault();
	}	
	
	public getWorldHeight(): number {
		return this.canvas.height/this.unit;
	}
	
	private getCursorPosition(event: MouseEvent|TouchEvent): Vector {
	
		const clientX = event instanceof MouseEvent? event.clientX : event.touches[0].clientX;
		const clientY = event instanceof MouseEvent? event.clientY : event.touches[0].clientY;
	
		const rect = this.canvas.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		return new Vector(x/this.unit, y/this.unit);
	}

	private onClick(pos: Vector) {

		if (pos.sub(this.ball.position).sqrMagnitude() < (this.ball.radius * this.ball.radius)) {
			this.ball.isMoving = true;
			this.ball.kick(pos);
		}
	
	}
	
	private draw() {
	
		this.context.fillStyle = "white";
		this.context.fillRect(0,0, this.canvas.width, this.canvas.height);
	
		this.context.fillStyle = "blue";
		this.context.beginPath();
		this.context.arc(this.ball.position.x * this.unit,this.ball.position.y * this.unit,this.ball.radius * this.unit,0,2*Math.PI)
		this.context.closePath();
		this.context.fill();
	
	}
	
	private update(deltaTime: number) {	
		this.draw();
	}

	public start() {

		this.handleResizeEvent();
		
		let last: number = undefined;
		const frame = (timeStamp: DOMHighResTimeStamp) => {
			let curr = timeStamp;
			this.update(last ? (curr-last)/1000 : 1/60);
			last = curr;
			window.requestAnimationFrame(frame);
		}
	
		window.requestAnimationFrame(frame);
	
		setInterval(() => {
			
			if (this.ball.isMoving) {
				this.ball.velocity.y += gravity * fixedDeltaTime;
				this.ball.updatePosition();
			}
	
		}, fixedDeltaTime * 1000);
	
	}

}