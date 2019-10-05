export function easeOutElastic(t: number): number {
	let p = 0.9;
	return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
}