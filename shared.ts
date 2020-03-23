/**
 * This file contains common shared code that is used by all three main TypeScript files
 * These are background.ts, main.ts, and popup.ts.
 *
 * This trick is done by loading this script before any others when they are requested and
 * then adding the following line at the top of the file for support from WebStorm IDE.
 * ///<reference path="./shared.ts"/>
 */

/** The font size percent, between 100 and 300 */
const keyTextSize: string = "textSize";

/** The line height percent, between 100 and 300 */
const keyLineHeight: string = "lineHeight";

/** Determines whether the extension is on or off, true is on */
const keyOnOff: string = "onOff";

/** The font to update to, this is a string */
const keyFont: string = "font";

/** The array of strings of whitelisted websites, this contains their hostnames in the format example.com */
const keyWhitelisted: string = "whitelisted";

/** The array of {@linkcode CustomSettings} that represents the sites with custom settings */
const keyCustomSettings: string = "customSettings";

/** The keys of the {@linkcode chrome.storage.sync} */
const keys: Array<string> = [
    keyTextSize,
    keyLineHeight,
    keyOnOff,
    keyFont,
    keyWhitelisted,
    keyCustomSettings
];

/**
 * Represents a site that uses different settings from the global settings
 * The settings themselves may be the same as the global but they will change independently
 */
class CustomSettings {
    /** The hostname url of this web site, this will always be in the form of example.com */
    url: string;
    /** The font size percent to use on this site */
    textSize: number;
    /** The line height percent to use on this site */
    lineHeight: number;
    /** The font to use on this site */
    font: string;

    constructor(url: string, textSize: number,
                lineHeight: number, font: string) {
        this.url = url;
        this.textSize = textSize;
        this.lineHeight = lineHeight;
        this.font = font;
    }

    static isValidCustomSettings(customSettings: CustomSettings): boolean {
        const url: string = customSettings.url;
        const textSize: number = customSettings.textSize;
        const lineHeight: number = customSettings.lineHeight;
        const font: string = customSettings.font;

        return !!url && typeof url === "string" &&
            !!textSize && typeof textSize === "number" && textSize >= 100 && textSize <= 300 &&
            !!lineHeight && typeof lineHeight === "number" && lineHeight >= 100 && lineHeight <= 300 &&
            !!font && typeof font === "string";
    }

    static isCustomSettings(obj: object): boolean {
        return !!obj && obj.hasOwnProperty("url") && obj.hasOwnProperty("textSize") &&
            obj.hasOwnProperty("lineHeight") && obj.hasOwnProperty("font") &&
            this.isValidCustomSettings(obj as CustomSettings);
    }

    static isCustomSettingsArray(array: Array<any>): boolean {
        return array.length === 0 || array.every((obj: object) => this.isCustomSettings(obj));
    }
}

// region Extensions

interface Array<T> {
    findFirst(predicate: (element: T, index: number) => boolean): T | null;

    contains(element: T): boolean;
}

/**
 * Finds the first element that matches the given {@param predicate} else returns null
 * You can use this as a way to check if the array contains an element that matches the given {@param predicate}, it
 * will return null if none exists
 * @param predicate the predicate to match
 */
Array.prototype.findFirst = function <T>(predicate: (element: T, index: number) => boolean): T | null {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i)) return this[i];
    }
    return null;
};

Array.prototype.contains = function <T>(element: T): boolean {
    return !!this.findFirst((it: T) => it === element);
};

// endregion Extensions

const defaultFont: string = "Droid Arabic Naskh";
const defaultTextSize: number = 115;
const defaultLineHeight: number = 125;
const defaultColor: string = "#880E4F";
const homePage: string = "http://basshelal.github.io/Wudooh";

/**
 * Shorthand for {@linkcode document.getElementById}, automatically casts to T, a HTMLElement
 *
 * @param elementId the id of the element to get
 */
function get<T extends HTMLElement>(elementId: string): T | null {
    return document.getElementById(elementId) as T
}