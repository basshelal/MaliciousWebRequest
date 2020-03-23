///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>


const main = get<HTMLDivElement>("main");

// Inputs
const sizeSlider = get<HTMLInputElement>("size");
const heightSlider = get<HTMLInputElement>("height");
const onOffSwitch = get<HTMLInputElement>("onOffSwitch");
const fontSelect = get<HTMLSelectElement>("font-select");
const overrideSiteSwitch = get<HTMLInputElement>("overrideSettingsSwitch");
const whiteListSwitch = get<HTMLInputElement>("whitelistSwitch");

// Labels
const sizeValue = get("sizeValue");
const heightValue = get("heightValue");
const overrideSettingsValue = get("overrideSettingsLabel");
const whitelistedValue = get("whitelistedLabel");

// Website Info
const websiteText = get<HTMLHeadingElement>("website");
const websiteIcon = get<HTMLImageElement>("websiteIcon");

// Import / Export
let exportButton = get<HTMLButtonElement>("exportButton");
let exportAnchor = get<HTMLAnchorElement>("exportAnchor");
let importButton = get<HTMLButtonElement>("importButton");
let importInput = get<HTMLInputElement>("importInput");