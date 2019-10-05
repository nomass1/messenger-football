define(["require", "exports", "vector", "constants"], function (require, exports, vector_1, constants_1) {
    "use strict";
    exports.__esModule = true;
    var Ball = (function () {
        function Ball(radius, game) {
            this.isMoving = false;
            this.radius = radius;
            this.game = game;
            this.reset();
        }
        Ball.prototype.reset = function () {
            this.isMoving = false;
            this.resetPosition();
            this.angularVelocity = 0;
            this.angle = 0;
            this.velocity = new vector_1["default"](0, 0);
        };
        Ball.prototype.resetPosition = function () {
            this.position = new vector_1["default"](0.5, this.game.getWorldHeight() - this.radius);
        };
        Ball.prototype.updatePosition = function () {
            this.position = this.position.add(this.velocity.mult(constants_1.fixedDeltaTime));
            this.angle += this.angularVelocity * constants_1.fixedDeltaTime;
            if (this.position.x - this.radius <= 0) {
                this.position.x = this.radius;
                this.velocity.x *= -1;
                this.angularVelocity *= -1;
            }
            if (this.position.x + this.radius >= 1) {
                this.position.x = 1 - this.radius;
                this.velocity.x *= -1;
                this.angularVelocity *= -1;
            }
            if (this.position.y - (2 * this.radius) > this.game.getWorldHeight()) {
                this.reset();
            }
        };
        Ball.prototype.kick = function (pos) {
            var offset = pos.sub(this.position);
            offset.y = -Math.abs(offset.y);
            offset.y -= this.radius / 3;
            offset.x *= -1;
            this.angularVelocity = offset.x * 40 * Math.PI;
            this.velocity = offset.normalized().mult(constants_1.kickSpeed);
        };
        return Ball;
    }());
    exports["default"] = Ball;
});
//# sourceMappingURL=ball.js.map