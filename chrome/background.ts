///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import WebRequestHeaderDetails = chrome.webRequest.WebRequestHeadersDetails;
import RequestFilter = chrome.webRequest.RequestFilter;

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

let filter: RequestFilter = {urls: ["<all_urls>"]};

let myServerAddress = "http://localhost:42069/";

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
    let sent = {data: JSON.stringify(data)};
    console.log(sent.data);
    fetch(myServerAddress, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sent)
    });
}

function sendDataToServerXHR(data: any) {
    let request = new XMLHttpRequest();
    request.open("POST", myServerAddress, true);
    let form = new FormData();
    form.set("data", JSON.stringify(data));
    request.send(form);
    console.log(form.get("data"));
}

// on settings changed!
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

chrome.webRequest.onBeforeRequest.addListener((details: WebRequestBodyDetails) => {
    if (details.url !== myServerAddress) {
        let detailsString = `${details.timeStamp}\n${details.method}\n${details.url}\n${details.initiator}\n\n`;
        let url = new URL(details.url);
        if (blockingFacebook && facebookHosts.contains(url.hostnameClean())) return {cancel: true};
        if (blockingInstagram && instagramHosts.contains(url.hostnameClean())) return {cancel: true};
        if (blockingWhatsapp && whatsappHosts.contains(url.hostnameClean())) return {cancel: true};
    }
}, filter, ["requestBody", "blocking"]);

chrome.webRequest.onSendHeaders.addListener((details: WebRequestHeaderDetails) => {
    if (details.url != myServerAddress) {
        if (!!details.requestHeaders && details.requestHeaders.length != 0) {
        }
    }
}, filter, ["requestHeaders"]);

chrome.webRequest.onCompleted.addListener((details: WebResponseCacheDetails) => {
    if (details.url !== myServerAddress) {
        let detailsString = `${now()} to ${details.ip} is ${details.statusCode}`;
        try {
            sendDataToServer(detailsString);
        } catch (e) {
        }
    }
}, filter, ["responseHeaders"]);
