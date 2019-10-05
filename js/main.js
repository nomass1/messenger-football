define(["require", "exports", "vector"], function (require, exports, vector_1) {
    "use strict";
    exports.__esModule = true;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var minRatio = 3 / 4;
    var fixedDeltaTime = 20 / 1000;
    var gravity = 8;
    var kickSpeed = 3;
    var unit = 0;
    var Ball = (function () {
        function Ball(radius) {
            this.isMoving = false;
            this.radius = radius;
            this.reset();
        }
        Ball.prototype.reset = function () {
            this.isMoving = false;
            this.resetPosition();
            this.velocity = new vector_1["default"](0, 0);
        };
        Ball.prototype.resetPosition = function () {
            this.position = new vector_1["default"](0.5, (canvas.height / unit) - this.radius);
        };
        Ball.prototype.updatePosition = function () {
            this.position = this.position.add(this.velocity.mult(fixedDeltaTime));
            if (this.position.x - this.radius <= 0) {
                this.position.x = this.radius;
                this.velocity.x *= -1;
            }
            if (this.position.x + this.radius >= 1) {
                this.position.x = 1 - this.radius;
                this.velocity.x *= -1;
            }
            if (this.position.y - (2 * this.radius) > (canvas.height / unit)) {
                this.reset();
            }
        };
        Ball.prototype.kick = function (pos) {
            var offset = pos.sub(this.position);
            offset.y = -Math.abs(offset.y);
            offset.y -= this.radius / 3;
            offset.x *= -1;
            this.velocity = offset.normalized().mult(kickSpeed);
        };
        return Ball;
    }());
    var ball = new Ball(0.5 * 0.3);
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
    function onClick(pos) {
        if (pos.sub(ball.position).sqrMagnitude() < (ball.radius * ball.radius)) {
            ball.isMoving = true;
            ball.kick(pos);
        }
    }
    function getCursorPosition(event) {
        var clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        var clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        var rect = canvas.getBoundingClientRect();
        var x = clientX - rect.left;
        var y = clientY - rect.top;
        return new vector_1["default"](x / unit, y / unit);
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
        setInterval(function () {
            if (ball.isMoving) {
                ball.velocity.y += gravity * fixedDeltaTime;
                ball.updatePosition();
            }
        }, fixedDeltaTime * 1000);
    }
    window.addEventListener("resize", updateCanvasSize);
    canvas.addEventListener("touchstart", function (e) {
        onClick(getCursorPosition(e));
        e.preventDefault();
    });
    canvas.addEventListener("mousedown", function (e) {
        onClick(getCursorPosition(e));
        e.preventDefault();
    });
    start();
});
//# sourceMappingURL=main.js.map