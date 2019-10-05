var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var minRatio = 3 / 4;
var unit = 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    Vector.prototype.add = function (vector2) {
        return new Vector(this.x + vector2.x, this.y + vector2.y);
    };
    Vector.prototype.sub = function (vector2) {
        return new Vector(this.x - vector2.x, this.y - vector2.y);
    };
    Vector.prototype.mult = function (factor) {
        return new Vector(this.x * factor, this.y * factor);
    };
    Vector.prototype.div = function (divisor) {
        return new Vector(this.x / divisor, this.y / divisor);
    };
    Vector.prototype.sqrMagnitude = function () {
        return (this.x * this.x) + (this.y * this.y);
    };
    Vector.prototype.magnitude = function () {
        return Math.sqrt(this.sqrMagnitude());
    };
    Vector.prototype.normalized = function () {
        return this.div(this.magnitude());
    };
    return Vector;
}());
var Ball = /** @class */ (function () {
    function Ball(radius) {
        this.isMoving = false;
        this.radius = radius;
    }
    Ball.prototype.resetPosition = function () {
        this.position = new Vector(0.5, (canvas.height / unit) - this.radius);
    };
    return Ball;
}());
var ball = new Ball(0.5 / 3);
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
    unit = canvas.width;
    if (!ball.isMoving) {
        ball.resetPosition();
    }
    draw();
}
function handleClick(pos) {
    if (pos.sub(ball.position).sqrMagnitude() < (ball.radius * ball.radius)) {
    }
}
function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return new Vector(x / unit, y / unit);
}
function draw() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "blue";
    context.beginPath();
    context.arc(ball.position.x * unit, ball.position.y * unit, ball.radius * unit, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
}
function update(deltaTime) {
    draw();
}
function start() {
    updateCanvasSize();
    var last = undefined;
    var frame = function (timeStamp) {
        var curr = timeStamp;
        update(last ? (curr - last) / 1000 : 1 / 60);
        last = curr;
        window.requestAnimationFrame(frame);
    };
    window.requestAnimationFrame(frame);
}
window.addEventListener("resize", updateCanvasSize);
canvas.addEventListener('mousedown', function (e) {
    handleClick(getCursorPosition(e));
});
start();
