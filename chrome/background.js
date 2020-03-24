///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
var filter = {urls: ["<all_urls>"]};
var myServerAddress = "http://localhost:42069/";

function now() {
    return Date().toString();
}

function sendDataToServer(data) {
    var request = new XMLHttpRequest();
    request.open("POST", myServerAddress);
    var form = new FormData();
    form.set("data", JSON.stringify(data));
    request.send(form);
    console.log(form.get("data"));
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.url !== myServerAddress) {
        var detailsString = details.timeStamp + "\n" + details.method + "\n" + details.url + "\n" + details.initiator + "\n\n";
    }
}, filter, ["requestBody"]);
chrome.webRequest.onSendHeaders.addListener(function (details) {
    if (details.url != myServerAddress) {
        if (!!details.requestHeaders && details.requestHeaders.length != 0) {
        }
    }
}, filter, ["requestHeaders"]);
chrome.webRequest.onCompleted.addListener(function (details) {
    if (details.url !== myServerAddress) {
        var detailsString = now() + " to " + details.ip + " is " + details.statusCode;
        sendDataToServer(detailsString);
    }
}, filter, ["responseHeaders"]);
