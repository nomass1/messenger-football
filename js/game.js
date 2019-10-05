define(["require", "exports", "ball", "vector", "constants"], function (require, exports, ball_1, vector_1, constants_1) {
    "use strict";
    exports.__esModule = true;
    var Game = (function () {
        function Game(canvas) {
            var _this = this;
            this.unit = 0;
            this.handleResizeEvent = function () {
                var w = document.body.clientWidth;
                var h = document.body.clientHeight;
                _this.canvas.height = h;
                if (w / h > constants_1.minRatio) {
                    _this.canvas.width = h * constants_1.minRatio;
                }
                else {
                    _this.canvas.width = w;
                }
                var oldHeight = _this.getWorldHeight();
                _this.unit = _this.canvas.width;
                if (!_this.ball.isMoving) {
                    _this.ball.resetPosition();
                }
                else {
                    _this.ball.position.y = (_this.ball.position.y / oldHeight) * _this.getWorldHeight();
                }
                _this.draw();
            };
            this.handleClickEvent = function (event) {
                _this.onClick(_this.getCursorPosition(event));
                event.preventDefault();
            };
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.ball = new ball_1["default"](0.5 * 0.3, this);
            this.ballImg = new Image();
            this.ballImg.src = "../img/ball.svg";
            window.addEventListener("resize", this.handleResizeEvent);
            this.canvas.addEventListener("touchstart", this.handleClickEvent);
            this.canvas.addEventListener("mousedown", this.handleClickEvent);
        }
        Game.prototype.getWorldHeight = function () {
            return this.canvas.height / this.unit;
        };
        Game.prototype.getCursorPosition = function (event) {
            var clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            var clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            var rect = this.canvas.getBoundingClientRect();
            var x = clientX - rect.left;
            var y = clientY - rect.top;
            return new vector_1["default"](x / this.unit, y / this.unit);
        };
        Game.prototype.onClick = function (pos) {
            if (pos.sub(this.ball.position).sqrMagnitude() < (this.ball.radius * this.ball.radius)) {
                this.ball.isMoving = true;
                this.ball.kick(pos);
            }
        };
        Game.prototype.draw = function () {
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            var x = (this.ball.position.x) * this.unit;
            var y = (this.ball.position.y) * this.unit;
            var width = (2 * this.ball.radius) * this.unit;
            var height = (2 * this.ball.radius) * this.unit;
            this.context.translate(x, y);
            this.context.rotate(this.ball.angle);
            this.context.drawImage(this.ballImg, -width / 2, -height / 2, width, height);
            this.context.rotate(-this.ball.angle);
            this.context.translate(-x, -y);
        };
        Game.prototype.update = function (deltaTime) {
            this.draw();
        };
        Game.prototype.start = function () {
            var _this = this;
            this.handleResizeEvent();
            var last = undefined;
            var frame = function (timeStamp) {
                var curr = timeStamp;
                _this.update(last ? (curr - last) / 1000 : 1 / 60);
                last = curr;
                window.requestAnimationFrame(frame);
            };
            window.requestAnimationFrame(frame);
            setInterval(function () {
                if (_this.ball.isMoving) {
                    _this.ball.velocity.y += constants_1.gravity * constants_1.fixedDeltaTime;
                    _this.ball.updatePosition();
                }
            }, constants_1.fixedDeltaTime * 1000);
        };
        return Game;
    }());
    exports["default"] = Game;
});
//# sourceMappingURL=game.js.map