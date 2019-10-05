export default class Vector {
	
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