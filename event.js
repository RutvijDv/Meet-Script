chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.todo == "activate") {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            chrome.pageAction.show(tabs[0].id)
        })
    }
})

chrome.storage.sync.get(["subtitleWarning"], function (result) {
    console.log("caps" + result.subtitleWarning);
    if (result.subtitleWarning) {
        var notifOption = {
            type: "basic",
            iconUrl: "icon.png",
            title: "Caption Off!",
            message: "Please turn on your CAPTIONS!!"
        };
        chrome.notifications.create("captionOff", notifOption);
    }
})