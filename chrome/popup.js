///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
// Inputs
var facebookSwitch = get("facebookSwitch");
var instagramSwitch = get("instagramSwitch");
var whatsappSwitch = get("whatsappSwitch");

function onSettingsChanged(key) {
    chrome.runtime.sendMessage({whatChanged: key});
}

function initializeUI() {
    chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true}, function (items) {
        facebookSwitch.checked = items["facebookSwitch"];
        instagramSwitch.checked = items["instagramSwitch"];
        whatsappSwitch.checked = items["whatsappSwitch"];
    });
    facebookSwitch.onclick = function () {
        chrome.storage.sync.set({facebookSwitch: facebookSwitch.checked});
        onSettingsChanged("facebookSwitch");
    };
    instagramSwitch.onclick = function () {
        chrome.storage.sync.set({instagramSwitch: instagramSwitch.checked});
        onSettingsChanged("instagramSwitch");
    };
    whatsappSwitch.onclick = function () {
        chrome.storage.sync.set({whatsappSwitch: whatsappSwitch.checked});
        onSettingsChanged("whatsappSwitch");
    };
}

initializeUI();
