///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
// On installation, initialize chrome sync variables
chrome.runtime.onInstalled.addListener((function (details) {
    chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true}, function (items) {
        return chrome.storage.sync.set(items);
    });
}));
var blockingFacebook = true;
var blockingInstagram = true;
var blockingWhatsapp = true;
chrome.storage.sync.get({facebookSwitch: true, instagramSwitch: true, whatsappSwitch: true}, function (items) {
    blockingFacebook = items["facebookSwitch"];
    blockingInstagram = items["instagramSwitch"];
    blockingWhatsapp = items["whatsappSwitch"];
});
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

// on settings changed!
chrome.runtime.onMessage.addListener(function (message) {
    var whatChanged = message["whatChanged"];
    if (!!whatChanged) {
        chrome.storage.sync.get(whatChanged, function (items) {
            if (whatChanged === "facebookSwitch")
                blockingFacebook = items[whatChanged];
            else if (whatChanged === "instagramSwitch")
                blockingInstagram = items[whatChanged];
            else if (whatChanged === "whatsappSwitch")
                blockingWhatsapp = items[whatChanged];
        });
    }
});
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.url !== myServerAddress) {
        var detailsString = details.timeStamp + "\n" + details.method + "\n" + details.url + "\n" + details.initiator + "\n\n";
        var url = new URL(details.url);
        if (blockingFacebook && facebookHosts.contains(url.hostnameClean()))
            return {cancel: true};
        if (blockingInstagram && instagramHosts.contains(url.hostnameClean()))
            return {cancel: true};
        if (blockingWhatsapp && whatsappHosts.contains(url.hostnameClean()))
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
        try {
            sendDataToServer(detailsString);
        } catch (e) {
        }
    }
}, filter, ["responseHeaders"]);
