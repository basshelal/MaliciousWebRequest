/**
 * This file contains common shared code that is used by all three main TypeScript files
 * These are background.ts, main.ts, and popup.ts.
 *
 * This trick is done by loading this script before any others when they are requested and
 * then adding the following line at the top of the file for support from WebStorm IDE.
 * ///<reference path="./shared.ts"/>
 */
URL.prototype.hostnameClean = function () {
    if (this.hostname.substring(0, 4) === "www.")
        return this.hostname.substring(4);
    else
        return this.hostname;
};
/**
 * Finds the first element that matches the given {@param predicate} else returns null
 * You can use this as a way to check if the array contains an element that matches the given {@param predicate}, it
 * will return null if none exists
 * @param predicate the predicate to match
 */
Array.prototype.findFirst = function (predicate) {
    for (var i = 0; i < this.length; i++) {
        if (predicate(this[i], i))
            return this[i];
    }
    return null;
};
Array.prototype.contains = function (element) {
    return !!this.findFirst(function (it) { return it === element; });
};
// endregion Extensions
/**
 * Shorthand for {@linkcode document.getElementById}, automatically casts to T, a HTMLElement
 *
 * @param elementId the id of the element to get
 */
function get(elementId) {
    return document.getElementById(elementId);
}
