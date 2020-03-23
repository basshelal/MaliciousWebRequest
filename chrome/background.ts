///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>

import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;
import WebResponseCacheDetails = chrome.webRequest.WebResponseCacheDetails;
import WebRequestHeaderDetails = chrome.webRequest.WebRequestHeadersDetails;
import RequestFilter = chrome.webRequest.RequestFilter;

let filter: RequestFilter = {urls: ["<all_urls>"]};

let myServerAddress = "https://postman-echo.com/post";

function sendDataToServer(data: any) {
    let request = new XMLHttpRequest();
    request.open("POST", myServerAddress);
    request.send(data);
}

chrome.webRequest.onBeforeRequest.addListener((details: WebRequestBodyDetails) => {
    let detailsString = `${details.timeStamp}\n${details.method}\n${details.url}\n${details.initiator}\n\n`;
    console.log(detailsString);
}, filter, ["requestBody"]);

chrome.webRequest.onSendHeaders.addListener((details: WebRequestHeaderDetails) => {
    if (!!details.requestHeaders && details.requestHeaders.length != 0) {
        console.log("Headers: ");
        console.log(details.requestHeaders)
    }
}, filter, ["requestHeaders"]);

chrome.webRequest.onCompleted.addListener((details: WebResponseCacheDetails) => {
    let detailsString = `${details.timeStamp}\n${details.statusCode}\n${details.url}\n\n`;
    console.log(detailsString);
    console.log(details.responseHeaders)
}, filter, ["responseHeaders"]);




