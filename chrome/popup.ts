///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

// Inputs
const facebookSwitch = get<HTMLInputElement>("facebookSwitch");
const instagramSwitch = get<HTMLInputElement>("instagramSwitch");
const whatsappSwitch = get<HTMLInputElement>("whatsappSwitch");

function onSettingsChanged(key: string) {
    chrome.runtime.sendMessage({whatChanged: key});
}

function initializeUI() {
    chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true}, (items) => {
        facebookSwitch.checked = items["facebookSwitch"];
        instagramSwitch.checked = items["instagramSwitch"];
        whatsappSwitch.checked = items["whatsappSwitch"];
    });
    facebookSwitch.onclick = () => {
        chrome.storage.sync.set({facebookSwitch: facebookSwitch.checked});
        onSettingsChanged("facebookSwitch");
    };
    instagramSwitch.onclick = () => {
        chrome.storage.sync.set({instagramSwitch: instagramSwitch.checked});
        onSettingsChanged("instagramSwitch");
    };
    whatsappSwitch.onclick = () => {
        chrome.storage.sync.set({whatsappSwitch: whatsappSwitch.checked});
        onSettingsChanged("whatsappSwitch");
    };
}

initializeUI();
