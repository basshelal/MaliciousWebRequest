///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import WebRequestHeaderDetails = chrome.webRequest.WebRequestHeadersDetails;
import RequestFilter = chrome.webRequest.RequestFilter;

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

chrome.webRequest.onBeforeRequest.addListener((details: WebRequestBodyDetails) => {
    if (details.url !== myServerAddress) {
        let detailsString = `${details.timeStamp}\n${details.method}\n${details.url}\n${details.initiator}\n\n`;
        let url = new URL(details.url);
        if (facebookHosts.contains(url.hostnameClean())) return {cancel: true};
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
        sendDataToServer(detailsString);
    }
}, filter, ["responseHeaders"]);
