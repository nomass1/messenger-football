import Vector from "vector";
import Game from "game";
import { emojiDelay, emojiFadeDelay } from "constants";

const badEmoji: HTMLImageElement[] = [];
const goodEmoji: HTMLImageElement[] = [];

for (let i = 0; i < 5; i++) {
	let emoji = new Image();
	emoji.src = "../img/emoji/bad/" + i + ".png";
	badEmoji.push(emoji);
}

for (let i = 0; i < 4; i++) {
	let emoji = new Image();
	emoji.src = "../img/emoji/good/" + i + ".png";
	goodEmoji.push(emoji);
}

function easeOutElastic(t: number): number {
	let p = 0.9;
	return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
}

export default class EmojiParticle {

	public position: Vector;
	public game: Game;
	public emoji: HTMLImageElement;
	private originalY: number;
	private timer = 0;
	private fading = false;
	private alpha = 1;

	constructor(good: boolean, position: Vector, game: Game) {
		if (good) this.emoji = goodEmoji[Math.floor(Math.random() * goodEmoji.length)];
		else this.emoji = badEmoji[Math.floor(Math.random() * badEmoji.length)];
		this.position = position;
		this.originalY = position.y;
		this.game = game;
	}

	public update(deltaTime: number) {
		if (!this.fading) {
			this.position.y = this.originalY - (easeOutElastic(this.timer)/10);
		}
		else {
			this.position.y = this.originalY - ((this.timer*this.timer)/10);
			this.alpha = 1-this.timer;
		}
		if (this.timer >= 1) {
			if (!this.fading) {
				this.fading = true;
				this.timer = 0;
				this.originalY = this.position.y;
			}
			else {
				this.game.removeEmoji(this);
			}
		}		
		this.timer += deltaTime/(this.fading ? emojiFadeDelay : emojiDelay);
	}

	public draw(context: CanvasRenderingContext2D) {
		let size = this.game.getUnit() * 0.07;
		context.globalAlpha = this.alpha;
		context.drawImage(
			this.emoji,
			this.position.x * this.game.getUnit() - (size/2),
			this.position.y * this.game.getUnit() - (size/2),
			size,
			size
		);
		context.globalAlpha = 1;
	}

}