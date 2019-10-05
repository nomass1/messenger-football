import Ball from "ball";
import Vector from "vector";
import { minRatio, gravity, fixedDeltaTime } from "constants";
import EmojiParticle from "emoji";

export default class Game {
	
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private unit = 0;
	private ball: Ball;
	private ballImg: HTMLImageElement;
	private emojis: EmojiParticle[];
	private highscore: number;
	private score: number;

	constructor(canvas: HTMLCanvasElement) {
		
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.ball = new Ball(0.5 * 0.3, this)
		this.ballImg = new Image()
		this.ballImg.src = "./../img/ball.svg";
		this.emojis = [];
		this.highscore = 0;
		this.score = 0;

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

	public getUnit(): number {
		return this.unit;
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

		const clickedBall = pos.sub(this.ball.position).sqrMagnitude() < (this.ball.radius * this.ball.radius);

		if (clickedBall) {
			this.ball.isMoving = true;
			this.ball.kick(pos);
			this.score++;
		}

		this.emojis.push(new EmojiParticle(clickedBall, pos, this));
	
	}

	public fail() {
		if (this.score > this.highscore) {
			this.highscore = this.score;
		}
		this.ball.reset();
		this.score = 0;
	}

	public removeEmoji(emoji: EmojiParticle) {		
		this.emojis.splice(this.emojis.indexOf(emoji), 1);
	}
	
	private draw() {
	
		this.context.fillStyle = "white";
		this.context.fillRect(0,0, this.canvas.width, this.canvas.height);

		this.context.font = (this.canvas.height / 6) + "px 'Roboto', Arial, sans-serif";
		this.context.fillStyle = this.ball.isMoving ? "gray" : "#215cff";
		this.context.textAlign = "center";
		this.context.fillText((this.ball.isMoving ? this.score : this.highscore) + "", this.canvas.width/2, this.canvas.height/2);
	
		let x = (this.ball.position.x) * this.unit;
		let y = (this.ball.position.y) * this.unit;
		let width = (2 * this.ball.radius) * this.unit;
		let height = (2 * this.ball.radius) * this.unit;
		
		this.context.translate(x, y);
		this.context.rotate(this.ball.angle);
		this.context.drawImage(this.ballImg, -width / 2, -height / 2, width, height);
		this.context.rotate(-this.ball.angle);
		this.context.translate(-x, -y);

		for (let i = 0; i < this.emojis.length; i++) {
			this.emojis[i].draw(this.context);			
		}

	}
	
	private update(deltaTime: number) {	
		for (let i = this.emojis.length-1; i >= 0; i--) this.emojis[i].update(deltaTime);
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