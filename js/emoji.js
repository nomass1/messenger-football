define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var badEmoji = [];
    var goodEmoji = [];
    for (var i = 0; i < 5; i++) {
        var emoji = new Image();
        emoji.src = "../img/emoji/bad/" + i + ".png";
        badEmoji.push(emoji);
    }
    for (var i = 0; i < 4; i++) {
        var emoji = new Image();
        emoji.src = "../img/emoji/good/" + i + ".png";
        goodEmoji.push(emoji);
    }
    var offset = 0.2;
    var badDelay = 0.9;
    var badDistance = 0.2;
    var badFadeDelay = 0.3;
    var badFadeDistance = 0.3;
    var goodDelay = 0.8;
    var goodDistance = 0.9;
    var goodFadeDelay = 0.2;
    var goodFadeDistance = 0.2;
    function easeOutElastic(t) {
        var p = 0.9;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }
    var EmojiParticle = (function () {
        function EmojiParticle(good, position, game) {
            this.timer = 0;
            this.fading = false;
            this.alpha = 1;
            if (good)
                this.emoji = goodEmoji[Math.floor(Math.random() * goodEmoji.length)];
            else
                this.emoji = badEmoji[Math.floor(Math.random() * badEmoji.length)];
            this.good = good;
            this.position = position;
            this.originalY = position.y;
            this.game = game;
        }
        EmojiParticle.prototype.update = function (deltaTime) {
            if (!this.fading) {
                this.position.y = this.originalY + offset - (easeOutElastic(this.timer) * (this.good ? goodDistance : badDistance));
                this.alpha = Math.min(this.timer * 3, 1);
            }
            else {
                this.position.y = this.originalY + offset - ((this.timer * this.timer) * (this.good ? goodFadeDistance : badFadeDistance));
                this.alpha = 1 - this.timer;
            }
            if (this.timer >= 1) {
                if (!this.fading) {
                    this.fading = true;
                    this.timer = 0;
                    this.originalY = this.position.y - offset;
                }
                else {
                    this.game.removeEmoji(this);
                }
            }
            this.timer += deltaTime / (this.fading ? (this.good ? goodFadeDelay : badFadeDelay) : (this.good ? goodDelay : badDelay));
        };
        EmojiParticle.prototype.draw = function (context) {
            var size = this.game.getUnit() * 0.07;
            context.globalAlpha = this.alpha;
            context.drawImage(this.emoji, this.position.x * this.game.getUnit() - (size / 2), this.position.y * this.game.getUnit() - (size / 2), size, size);
            context.globalAlpha = 1;
        };
        return EmojiParticle;
    }());
    exports["default"] = EmojiParticle;
});
//# sourceMappingURL=emoji.js.map