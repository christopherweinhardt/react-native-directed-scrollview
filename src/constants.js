"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCROLL_DIRECTION = exports.scrollViewDidEndDragging = exports.scrollViewWillBeginDragging = void 0;
exports.scrollViewWillBeginDragging = 'scrollViewWillBeginDragging';
exports.scrollViewDidEndDragging = 'scrollViewDidEndDragging';
var SCROLL_DIRECTION;
(function (SCROLL_DIRECTION) {
    SCROLL_DIRECTION["VERTICAL"] = "vertical";
    SCROLL_DIRECTION["HORIZONTAL"] = "horizontal";
    SCROLL_DIRECTION["BOTH"] = "both";
})(SCROLL_DIRECTION || (exports.SCROLL_DIRECTION = SCROLL_DIRECTION = {}));
