import Vector from "vector";
import Game from "game";
import { fixedDeltaTime, kickSpeed } from "constants";

export default class Ball {

	public position: Vector;
	public velocity: Vector;
	public angle: number;
	public angularVelocity: number;
	public radius: number;
	public isMoving = false;
	public game: Game;

	constructor(radius: number, game: Game) {
		this.radius = radius;
		this.game = game;
		this.reset();
	}

	public reset() {
		this.isMoving = false;
		this.resetPosition();
		this.angularVelocity = 0;
		this.angle = 0;
		this.velocity = new Vector(0,0);
	}

	public resetPosition() {		
		this.position = new Vector(0.5,this.game.getWorldHeight()-this.radius);
	}

	public updatePosition() {
		this.position = this.position.add(this.velocity.mult(fixedDeltaTime));
		this.angle += this.angularVelocity * fixedDeltaTime;
		if (this.position.x - this.radius <= 0) {
			this.position.x = this.radius;
			this.velocity.x *= -1;
			this.angularVelocity *= -1;
		}
		if (this.position.x + this.radius >= 1) {
			this.position.x = 1-this.radius;
			this.velocity.x *= -1;
			this.angularVelocity *= -1;
		}
		if (this.position.y - (2*this.radius) > this.game.getWorldHeight()) {
			this.game.fail();
		}
	}

	public kick(pos: Vector) {

		let offset = pos.sub(this.position);
		offset.y = -Math.abs(offset.y);
		offset.y -= this.radius/3;
		offset.x *= -1;

		this.angularVelocity = offset.x * 40 * Math.PI;		
		
		this.velocity = offset.normalized().mult(kickSpeed);

	}

}