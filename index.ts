const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
const minRatio = 3/4;
let scale = 0;

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

	scale = canvas.width/3;

	draw();

}

function draw() {

	context.fillStyle = "white";
	context.fillRect(0,0, canvas.width, canvas.height);

}

function start() {
	updateCanvasSize();
	draw();
}

window.addEventListener("resize", updateCanvasSize);

start();