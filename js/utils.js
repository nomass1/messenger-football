define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function easeOutElastic(t) {
        var p = 0.9;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
    exports.easeOutElastic = easeOutElastic;
});
//# sourceMappingURL=utils.js.map