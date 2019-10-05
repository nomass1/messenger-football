define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Vector = (function () {
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
    exports["default"] = Vector;
});
//# sourceMappingURL=vector.js.map