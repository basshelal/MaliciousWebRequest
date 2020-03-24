# Malicious Web Request

University CSCM28 (Security Vulnerabilities and Penetration Testing) Coursework.

This is a small Web Extension (Chrome) that demonstrates the potential security and privacy vulnerabilities that come from using extensions that make use of the [`WebRequest` API](https://developer.chrome.com/extensions/webRequest).

- [Malicious Web Request](#malicious-web-request)
  - [Installation](#installation)
    - [Chrome Extension](#chrome-extension)
    - [Node Server](#node-server)
  - [Video Demonstration](#video-demonstration)
  - [Details](#details)
  - [Thanks](#thanks)
  - [Disclaimer](#disclaimer)

## Installation

### Chrome Extension

1. Clone this repository.
2. Launch Chrome and open the extensions page, you can do this by entering the URL `chrome://extensions`
3. Turn on **Developer Mode** by toggling the switch in the top right corner of the page. [Read here for more if you're struggling.](https://developer.chrome.com/extensions/faq#faq-dev-01)
4. [You are now a Chrome Extension Developer](https://i.redd.it/4ifd4hw4s9701.jpg) 😁
5. Click the now visible, **Load unpacked** in the top left of the extensions page.
6. In the folder selection, go to the directory of this repository. Once inside, be sure to click (but not enter) the `chrome` directory, then select that folder.
7. If everything went correctly, you should now see your unpacked extension called "*No Facebook!*" as if you downloaded and installed it from the Chrome Web Store. Toggle the switch to activate it.
8. When done with the demonstration, remove the extension.

### Node Server

1. Clone this repository (skip if you've already done so).
2. Install [node.js](https://nodejs.org/en/) if you do not have it installed. To check if you have it installed or if you installed it correctly, run `node -v` and `npm -v` on a command line.
3. Navigate to this repository's directory then navigate to the `server` directory.
4. From the `server` directory run `node bin/www` on a command line.
5. In a browser, go to http://localhost:42069/, you should be greeted to an Express webpage. If so, the server is up an running and all web requests received will be shown on the command line.

## Video Demonstration

TODO YouTube link

## Details

**TL;DR**:

**A user can install an extension which can (correctly) claim to block web traffic (such as ads, adult content, facebook etc.) but it can also be gathering ALL the user's browsing data in extreme detail while doing so and it can be made very difficult to detect this.**

To properly understand this you must first read the [Details Document](DetailsDocument.pdf) that briefly goes into detail about what the API is capable of and how a malicious actor can use this as an attack vector to gather excessive amounts of data.

This extension masks itself as a Facebook blocker, i.e. it blocks all web requests made to any Facebook servers, this can include or exclude Instagram and WhatsApp. 

The idea is that users who want to block Facebook entirely from their lives (like my Dad 😄) are now able to do so on their browser with a simple extension. But, in order for this extension to this correctly, it naturally must read all web requests you make to determine if it is a request to a Facebook server or not and if it is, the request will return preemptively with no content, i.e. blocked. 

However, what else it may be secretly doing with the web traffic it can read is where the attack vector is found. Because it can read **all** web requests, it can know exactly what sites you visited **AND** how long you spent on them and how much data you loaded from them, such as pages, images, video length watched etc. This is more than just a history reader because a history reader can only see web pages and time, it cannot know what was done on each page. For example a user can spend hours on a web app and the history reader cannot correctly deduce wether the user was actually active on the site or away from keyboard. On the other hand, the extension can know exactly in detail all requests made, including `POST` requests meaning it can correctly deduce whether the user was actually idle or actively using the web app and what requests they made as well. This means the extension can know deep details about your visit to a page, including dynamic pages and apps such as YouTube, where it can determine how much of a video you watched (or at least requested to watch), how many pages of comments you loaded, whether you liked the video or commented (because those are `POST` requests) and a lot more. All of this data can be sent asynchronously to a remote server for further analysis and gathering and suddenly, the innocent blocker extension which was only responsible for blocking content (a very simple task) now knows which videos I watch on YouTube and how long I spend watching them. [**YIKES!**](https://www.youtube.com/watch?v=80S4SK90LUA)

## Thanks

* Thanks to [Dr. Phillip James](https://www.swansea.ac.uk/staff/science/computer-science/p.d.james/) for teaching this difficult and intellectually stimulating module. More importantly though, for his attitude and behavior with both his students and the content of the module. This security shit is not stuff I'm not extremely interested in and yet I'm always interested and motivated in your module. Thanks 😊

* Thanks to [Jonathan Dugan](https://github.com/jmdugan) for the [blocklists](https://github.com/jmdugan/blocklists) repository which provides the list of all the facebook hosts to block.

## Disclaimer

This is just a demonstration, no actual data is gathered or saved anywhere. The demonstration send request information from the browser to a server running on the same machine. I do not endorse nor condone unconsented data gathering, trust me, you don't want to know what people do online when no one is looking 🤨.