var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var minRatio = 3 / 4;
var scale = 0;
function updateCanvasSize() {
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    canvas.height = h;
    if (w / h > minRatio) {
        canvas.width = h * minRatio;
    }
    else {
        canvas.width = w;
    }
    scale = canvas.width / 3;
    draw();
}
function draw() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function start() {
    updateCanvasSize();
    draw();
}
window.addEventListener("resize", updateCanvasSize);
start();
