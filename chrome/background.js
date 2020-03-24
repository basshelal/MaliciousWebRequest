///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
var filter = {urls: ["<all_urls>"]};
var myServerAddress = "http://localhost:42069/";
var facebookHosts = [];
var facebookHostsFilePath = chrome.runtime.getURL("lists/facebook.txt");
fetch(facebookHostsFilePath).then(function (response) {
    return response.text().then(function (text) {
        facebookHosts = text.split("\n");
        facebookHosts.forEach(function (it, index) {
            return facebookHosts[index] = it.trim();
        });
    });
});
var instagramHosts = [];
var instagramHostsFilePath = chrome.runtime.getURL("lists/instagram.txt");
fetch(instagramHostsFilePath).then(function (response) {
    return response.text().then(function (text) {
        instagramHosts = text.split("\n");
        instagramHosts.forEach(function (it, index) {
            return instagramHosts[index] = it.trim();
        });
    });
});
var whatsappHosts = [];
var whatsappHostsFilePath = chrome.runtime.getURL("lists/whatsapp.txt");
fetch(whatsappHostsFilePath).then(function (response) {
    return response.text().then(function (text) {
        whatsappHosts = text.split("\n");
        whatsappHosts.forEach(function (it, index) {
            return whatsappHosts[index] = it.trim();
        });
    });
});

function now() {
    return Date().toString();
}

function sendDataToServer(data) {
    var sent = {data: JSON.stringify(data)};
    console.log(sent.data);
    fetch(myServerAddress, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sent)
    });
}

function sendDataToServerXHR(data) {
    var request = new XMLHttpRequest();
    request.open("POST", myServerAddress, true);
    var form = new FormData();
    form.set("data", JSON.stringify(data));
    request.send(form);
    console.log(form.get("data"));
}

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.url !== myServerAddress) {
        var detailsString = details.timeStamp + "\n" + details.method + "\n" + details.url + "\n" + details.initiator + "\n\n";
        var url = new URL(details.url);
        if (facebookHosts.contains(url.hostnameClean()))
            return {cancel: true};
    }
}, filter, ["requestBody", "blocking"]);
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
