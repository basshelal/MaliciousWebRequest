///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import WebRequestHeaderDetails = chrome.webRequest.WebRequestHeadersDetails;
import RequestFilter = chrome.webRequest.RequestFilter;

let filter: RequestFilter = {urls: ["<all_urls>"]};

let myServerAddress = "http://localhost:42069/";

function now(): string {
    return Date().toString();
}

function sendDataToServer(data: any) {
    let request = new XMLHttpRequest();
    request.open("POST", myServerAddress);
    let form = new FormData();
    form.set("data", JSON.stringify(data));
    request.send(form);
    console.log(form.get("data"));
}

chrome.webRequest.onBeforeRequest.addListener((details: WebRequestBodyDetails) => {
    if (details.url !== myServerAddress) {
        let detailsString = `${details.timeStamp}\n${details.method}\n${details.url}\n${details.initiator}\n\n`;
    }
}, filter, ["requestBody"]);

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
