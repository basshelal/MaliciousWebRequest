///<reference path="../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
var filter = { urls: ["<all_urls>"] };
var myServerAddress = "https://postman-echo.com/post";
function sendDataToServer(data) {
    var request = new XMLHttpRequest();
    request.open("POST", myServerAddress);
    request.send(data);
}
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    var detailsString = details.timeStamp + "\n" + details.method + "\n" + details.url + "\n" + details.initiator + "\n\n";
    console.log(detailsString);
}, filter, ["requestBody"]);
chrome.webRequest.onSendHeaders.addListener(function (details) {
    if (!!details.requestHeaders && details.requestHeaders.length != 0) {
        console.log("Headers: ");
        console.log(details.requestHeaders);
    }
}, filter, ["requestHeaders"]);
chrome.webRequest.onCompleted.addListener(function (details) {
    var detailsString = details.timeStamp + "\n" + details.statusCode + "\n" + details.url + "\n\n";
    console.log(detailsString);
    console.log(details.responseHeaders);
}, filter, ["responseHeaders"]);
